from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from .connection import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    url = Column(String(1000), nullable=False, unique=True, index=True)
    top_image = Column(String(1000), nullable=True)
    images = Column(JSON, nullable=True)  # Store as JSON array
    videos = Column(JSON, nullable=True)  # Store as JSON array
    date = Column(DateTime, nullable=True)
    short_description = Column(Text, nullable=True)
    text = Column(Text, nullable=True)
    publisher_href = Column(String(500), nullable=True)
    publisher_title = Column(String(200), nullable=True)
    
    # Language and location fields
    language = Column(String(10), nullable=False, default='en', index=True)  # Language code (en, he, etc.)
    location = Column(String(10), nullable=False, default='us', index=True)  # Location code (us, il, etc.)
    
    # Metadata fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # User interaction fields
    views = Column(Integer, default=0)

    def __repr__(self):
        return f"<NewsArticle(id={self.id}, title='{self.title[:50]}...', language='{self.language}')>" 