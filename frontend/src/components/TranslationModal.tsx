import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Languages, Loader2 } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { newsLanguages } from '@/data/mockNews';

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle;
}

export const TranslationModal = ({ isOpen, onClose, article }: TranslationModalProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    title: string;
    excerpt: string;
    content: string;
  } | null>(null);

  const handleTranslate = async () => {
    if (!selectedLanguage) return;
    
    setIsTranslating(true);
    
    // Simulate translation API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const selectedLang = newsLanguages.find(lang => lang.code === selectedLanguage);
    
    // Mock translation - in real app, this would be an API call
    const translations = {
      'es': {
        title: `[ES] ${article.title}`,
        excerpt: `[Traducido al español] ${article.excerpt}`,
        content: `[Contenido traducido al español] ${article.content}`
      },
      'fr': {
        title: `[FR] ${article.title}`,
        excerpt: `[Traduit en français] ${article.excerpt}`,
        content: `[Contenu traduit en français] ${article.content}`
      },
      'de': {
        title: `[DE] ${article.title}`,
        excerpt: `[Ins Deutsche übersetzt] ${article.excerpt}`,
        content: `[Ins Deutsche übersetzter Inhalt] ${article.content}`
      }
    };
    
    setTranslatedContent(translations[selectedLanguage as keyof typeof translations] || {
      title: `[${selectedLang?.name}] ${article.title}`,
      excerpt: `[Translated to ${selectedLang?.name}] ${article.excerpt}`,
      content: `[Content translated to ${selectedLang?.name}] ${article.content}`
    });
    
    setIsTranslating(false);
  };

  const handleClose = () => {
    setTranslatedContent(null);
    setSelectedLanguage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Languages className="h-5 w-5" />
            <span>Translate Article</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target language" />
                </SelectTrigger>
                <SelectContent>
                  {newsLanguages.filter(lang => lang.code !== 'en').map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <span className="flex items-center space-x-2">
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleTranslate}
              disabled={!selectedLanguage || isTranslating}
              className="min-w-[120px]"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                'Translate'
              )}
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <span>🇺🇸</span>
                  <span>Original (English)</span>
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className="font-medium mb-1">Title:</h5>
                    <p className="text-muted-foreground">{article.title}</p>
                  </div>
                  <Separator />
                  <div>
                    <h5 className="font-medium mb-1">Excerpt:</h5>
                    <p className="text-muted-foreground">{article.excerpt}</p>
                  </div>
                  <Separator />
                  <div>
                    <h5 className="font-medium mb-1">Content:</h5>
                    <p className="text-muted-foreground text-xs max-h-32 overflow-y-auto">
                      {article.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <span>
                    {selectedLanguage ? newsLanguages.find(lang => lang.code === selectedLanguage)?.flag : '🌐'}
                  </span>
                  <span>
                    Translation ({selectedLanguage ? newsLanguages.find(lang => lang.code === selectedLanguage)?.name : 'Select language'})
                  </span>
                </h4>
                
                {!translatedContent && !isTranslating && (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    Select a language and click translate
                  </div>
                )}
                
                {isTranslating && (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                
                {translatedContent && (
                  <div className="space-y-3 text-sm">
                    <div>
                      <h5 className="font-medium mb-1">Title:</h5>
                      <p className="text-muted-foreground">{translatedContent.title}</p>
                    </div>
                    <Separator />
                    <div>
                      <h5 className="font-medium mb-1">Excerpt:</h5>
                      <p className="text-muted-foreground">{translatedContent.excerpt}</p>
                    </div>
                    <Separator />
                    <div>
                      <h5 className="font-medium mb-1">Content:</h5>
                      <p className="text-muted-foreground text-xs max-h-32 overflow-y-auto">
                        {translatedContent.content}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};