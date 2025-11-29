"""
Wellness Chatbot Backend - FastAPI Server
A health/wellness chatbot API that provides research-backed answers.
"""

from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from search_agent import process_wellness_query
from database import engine, get_db
from models import Base
import crud
from schemas import ArticleCreate, ArticleUpdate, ArticleResponse

# Load environment variables from .env file
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)


# =============================================================================
# FASTAPI APPLICATION
# =============================================================================

app = FastAPI(
    title="Total Life Daily API",
    description="A health and wellness platform with AI chatbot and article management",
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
# ARTICLE CRUD ENDPOINTS
# =============================================================================

@app.post("/articles", response_model=ArticleResponse, status_code=201)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    """
    Create a new article.
    
    - **article_markdown**: The article content in markdown format
    """
    return crud.create_article(db=db, article=article)


@app.get("/articles", response_model=List[ArticleResponse])
def read_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all articles with pagination.
    
    - **skip**: Number of articles to skip (default: 0)
    - **limit**: Maximum number of articles to return (default: 100)
    """
    articles = crud.get_articles(db=db, skip=skip, limit=limit)
    return articles


@app.get("/articles/{article_id}", response_model=ArticleResponse)
def read_article(article_id: int, db: Session = Depends(get_db)):
    """
    Get a single article by ID.
    
    - **article_id**: The ID of the article to retrieve
    """
    db_article = crud.get_article(db=db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article


@app.put("/articles/{article_id}", response_model=ArticleResponse)
def update_article(article_id: int, article: ArticleUpdate, db: Session = Depends(get_db)):
    """
    Update an existing article.
    
    - **article_id**: The ID of the article to update
    - **article_markdown**: The updated article content in markdown format
    """
    db_article = crud.update_article(db=db, article_id=article_id, article_update=article)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article


@app.delete("/articles/{article_id}", status_code=204)
def delete_article(article_id: int, db: Session = Depends(get_db)):
    """
    Delete an article.
    
    - **article_id**: The ID of the article to delete
    """
    success = crud.delete_article(db=db, article_id=article_id)
    if not success:
        raise HTTPException(status_code=404, detail="Article not found")
    return None


# =============================================================================
# RUN SERVER (for development)
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
