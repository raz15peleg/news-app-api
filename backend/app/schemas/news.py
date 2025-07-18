from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Any
from datetime import datetime

class Publisher(BaseModel):
    href: Optional[str] = None
    title: Optional[str] = None

class NewsArticleBase(BaseModel):
    title: str
    url: str
    top_image: Optional[str] = None
    images: Optional[List[str]] = None
    videos: Optional[List[str]] = None
    date: Optional[datetime] = None
    short_description: Optional[str] = None
    text: Optional[str] = None
    publisher_href: Optional[str] = None
    publisher_title: Optional[str] = None
    language: str = "en"  # Language code (en, he, etc.)
    location: str = "us"  # Location code (us, il, etc.)

class NewsArticleCreate(NewsArticleBase):
    pass

class NewsArticleUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    top_image: Optional[str] = None
    images: Optional[List[str]] = None
    videos: Optional[List[str]] = None
    date: Optional[datetime] = None
    short_description: Optional[str] = None
    text: Optional[str] = None
    publisher_href: Optional[str] = None
    publisher_title: Optional[str] = None
    language: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None

class NewsArticleResponse(NewsArticleBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool
    views: int
    
    class Config:
        from_attributes = True

class NewsArticleList(BaseModel):
    articles: List[NewsArticleResponse]
    total: int
    page: int
    size: int
    has_next: bool

class UserAction(BaseModel):
    action: str  # 'view'
    article_id: int

class NewsAPIResponse(BaseModel):
    count: int
    news: List[dict]

# Language configuration
class LanguageConfig(BaseModel):
    code: str
    name: str
    location: str

class SupportedLanguages(BaseModel):
    languages: List[LanguageConfig] 