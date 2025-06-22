from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from ..database.connection import get_db
from ..services.news_service import NewsService
from ..services.cron_service import cron_service
from ..schemas.news import (
    NewsArticleResponse, 
    NewsArticleList, 
    UserAction,
    NewsArticleCreate
)

logger = logging.getLogger(__name__)

router = APIRouter()
news_service = NewsService()

@router.get("/articles", response_model=NewsArticleList)
async def get_articles(
    skip: int = Query(0, ge=0, description="Number of articles to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of articles to return"),
    random_order: bool = Query(False, description="Whether to return articles in random order"),
    db: Session = Depends(get_db)
):
    """Get paginated list of news articles"""
    try:
        if random_order:
            # Get random articles
            from sqlalchemy import func, and_
            from ..database.models import NewsArticle
            
            articles = db.query(NewsArticle).filter(
                and_(
                    NewsArticle.is_active == True,
                    NewsArticle.top_image.isnot(None),
                    NewsArticle.top_image != ''
                )
            ).order_by(func.random()).offset(skip).limit(limit).all()
        else:
            # Get articles ordered by newest first
            articles = news_service.get_articles(db, skip=skip, limit=limit)
        
        # Get total count for pagination
        from ..database.models import NewsArticle
        from sqlalchemy import and_
        total = db.query(NewsArticle).filter(
            and_(
                NewsArticle.is_active == True,
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != ''
            )
        ).count()
        
        has_next = skip + limit < total
        
        return NewsArticleList(
            articles=articles,
            total=total,
            page=skip // limit + 1,
            size=len(articles),
            has_next=has_next
        )
    except Exception as e:
        logger.error(f"Error getting articles: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch articles")

@router.get("/articles/random")
async def get_random_articles(count: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)):
    """Get random articles for the swipe interface"""
    try:
        from sqlalchemy import func, and_
        from ..database.models import NewsArticle
        
        articles = db.query(NewsArticle).filter(
            and_(
                NewsArticle.is_active == True,
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != ''
            )
        ).order_by(func.random()).limit(count).all()
        
        return {"articles": articles}
    except Exception as e:
        logger.error(f"Error getting random articles: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch random articles")

@router.get("/articles/newest")
async def get_newest_articles(count: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)):
    """Get newest articles for the swipe interface"""
    try:
        articles = news_service.get_articles(db, skip=0, limit=count)
        return {"articles": articles}
    except Exception as e:
        logger.error(f"Error getting newest articles: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch newest articles")

@router.get("/articles/{article_id}", response_model=NewsArticleResponse)
async def get_article(article_id: int, db: Session = Depends(get_db)):
    """Get a specific article by ID"""
    try:
        article = news_service.get_article_by_id(db, article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        # Increment view count
        news_service.update_article_interaction(db, article_id, "view")
        
        return article
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting article {article_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch article")

@router.post("/articles/{article_id}/action")
async def article_action(
    article_id: int, 
    action: UserAction, 
    db: Session = Depends(get_db)
):
    """Handle user actions on articles (view only)"""
    try:
        if action.action not in ["view"]:
            raise HTTPException(status_code=400, detail="Invalid action")
        
        success = news_service.update_article_interaction(db, article_id, action.action)
        if not success:
            raise HTTPException(status_code=404, detail="Article not found")
        
        return {"message": f"Action '{action.action}' recorded successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error recording action for article {article_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to record action")

@router.post("/fetch-news")
async def fetch_news_manually(db: Session = Depends(get_db)):
    """Manually trigger news fetching (for testing/admin use)"""
    try:
        saved_count = news_service.fetch_and_save_latest_news(db)
        return {
            "message": "News fetch completed successfully", 
            "articles_saved": saved_count
        }
    except Exception as e:
        logger.error(f"Error in manual news fetch: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch news")

@router.get("/scheduler-status")
async def get_scheduler_status():
    """Get the status of scheduled jobs"""
    try:
        jobs = cron_service.get_job_status()
        return {
            "scheduler_running": cron_service.scheduler.running,
            "jobs": jobs
        }
    except Exception as e:
        logger.error(f"Error getting scheduler status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get scheduler status")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "News API is running"}

# Include all routes
def get_router():
    return router 