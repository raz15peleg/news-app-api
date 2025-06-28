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
        self.rapidapi_key = "aa8ed895c2msha546930acfab01ap109070jsn317e255ca2a0"
        self.rapidapi_host = "newsnow.p.rapidapi.com"
        self.base_url_top_news = "https://newsnow.p.rapidapi.com/newsv2_top_news"
        self.base_url_search = "https://newsnow.p.rapidapi.com/newsv2"
        
        # Supported languages configuration
        self.supported_languages = {
            "en": {"name": "English", "location": "us"},
            "he": {"name": "Hebrew", "location": "il"}  # Hebrew content from Israel
        }
        
    def get_supported_languages(self):
        """Get list of supported languages"""
        return self.supported_languages
        
    def fetch_news_from_api(self, location: str = "us", language: str = "en", page: int = 1) -> Optional[dict]:
        """Fetch news from RapidAPI for the past 12 hours"""
        try:
            headers = {
                'Content-Type': 'application/json',
                'x-rapidapi-host': self.rapidapi_host,
                'x-rapidapi-key': self.rapidapi_key
            }
            
            # Get current time for the API request
            now = datetime.now()
            
            # Fetch news from the past 12 hours for both languages
            from_date = (now - timedelta(hours=12)).strftime("%d/%m/%Y")
            to_date = now.strftime("%d/%m/%Y")
            
            # Use different endpoint and payload structure for Hebrew
            if language == "he":
                # For Hebrew, use the search endpoint
                url = self.base_url_search
                payload = {
                    "query": "חדשות",  # Hebrew word for "news"
                    "location": location,
                    "language": language,
                    "page": page,
                    "time_bounded": True,
                    "from_date": from_date,
                    "to_date": to_date
                }
            else:
                # For English and other languages, use the top news endpoint
                url = self.base_url_top_news
                payload = {
                    "location": location,
                    "language": language,
                    "page": page,
                    "time_bounded": True,
                    "from_date": from_date,
                    "to_date": to_date
                }
            
            logger.info(f"Fetching news for language: {language}, location: {location}, page: {page} (past 12 hours: {from_date} to {to_date})")
            logger.debug(f"Using URL: {url}")
            logger.debug(f"Payload: {payload}")
            
            response = requests.post(
                url,
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
    
    def parse_and_save_articles(self, db: Session, api_response: dict, language: str = "en", location: str = "us") -> int:
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
                    
                    # Create article with language and location
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
                        language=language,
                        location=location,
                        is_active=True
                    )
                    
                    db.add(article)
                    saved_count += 1
                    
                except Exception as e:
                    logger.error(f"Error processing article: {str(e)}")
                    continue
            
            db.commit()
            logger.info(f"Successfully saved {saved_count} new articles for {language}/{location}, skipped {skipped_no_image} articles without images")
            return saved_count
            
        except Exception as e:
            logger.error(f"Error parsing and saving articles: {str(e)}")
            db.rollback()
            return 0
    
    def get_articles(self, db: Session, skip: int = 0, limit: int = 20, 
                    only_active: bool = True, language: str = None) -> List[NewsArticle]:
        """Get articles from database from the last 24 hours, ordered by publication date (newest first)"""
        query = db.query(NewsArticle)
        
        if only_active:
            query = query.filter(NewsArticle.is_active == True)
        
        # Filter by language if specified
        if language:
            query = query.filter(NewsArticle.language == language)
        
        # Filter out articles without images
        query = query.filter(
            and_(
                NewsArticle.top_image.isnot(None),
                NewsArticle.top_image != ''
            )
        )
        
        # Filter articles from the last 24 hours
        # Use both article date and created_at to ensure we catch all recent articles
        twenty_four_hours_ago = datetime.now() - timedelta(hours=24)
        query = query.filter(
            and_(
                # Either the article date is within 24 hours OR created_at is within 24 hours
                # This handles cases where article date might be missing or inaccurate
                (NewsArticle.date >= twenty_four_hours_ago) |
                (NewsArticle.created_at >= twenty_four_hours_ago)
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
    
    def fetch_and_save_latest_news(self, db: Session, language: str = None) -> int:
        """Fetch latest news from the past 12 hours and save to database - used by cron job"""
        try:
            logger.info(f"Starting 12-hour news fetch job for language: {language or 'all languages'}")
            
            # Determine which languages to fetch
            languages_to_fetch = []
            if language:
                if language in self.supported_languages:
                    languages_to_fetch.append((language, self.supported_languages[language]["location"]))
                else:
                    logger.error(f"Unsupported language: {language}")
                    return 0
            else:
                # Fetch all supported languages
                for lang_code, lang_config in self.supported_languages.items():
                    languages_to_fetch.append((lang_code, lang_config["location"]))
            
            total_saved = 0
            
            # Fetch news for each language from the past 12 hours
            for lang_code, location in languages_to_fetch:
                logger.info(f"Fetching 12-hour news cycle for {lang_code} from {location}")
                
                # Fetch news from multiple pages to get more articles from the 12-hour window
                for page in range(1, 5):  # Fetch first 5 pages to get more articles from 12-hour window
                    api_response = self.fetch_news_from_api(location=location, language=lang_code, page=page)
                    if api_response:
                        saved = self.parse_and_save_articles(db, api_response, language=lang_code, location=location)
                        total_saved += saved
                        
                        # If no articles were saved from this page, likely no more new articles
                        if saved == 0:
                            logger.info(f"No new articles found on page {page} for {lang_code}, stopping pagination")
                            break
            
            logger.info(f"12-hour news fetch job completed. Total articles saved: {total_saved}")
            return total_saved
            
        except Exception as e:
            logger.error(f"Error in fetch_and_save_latest_news: {str(e)}")
            return 0 