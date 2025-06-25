from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import logging
from contextlib import asynccontextmanager

from ..database.connection import SessionLocal
from .news_service import NewsService

logger = logging.getLogger(__name__)

class CronService:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.news_service = NewsService()
        
    def start_scheduler(self):
        """Start the background scheduler"""
        try:
            # Add job to fetch news every 12 hours (twice a day at 12:00 AM and 12:00 PM)
            self.scheduler.add_job(
                func=self.fetch_news_job,
                trigger=CronTrigger(hour='0,12', minute=0),  # Run at 12:00 AM and 12:00 PM
                id='fetch_news_12hourly',
                name='Fetch News Every 12 Hours',
                replace_existing=True
            )
            
            # Add job to clean up old articles daily at 2 AM
            self.scheduler.add_job(
                func=self.cleanup_old_articles_job,
                trigger=CronTrigger(hour=2, minute=0),  # Run daily at 2 AM
                id='cleanup_old_articles',
                name='Cleanup Old Articles',
                replace_existing=True
            )
            
            self.scheduler.start()
            logger.info("Scheduler started successfully - News fetching every 12 hours (12:00 AM and 12:00 PM)")
            
        except Exception as e:
            logger.error(f"Failed to start scheduler: {str(e)}")
    
    def stop_scheduler(self):
        """Stop the background scheduler"""
        try:
            self.scheduler.shutdown()
            logger.info("Scheduler stopped successfully")
        except Exception as e:
            logger.error(f"Failed to stop scheduler: {str(e)}")
    
    async def fetch_news_job(self):
        """Background job to fetch news from the past 12 hours"""
        try:
            logger.info("Running scheduled news fetch job (12-hour cycle)...")
            db = SessionLocal()
            try:
                saved_count = self.news_service.fetch_and_save_latest_news(db)
                logger.info(f"Scheduled news fetch completed. Articles saved: {saved_count}")
            finally:
                db.close()
        except Exception as e:
            logger.error(f"Error in scheduled news fetch job: {str(e)}")
    
    async def cleanup_old_articles_job(self):
        """Background job to clean up old articles"""
        try:
            logger.info("Running scheduled cleanup job...")
            db = SessionLocal()
            try:
                # Clean up articles older than 7 days
                from datetime import datetime, timedelta
                from ..database.models import NewsArticle
                
                cutoff_date = datetime.now() - timedelta(days=7)
                deleted_count = db.query(NewsArticle).filter(
                    NewsArticle.created_at < cutoff_date
                ).delete()
                
                db.commit()
                logger.info(f"Cleanup job completed. Articles deleted: {deleted_count}")
            finally:
                db.close()
        except Exception as e:
            logger.error(f"Error in cleanup job: {str(e)}")
    
    def get_job_status(self):
        """Get the status of scheduled jobs"""
        jobs = []
        for job in self.scheduler.get_jobs():
            jobs.append({
                'id': job.id,
                'name': job.name,
                'next_run': job.next_run_time.isoformat() if job.next_run_time else None,
                'trigger': str(job.trigger)
            })
        return jobs

# Global instance
cron_service = CronService() 