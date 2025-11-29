"""
Wellness Chatbot Backend - FastAPI + LangGraph RAG Application
A health/wellness chatbot that retrieves PubMed articles and answers questions based on them.
"""

import os
import xml.etree.ElementTree as ET
from typing import List, Optional
from typing_extensions import TypedDict
import httpx

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, START, END

# Load environment variables from .env file
load_dotenv()


# =============================================================================
# PUBMED API CLIENT
# =============================================================================

PUBMED_SEARCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
PUBMED_FETCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
PUBMED_BASE_URL = "https://pubmed.ncbi.nlm.nih.gov"


async def search_pubmed(query: str, max_results: int = 5) -> List[str]:
    """
    Search PubMed for articles matching the query.
    Returns a list of PubMed IDs (PMIDs).
    """
    params = {
        "db": "pubmed",
        "term": query,
        "retmax": max_results,
        "retmode": "json",
        "sort": "relevance"
    }
    
    # Add API key if available
    api_key = os.getenv("NCBI_API_KEY")
    if api_key:
        params["api_key"] = api_key
    
    async with httpx.AsyncClient() as client:
        response = await client.get(PUBMED_SEARCH_URL, params=params, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        
    return data.get("esearchresult", {}).get("idlist", [])


async def fetch_pubmed_articles(pmids: List[str]) -> List[dict]:
    """
    Fetch article details from PubMed given a list of PMIDs.
    Returns a list of article dictionaries with title, abstract, authors, etc.
    """
    if not pmids:
        return []
    
    params = {
        "db": "pubmed",
        "id": ",".join(pmids),
        "retmode": "xml",
        "rettype": "abstract"
    }
    
    # Add API key if available
    api_key = os.getenv("NCBI_API_KEY")
    if api_key:
        params["api_key"] = api_key
    
    async with httpx.AsyncClient() as client:
        response = await client.get(PUBMED_FETCH_URL, params=params, timeout=15.0)
        response.raise_for_status()
        xml_content = response.text
    
    return parse_pubmed_xml(xml_content)


def parse_pubmed_xml(xml_content: str) -> List[dict]:
    """
    Parse PubMed XML response and extract article information.
    """
    articles = []
    
    try:
        root = ET.fromstring(xml_content)
        
        for article_elem in root.findall(".//PubmedArticle"):
            try:
                # Get PMID
                pmid_elem = article_elem.find(".//PMID")
                pmid = pmid_elem.text if pmid_elem is not None else "Unknown"
                
                # Get title
                title_elem = article_elem.find(".//ArticleTitle")
                title = title_elem.text if title_elem is not None else "No title available"
                
                # Get abstract
                abstract_parts = []
                for abstract_elem in article_elem.findall(".//AbstractText"):
                    label = abstract_elem.get("Label", "")
                    text = abstract_elem.text or ""
                    if label:
                        abstract_parts.append(f"{label}: {text}")
                    else:
                        abstract_parts.append(text)
                abstract = " ".join(abstract_parts) if abstract_parts else "No abstract available."
                
                # Get authors
                authors = []
                for author_elem in article_elem.findall(".//Author"):
                    last_name = author_elem.find("LastName")
                    initials = author_elem.find("Initials")
                    if last_name is not None:
                        author_name = last_name.text
                        if initials is not None:
                            author_name += f" {initials.text}"
                        authors.append(author_name)
                
                # Format authors string
                if len(authors) > 3:
                    authors_str = f"{authors[0]}, {authors[1]}, {authors[2]}, et al."
                elif authors:
                    authors_str = ", ".join(authors)
                else:
                    authors_str = "Unknown authors"
                
                # Get journal info
                journal_elem = article_elem.find(".//Journal/Title")
                journal = journal_elem.text if journal_elem is not None else "Unknown journal"
                
                # Get publication year
                year_elem = article_elem.find(".//PubDate/Year")
                if year_elem is None:
                    year_elem = article_elem.find(".//PubDate/MedlineDate")
                year = year_elem.text[:4] if year_elem is not None and year_elem.text else "Unknown"
                
                articles.append({
                    "id": pmid,
                    "title": title,
                    "content": abstract,
                    "authors": authors_str,
                    "journal": journal,
                    "year": year,
                    "url": f"{PUBMED_BASE_URL}/{pmid}"
                })
                
            except Exception as e:
                print(f"Error parsing article: {e}")
                continue
                
    except ET.ParseError as e:
        print(f"Error parsing PubMed XML: {e}")
        
    return articles


# =============================================================================
# LANGGRAPH STATE DEFINITION
# =============================================================================

class AgentState(TypedDict):
    """State that flows through the RAG pipeline."""
    question: str                    # User's original question
    search_query: Optional[str]      # Enhanced search query for PubMed
    context: List[dict]              # Retrieved articles from PubMed
    answer: str                      # Final generated response


# =============================================================================
# GRAPH NODES
# =============================================================================

def enhance_query_node(state: AgentState) -> dict:
    """
    Uses LLM to convert a natural language question into optimized PubMed search terms.
    This improves search results by using proper medical terminology and Boolean operators.
    """
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    api_key = os.getenv("GOOGLE_API_KEY")
    llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=api_key)
    
    system_prompt = """You are a medical search query optimizer for PubMed. Convert natural language health questions into effective PubMed search queries.

CRITICAL RULES:
1. Keep queries SIMPLE - use 2-4 key medical terms connected with AND/OR
2. Prefer single words or short 2-word terms over long phrases
3. Use standard medical terminology (e.g., "hypertension" not "high blood pressure")
4. Also include the scientific name if a supplement/herb is mentioned (e.g., turmeric → curcumin)
5. Output ONLY the search query, nothing else - no quotes, no explanation

GOOD EXAMPLES (simple, somewhat broad):
- "What helps with sleep?" → sleep quality OR insomnia treatment
- "Is turmeric good for inflammation?" → curcumin OR turmeric AND inflammation
- "How much vitamin D do I need?" → vitamin D AND (dosage OR supplementation OR requirements)
- "Does exercise help anxiety?" → exercise AND anxiety
- "What are the benefits of omega-3?" → omega-3 AND health AND benefits
- "Is coffee bad for your heart?" → caffeine AND cardiovascular
- "How to lower cholesterol naturally?" → cholesterol AND (diet OR lifestyle OR natural)
- "What causes headaches?" → headache AND (causes OR etiology OR triggers)

BAD EXAMPLES (too specific, will return zero results):
- "sleep quality improvement techniques for adults" 
- "turmeric health benefits for inflammation reduction"
- "natural ways to reduce high blood pressure without medication"
"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Convert this to a PubMed search query: {state['question']}")
    ]
    
    try:
        response = llm.invoke(messages)
        search_query = response.content.strip()
        
        # Remove any quotes the LLM might have added around the query
        search_query = search_query.strip('"\'')
        
    except Exception as e:
        # Fallback: use the original question as a simple search
        print(f"[DEBUG] LLM query enhancement failed: {e}")
        search_query = state['question']
    
    print(f"[DEBUG] Original question: {state['question']}")
    print(f"[DEBUG] Enhanced search query: {search_query}")
    
    return {"search_query": search_query}


async def retrieve_node(state: AgentState) -> dict:
    """
    Retrieves relevant articles from PubMed using the enhanced search query.
    Uses a simplified query as fallback if no results found.
    """
    search_query = state.get("search_query") or state["question"]
    original_question = state["question"]
    
    try:
        # First attempt: Use the enhanced search query
        pmids = await search_pubmed(search_query, max_results=5)
        
        # Second attempt: If no results, try a simplified version (just key words from original question)
        if not pmids:
            print(f"[DEBUG] No results with enhanced query, trying simplified search...")
            # Extract simple keywords - remove common words and use original question
            simplified_query = " ".join([
                word for word in original_question.split() 
                if len(word) > 3 and word.lower() not in 
                {'what', 'how', 'does', 'help', 'with', 'the', 'for', 'and', 'are', 'is', 'can', 'should', 'would', 'could', 'about', 'your', 'have', 'been', 'this', 'that', 'from', 'they', 'will', 'good', 'best', 'much', 'many'}
            ])
            if simplified_query:
                print(f"[DEBUG] Simplified query: {simplified_query}")
                pmids = await search_pubmed(simplified_query, max_results=5)
        
        if not pmids:
            print(f"[DEBUG] No PubMed results found")
            return {"context": []}
        
        # Fetch full article details
        articles = await fetch_pubmed_articles(pmids)
        
        if not articles:
            print(f"[DEBUG] Failed to fetch article details")
            return {"context": []}
        
        print(f"[DEBUG] Retrieved {len(articles)} articles from PubMed")
        return {"context": articles}
        
    except Exception as e:
        print(f"[DEBUG] PubMed API error: {e}")
        return {"context": []}


def generate_research_node(state: AgentState) -> dict:
    """
    Generates an answer using PubMed research articles.
    This node is called when we have retrieved articles from PubMed.
    
    Responsibilities:
    - Answer based on the provided research articles
    - Include proper citations using [Source: PMID] format
    - Synthesize information across multiple articles
    
    NOTE: The LLM often responds with Markdown formatting (e.g., **bold text**, *italics*).
    The frontend should parse and render this Markdown appropriately.
    """
    print(f"[DEBUG] Using RESEARCH generation path")
    
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    api_key = os.getenv("GOOGLE_API_KEY")
    llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=api_key)
    
    system_prompt = """You are a friendly and knowledgeable wellness guide. Your role is to help users with health and wellness questions based on the provided research articles.

