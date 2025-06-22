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
  text?: string;
  publisher_href?: string;
  publisher_title?: string;
  created_at: string;
  updated_at?: string;
  is_active: boolean;
  views: number;
  likes: number;
  dislikes: number;
}

export interface NewsArticleList {
  articles: NewsArticle[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
}

export interface UserAction {
  action: 'like' | 'dislike' | 'view';
  article_id: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down'; 