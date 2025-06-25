import { useState, useEffect, useCallback } from 'react';
import { NewsArticle } from '../types/news';
import { newsApi } from '../services/api';
import toast from 'react-hot-toast';

export const useNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRandomMode, setIsRandomMode] = useState(false);

  const fetchNewestArticles = useCallback(async (count: number = 100) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await newsApi.getNewestArticles(count);
      setArticles(response.articles);
      setCurrentIndex(0);
      setIsRandomMode(false);
      toast.success(`Loaded ${response.articles.length} newest articles`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch articles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRandomArticles = useCallback(async (count: number = 100) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await newsApi.getRandomArticles(count);
      setArticles(response.articles);
      setCurrentIndex(0);
      setIsRandomMode(true);
      toast.success(`Loaded ${response.articles.length} random articles`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch articles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleRandomMode = useCallback(() => {
    if (isRandomMode) {
      fetchNewestArticles(100);
    } else {
      fetchRandomArticles(100);
    }
  }, [isRandomMode, fetchNewestArticles, fetchRandomArticles]);

  const recordAction = useCallback(async (articleId: number, action: 'view') => {
    try {
      await newsApi.recordAction(articleId, action);
    } catch (err) {
      console.error('Failed to record action:', err);
      // Don't show toast for action recording failures as it's not critical
    }
  }, []);

  const goToNext = useCallback(async () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(prev => prev + 1);
      
      // Load more articles if running low (keep this for future expansion)
      if (currentIndex >= articles.length - 3 && articles.length < 50) {
        if (isRandomMode) {
          await fetchRandomArticles(100);
        } else {
          await fetchNewestArticles(100);
        }
      }
    }
  }, [articles.length, currentIndex, fetchRandomArticles, fetchNewestArticles, isRandomMode]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const openArticle = useCallback(async (article: NewsArticle) => {
    await recordAction(article.id, 'view');
    window.open(article.url, '_blank');
    toast.success('Opening article...');
  }, [recordAction]);

  const getCurrentArticle = useCallback((): NewsArticle | null => {
    return articles[currentIndex] || null;
  }, [articles, currentIndex]);

  const getUpcomingArticles = useCallback((count: number = 3): NewsArticle[] => {
    return articles.slice(currentIndex + 1, currentIndex + 1 + count);
  }, [articles, currentIndex]);

  const hasMoreArticles = useCallback((): boolean => {
    return currentIndex < articles.length - 1;
  }, [articles.length, currentIndex]);

  const hasPreviousArticles = useCallback((): boolean => {
    return currentIndex > 0;
  }, [currentIndex]);

  const resetToFirst = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  // Initial load
  useEffect(() => {
    fetchNewestArticles();
  }, [fetchNewestArticles]);

  return {
    articles,
    loading,
    error,
    currentIndex,
    isRandomMode,
    fetchNewestArticles,
    fetchRandomArticles,
    toggleRandomMode,
    goToNext,
    goToPrevious,
    openArticle,
    getCurrentArticle,
    getUpcomingArticles,
    hasMoreArticles,
    hasPreviousArticles,
    resetToFirst,
    recordAction
  };
}; 