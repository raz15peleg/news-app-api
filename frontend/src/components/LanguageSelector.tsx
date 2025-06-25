import React from 'react';
import { Language } from '../types/news';

interface LanguageSelectorProps {
  selectedLanguage: string;
  supportedLanguages: Language[];
  onLanguageChange: (languageCode: string) => void;
  loading?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  supportedLanguages,
  onLanguageChange,
  loading = false
}) => {
  const getLanguageEmoji = (code: string) => {
    switch (code) {
      case 'en':
        return '🇺🇸';
      case 'he':
        return '🇮🇱';
      default:
        return '🌐';
    }
  };

  if (supportedLanguages.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700">
      <span className="text-gray-300 text-sm font-medium">Language:</span>
      <div className="flex gap-1">
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            disabled={loading}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${selectedLanguage === language.code
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-base">{getLanguageEmoji(language.code)}</span>
            <span>{language.name}</span>
          </button>
        ))}
      </div>
      {loading && (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 