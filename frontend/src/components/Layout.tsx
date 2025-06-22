import React from 'react';
import { Newspaper, RefreshCw, Settings, Calendar, Shuffle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  onToggleRandom?: () => void;
  loading?: boolean;
  isRandomMode?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onRefresh, 
  onToggleRandom,
  loading = false,
  isRandomMode = false 
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

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {onToggleRandom && (
                <button
                  onClick={onToggleRandom}
                  disabled={loading}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isRandomMode
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isRandomMode ? (
                    <>
                      <Calendar size={16} className="mr-2" />
                      Newest
                    </>
                  ) : (
                    <>
                      <Shuffle size={16} className="mr-2" />
                      Random
                    </>
                  )}
                </button>
              )}
              
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
                  {loading ? 'Loading...' : 'Refresh'}
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