import React, { useState, useRef, useEffect } from 'react';
import { NewsArticle } from '../types/news';
import { Globe, Clock, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface ArticleCardProps {
  article: NewsArticle;
  onTap: (article: NewsArticle) => void;
  className?: string;
  showTimestamp?: boolean; // Control whether to show the timestamp bar
  isPreview?: boolean; // Control whether this is a preview card (background)
  preloadImages?: boolean; // Control whether to preload images
}

// Local fallback image as base64 data URI (small, fast-loading placeholder)
const LOCAL_FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0zNTAgMTYwSDQ1MFYxODBIMzUwVjE2MFpNMzUwIDIwMEg0NTBWMjIwSDM1MFYyMDBaTTM3MCAyNDBINDMwVjI2MEgzNzBWMjQwWk0zNDAgMTQwSDQ2MFYyODBIMzQwVjE0MFpNMzIwIDEyMEg0ODBWMzAwSDMyMFYxMjBaTTM2MCAyMjBINDEwVjIzMEgzNjBWMjIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSI0MDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5OZXdzIEFydGljbGU8L3RleHQ+Cjwvc3ZnPgo=';

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onTap, 
  className = "",
  showTimestamp = true,
  isPreview = false,
  preloadImages = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const hasValidImage = article.top_image && article.top_image.trim() !== '';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoadStarted, setImageLoadStarted] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset image loading state when article changes
  useEffect(() => {
    setIsTextExpanded(false);
    setImageLoaded(false);
    setImageError(false);
    setRetryCount(0);
    setIsRetrying(false);
    setImageLoadStarted(false);
    
    // Clear any existing timeout
    if (imageTimeoutRef.current) {
      clearTimeout(imageTimeoutRef.current);
    }
    
    // Set a faster timeout for image loading (3 seconds instead of 8)
    if (hasValidImage) {
      imageTimeoutRef.current = setTimeout(() => {
        if (!imageLoaded && !imageError) {
          console.log('Image loading timeout (3s), switching to fallback');
          setImageError(true);
          setImageLoaded(true);
        }
      }, 3000); // Reduced from 8000ms to 3000ms
    } else {
      // If no valid image, immediately show fallback
      setImageLoaded(true);
    }

    return () => {
      if (imageTimeoutRef.current) {
        clearTimeout(imageTimeoutRef.current);
      }
    };
  }, [article.id, hasValidImage]);

  // Preload images if enabled
  useEffect(() => {
    if (preloadImages && hasValidImage && !imageLoadStarted && !imageError) {
      const preloadImg = new Image();
      preloadImg.onload = () => {
        setImageLoaded(true);
        setImageLoadStarted(true);
        if (imageTimeoutRef.current) {
          clearTimeout(imageTimeoutRef.current);
        }
      };
      preloadImg.onerror = () => {
        console.log('Preload failed for:', article.top_image);
        setImageError(true);
        setImageLoaded(true);
      };
      preloadImg.src = article.top_image!;
      setImageLoadStarted(true);
    }
  }, [preloadImages, hasValidImage, article.top_image, imageLoadStarted, imageError]);

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

  const handleExpandText = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when expanding text
    const wasExpanded = isTextExpanded;
    setIsTextExpanded(!isTextExpanded);
    
    // Smooth scroll to ensure expanded content is visible within the card
    if (!wasExpanded && contentRef.current) {
      // Wait for content to expand, then scroll within the card to show the expanded area
      setTimeout(() => {
        const contentElement = contentRef.current;
        const cardElement = contentElement?.closest('.overflow-y-auto') as HTMLElement;
        
        if (contentElement && cardElement) {
          // Scroll within the card container to show the expanded content
          
          // Calculate the scroll position to show the expanded content
          const scrollTop = contentElement.offsetTop - cardElement.offsetTop;
          
          cardElement.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      }, 250); // Longer timeout to ensure content expansion animation completes
    }
  };

  const handleRetry = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (retryCount >= 2 || !hasValidImage) return; // Max 2 retries
    
    setIsRetrying(true);
    setImageError(false);
    setImageLoaded(false);
    
    // Clear existing timeout
    if (imageTimeoutRef.current) {
      clearTimeout(imageTimeoutRef.current);
    }
    
    // Set new timeout for retry
    imageTimeoutRef.current = setTimeout(() => {
      if (!imageLoaded && !imageError) {
        console.log(`Image retry ${retryCount + 1} timeout`);
        setImageError(true);
        setImageLoaded(true);
        setIsRetrying(false);
      }
    }, 3000);
    
    // Force reload the image
    if (imageRef.current) {
      imageRef.current.src = article.top_image! + '?retry=' + Date.now();
    }
    
    setRetryCount(prev => prev + 1);
    setIsRetrying(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image failed to load:', e.currentTarget.src);
    if (imageTimeoutRef.current) {
      clearTimeout(imageTimeoutRef.current);
    }
    setImageError(true);
    setImageLoaded(true);
    setIsRetrying(false);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image loaded successfully:', e.currentTarget.src);
    if (imageTimeoutRef.current) {
      clearTimeout(imageTimeoutRef.current);
    }
    setImageLoaded(true);
    setImageError(false);
    setIsRetrying(false);
  };

  const publishedDate = article.date || article.created_at;
  const relativeTime = formatRelativeTime(publishedDate);
  const fullDate = formatDate(publishedDate);

  // Determine which image to show - use local fallback
  const imageUrl = (!hasValidImage || imageError) ? LOCAL_FALLBACK_IMAGE : article.top_image;
  
  // Show image when: it's loaded OR it's a fallback image OR we have an error
  const shouldShowImage = imageLoaded || imageError || !hasValidImage;

  // Text processing utilities
  const formatArticleText = (text: string): string[] => {
    if (!text) return [];
    
    // Split text into paragraphs and clean up
    const paragraphs = text
      .split(/\n\s*\n|\r\n\s*\r\n/) // Split on double line breaks
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => p.replace(/\s+/g, ' ')); // Normalize whitespace
    
    return paragraphs;
  };

  const truncateText = (text: string, maxLength: number = 250): { text: string; isTruncated: boolean } => {
    if (text.length <= maxLength) {
      return { text, isTruncated: false };
    }
    
    // Find the last space before maxLength to avoid cutting words
    const lastSpace = text.lastIndexOf(' ', maxLength);
    const cutPoint = lastSpace > maxLength * 0.8 ? lastSpace : maxLength;
    
    return {
      text: text.substring(0, cutPoint) + '...',
      isTruncated: true
    };
  };

  // Process article text
  const textParagraphs = formatArticleText(article.text || '');
  const hasArticleText = textParagraphs.length > 0;
  
  // For display purposes, join paragraphs with proper spacing
  const fullText = textParagraphs.join('\n\n');
  const { text: displayText, isTruncated } = truncateText(fullText, 250);

  return (
    <div 
      className={`relative bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl group flex flex-col h-full w-full ${className} ${
        isTextExpanded ? 'overflow-y-auto' : 'overflow-hidden'
      }`}
      onClick={handleClick}
    >
      {/* Article Image - Improved loading with progressive enhancement */}
      <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-t-lg sm:rounded-t-xl">
        {/* Loading state - faster feedback */}
        {!shouldShowImage && hasValidImage && !imageError && !isRetrying && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        )}
        
        {/* Retry loading state */}
        {isRetrying && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 z-10">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 animate-spin mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Retrying...</p>
            </div>
          </div>
        )}
        
        {/* Main image with progressive loading */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt={article.title || 'News article'}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            shouldShowImage ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
          }`}
          loading={isPreview ? "lazy" : "eager"}
          decoding="async"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            // Ensure images are displayed when ready
            display: shouldShowImage ? 'block' : 'none',
            // Better image rendering
            imageRendering: 'auto',
            // Prevent layout shift
            aspectRatio: '16/9'
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Enhanced error state with retry option */}
        {imageError && hasValidImage && !isRetrying && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
              <p className="text-xs sm:text-sm mb-3">Image unavailable</p>
              {retryCount < 2 && (
                <button
                  onClick={handleRetry}
                  className="text-xs px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  Retry ({retryCount + 1}/2)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Article Content - Shorter, more compact container */}
      <div className={`flex-1 flex flex-col p-3 sm:p-4 md:p-5 bg-white/95 backdrop-blur-sm ${isTextExpanded ? 'pb-4 sm:pb-6 overflow-y-auto' : 'pb-12 sm:pb-14'} min-h-0 max-h-64 sm:max-h-72 md:max-h-80`}>
        {/* Headline - Responsive typography */}
        <h2 className="article-headline font-display font-bold text-black mb-2 sm:mb-3 leading-tight text-lg sm:text-xl md:text-2xl lg:text-3xl line-clamp-3 hover:text-blue-600 transition-colors flex-shrink-0">
          {article.title || 'No title available'}
        </h2>

        {/* Short Description */}
        {article.short_description && (
          <p className="article-body text-gray-700 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed text-sm sm:text-base flex-shrink-0">
            {article.short_description}
          </p>
        )}

        {/* Article Text Content - Scrollable area with reduced height */}
        {hasArticleText && (
          <div className="mb-3 sm:mb-4 bg-white/95 backdrop-blur-sm flex-1 min-h-0 max-h-32 sm:max-h-40" ref={contentRef}>
            <div className={`article-text bg-white/95 backdrop-blur-sm text-sm sm:text-base ${article.language === 'he' ? 'text-right' : 'text-left'} ${isTextExpanded ? 'h-auto' : ''}`}>
              {isTextExpanded ? (
                // Show full text with proper paragraph formatting
                <div className="space-y-3 sm:space-y-4 bg-white/95 backdrop-blur-sm pb-4">
                  {textParagraphs.map((paragraph, index) => (
                    <p key={index} className={`article-text bg-white/95 backdrop-blur-sm text-sm sm:text-base leading-relaxed ${article.language === 'he' ? 'text-right' : 'text-left'}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                // Show truncated text
                <div className={`whitespace-pre-line bg-white/95 backdrop-blur-sm text-sm sm:text-base leading-relaxed ${article.language === 'he' ? 'text-right' : 'text-left'}`}>
                  {displayText}
                </div>
              )}
            </div>
            
            {/* Read More/Less Button */}
            {(isTruncated || isTextExpanded) && (
              <button
                onClick={handleExpandText}
                className={`read-more-btn mt-2 sm:mt-3 flex items-center space-x-1 text-blue-600 hover:text-blue-800 bg-white/95 backdrop-blur-sm text-sm sm:text-base font-medium ${article.language === 'he' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <span>{isTextExpanded ? 'Read Less' : 'Read More'}</span>
                {isTextExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        )}

        {/* Publisher Info and Language Badge - Bottom section */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            {article.publisher_title && (
              <span className="article-meta text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                {article.publisher_title}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Language Badge */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {article.language?.toUpperCase() || 'EN'}
              </span>
              <span className="text-xs">
                {article.language === 'he' ? '🇮🇱' : 
                 article.language === 'en' ? '🇺🇸' : '🌐'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating timestamp bar - Only show when not expanded */}
      {showTimestamp && !isTextExpanded && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/85 backdrop-blur-sm text-white px-3 sm:px-4 py-2 sm:py-2.5 z-10 rounded-b-lg sm:rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 opacity-80" />
              <span className="text-xs sm:text-sm font-medium">
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
      )}

      {/* Scroll Indicator - shows when content is expanded and scrollable */}
      {isTextExpanded && (
        <div className="absolute top-0 left-0 right-0 h-4 sm:h-6 bg-gradient-to-b from-white/95 via-white/95 to-transparent pointer-events-none z-20 rounded-t-lg sm:rounded-t-xl" />
      )}
    </div>
  );
}; 