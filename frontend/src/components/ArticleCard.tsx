import React, { useState } from 'react';
import { NewsArticle } from '../types/news';
import { Globe, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: NewsArticle;
  onTap: (article: NewsArticle) => void;
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onTap, 
  className = "" 
}) => {
  const [imageError, setImageError] = useState(false);
  const hasValidImage = article.top_image && article.top_image.trim() !== '';
  const [imageLoaded, setImageLoaded] = useState(!hasValidImage);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Time unknown';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Time unknown';
      
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return formatDate(dateString);
    } catch {
      return 'Time unknown';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onTap(article);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image failed to load:', e.currentTarget.src);
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image loaded successfully:', e.currentTarget.src);
    setImageLoaded(true);
    setImageError(false);
  };

  const publishedDate = article.date || article.created_at;
  const relativeTime = formatRelativeTime(publishedDate);
  const fullDate = formatDate(publishedDate);

  // Determine which image to show
  const fallbackImage = 'https://via.placeholder.com/800x400/e5e7eb/9ca3af?text=News+Article';
  const imageUrl = (!hasValidImage || imageError) ? fallbackImage : article.top_image;
  
  // For fallback images, we want them to be visible immediately
  const shouldShowImage = imageLoaded || (!hasValidImage || imageError);

  return (
    <div 
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl group ${className}`}
      onClick={handleClick}
    >
      {/* Article Image */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {!shouldShowImage && hasValidImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        <img
          src={imageUrl}
          alt={article.title || 'News article'}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            shouldShowImage ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Image error fallback overlay */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Globe className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="p-4 sm:p-5 md:p-6 pb-16">
        {/* Headline */}
        <h2 className="article-headline font-display font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight line-clamp-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {article.title || 'No title available'}
        </h2>

        {/* Short Description */}
        {article.short_description && (
          <p className="article-body text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
            {article.short_description}
          </p>
        )}

        {/* Publisher Info */}
        {article.publisher_title && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
            <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="font-medium truncate">{article.publisher_title}</span>
          </div>
        )}

        {/* Language Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {article.language && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                article.language === 'he' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {article.language === 'he' ? '🇮🇱 עברית' : '🇺🇸 English'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Floating Timestamp Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white px-4 py-2 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 flex-shrink-0 opacity-80" />
            <span className="text-sm font-medium">
              {relativeTime}
            </span>
          </div>
          {fullDate && (
            <span className="text-xs opacity-75 hidden sm:block" title={fullDate}>
              {fullDate}
            </span>
          )}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}; 