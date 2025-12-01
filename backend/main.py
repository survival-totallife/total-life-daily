"""
Wellness Chatbot Backend - FastAPI Server
A health/wellness chatbot API that provides research-backed answers.
"""

from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from search_agent import process_wellness_query

# Load environment variables from .env file
load_dotenv()


# =============================================================================
# FASTAPI APPLICATION
# =============================================================================

app = FastAPI(
    title="Total Life Daily API",
    description="A health and wellness AI chatbot API",
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


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

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


# =============================================================================
# API ENDPOINTS
# =============================================================================

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a wellness-related question and return an AI-generated answer
    based on PubMed research articles.
    """
    result = await process_wellness_query(request.message)

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
