import React from 'react';
import { NewsArticle } from '../types/news';
import { Clock, Eye, Heart, ThumbsDown, ExternalLink, User } from 'lucide-react';

interface ArticleCardProps {
  article: NewsArticle;
  onClick?: () => void;
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, className = '' }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const defaultImage = 'https://via.placeholder.com/400x200/e2e8f0/64748b?text=No+Image';

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 ${className}`}
      onClick={onClick}
    >
      {/* Article Image */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden bg-gray-100 flex items-center justify-center">
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
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <ExternalLink size={12} />
          Read More
        </div>
      </div>

      {/* Article Content */}
      <div className="p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10">
        {/* Publisher Info */}
        {article.publisher_title && (
          <div className="flex items-center gap-2 mb-3 lg:mb-4 text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
            <User size={14} />
            <span className="font-medium">{article.publisher_title}</span>
            {article.date && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{formatDate(article.date)}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 lg:mb-4 xl:mb-6 line-clamp-3 lg:line-clamp-4">
          {article.title}
        </h2>

        {/* Short Description */}
        {article.short_description && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-4 lg:mb-6 xl:mb-8 line-clamp-3 lg:line-clamp-4 xl:line-clamp-6">
            {truncateText(article.short_description, 200)}
          </p>
        )}

        {/* Article Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{article.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={14} />
            <span>{article.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown size={14} />
            <span>{article.dislikes}</span>
          </div>
        </div>
      </div>

      {/* Swipe Instructions */}
      <div className="px-6 pb-4">
        <div className="text-center text-xs text-gray-400 bg-gray-50 rounded-lg py-2">
          👈 Swipe left to dislike • Tap to read • Swipe right to like 👉
        </div>
      </div>
    </div>
  );
}; 