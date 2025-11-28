"""
Wellness Chatbot Backend - FastAPI + LangGraph RAG Application
A health/wellness chatbot that retrieves PubMed articles and answers questions based on them.
"""

import os
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import List, Optional
from typing_extensions import TypedDict
import httpx

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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
# FALLBACK MOCK DATA (used when PubMed API fails)
# =============================================================================

FALLBACK_ARTICLES: List[dict] = [
    {
        "id": "MOCK001",
        "title": "Sleep Hygiene Practices for Better Rest",
        "content": (
            "Good sleep hygiene involves maintaining a consistent sleep schedule by going to bed "
            "and waking up at the same time every day. Avoiding screens and blue light exposure "
            "at least one hour before bedtime significantly improves sleep quality. Creating a cool, "
            "dark, and quiet sleeping environment helps the body prepare for restorative rest."
        ),
        "authors": "Wellness Guide Team",
        "journal": "Internal Knowledge Base",
        "year": "2024",
        "url": "#"
    },
    {
        "id": "MOCK002",
        "title": "The Health Benefits of Turmeric",
        "content": (
            "Turmeric contains curcumin, a powerful anti-inflammatory compound that may help reduce "
            "chronic inflammation in the body. Studies suggest turmeric can aid digestion and support "
            "gut health when consumed regularly. Additionally, curcumin has antioxidant properties "
            "that may protect cells from oxidative damage and support brain function."
        ),
        "authors": "Wellness Guide Team",
        "journal": "Internal Knowledge Base",
        "year": "2024",
        "url": "#"
    },
    {
        "id": "MOCK003",
        "title": "Vitamin D: The Sunshine Vitamin",
        "content": (
            "Vitamin D is essential for calcium absorption and maintaining strong bones and teeth. "
            "The body produces Vitamin D naturally when skin is exposed to sunlight, though many people "
            "are deficient, especially in winter months. Supplementation or consuming Vitamin D-rich "
            "foods like fatty fish and fortified dairy can help maintain adequate levels."
        ),
        "authors": "Wellness Guide Team",
        "journal": "Internal Knowledge Base",
        "year": "2024",
        "url": "#"
    },
]


# =============================================================================
# LANGGRAPH STATE DEFINITION
# =============================================================================

class AgentState(TypedDict):
    """State that flows through the RAG pipeline."""
    question: str                    # User's original question
    search_query: Optional[str]      # Enhanced search query for PubMed
    context: List[dict]              # Retrieved articles from PubMed
    answer: str                      # Final generated response
    used_fallback: bool              # Whether fallback data was used


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
    
    system_prompt = """You are a medical search query optimizer. Your job is to convert natural language health questions into effective PubMed search queries.

RULES:
1. Extract key medical/health concepts from the question
2. Use proper medical terminology where appropriate
3. Use Boolean operators (AND, OR) to connect related terms
4. Keep the query concise but comprehensive
5. Output ONLY the search query, nothing else
6. Do not include quotes unless searching for an exact phrase

EXAMPLES:
- "What helps with sleep?" → "sleep quality improvement OR sleep hygiene OR insomnia treatment"
- "Is turmeric good for you?" → "turmeric health benefits OR curcumin therapeutic effects"
- "How much vitamin D do I need?" → "vitamin D recommended intake OR vitamin D dosage OR vitamin D deficiency"
- "Does exercise help anxiety?" → "exercise anxiety reduction OR physical activity mental health"
"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Convert this question to a PubMed search query: {state['question']}")
    ]
    
    response = llm.invoke(messages)
    search_query = response.content.strip()
    
    print(f"[DEBUG] Original question: {state['question']}")
    print(f"[DEBUG] Enhanced search query: {search_query}")
    
    return {"search_query": search_query}


async def retrieve_node(state: AgentState) -> dict:
    """
    Retrieves relevant articles from PubMed using the enhanced search query.
    Falls back to mock data if the API call fails.
    """
    search_query = state.get("search_query") or state["question"]
    
    try:
        # Search PubMed for article IDs
        pmids = await search_pubmed(search_query, max_results=5)
        
        if not pmids:
            print(f"[DEBUG] No PubMed results found, using fallback data")
            return {"context": FALLBACK_ARTICLES, "used_fallback": True}
        
        # Fetch full article details
        articles = await fetch_pubmed_articles(pmids)
        
        if not articles:
            print(f"[DEBUG] Failed to fetch article details, using fallback data")
            return {"context": FALLBACK_ARTICLES, "used_fallback": True}
        
        print(f"[DEBUG] Retrieved {len(articles)} articles from PubMed")
        return {"context": articles, "used_fallback": False}
        
    except Exception as e:
        print(f"[DEBUG] PubMed API error: {e}, using fallback data")
        return {"context": FALLBACK_ARTICLES, "used_fallback": True}


def generate_node(state: AgentState) -> dict:
    """
    Generates an answer using the Gemini LLM based on retrieved PubMed context.
    Includes source citations with PMIDs and mentions peer-reviewed research.
    """
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    api_key = os.getenv("GOOGLE_API_KEY")
    llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=api_key)
    
    # Build the system prompt
    used_fallback = state.get("used_fallback", False)
    
    if used_fallback:
        source_note = "Note: These are from an internal knowledge base as the medical literature search was unavailable."
    else:
        source_note = "These are from peer-reviewed medical literature indexed in PubMed."
    
    system_prompt = f"""You are a friendly and knowledgeable wellness guide. Your role is to help users with health and wellness questions based ONLY on the provided research articles.

