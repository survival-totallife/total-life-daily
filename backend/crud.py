"""
CRUD operations for articles.
"""

from datetime import datetime
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from models import Article, ArticleLike, Comment, CommentLike
from schemas import ArticleCreate, ArticleUpdate, CommentCreate


def create_article(db: Session, article: ArticleCreate) -> Article:
    """Create a new article."""
    db_article = Article(
        slug=article.slug,
        title=article.title,
        excerpt=article.excerpt,
        content=article.content,
        category=article.category,
        featured_image_url=article.featured_image_url,
        featured_image_alt=article.featured_image_alt,
        is_featured=article.is_featured,
        is_hero=article.is_hero,
        published_at=datetime.utcnow(),
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


def get_article_by_slug(db: Session, slug: str) -> Optional[Article]:
    """Get a single article by slug."""
    return db.query(Article).filter(Article.slug == slug).first()


def get_articles(db: Session, skip: int = 0, limit: int = 100) -> List[Article]:
    """Get all articles with pagination."""
    return db.query(Article).order_by(Article.published_at.desc()).offset(skip).limit(limit).all()


def get_hero_article(db: Session) -> Optional[Article]:
    """Get the hero article (is_hero=True)."""
    return db.query(Article).filter(Article.is_hero == True).first()


def get_featured_articles(db: Session, limit: int = 3) -> List[Article]:
    """Get featured articles (is_featured=True)."""
    return db.query(Article).filter(Article.is_featured == True).order_by(Article.published_at.desc()).limit(limit).all()


def get_articles_by_category(db: Session, category: str, limit: int = 10) -> List[Article]:
    """Get articles by category."""
    return db.query(Article).filter(Article.category == category).order_by(Article.published_at.desc()).limit(limit).all()


def get_articles_grouped_by_category(db: Session, limit_per_category: int = 2) -> Dict[str, List[Article]]:
    """Get articles grouped by all categories."""
    categories = ["nourishment", "restoration", "mindset", "relationships", "vitality"]
    result = {}
    for category in categories:
        result[category] = get_articles_by_category(db, category, limit_per_category)
    return result


def update_article(db: Session, article_id: int, article_update: ArticleUpdate) -> Optional[Article]:
    """Update an existing article."""
    db_article = db.query(Article).filter(Article.article_id == article_id).first()
    if db_article:
        # Update only provided fields
        update_data = article_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if value is not None:
                setattr(db_article, field, value)
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


# =============================================================================
# Article Likes CRUD
# =============================================================================

def get_article_likes_count(db: Session, article_id: int) -> int:
    """Get the number of likes for an article."""
    return db.query(ArticleLike).filter(ArticleLike.article_id == article_id).count()


def is_article_liked_by_user(db: Session, article_id: int, user_id: str) -> bool:
    """Check if a user has liked an article."""
    return db.query(ArticleLike).filter(
        ArticleLike.article_id == article_id,
        ArticleLike.anonymous_user_id == user_id
    ).first() is not None


def toggle_article_like(db: Session, article_id: int, user_id: str) -> tuple[int, bool]:
    """Toggle like on an article. Returns (likes_count, is_liked)."""
    existing_like = db.query(ArticleLike).filter(
        ArticleLike.article_id == article_id,
        ArticleLike.anonymous_user_id == user_id
    ).first()
    
    if existing_like:
        # Unlike
        db.delete(existing_like)
        db.commit()
        likes_count = get_article_likes_count(db, article_id)
        return likes_count, False
    else:
        # Like
        new_like = ArticleLike(
            article_id=article_id,
            anonymous_user_id=user_id,
            created_at=datetime.utcnow()
        )
        db.add(new_like)
        db.commit()
        likes_count = get_article_likes_count(db, article_id)
        return likes_count, True


# =============================================================================
# Comments CRUD
# =============================================================================

def get_comments(db: Session, article_id: int) -> List[Comment]:
    """Get all comments for an article, newest first."""
    return db.query(Comment).filter(
        Comment.article_id == article_id
    ).order_by(Comment.created_at.desc()).all()


def get_comment(db: Session, comment_id: int) -> Optional[Comment]:
    """Get a single comment by ID."""
    return db.query(Comment).filter(Comment.comment_id == comment_id).first()


def get_comments_count(db: Session, article_id: int) -> int:
    """Get the number of comments for an article."""
    return db.query(Comment).filter(Comment.article_id == article_id).count()


def create_comment(db: Session, article_id: int, comment: CommentCreate) -> Comment:
    """Create a new comment."""
    db_comment = Comment(
        article_id=article_id,
        anonymous_user_id=comment.anonymous_user_id,
        display_name=comment.display_name,
        content=comment.content,
        created_at=datetime.utcnow()
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


def delete_comment(db: Session, comment_id: int, user_id: str) -> bool:
    """Delete a comment. Only the author can delete their comment."""
    db_comment = db.query(Comment).filter(
        Comment.comment_id == comment_id,
        Comment.anonymous_user_id == user_id
    ).first()
    
    if db_comment:
        db.delete(db_comment)
        db.commit()
        return True
    return False


# =============================================================================
# Comment Likes CRUD
# =============================================================================

def get_comment_likes_count(db: Session, comment_id: int) -> int:
    """Get the number of likes for a comment."""
    return db.query(CommentLike).filter(CommentLike.comment_id == comment_id).count()


def is_comment_liked_by_user(db: Session, comment_id: int, user_id: str) -> bool:
    """Check if a user has liked a comment."""
    return db.query(CommentLike).filter(
        CommentLike.comment_id == comment_id,
        CommentLike.anonymous_user_id == user_id
    ).first() is not None


def toggle_comment_like(db: Session, comment_id: int, user_id: str) -> tuple[int, bool]:
    """Toggle like on a comment. Returns (likes_count, is_liked)."""
    existing_like = db.query(CommentLike).filter(
        CommentLike.comment_id == comment_id,
        CommentLike.anonymous_user_id == user_id
    ).first()
    
    if existing_like:
        # Unlike
        db.delete(existing_like)
        db.commit()
        likes_count = get_comment_likes_count(db, comment_id)
        return likes_count, False
    else:
        # Like
        new_like = CommentLike(
            comment_id=comment_id,
            anonymous_user_id=user_id,
            created_at=datetime.utcnow()
        )
        db.add(new_like)
        db.commit()
        likes_count = get_comment_likes_count(db, comment_id)
        return likes_count, True
