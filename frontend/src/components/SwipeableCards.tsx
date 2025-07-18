// Your imports remain the same
import React, { useState, useRef, useCallback, useEffect } from 'react';
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

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
  startTime: number;
}

class ImagePreloader {
  private static instance: ImagePreloader;
  private preloadedImages: Set<string> = new Set();
  private preloadingImages: Set<string> = new Set();

  static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader();
    }
    return ImagePreloader.instance;
  }

  preloadImage(url: string): Promise<void> {
    if (!url || this.preloadedImages.has(url) || this.preloadingImages.has(url)) {
      return Promise.resolve();
    }

    this.preloadingImages.add(url);

    return new Promise((resolve) => {
      const img = new Image();
      const cleanup = () => {
        this.preloadingImages.delete(url);
      };

      img.onload = () => {
        this.preloadedImages.add(url);
        cleanup();
        resolve();
      };

      img.onerror = () => {
        cleanup();
        resolve();
      };

      setTimeout(() => {
        cleanup();
        resolve();
      }, 5000);

      img.src = url;
    });
  }

  preloadImages(urls: string[]): Promise<void[]> {
    return Promise.all(urls.map((url) => this.preloadImage(url)));
  }

  isPreloaded(url: string): boolean {
    return this.preloadedImages.has(url);
  }
}

export const SwipeableCards: React.FC<SwipeableCardsProps> = ({
  articles,
  currentIndex,
  onNext,
  onPrevious,
  onTap,
  loading = false,
}) => {
  const currentArticle = articles[currentIndex];
  const upcomingArticles = articles.slice(currentIndex + 1, currentIndex + 4);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < articles.length - 1;
  const imagePreloader = ImagePreloader.getInstance();

  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    startTime: 0,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imagesToPreload = upcomingArticles.map((a) => a.top_image).filter(Boolean) as string[];
    if (imagesToPreload.length > 0) {
      imagePreloader.preloadImages(imagesToPreload).catch(console.error);
    }
  }, [currentIndex, articles, upcomingArticles]);

  const handleCardClick = (e: React.MouseEvent, article: NewsArticle) => {
    if (touchState.isDragging || isAnimating) {
      e.preventDefault();
      return;
    }
    onTap(article);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1 || isAnimating) return;
    const touch = e.touches[0];
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: false,
      startTime: Date.now(),
    });
  }, [isAnimating]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;

    if (!touchState.isDragging) {
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10;
      if (isHorizontalSwipe) {
        setTouchState((prev) => ({ ...prev, isDragging: true }));
      }
    }

    setTouchState((prev) => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
    }));
  }, [touchState]);

  const handleTouchEnd = useCallback(() => {
    if (!touchState.isDragging) return;

    const deltaX = touchState.currentX - touchState.startX;
    const deltaTime = Date.now() - touchState.startTime;
    const velocity = Math.abs(deltaX) / deltaTime;

    const SWIPE_THRESHOLD = 70;
    const VELOCITY_THRESHOLD = 0.3;
    const MAX_SWIPE_TIME = 400;

    const shouldSwipe =
      Math.abs(deltaX) > SWIPE_THRESHOLD ||
      (velocity > VELOCITY_THRESHOLD && deltaTime < MAX_SWIPE_TIME);

    if (shouldSwipe) {
      if (deltaX > 0 && hasPrevious) {
        triggerNavigation('previous');
      } else if (deltaX < 0 && hasNext) {
        triggerNavigation('next');
      }
    }

    setTouchState((prev) => ({ ...prev, isDragging: false }));
  }, [touchState, hasPrevious, hasNext]);

  const triggerNavigation = useCallback(
    (direction: 'next' | 'previous') => {
      setIsAnimating(true);
      setTransitionDirection(direction === 'next' ? 'left' : 'right');

      setTimeout(() => {
        if (direction === 'next') {
          onNext();
        } else {
          onPrevious();
        }
        setTransitionDirection(null);
        setIsAnimating(false);
      }, 600);
    },
    [onNext, onPrevious]
  );



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Loading news...</h2>
        <p>Getting the latest articles for you</p>
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700 px-4">
        <div className="text-6xl mb-4">📰</div>
        <h2 className="text-xl font-semibold mb-2">No more articles</h2>
        <p>You've seen all available articles. Check back later for more news!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 relative overflow-hidden px-2 sm:px-4 py-2 sm:py-4">
        <div className="relative w-full h-full max-w-4xl mx-auto card-container">
          {upcomingArticles.map((article, index) => (
            <div
              key={article.id}
              className="absolute inset-0 background-card"
              style={{
                transform: `scale(${1 - (index + 1) * 0.03}) translateY(${(index + 1) * 4}px)`,
                zIndex: upcomingArticles.length - index,
                opacity: 1 - (index + 1) * 0.15,
              }}
            >
              <ArticleCard
                article={article}
                onTap={onTap}
                className="pointer-events-none h-full"
                showTimestamp={false}
                isPreview={true}
                preloadImages={true}
              />
            </div>
          ))}

          <div
            ref={cardRef}
            className={`absolute inset-0 z-50 main-card card-flip ${
              transitionDirection === 'left'
                ? 'card-flip-forward'
                : transitionDirection === 'right'
                ? 'card-flip-backward'
                : ''
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => handleCardClick(e, currentArticle)}
          >
            <ArticleCard
              key={currentArticle.id}
              article={currentArticle}
              onTap={onTap}
              className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 ease-out select-none"
              showTimestamp={true}
              isPreview={false}
              preloadImages={false}
            />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 py-2 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="text-sm font-medium text-gray-700">
            {currentIndex + 1} of {articles.length}
          </div>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full progress-bar"
              style={{ width: `${((currentIndex + 1) / articles.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
