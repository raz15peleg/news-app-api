import { APINewsArticle } from '@/services/api';

// Frontend display interface (adapted from API response)
export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  source: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  category: string;
  language: string;
  // Original API fields for reference
  originalId: number;
  views: number;
  location: string;
}

export interface NewsSource {
  id: string;
  name: string;
  color: string;
  logo?: string;
}

export type Language = {
  code: string;
  name: string;
  flag: string;
};

// Language mapping for display
export const LANGUAGE_MAP = {
  'en': { name: 'English', flag: '🇺🇸' },
  'he': { name: 'Hebrew', flag: '🇮🇱' },
} as const;

// Helper function to convert API response to display format
export function convertAPIToDisplayArticle(apiArticle: APINewsArticle): NewsArticle {
  return {
    id: apiArticle.id.toString(),
    originalId: apiArticle.id,
    title: apiArticle.title,
    excerpt: apiArticle.short_description || apiArticle.title.substring(0, 150) + '...',
    content: apiArticle.text || apiArticle.short_description || '',
    source: apiArticle.publisher_title || 'Unknown Source',
    author: apiArticle.publisher_title || 'Unknown Author',
    publishedAt: apiArticle.date || apiArticle.created_at,
    imageUrl: apiArticle.top_image || '/placeholder.svg',
    url: apiArticle.url,
    category: 'News', // API doesn't provide category, so defaulting to 'News'
    language: LANGUAGE_MAP[apiArticle.language as keyof typeof LANGUAGE_MAP]?.name || apiArticle.language,
    views: apiArticle.views,
    location: apiArticle.location,
  };
}

// Helper function to get language code from language name
export function getLanguageCode(languageName: string): string {
  const entry = Object.entries(LANGUAGE_MAP).find(([_, value]) => value.name === languageName);
  return entry ? entry[0] : 'en'; // Default to English
}

// Helper function to get language name from language code
export function getLanguageName(languageCode: string): string {
  return LANGUAGE_MAP[languageCode as keyof typeof LANGUAGE_MAP]?.name || languageCode;
}