"""
Pydantic schemas for request/response validation.
"""

from datetime import datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, Field

# Valid category types matching frontend
CategoryType = Literal["nourishment", "restoration", "mindset", "relationships", "vitality"]


class ArticleCreate(BaseModel):
    """Schema for creating a new article."""
    slug: str = Field(..., min_length=1, max_length=255, description="URL-friendly article identifier")
    title: str = Field(..., min_length=1, max_length=500, description="Article title")
    excerpt: Optional[str] = Field(None, description="Short summary of the article")
    content: str = Field(..., min_length=1, description="Article body in markdown format")
    category: CategoryType = Field(..., description="Article category (one of the 5 pillars)")
    featured_image_url: Optional[str] = Field(None, max_length=1000, description="URL of the featured image")
    featured_image_alt: Optional[str] = Field(None, max_length=500, description="Alt text for the featured image")
    is_featured: bool = Field(False, description="Whether this article should appear in featured section")
    is_hero: bool = Field(False, description="Whether this is the main hero article")


class ArticleUpdate(BaseModel):
    """Schema for updating an existing article."""
    slug: Optional[str] = Field(None, min_length=1, max_length=255, description="URL-friendly article identifier")
    title: Optional[str] = Field(None, min_length=1, max_length=500, description="Article title")
    excerpt: Optional[str] = Field(None, description="Short summary of the article")
    content: Optional[str] = Field(None, min_length=1, description="Article body in markdown format")
    category: Optional[CategoryType] = Field(None, description="Article category")
    featured_image_url: Optional[str] = Field(None, max_length=1000, description="URL of the featured image")
    featured_image_alt: Optional[str] = Field(None, max_length=500, description="Alt text for the featured image")
    is_featured: Optional[bool] = Field(None, description="Whether this article should appear in featured section")
    is_hero: Optional[bool] = Field(None, description="Whether this is the main hero article")


class FeaturedImage(BaseModel):
    """Schema for featured image response."""
    url: str
    alt: str


class ArticleResponse(BaseModel):
    """Schema for article response."""
    article_id: int
    slug: str
    title: str
    excerpt: Optional[str]
    content: str
    category: str
    featured_image: Optional[FeaturedImage] = None
    is_featured: bool
    is_hero: bool
    published_at: datetime
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ArticlePreview(BaseModel):
    """Schema for article preview (listing pages)."""
    article_id: int
    slug: str
    title: str
    excerpt: Optional[str]
    category: str
    featured_image: Optional[FeaturedImage] = None
    is_featured: bool
    published_at: datetime
    
    class Config:
        from_attributes = True


class ArticlesByCategory(BaseModel):
    """Schema for articles grouped by category."""
    nourishment: List[ArticlePreview] = []
    restoration: List[ArticlePreview] = []
    mindset: List[ArticlePreview] = []
    relationships: List[ArticlePreview] = []
    vitality: List[ArticlePreview] = []


class HomepageData(BaseModel):
    """Schema for homepage data response."""
    hero_article: Optional[ArticlePreview] = None
    featured_articles: List[ArticlePreview] = []
    articles_by_category: ArticlesByCategory  # Replaces orm_mode in Pydantic v2


# =============================================================================
# Engagement Schemas (Likes and Comments)
# =============================================================================

class LikeRequest(BaseModel):
    """Schema for toggling a like."""
    user_id: str = Field(..., min_length=1, max_length=100)


class LikeResponse(BaseModel):
    """Schema for like toggle response."""
    article_id: int
    likes_count: int
    is_liked: bool


class CommentLikeResponse(BaseModel):
    """Schema for comment like toggle response."""
    comment_id: int
    likes_count: int
    is_liked: bool


class EngagementStats(BaseModel):
    """Schema for article engagement statistics."""
    article_id: int
    likes_count: int
    comments_count: int
    is_liked_by_user: bool = False


class CommentCreate(BaseModel):
    """Schema for creating a comment."""
    anonymous_user_id: str = Field(..., min_length=1, max_length=100)
    display_name: str = Field(..., min_length=1, max_length=100)
    content: str = Field(..., min_length=1, max_length=5000)


class CommentResponse(BaseModel):
    """Schema for comment response."""
    comment_id: int
    article_id: int
    anonymous_user_id: str
    display_name: str
    content: str
    created_at: datetime
    likes_count: int = 0
    is_liked: bool = False
    is_own: bool = False
    
    class Config:
        from_attributes = True


class CommentDeleteRequest(BaseModel):
    """Schema for deleting a comment."""
    user_id: str = Field(..., min_length=1, max_length=100)
