import requests
import json
from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_

from ..database.models import NewsArticle
from ..schemas.news import NewsArticleCreate, NewsArticleResponse
import logging

logger = logging.getLogger(__name__)

class NewsService:
    def __init__(self):
        self.rapidapi_key = "8028f92d37mshaee587861c286bfp1f370djsn6a351cc6de16"
        self.rapidapi_host = "newsnow.p.rapidapi.com"
        self.base_url = "https://newsnow.p.rapidapi.com/newsv2_top_news"
        
    def fetch_news_from_api(self, location: str = "us", language: str = "en", page: int = 1) -> Optional[dict]:
        """Fetch news from RapidAPI"""
        try:
            headers = {
                'Content-Type': 'application/json',
                'x-rapidapi-host': self.rapidapi_host,
                'x-rapidapi-key': self.rapidapi_key
            }
            
            # Get current time for the API request
            now = datetime.now()
            from_date = (now - timedelta(hours=1)).strftime("%d/%m/%Y")
            to_date = now.strftime("%d/%m/%Y")
            
            payload = {
                "location": location,
                "language": language,
                "page": page,
                "time_bounded": True,
                "from_date": from_date,
                "to_date": to_date
            }
            
            response = requests.post(
                self.base_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"API request failed with status {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error fetching news from API: {str(e)}")
            return None
    
    def parse_and_save_articles(self, db: Session, api_response: dict) -> int:
        """Parse API response and save articles to database"""
        saved_count = 0
        skipped_no_image = 0
        
        try:
            if not api_response or 'news' not in api_response:
                logger.warning("No news data in API response")
                return 0
            
            for article_data in api_response['news']:
                try:
                    # Skip articles without images
                    top_image = article_data.get('top_image')
                    if not top_image or top_image.strip() == '':
                        skipped_no_image += 1
                        logger.debug(f"Skipping article without image: {article_data.get('title', 'Unknown')}")
                        continue
                    
                    # Check if article already exists
                    existing_article = db.query(NewsArticle).filter(
                        NewsArticle.url == article_data.get('url')
                    ).first()
                    
                    if existing_article:
                        logger.debug(f"Article already exists: {article_data.get('title', 'Unknown')}")
                        continue
                    
                    # Parse date
                    article_date = None
                    if article_data.get('date'):
                        try:
                            article_date = datetime.strptime(
                                article_data['date'], 
                                "%a, %d %b %Y %H:%M:%S %Z"
                            )
                        except ValueError:
                            try:
                                article_date = datetime.fromisoformat(
                                    article_data['date'].replace('Z', '+00:00')
                                )
                            except:
                                logger.warning(f"Could not parse date: {article_data['date']}")
                    
                    # Extract publisher info
                    publisher = article_data.get('publisher', {})
                    publisher_href = publisher.get('href') if publisher else None
                    publisher_title = publisher.get('title') if publisher else None
                    
                    # Create article
                    article = NewsArticle(
                        title=article_data.get('title', 'No Title'),
                        url=article_data.get('url', ''),
                        top_image=top_image,
                        images=article_data.get('images', []),
                        videos=article_data.get('videos', []),
                        date=article_date,
                        short_description=article_data.get('short_description'),
                        text=article_data.get('text'),
                        publisher_href=publisher_href,
                        publisher_title=publisher_title,
                        is_active=True
                    )
                    
                    db.add(article)
                    saved_count += 1
                    
                except Exception as e:
                    logger.error(f"Error processing article: {str(e)}")
                    continue
            
            db.commit()
            logger.info(f"Successfully saved {saved_count} new articles, skipped {skipped_no_image} articles without images")
            return saved_count
            
        except Exception as e:
            logger.error(f"Error parsing and saving articles: {str(e)}")
            db.rollback()
            return 0
    
    def get_articles(self, db: Session, skip: int = 0, limit: int = 20, 
                    only_active: bool = True) -> List[NewsArticle]:
        """Get articles from database ordered by publication date (newest first)"""
        query = db.query(NewsArticle)
        
        if only_active:
            query = query.filter(NewsArticle.is_active == True)
        
        # Filter out articles without images
        query = query.filter(
            and_(
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != ''
            )
        )
        
        # Order by article publication date (newest first), fallback to created_at if date is null
        # Use case statement to handle nulls properly
        from sqlalchemy import case
        return query.order_by(
            desc(case((NewsArticle.date.is_(None), NewsArticle.created_at), else_=NewsArticle.date)),
            desc(NewsArticle.created_at)
        ).offset(skip).limit(limit).all()
    
    def get_article_by_id(self, db: Session, article_id: int) -> Optional[NewsArticle]:
        """Get a specific article by ID"""
        return db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    
    def update_article_interaction(self, db: Session, article_id: int, action: str) -> bool:
        """Update article interaction (views only)"""
        try:
            article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
            if not article:
                return False
            
            if action == "view":
                article.views += 1
            else:
                return False
            
            db.commit()
            return True
            
        except Exception as e:
            logger.error(f"Error updating article interaction: {str(e)}")
            db.rollback()
            return False
    
    def fetch_and_save_latest_news(self, db: Session) -> int:
        """Fetch latest news and save to database - used by cron job"""
        try:
            logger.info("Starting news fetch job...")
            
            # Fetch news from multiple pages to get more articles
            total_saved = 0
            for page in range(1, 4):  # Fetch first 3 pages
                api_response = self.fetch_news_from_api(page=page)
                if api_response:
                    saved = self.parse_and_save_articles(db, api_response)
                    total_saved += saved
            
            logger.info(f"News fetch job completed. Total articles saved: {total_saved}")
            return total_saved
            
        except Exception as e:
            logger.error(f"Error in fetch_and_save_latest_news: {str(e)}")
            return 0 