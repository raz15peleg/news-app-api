import React, { useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { SwipeableCards } from './components/SwipeableCards';
import { useNews } from './hooks/useNews';
import './index.css';

function App() {
  const {
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
    hasMoreArticles,
    hasPreviousArticles
  } = useNews();

  const handleRefresh = () => {
    if (isRandomMode) {
      fetchRandomArticles(15);
    } else {
      fetchNewestArticles(15);
    }
  };

  // Keyboard navigation handler
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Prevent keyboard navigation when user is typing in an input field
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const currentArticle = getCurrentArticle();
    if (!currentArticle || loading) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        goToNext();
        break;
      case 'Enter':
        event.preventDefault();
        openArticle(currentArticle);
        break;
      case 'r':
      case 'R':
        if (event.ctrlKey || event.metaKey) return; // Allow browser refresh
        event.preventDefault();
        toggleRandomMode();
        break;
    }
  }, [getCurrentArticle, goToNext, goToPrevious, openArticle, loading, toggleRandomMode]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96 text-red-500">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-center mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
        <Toaster position="bottom-center" />
      </Layout>
    );
  }

  return (
    <Layout 
      onRefresh={handleRefresh} 
      onToggleRandom={toggleRandomMode}
      loading={loading}
      isRandomMode={isRandomMode}
    >
      <div className="flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center mb-4 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
            Browse News Articles
          </h2>
          <p className="text-gray-600 max-w-lg lg:max-w-2xl text-sm lg:text-base xl:text-lg">
            {isRandomMode 
              ? "Exploring random news articles. Click 'Newest' to see latest stories."
              : "Browsing latest news articles. Click 'Random' to discover unexpected stories."
            }
          </p>
        </div>

        {/* Mode indicator */}
        <div className="mb-4">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            isRandomMode 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isRandomMode ? '🎲 Random Mode' : '📅 Newest First'}
          </div>
        </div>

        {/* Stats */}
        {articles.length > 0 && (
          <div className="mb-4 lg:mb-6 text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-lg px-6 py-3 shadow-sm">
              <div className="text-sm">
                <span className="font-semibold text-blue-600">{currentIndex + 1}</span>
                <span className="text-gray-500"> of {articles.length}</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="text-sm text-gray-500">
                {articles.length - currentIndex - 1} remaining
              </div>
            </div>
          </div>
        )}

        {/* Navigation Cards */}
        <SwipeableCards
          articles={articles}
          currentIndex={currentIndex}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onTap={openArticle}
          loading={loading}
        />

        {/* Instructions */}
        {!loading && articles.length > 0 && (
          <div className="mt-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm max-w-lg">
              <h3 className="font-semibold text-gray-900 mb-4">How to navigate</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 mb-2">Touch/Mouse</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      ←
                    </div>
                    <span>Click ← button for previous</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      →
                    </div>
                    <span>Click → button for next</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      👆
                    </div>
                    <span>Tap card or click 👁️ to read</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 mb-2">Keyboard</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      ←
                    </div>
                    <span>Left arrow for previous</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      →
                    </div>
                    <span>Right arrow for next</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      ↵
                    </div>
                    <span>Enter to read</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      R
                    </div>
                    <span>R to toggle random/newest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster position="bottom-center" />
    </Layout>
  );
}

export default App; 