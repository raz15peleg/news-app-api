import React from 'react';
import { NewsArticle } from '../types/news';
import { MapPin, Globe, Calendar } from 'lucide-react';

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

  const getSimpleDate = (dateString?: string, language: string = 'en') => {
    console.log('Date debug:', { dateString, language, type: typeof dateString });
    
    if (!dateString) {
      return language === 'he' ? 'אין תאריך' : 'No date';
    }
    
    try {
      const date = new Date(dateString);
      console.log('Parsed date:', date, 'Valid:', !isNaN(date.getTime()));
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return language === 'he' ? 'תאריך לא תקין' : 'Invalid date';
      }

      // Simple format that should work for both languages
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };

      if (language === 'he') {
        return date.toLocaleDateString('he-IL', options);
      } else {
        return date.toLocaleDateString('en-US', options);
      }
    } catch (error) {
      console.error('Date formatting error:', error, 'for date:', dateString);
      return language === 'he' ? 'שגיאה בתאריך' : 'Date error';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const defaultImage = 'https://via.placeholder.com/400x200/e2e8f0/64748b?text=No+Image';

  // Check if content is Hebrew (RTL)
  const isHebrew = article.language === 'he';
  const textDirection = isHebrew ? 'rtl' : 'ltr';
  const textAlign = isHebrew ? 'text-right' : 'text-left';
  const flexAlign = isHebrew ? 'justify-end' : 'justify-start';

  const getLocationFlag = (location: string) => {
    switch (location.toLowerCase()) {
      case 'us':
        return '🇺🇸';
      case 'il':
        return '🇮🇱';
      default:
        return '🌐';
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language.toLowerCase()) {
      case 'he':
        return '🇮🇱';
      case 'en':
        return '🇬🇧';
      default:
        return '🌐';
    }
  };

  return (
    <div 
      className={`
        relative bg-white rounded-2xl shadow-lg cursor-pointer
        transform transition-all duration-300 hover:scale-105 hover:shadow-xl
        flex flex-col h-full overflow-hidden
        ${className}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onTap(article);
      }}
      dir={textDirection}
    >
      {/* Entire card content is now scrollable */}
      <div className="overflow-y-auto h-full flex flex-col">
        {/* Article Image - flexible height */}
        <div className="relative flex-shrink-0 min-h-[200px] max-h-[60%] overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={article.top_image || defaultImage}
            alt={article.title}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
        </div>

        {/* Article Content - takes remaining space */}
        <div className={`p-4 sm:p-6 flex flex-col flex-grow ${textAlign} min-h-0`} dir={textDirection}>
          {/* Main Header - Short Description */}
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight ${textAlign}`}>
            {article.short_description || article.title || 'No title available'}
          </h2>

          {/* Article Text - no separate scroll container */}
          <div className={`flex-grow mb-3 sm:mb-4 ${textAlign}`}>
            <p className={`text-sm sm:text-base text-gray-700 leading-relaxed ${textAlign}`}>
              {article.text || article.short_description || 'No description available'}
            </p>
          </div>

          {/* Date and location info - always visible at bottom */}
          <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm ${flexAlign} border-t border-gray-200 pt-3 mt-auto flex-shrink-0 bg-gray-50 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-2`}>
            <div className="flex items-center gap-1 bg-blue-100 px-3 py-1.5 rounded-full shadow-sm">
              <Calendar size={14} className="text-blue-600" />
              <span className="font-semibold text-blue-700 whitespace-nowrap text-sm">
                {article.date ? getSimpleDate(article.date, article.language) : (article.language === 'he' ? 'אין תאריך' : 'No date')}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-lg emoji" role="img" aria-label="location flag">{getLocationFlag(article.location)}</span>
              <span className="font-semibold text-green-700 whitespace-nowrap text-sm">{article.location?.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-100 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-lg emoji" role="img" aria-label="language flag">{getLanguageFlag(article.language)}</span>
              <span className="font-semibold text-purple-700 whitespace-nowrap text-sm">{article.language?.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 