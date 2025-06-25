import { useState, useEffect, useCallback } from 'react';
import { NewsArticle, Language } from '../types/news';
import { newsApi } from '../services/api';
import toast from 'react-hot-toast';

export const useNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [supportedLanguages, setSupportedLanguages] = useState<Language[]>([]);

  const fetchSupportedLanguages = useCallback(async () => {
    try {
      const response = await newsApi.getSupportedLanguages();
      // Add flags to languages
      const languagesWithFlags = response.languages.map((lang: any) => ({
        ...lang,
        flag: lang.code === 'en' ? '🇺🇸' : lang.code === 'he' ? '🇮🇱' : '🌐'
      }));
      setSupportedLanguages(languagesWithFlags);
    } catch (err) {
      console.error('Failed to fetch supported languages:', err);
    }
  }, []);

  const fetchNewestArticles = useCallback(async (count: number = 100, language?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const langToUse = language || selectedLanguage;
      const response = await newsApi.getNewestArticles(count, langToUse);
      setArticles(response.articles);
      setCurrentIndex(0);
      
      const langName = supportedLanguages.find(l => l.code === langToUse)?.name || langToUse;
      toast.success(`Loaded ${response.articles.length} newest ${langName} articles`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch articles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, supportedLanguages]);

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
        await fetchNewestArticles(100);
      }
    }
  }, [articles.length, currentIndex, fetchNewestArticles]);

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

  const changeLanguage = useCallback(async (languageCode: string) => {
    if (languageCode === selectedLanguage) return;
    
    setSelectedLanguage(languageCode);
    
    // Refetch articles with new language
    await fetchNewestArticles(100, languageCode);
  }, [selectedLanguage, fetchNewestArticles]);

  // Initial load
  useEffect(() => {
    fetchSupportedLanguages();
  }, [fetchSupportedLanguages]);

  useEffect(() => {
    if (supportedLanguages.length > 0) {
      fetchNewestArticles();
    }
  }, [supportedLanguages, fetchNewestArticles]);

  return {
    articles,
    loading,
    error,
    currentIndex,
    selectedLanguage,
    supportedLanguages,
    fetchNewestArticles,
    fetchSupportedLanguages,
    changeLanguage,
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