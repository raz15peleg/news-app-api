// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface APINewsArticle {
  id: number;
  title: string;
  url: string;
  top_image: string | null;
  images: string[] | null;
  videos: string[] | null;
  date: string | null;
  short_description: string | null;
  text: string | null;
  publisher_href: string | null;
  publisher_title: string | null;
  language: string;
  location: string;
  created_at: string;
  updated_at: string | null;
  is_active: boolean;
  views: number;
}

export interface APINewsResponse {
  articles: APINewsArticle[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  location: string;
}

export interface LanguagesResponse {
  languages: SupportedLanguage[];
}

class NewsAPIService {
  private baseURL = API_BASE_URL;

  async getArticles(
    language?: string,
    skip: number = 0,
    limit: number = 20,
    randomOrder: boolean = false
  ): Promise<APINewsResponse> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      random_order: randomOrder.toString(),
    });

    if (language) {
      params.append('language', language);
    }

    const response = await fetch(`${this.baseURL}/articles?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getRandomArticles(language?: string, count: number = 50): Promise<{ articles: APINewsArticle[] }> {
    const params = new URLSearchParams({
      count: count.toString(),
    });

    if (language) {
      params.append('language', language);
    }

    const response = await fetch(`${this.baseURL}/articles/random?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getNewestArticles(language?: string, count: number = 50): Promise<{ articles: APINewsArticle[] }> {
    const params = new URLSearchParams({
      count: count.toString(),
    });

    if (language) {
      params.append('language', language);
    }

    const response = await fetch(`${this.baseURL}/articles/newest?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getSupportedLanguages(): Promise<LanguagesResponse> {
    const response = await fetch(`${this.baseURL}/languages`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getArticleStats(): Promise<{ total_articles: number; by_language: Record<string, number> }> {
    const response = await fetch(`${this.baseURL}/articles/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async recordArticleView(articleId: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/articles/${articleId}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'view',
        article_id: articleId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}

export const newsAPI = new NewsAPIService(); 