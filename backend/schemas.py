"""
Pydantic schemas for request/response validation.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class ArticleCreate(BaseModel):
    """Schema for creating a new article."""
    article_markdown: str = Field(..., min_length=1, description="Article content in markdown format")


class ArticleUpdate(BaseModel):
    """Schema for updating an existing article."""
    article_markdown: str = Field(..., min_length=1, description="Updated article content in markdown format")


class ArticleResponse(BaseModel):
    """Schema for article response."""
    article_id: int
    article_markdown: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # Replaces orm_mode in Pydantic v2
