"""
Wellness Chatbot Backend - FastAPI Server
A health/wellness chatbot API that provides research-backed answers.
"""

from typing import List, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from search_agent import process_wellness_query
from database import engine, get_db
from models import Base, Article
import crud
from schemas import (
    ArticleCreate, ArticleUpdate, ArticleResponse, ArticlePreview,
    ArticlesByCategory, HomepageData, FeaturedImage,
    LikeRequest, LikeResponse, EngagementStats, CommentCreate, CommentResponse, CommentDeleteRequest, CommentLikeResponse
)

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

def article_to_preview(article: Article) -> ArticlePreview:
    """Convert Article model to ArticlePreview schema."""
    featured_image = None
    if article.featured_image_url:
        featured_image = FeaturedImage(
            url=article.featured_image_url,
            alt=article.featured_image_alt or article.title
        )
    return ArticlePreview(
        article_id=article.article_id,
        slug=article.slug,
        title=article.title,
        excerpt=article.excerpt,
        category=article.category,
        featured_image=featured_image,
        is_featured=article.is_featured,
        published_at=article.published_at
    )


def article_to_response(article: Article) -> ArticleResponse:
    """Convert Article model to ArticleResponse schema."""
    featured_image = None
    if article.featured_image_url:
        featured_image = FeaturedImage(
            url=article.featured_image_url,
            alt=article.featured_image_alt or article.title
        )
    return ArticleResponse(
        article_id=article.article_id,
        slug=article.slug,
        title=article.title,
        excerpt=article.excerpt,
        content=article.content,
        category=article.category,
        featured_image=featured_image,
        is_featured=article.is_featured,
        is_hero=article.is_hero,
        published_at=article.published_at,
        created_at=article.created_at,
        updated_at=article.updated_at
    )


@app.get("/homepage", response_model=HomepageData)
def get_homepage_data(db: Session = Depends(get_db)):
    """
    Get all data needed for the homepage in a single request.
    Includes hero article, featured articles, and articles grouped by category.
    """
    hero = crud.get_hero_article(db)
    featured = crud.get_featured_articles(db, limit=3)
    articles_by_cat = crud.get_articles_grouped_by_category(db, limit_per_category=2)
    
    return HomepageData(
        hero_article=article_to_preview(hero) if hero else None,
        featured_articles=[article_to_preview(a) for a in featured],
        articles_by_category=ArticlesByCategory(
            nourishment=[article_to_preview(a) for a in articles_by_cat.get("nourishment", [])],
            restoration=[article_to_preview(a) for a in articles_by_cat.get("restoration", [])],
            mindset=[article_to_preview(a) for a in articles_by_cat.get("mindset", [])],
            relationships=[article_to_preview(a) for a in articles_by_cat.get("relationships", [])],
            vitality=[article_to_preview(a) for a in articles_by_cat.get("vitality", [])]
        )
    )


