"""
SQLAlchemy database models.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class Article(Base):
    """Article model for storing blog articles with structured metadata."""
    
    __tablename__ = "articles"
    
    article_id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(500), nullable=False)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)  # Article body in markdown format
    category = Column(String(50), index=True, nullable=False)  # nourishment, restoration, mindset, relationships, vitality
    featured_image_url = Column(String(1000), nullable=True)
    featured_image_alt = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_hero = Column(Boolean, default=False, nullable=False)  # For the main hero article
    published_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    likes = relationship("ArticleLike", back_populates="article", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="article", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Article(article_id={self.article_id}, slug={self.slug}, title={self.title[:30]}...)>"


class ArticleLike(Base):
    """Track article likes by anonymous users."""
    
    __tablename__ = "article_likes"
    
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.article_id", ondelete="CASCADE"), nullable=False)
    anonymous_user_id = Column(String(100), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Ensure each user can only like an article once
    __table_args__ = (
        UniqueConstraint('article_id', 'anonymous_user_id', name='unique_article_like'),
    )
    
    article = relationship("Article", back_populates="likes")
    
    def __repr__(self):
        return f"<ArticleLike(article_id={self.article_id}, user={self.anonymous_user_id})>"


class Comment(Base):
    """Comments on articles by anonymous users."""
    
    __tablename__ = "comments"
    
    comment_id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.article_id", ondelete="CASCADE"), nullable=False, index=True)
    anonymous_user_id = Column(String(100), index=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    article = relationship("Article", back_populates="comments")
    likes = relationship("CommentLike", back_populates="comment", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Comment(comment_id={self.comment_id}, article_id={self.article_id}, user={self.display_name})>"


class CommentLike(Base):
    """Track comment likes by anonymous users."""
    
    __tablename__ = "comment_likes"
    
    id = Column(Integer, primary_key=True, index=True)
    comment_id = Column(Integer, ForeignKey("comments.comment_id", ondelete="CASCADE"), nullable=False)
    anonymous_user_id = Column(String(100), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Ensure each user can only like a comment once
    __table_args__ = (
        UniqueConstraint('comment_id', 'anonymous_user_id', name='unique_comment_like'),
    )
    
    comment = relationship("Comment", back_populates="likes")
    
    def __repr__(self):
        return f"<CommentLike(comment_id={self.comment_id}, user={self.anonymous_user_id})>"
