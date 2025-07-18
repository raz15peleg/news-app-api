import { useEffect, useCallback } from 'react';
import { Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { SwipeableCards } from './components/SwipeableCards';
import { useNews } from './hooks/useNews';
import './index.css';

function NewsApp() {
  const { lang } = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    articles,
    loading,
    error,
    currentIndex,
    selectedLanguage,
    supportedLanguages,
    fetchNewestArticles,
    searchArticles,
    changeLanguage,
    goToNext,
    goToPrevious,
    openArticle,
    getCurrentArticle
  } = useNews();

  // Handle default language redirection and URL parameter
  useEffect(() => {
    if (location.pathname === '/' && supportedLanguages.length > 0) {
      // Redirect to default language (first supported language)
      const defaultLang = supportedLanguages[0]?.code || 'en';
      navigate(`/${defaultLang}`, { replace: true });
    } else if (lang && lang !== selectedLanguage && supportedLanguages.length > 0) {
      // Validate language exists in supported languages
      const isValidLang = supportedLanguages.some(l => l.code === lang);
      if (isValidLang) {
        changeLanguage(lang);
      } else {
        // Redirect to default language if invalid
        const defaultLang = supportedLanguages[0]?.code || 'en';
        navigate(`/${defaultLang}`, { replace: true });
      }
    }
  }, [lang, selectedLanguage, supportedLanguages, location.pathname, navigate, changeLanguage]);

  // Set document direction based on selected language
  useEffect(() => {
    if (selectedLanguage === 'he') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'he';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = selectedLanguage || 'en';
    }
  }, [selectedLanguage]);

  // Handle language change and update URL
  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
    navigate(`/${language}`);
  };

  const handleRefresh = () => {
    fetchNewestArticles(15);
  };

  const handleSearch = (query: string) => {
    searchArticles(query);
  };

  const handleSearchClear = () => {
    fetchNewestArticles(15);
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
    }
  }, [getCurrentArticle, goToNext, goToPrevious, openArticle, loading]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (error) {
    return (
      <Layout
        selectedLanguage={selectedLanguage}
        supportedLanguages={supportedLanguages}
        onLanguageChange={handleLanguageChange}
        onRefresh={handleRefresh}
        onSearch={handleSearch}
        onSearchClear={handleSearchClear}
        loading={loading}
        currentIndex={currentIndex}
        totalArticles={articles.length}
      >
        <div className="flex flex-col items-center justify-center h-96 text-red-600">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2 text-black">Something went wrong</h2>
          <p className="text-center mb-4 text-gray-800">{error}</p>
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
      onSearch={handleSearch}
      onSearchClear={handleSearchClear}
      loading={loading}
      selectedLanguage={selectedLanguage}
      supportedLanguages={supportedLanguages}
      onLanguageChange={handleLanguageChange}
      currentIndex={currentIndex}
      totalArticles={articles.length}
    >
      <div className="flex flex-col items-center">
        {/* Navigation Cards */}
        <SwipeableCards
          articles={articles}
          currentIndex={currentIndex}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onTap={openArticle}
          loading={loading}
        />
      </div>
      <Toaster position="bottom-center" />
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsApp />} />
      <Route path="/:lang" element={<NewsApp />} />
    </Routes>
  );
}

export default App; 