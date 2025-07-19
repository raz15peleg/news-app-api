import { Search, Globe, Settings, Languages, ChevronDown, Sun, Moon, Monitor } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LANGUAGE_MAP } from '@/types/news';
import { useTheme } from '@/components/ThemeProvider';

interface NewsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

// Get supported languages from the backend API mapping
const supportedLanguages = Object.entries(LANGUAGE_MAP).map(([code, config]) => ({
  code,
  name: config.name,
  flag: config.flag,
}));

export const NewsHeader = ({ 
  searchTerm, 
  onSearchChange, 
  selectedLanguage = 'English',
  onLanguageChange 
}: NewsHeaderProps) => {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };
  return (
    <header className="bg-gradient-header text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">NewsHub</h1>
          </div>
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-white border-white hover:bg-white/20 bg-white/10 backdrop-blur-sm"
                >
                  <Languages className="h-4 w-4 mr-2" />
                  {supportedLanguages.find(lang => lang.name === selectedLanguage)?.flag} {selectedLanguage}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-50 bg-background border-border min-w-[140px]">
                {supportedLanguages.map((language) => (
                  <DropdownMenuItem 
                    key={language.code}
                    onClick={() => onLanguageChange?.(language.name)}
                    className="cursor-pointer hover:bg-muted"
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-white border-white hover:bg-white/20 bg-white/10 backdrop-blur-sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-50 bg-background border-border min-w-[140px]">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="cursor-pointer hover:bg-muted"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="cursor-pointer hover:bg-muted"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className="cursor-pointer hover:bg-muted"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
          />
        </div>
      </div>
    </header>
  );
};