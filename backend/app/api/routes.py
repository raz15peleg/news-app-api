from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
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
    language: str = Query(None, description="Language code to filter articles (en, he, etc.)"),
    db: Session = Depends(get_db)
):
    """Get paginated list of news articles from the last 24 hours"""
    try:
        # Calculate 24 hours ago timestamp
        twenty_four_hours_ago = datetime.now() - timedelta(hours=24)
        
        if random_order:
            # Get random articles from last 24 hours
            from sqlalchemy import func, and_
            from ..database.models import NewsArticle
            
            query = db.query(NewsArticle).filter(
                and_(
                    NewsArticle.is_active == True,
                    NewsArticle.top_image.isnot(None),
                    NewsArticle.top_image != '',
                    # Filter articles from the last 24 hours
                    (NewsArticle.date >= twenty_four_hours_ago) |
                    (NewsArticle.created_at >= twenty_four_hours_ago)
                )
            )
            
            # Filter by language if specified
            if language:
                query = query.filter(NewsArticle.language == language)
                
            articles = query.order_by(func.random()).offset(skip).limit(limit).all()
        else:
            # Get articles ordered by newest first (already filtered by 24 hours in service)
            articles = news_service.get_articles(db, skip=skip, limit=limit, language=language)
        
        # Get total count for pagination (filtered by 24 hours)
        from ..database.models import NewsArticle
        from sqlalchemy import and_
        
        count_query = db.query(NewsArticle).filter(
            and_(
                NewsArticle.is_active == True,
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != '',
                # Filter articles from the last 24 hours
                (NewsArticle.date >= twenty_four_hours_ago) |
                (NewsArticle.created_at >= twenty_four_hours_ago)
            )
        )
        
        # Filter by language if specified
        if language:
            count_query = count_query.filter(NewsArticle.language == language)
            
        total = count_query.count()
        
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
async def get_random_articles(
    count: int = Query(50, ge=1, le=1000), 
    language: str = Query(None, description="Language code to filter articles (en, he, etc.)"),
    db: Session = Depends(get_db)
):
    """Get random articles from the last 24 hours for the swipe interface"""
    try:
        from sqlalchemy import func, and_
        from ..database.models import NewsArticle
        
        # Calculate 24 hours ago timestamp
        twenty_four_hours_ago = datetime.now() - timedelta(hours=24)
        
        # Get total count of available articles from last 24 hours
        count_query = db.query(NewsArticle).filter(
            and_(
                NewsArticle.is_active == True,
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != '',
                # Filter articles from the last 24 hours
                (NewsArticle.date >= twenty_four_hours_ago) |
                (NewsArticle.created_at >= twenty_four_hours_ago)
            )
        )
        
        # Filter by language if specified
        if language:
            count_query = count_query.filter(NewsArticle.language == language)
            
        total_available = count_query.count()
        
        # If count is higher than available, use all available
        actual_count = min(count, total_available)
        
        article_query = db.query(NewsArticle).filter(
            and_(
                NewsArticle.is_active == True,
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != '',
                # Filter articles from the last 24 hours
                (NewsArticle.date >= twenty_four_hours_ago) |
                (NewsArticle.created_at >= twenty_four_hours_ago)
            )
        )
        
        # Filter by language if specified
        if language:
            article_query = article_query.filter(NewsArticle.language == language)
            
        articles = article_query.order_by(func.random()).limit(actual_count).all()
        
        return {"articles": articles}
    except Exception as e:
        logger.error(f"Error getting random articles: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch random articles")

@router.get("/articles/newest")
async def get_newest_articles(
    count: int = Query(50, ge=1, le=1000), 
    language: str = Query(None, description="Language code to filter articles (en, he, etc.)"),
    db: Session = Depends(get_db)
):
    """Get newest articles from the last 24 hours for the swipe interface"""
    try:
        from sqlalchemy import and_
        from ..database.models import NewsArticle
        
        # Calculate 24 hours ago timestamp
        twenty_four_hours_ago = datetime.now() - timedelta(hours=24)
        
        # Get total count of available articles from last 24 hours
        count_query = db.query(NewsArticle).filter(
            and_(
                NewsArticle.is_active == True,
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != '',
                # Filter articles from the last 24 hours
                (NewsArticle.date >= twenty_four_hours_ago) |
                (NewsArticle.created_at >= twenty_four_hours_ago)
            )
        )
        
        # Filter by language if specified
        if language:
            count_query = count_query.filter(NewsArticle.language == language)
            
        total_available = count_query.count()
        
        # If count is higher than available, use all available
        actual_count = min(count, total_available)
        
        # Use the news service which already has the 24-hour filter
        articles = news_service.get_articles(db, skip=0, limit=actual_count, language=language)
        return {"articles": articles}
    except Exception as e:
        logger.error(f"Error getting newest articles: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch newest articles")

