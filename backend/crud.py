"""
CRUD operations for articles.
"""

from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from models import Article
from schemas import ArticleCreate, ArticleUpdate


def create_article(db: Session, article: ArticleCreate) -> Article:
    """Create a new article."""
    db_article = Article(
        article_markdown=article.article_markdown,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


def get_article(db: Session, article_id: int) -> Optional[Article]:
    """Get a single article by ID."""
    return db.query(Article).filter(Article.article_id == article_id).first()


def get_articles(db: Session, skip: int = 0, limit: int = 100) -> List[Article]:
    """Get all articles with pagination."""
    return db.query(Article).offset(skip).limit(limit).all()


def update_article(db: Session, article_id: int, article_update: ArticleUpdate) -> Optional[Article]:
    """Update an existing article."""
    db_article = db.query(Article).filter(Article.article_id == article_id).first()
    if db_article:
        db_article.article_markdown = article_update.article_markdown
        db_article.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_article)
    return db_article


def delete_article(db: Session, article_id: int) -> bool:
    """Delete an article."""
    db_article = db.query(Article).filter(Article.article_id == article_id).first()
    if db_article:
        db.delete(db_article)
        db.commit()
        return True
    return False
