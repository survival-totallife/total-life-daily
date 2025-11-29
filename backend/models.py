"""
SQLAlchemy database models.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base


class Article(Base):
    """Article model for storing blog articles in markdown format."""
    
    __tablename__ = "articles"
    
    article_id = Column(Integer, primary_key=True, index=True)
    article_markdown = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Article(article_id={self.article_id}, created_at={self.created_at})>"
