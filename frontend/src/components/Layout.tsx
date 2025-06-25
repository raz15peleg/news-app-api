import React from 'react';
import { Newspaper, RefreshCw, Settings } from 'lucide-react';
import { Language } from '../types/news';

interface LayoutProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
  // Language selector props
  selectedLanguage?: string;
  supportedLanguages?: Language[];
  onLanguageChange?: (language: string) => void;
  // Stats props
  currentIndex?: number;
  totalArticles?: number;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onRefresh, 
  loading = false,
  selectedLanguage,
  supportedLanguages = [],
  onLanguageChange,
  currentIndex = 0,
  totalArticles = 0
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Newspaper className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">NewsSwipe</h1>
            </div>

            {/* Center - Language Selector and Stats */}
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              {supportedLanguages.length > 0 && onLanguageChange && (
                <div className="flex items-center">
                  <select
                    value={selectedLanguage || ''}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    disabled={loading}
                    className={`px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-colors ${
                      loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }`}
                  >
                    {supportedLanguages.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.flag} {language.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Stats */}
              {totalArticles > 0 && (
                <div className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-2">
                  <div className="text-sm">
                    <span className="font-semibold text-blue-600">{currentIndex + 1}</span>
                    <span className="text-gray-500"> of {totalArticles}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="text-sm text-gray-500">
                    {totalArticles - currentIndex - 1} remaining
                  </div>
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <RefreshCw 
                    size={16} 
                    className={`mr-2 ${loading ? 'animate-spin' : ''}`} 
                  />
                  {loading 
                    ? (selectedLanguage === 'he' ? 'טוען...' : 'Loading...') 
                    : (selectedLanguage === 'he' ? 'רענן' : 'Refresh')
                  }
                </button>
              )}
              
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              NewsSwipe - Discover news in a fun way • 
              <span className="mx-2">•</span>
              Swipe right to like, left to skip, tap to read
            </p>
            <p className="mt-2">
              Powered by FastAPI & React • News updated hourly • Only articles with images
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 