{source_note}

IMPORTANT RULES:
1. Only use information from the provided articles to answer questions.
2. CITATION FORMAT IS CRITICAL: Always cite sources using EXACTLY this format: [Source: PMID] where PMID is a single article ID.
   - CORRECT: "Vitamin D is important [Source: 22716179]. It helps with calcium absorption [Source: 36902073]."
   - WRONG: "Vitamin D is important [Source: 22716179, 36902073]." (DO NOT combine multiple PMIDs in one bracket!)
   - WRONG: "[Source: 22716179, 36902073]" (NEVER do this!)
   - If citing multiple sources for the same fact, use separate brackets: [Source: 22716179] [Source: 36902073]
3. If the provided context does not contain relevant information to answer the question, respond with: "I couldn't find specific research on that topic. Please try rephrasing your question."
4. Be warm, encouraging, and supportive in your tone.
5. Keep answers concise but informative.
6. Synthesize information across articles rather than just summarizing each one.
7. Remind users that this is general health information and they should consult healthcare providers for personal medical advice."""

    # Format the context for the LLM
    context = state["context"]
    question = state["question"]
    
    if context:
        context_text = "\n\n".join([
            f"PMID: {article['id']}\nTitle: {article['title']}\nAuthors: {article.get('authors', 'Unknown')}\nJournal: {article.get('journal', 'Unknown')}\nYear: {article.get('year', 'Unknown')}\nAbstract: {article['content']}"
            for article in context
        ])
        user_message = f"""Based on the following research articles, please answer the user's question.

RESEARCH ARTICLES:
{context_text}

USER QUESTION: {question}"""
    else:
        user_message = f"""No relevant articles were found for this question.

USER QUESTION: {question}

Please respond appropriately indicating you couldn't find relevant research."""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_message)
    ]
    
    response = llm.invoke(messages)
    
    return {"answer": response.content}


# =============================================================================
# BUILD THE LANGGRAPH
# =============================================================================

def build_graph():
    """Constructs and compiles the RAG workflow graph."""
    graph_builder = StateGraph(AgentState)
    
    # Add nodes
    graph_builder.add_node("enhance_query", enhance_query_node)
    graph_builder.add_node("retrieve", retrieve_node)
    graph_builder.add_node("generate", generate_node)
    
    # Define the flow: START -> enhance_query -> retrieve -> generate -> END
    graph_builder.add_edge(START, "enhance_query")
    graph_builder.add_edge("enhance_query", "retrieve")
    graph_builder.add_edge("retrieve", "generate")
    graph_builder.add_edge("generate", END)
    
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

# =============================================================================
# TEMPORARY FRONTEND SETUP (remove this section when integrating real frontend)
# =============================================================================
# CORS middleware - allows frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory for temporary frontend
# Access at: http://localhost:8000/static/index.html
STATIC_DIR = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
# =============================================================================
# END TEMPORARY FRONTEND SETUP
# =============================================================================


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    answer: str


class ChatDebugResponse(BaseModel):
    """Debug response model that includes retrieved context."""
    answer: str
    retrieved_articles: List[dict]
    question: str


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a wellness-related question and return an AI-generated answer
    based on PubMed research articles.
    """
    # Initialize the state with the user's question
    initial_state = {
        "question": request.message,
        "search_query": None,
        "context": [],
        "answer": "",
        "used_fallback": False
    }
    
    # Run the graph
    result = await wellness_graph.ainvoke(initial_state)
    
    return ChatResponse(answer=result["answer"])


@app.post("/chat/debug", response_model=ChatDebugResponse)
async def chat_debug(request: ChatRequest):
    """
    Debug version of chat endpoint - shows retrieved articles alongside the answer.
    """
    initial_state = {
        "question": request.message,
        "search_query": None,
        "context": [],
        "answer": "",
        "used_fallback": False
    }
    
    result = await wellness_graph.ainvoke(initial_state)
    
    return ChatDebugResponse(
        answer=result["answer"],
        retrieved_articles=result["context"],
        question=result["question"]
    )


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Wellness Chatbot API"}


@app.get("/articles/fallback")
async def list_fallback_articles():
    """Returns fallback articles used when PubMed API is unavailable."""
    return {"articles": FALLBACK_ARTICLES}


# =============================================================================
# RUN SERVER (for development)
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
