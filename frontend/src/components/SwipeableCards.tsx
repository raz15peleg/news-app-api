import React from 'react';
import { NewsArticle } from '../types/news';
import { ArticleCard } from './ArticleCard';

interface SwipeableCardsProps {
  articles: NewsArticle[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onTap: (article: NewsArticle) => void;
  loading?: boolean;
}

export const SwipeableCards: React.FC<SwipeableCardsProps> = ({
  articles,
  currentIndex,
  onNext,
  onPrevious,
  onTap,
  loading = false
}) => {
  const currentArticle = articles[currentIndex];
  const upcomingArticles = articles.slice(currentIndex + 1, currentIndex + 4);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < articles.length - 1;

  const handleCardClick = (_e: React.MouseEvent, article: NewsArticle) => {
    onTap(article);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <div className="text-6xl mb-4">📰</div>
        <h2 className="text-xl font-semibold mb-2">No more articles</h2>
        <p className="text-center">You've seen all available articles. Check back later for more news!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      {/* Card Container */}
      <div className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[85vh] mb-6">
        {/* Background cards (showing upcoming articles) */}
        {upcomingArticles.map((article, index) => (
          <div
            key={article.id}
            className="absolute inset-0 transition-transform duration-200"
            style={{
              transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * 8}px)`,
              zIndex: upcomingArticles.length - index,
              opacity: 1 - (index + 1) * 0.15
            }}
          >
            <ArticleCard
              article={article}
              onTap={onTap}
              className="pointer-events-none"
            />
          </div>
        ))}

        {/* Main interactive card */}
        <div
          className="absolute inset-0 z-50"
          onClick={(e) => handleCardClick(e, currentArticle)}
        >
          <ArticleCard
            article={currentArticle}
            onTap={onTap}
            className="h-full cursor-pointer hover:shadow-xl transition-shadow"
          />
        </div>

        {/* Left Arrow - positioned on the left side of the card */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          disabled={!hasPrevious}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-60 rounded-full p-2 lg:p-3 shadow-lg transition-colors ${
            hasPrevious 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Previous article"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        {/* Right Arrow - positioned on the right side of the card */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          disabled={!hasNext}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-60 rounded-full p-2 lg:p-3 shadow-lg transition-colors ${
            hasNext 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Next article"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}; 