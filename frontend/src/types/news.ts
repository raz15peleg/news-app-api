export interface Publisher {
  href?: string;
  title?: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  url: string;
  top_image?: string;
  images?: string[];
  videos?: string[];
  date?: string;
  short_description?: string;
  description?: string; // Add description field that we're using
  text?: string;
  publisher_href?: string;
  publisher_title?: string;
  language: string;
  location: string;
  created_at: string;
  updated_at?: string;
  is_active: boolean;
  views: number;
}

export interface NewsArticleList {
  articles: NewsArticle[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
}

export interface UserAction {
  action: 'view';
  article_id: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface Language {
  code: string;
  name: string;
  location: string;
  flag: string;
}

export interface LanguageStats {
  total_articles: number;
  by_language: Record<string, number>;
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down'; 