These are from peer-reviewed medical literature indexed in PubMed.

IMPORTANT RULES:
1. Base your answer on the provided research articles and cite them appropriately.
2. CITATION FORMAT IS CRITICAL: Always cite sources using EXACTLY this format: [Source: PMID] where PMID is a single article ID.
   - CORRECT: "Vitamin D is important [Source: 22716179]. It helps with calcium absorption [Source: 36902073]."
   - WRONG: "Vitamin D is important [Source: 22716179, 36902073]." (DO NOT combine multiple PMIDs in one bracket!)
   - WRONG: "[Source: 22716179, 36902073]" (NEVER do this!)
   - If citing multiple sources for the same fact, use separate brackets: [Source: 22716179] [Source: 36902073]
3. Be warm, encouraging, and supportive in your tone.
4. Keep answers concise but informative.
5. Synthesize information across articles rather than just summarizing each one.
6. Remind users that this is general health information and they should consult healthcare providers for personal medical advice."""

    context = state["context"]
    question = state["question"]
    
    # Format articles for the LLM
    context_text = "\n\n".join([
        f"PMID: {article['id']}\nTitle: {article['title']}\nAuthors: {article.get('authors', 'Unknown')}\nJournal: {article.get('journal', 'Unknown')}\nYear: {article.get('year', 'Unknown')}\nAbstract: {article['content']}"
        for article in context
    ])
    
    user_message = f"""Based on the following research articles, please answer the user's question.