@app.post("/articles", response_model=ArticleResponse, status_code=201)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    """
    Create a new article.
    """
    # Check if slug already exists
    existing = crud.get_article_by_slug(db, article.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Article with this slug already exists")
    
    db_article = crud.create_article(db=db, article=article)
    return article_to_response(db_article)


@app.get("/articles", response_model=List[ArticlePreview])
def read_articles(skip: int = 0, limit: int = 100, category: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get all articles with pagination, optionally filtered by category.
    
    - **skip**: Number of articles to skip (default: 0)
    - **limit**: Maximum number of articles to return (default: 100)
    - **category**: Filter by category (optional)
    """
    if category:
        articles = crud.get_articles_by_category(db=db, category=category, limit=limit)
    else:
        articles = crud.get_articles(db=db, skip=skip, limit=limit)
    return [article_to_preview(a) for a in articles]


@app.get("/articles/featured", response_model=List[ArticlePreview])
def read_featured_articles(limit: int = 3, db: Session = Depends(get_db)):
    """
    Get featured articles.
    
    - **limit**: Maximum number of articles to return (default: 3)
    """
    articles = crud.get_featured_articles(db=db, limit=limit)
    return [article_to_preview(a) for a in articles]


@app.get("/articles/hero", response_model=ArticlePreview)
def read_hero_article(db: Session = Depends(get_db)):
    """
    Get the hero article for the homepage.
    """
    article = crud.get_hero_article(db)
    if article is None:
        raise HTTPException(status_code=404, detail="No hero article found")
    return article_to_preview(article)


@app.get("/articles/slug/{slug}", response_model=ArticleResponse)
def read_article_by_slug(slug: str, db: Session = Depends(get_db)):
    """
    Get a single article by slug.
    
    - **slug**: The URL-friendly slug of the article
    """
    db_article = crud.get_article_by_slug(db=db, slug=slug)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article_to_response(db_article)


# =============================================================================
# ENGAGEMENT ENDPOINTS (Likes, Comments)
# These must be defined BEFORE /articles/{article_id} to avoid route conflicts
# =============================================================================

@app.get("/articles/{article_id}/engagement", response_model=EngagementStats)
def get_engagement_stats(article_id: int, user_id: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get engagement statistics for an article.
    
    - **article_id**: The ID of the article
    - **user_id**: Optional anonymous user ID to check if user has liked (query param)
    """
    # Verify article exists
    db_article = crud.get_article(db=db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    likes_count = crud.get_article_likes_count(db, article_id)
    comments_count = crud.get_comments_count(db, article_id)
    is_liked = crud.is_article_liked_by_user(db, article_id, user_id) if user_id else False
    
    return EngagementStats(
        article_id=article_id,
        likes_count=likes_count,
        comments_count=comments_count,
        is_liked_by_user=is_liked
    )


@app.post("/articles/{article_id}/like", response_model=LikeResponse)
def toggle_article_like(article_id: int, request: LikeRequest, db: Session = Depends(get_db)):
    """
    Toggle like on an article (like if not liked, unlike if already liked).
    
    - **article_id**: The ID of the article
    - **user_id**: Anonymous user ID in request body
    """
    # Verify article exists
    db_article = crud.get_article(db=db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    likes_count, is_liked = crud.toggle_article_like(db, article_id, request.user_id)
    
    return LikeResponse(
        article_id=article_id,
        likes_count=likes_count,
        is_liked=is_liked
    )


@app.get("/articles/{article_id}/comments", response_model=List[CommentResponse])
def get_article_comments(article_id: int, user_id: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get all comments for an article.
    
    - **article_id**: The ID of the article
    - **user_id**: Optional anonymous user ID to check ownership and likes (query param)
    """
    # Verify article exists
    db_article = crud.get_article(db=db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    comments = crud.get_comments(db, article_id)
    
    return [
        CommentResponse(
            comment_id=c.comment_id,
            article_id=c.article_id,
            anonymous_user_id=c.anonymous_user_id,
            display_name=c.display_name,
            content=c.content,
            created_at=c.created_at,
            likes_count=crud.get_comment_likes_count(db, c.comment_id),
            is_liked=crud.is_comment_liked_by_user(db, c.comment_id, user_id) if user_id else False,
            is_own=c.anonymous_user_id == user_id if user_id else False
        )
        for c in comments
    ]


@app.post("/articles/{article_id}/comments", response_model=CommentResponse, status_code=201)
def create_article_comment(article_id: int, comment: CommentCreate, db: Session = Depends(get_db)):
    """
    Create a new comment on an article.
    
    - **article_id**: The ID of the article
    """
    # Verify article exists
    db_article = crud.get_article(db=db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db_comment = crud.create_comment(db, article_id, comment)
    
    return CommentResponse(
        comment_id=db_comment.comment_id,
        article_id=db_comment.article_id,
        anonymous_user_id=db_comment.anonymous_user_id,
        display_name=db_comment.display_name,
        content=db_comment.content,
        created_at=db_comment.created_at,
        likes_count=0,
        is_liked=False,
        is_own=True
    )


@app.delete("/articles/{article_id}/comments/{comment_id}", status_code=204)
def delete_article_comment(article_id: int, comment_id: int, request: CommentDeleteRequest, db: Session = Depends(get_db)):
    """
    Delete a comment. Only the author can delete their comment.
    
    - **article_id**: The ID of the article
    - **comment_id**: The ID of the comment to delete
    - **user_id**: Anonymous user ID in request body (must be the author)
    """
    # Verify comment belongs to this article
    db_comment = crud.get_comment(db, comment_id)
    if db_comment is None or db_comment.article_id != article_id:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    success = crud.delete_comment(db, comment_id, request.user_id)
    if not success:
        raise HTTPException(status_code=403, detail="You can only delete your own comments")
    return None


@app.post("/articles/{article_id}/comments/{comment_id}/like", response_model=CommentLikeResponse)
def toggle_comment_like(article_id: int, comment_id: int, request: LikeRequest, db: Session = Depends(get_db)):
    """
    Toggle like on a comment (like if not liked, unlike if already liked).
    
    - **article_id**: The ID of the article
    - **comment_id**: The ID of the comment
    - **user_id**: Anonymous user ID in request body
    """
    # Verify comment belongs to this article
    db_comment = crud.get_comment(db, comment_id)
    if db_comment is None or db_comment.article_id != article_id:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    likes_count, is_liked = crud.toggle_comment_like(db, comment_id, request.user_id)
    
    return CommentLikeResponse(
        comment_id=comment_id,
        likes_count=likes_count,
        is_liked=is_liked
    )


# =============================================================================
# ARTICLE BY ID ENDPOINTS (must be after more specific routes)
# =============================================================================

@app.get("/articles/{article_id}", response_model=ArticleResponse)
def read_article(article_id: int, db: Session = Depends(get_db)):
    """
    Get a single article by ID.
    
    - **article_id**: The ID of the article to retrieve
    """
    db_article = crud.get_article(db=db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article_to_response(db_article)


@app.put("/articles/{article_id}", response_model=ArticleResponse)
def update_article(article_id: int, article: ArticleUpdate, db: Session = Depends(get_db)):
    """
    Update an existing article.
    
    - **article_id**: The ID of the article to update
    """
    db_article = crud.update_article(db=db, article_id=article_id, article_update=article)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article_to_response(db_article)


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