@router.get("/articles/search")
async def search_articles(
    query: str = Query(..., description="Search query string"),
    skip: int = Query(0, ge=0, description="Number of articles to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of articles to return"),
    language: str = Query(None, description="Language code to filter articles (en, he, etc.)"),
    db: Session = Depends(get_db)
):
    """Search articles by title, description, or text content"""
    try:
        from sqlalchemy import func, and_, or_, desc, case
        from ..database.models import NewsArticle
        
        # Calculate 24 hours ago timestamp
        twenty_four_hours_ago = datetime.now() - timedelta(hours=24)
        
        # Build search query
        search_query = db.query(NewsArticle).filter(
            and_(
                NewsArticle.is_active == True,
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != '',
                # Filter articles from the last 24 hours
                (NewsArticle.date >= twenty_four_hours_ago) |
                (NewsArticle.created_at >= twenty_four_hours_ago),
                # Search in title, short_description, and text
                or_(
                    NewsArticle.title.ilike(f'%{query}%'),
                    NewsArticle.short_description.ilike(f'%{query}%'),
                    NewsArticle.text.ilike(f'%{query}%')
                )
            )
        )
        
        # Filter by language if specified
        if language:
            search_query = search_query.filter(NewsArticle.language == language)
        
        # Get total count for pagination
        total = search_query.count()
        
        # Get paginated results ordered by relevance (title matches first, then description, then text)
        articles = search_query.order_by(
            case(
                (NewsArticle.title.ilike(f'%{query}%'), 0),
                else_=1
            ),
            NewsArticle.date.desc(),
            NewsArticle.created_at.desc()
        ).offset(skip).limit(limit).all()
        
        has_next = skip + limit < total
        
        return NewsArticleList(
            articles=articles,
            total=total,
            page=skip // limit + 1,
            size=len(articles),
            has_next=has_next
        )
    except Exception as e:
        logger.error(f"Error searching articles: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to search articles")

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
async def fetch_news_manually(
    language: str = Query(None, description="Language code to fetch (en, he, etc.). If not specified, fetches all languages"),
    hours: int = Query(12, ge=1, le=168, description="How many hours back to fetch news (default: 12, max: 168)"),
    db: Session = Depends(get_db)
):
    """Manually trigger news fetching (for testing/admin use)"""
    try:
        # Validate language if specified
        if language and language not in news_service.get_supported_languages():
            raise HTTPException(status_code=400, detail=f"Unsupported language: {language}")
        
        saved_count = news_service.fetch_and_save_latest_news(db, language=language, hours=hours)
        return {
            "message": "News fetch completed successfully", 
            "articles_saved": saved_count,
            "language": language or "all languages",
            "hours": hours
        }
    except HTTPException:
        raise
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

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages"""
    try:
        languages = news_service.get_supported_languages()
        return {
            "languages": [
                {
                    "code": code,
                    "name": config["name"],
                    "location": config["location"]
                }
                for code, config in languages.items()
            ]
        }
    except Exception as e:
        logger.error(f"Error getting supported languages: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get supported languages")

@router.get("/articles/stats")
async def get_articles_stats(db: Session = Depends(get_db)):
    """Get article statistics by language"""
    try:
        from sqlalchemy import func, and_
        from ..database.models import NewsArticle
        
        # Get article counts by language
        stats = db.query(
            NewsArticle.language,
            func.count(NewsArticle.id).label('count')
        ).filter(
            and_(
                NewsArticle.is_active == True,
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != ''
            )
        ).group_by(NewsArticle.language).all()
        
        # Get total count
        total = db.query(NewsArticle).filter(
            and_(
                NewsArticle.is_active == True,
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != ''
            )
        ).count()
        
        return {
            "total_articles": total,
            "by_language": {stat.language: stat.count for stat in stats}
        }
    except Exception as e:
        logger.error(f"Error getting article stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get article statistics")

@router.post("/cleanup-old-articles")
async def cleanup_old_articles(db: Session = Depends(get_db)):
    """Manually trigger cleanup of old articles (older than 7 days)"""
    try:
        logger.info("Manual cleanup job triggered...")
        
        # Clean up articles older than 7 days
        from datetime import datetime, timedelta
        from ..database.models import NewsArticle
        
        cutoff_date = datetime.now() - timedelta(days=7)
        deleted_count = db.query(NewsArticle).filter(
            NewsArticle.created_at < cutoff_date
        ).delete()
        
        db.commit()
        logger.info(f"Manual cleanup job completed. Articles deleted: {deleted_count}")
        
        return {
            "message": "Cleanup completed successfully",
            "articles_deleted": deleted_count,
            "cutoff_date": cutoff_date.isoformat()
        }
    except Exception as e:
        logger.error(f"Error in manual cleanup job: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "News API is running"}


# Include all routes
def get_router():
    return router 