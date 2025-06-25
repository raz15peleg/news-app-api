import axios from 'axios';
import { NewsArticle, NewsArticleList } from '../types/news';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || error.response.data?.message || 'Server error';
      throw new Error(`${error.response.status}: ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check if the server is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export const newsApi = {
  // Get paginated articles
  async getArticles(skip: number = 0, limit: number = 20, randomOrder: boolean = false, language?: string): Promise<NewsArticleList> {
    const params: any = { skip, limit, random_order: randomOrder };
    if (language) {
      params.language = language;
    }
    const response = await api.get('/articles', { params });
    return response.data;
  },

  // Get random articles for swipe interface
  async getRandomArticles(count: number = 100, language?: string): Promise<{ articles: NewsArticle[] }> {
    const params: any = { count };
    if (language) {
      params.language = language;
    }
    const response = await api.get('/articles/random', { params });
    return response.data;
  },

  // Get newest articles for swipe interface
  async getNewestArticles(count: number = 100, language?: string): Promise<{ articles: NewsArticle[] }> {
    const params: any = { count };
    if (language) {
      params.language = language;
    }
    const response = await api.get('/articles/newest', { params });
    return response.data;
  },

  // Get specific article by ID
  async getArticle(id: number): Promise<NewsArticle> {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  // Record user action on article
  async recordAction(articleId: number, action: 'view'): Promise<{ message: string }> {
    const response = await api.post(`/articles/${articleId}/action`, {
      action,
      article_id: articleId
    });
    return response.data;
  },

  // Manually fetch news (admin function)
  async fetchNews(language?: string): Promise<{ message: string; articles_saved: number; language: string }> {
    const params: any = {};
    if (language) {
      params.language = language;
    }
    const response = await api.post('/fetch-news', {}, { params });
    return response.data;
  },

  // Get supported languages
  async getSupportedLanguages(): Promise<{ languages: Array<{ code: string; name: string; location: string }> }> {
    const response = await api.get('/languages');
    return response.data;
  },

  // Get article statistics by language
  async getArticleStats(): Promise<{ total_articles: number; by_language: Record<string, number> }> {
    const response = await api.get('/articles/stats');
    return response.data;
  },

  // Get scheduler status
  async getSchedulerStatus(): Promise<any> {
    const response = await api.get('/scheduler-status');
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api; 