RESEARCH ARTICLES:
{context_text}

USER QUESTION: {question}"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_message)
    ]
    
    response = llm.invoke(messages)
    
    return {"answer": response.content}


def generate_general_node(state: AgentState) -> dict:
    """
    Generates a general wellness answer without research citations.
    This node is called when no PubMed articles were found.
    
    Responsibilities:
    - Provide helpful general wellness guidance
    - DO NOT include any citations (we have no sources)
    - Be transparent that this is general knowledge, not research-backed
    
    NOTE: The LLM often responds with Markdown formatting (e.g., **bold text**, *italics*).
    The frontend should parse and render this Markdown appropriately.
    """
    print(f"[DEBUG] Using GENERAL generation path (no research articles found)")
    
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    api_key = os.getenv("GOOGLE_API_KEY")
    llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=api_key)
    
    system_prompt = """You are a friendly and knowledgeable wellness guide. Your role is to help users with health and wellness questions using your general knowledge.

IMPORTANT RULES:
1. Be warm, encouraging, and supportive in your tone.
2. Provide helpful, general wellness information based on widely accepted health guidance.
3. Keep answers concise but informative.
4. DO NOT include any [Source: ...] citations since you don't have research articles to reference.
5. Start your response with a brief note like: "While I couldn't find specific research articles on this topic, here's what I can share:"
6. Always remind users that this is general health information and they should consult healthcare providers for personal medical advice.
7. If the question is outside of health/wellness topics, politely redirect the conversation back to wellness."""

    question = state["question"]
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=question)
    ]
    
    response = llm.invoke(messages)
    
    return {"answer": response.content}


def route_by_context(state: AgentState) -> str:
    """
    Router function that determines which generation path to take.
    
    Returns:
        "has_research" - if we have PubMed articles to cite
        "no_research" - if no articles were found
    """
    context = state.get("context", [])
    
    if context and len(context) > 0:
        print(f"[DEBUG] Router: Found {len(context)} articles -> routing to RESEARCH path")
        return "has_research"
    else:
        print(f"[DEBUG] Router: No articles found -> routing to GENERAL path")
        return "no_research"


# =============================================================================
# BUILD THE LANGGRAPH
# =============================================================================

def build_graph():
    """Constructs and compiles the RAG workflow graph."""
    graph_builder = StateGraph(AgentState)
    
    # Add nodes
    graph_builder.add_node("enhance_query", enhance_query_node)
    graph_builder.add_node("retrieve", retrieve_node)
    graph_builder.add_node("generate_research", generate_research_node)
    graph_builder.add_node("generate_general", generate_general_node)
    
    # Define the flow: START -> enhance_query -> retrieve
    graph_builder.add_edge(START, "enhance_query")
    graph_builder.add_edge("enhance_query", "retrieve")
    
    # Conditional routing after retrieve: choose generation path based on context
    graph_builder.add_conditional_edges(
        "retrieve",
        route_by_context,
        {
            "has_research": "generate_research",
            "no_research": "generate_general"
        }
    )
    
    # Both generation paths lead to END
    graph_builder.add_edge("generate_research", END)
    graph_builder.add_edge("generate_general", END)
    
    # Compile and return
    return graph_builder.compile()


# Create the compiled graph
wellness_graph = build_graph()


# =============================================================================
# FASTAPI APPLICATION
# =============================================================================

app = FastAPI(
    title="Wellness Chatbot API",
    description="A health and wellness RAG chatbot powered by LangGraph and Gemini",
    version="1.0.0"
)

# CORS middleware - allows frontend to access API from different origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str


class ArticleSource(BaseModel):
    """Model for a PubMed article source."""
    id: str
    title: str
    authors: str
    journal: str
    year: str
    url: str


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    answer: str
    sources: List[ArticleSource]


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a wellness-related question and return an AI-generated answer
    based on PubMed research articles.
    """
    initial_state = {
        "question": request.message,
        "search_query": None,
        "context": [],
        "answer": ""
    }
    
    result = await wellness_graph.ainvoke(initial_state)
    
    # Convert context articles to ArticleSource models
    sources = [
        ArticleSource(
            id=article["id"],
            title=article["title"],
            authors=article.get("authors", "Unknown"),
            journal=article.get("journal", "Unknown"),
            year=article.get("year", "Unknown"),
            url=article["url"]
        )
        for article in result.get("context", [])
    ]
    
    return ChatResponse(answer=result["answer"], sources=sources)


# =============================================================================
# RUN SERVER (for development)
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
