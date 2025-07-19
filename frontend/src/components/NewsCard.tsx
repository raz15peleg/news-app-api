import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ExternalLink, Languages, GripVertical } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { newsAPI } from '@/services/api';
import { TranslationModal } from './TranslationModal';

interface NewsCardProps {
  article: NewsArticle;
  isDragging?: boolean;
}

export const NewsCard = ({ article, isDragging }: NewsCardProps) => {
  const [isTranslationOpen, setIsTranslationOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceStyle = (source: string) => {
    // Generate a color based on the source name for consistency
    const colors = [
      'bg-blue-600 text-white',
      'bg-red-600 text-white', 
      'bg-green-600 text-white',
      'bg-purple-600 text-white',
      'bg-orange-600 text-white',
      'bg-teal-600 text-white',
      'bg-pink-600 text-white',
      'bg-indigo-600 text-white',
    ];
    
    // Use a simple hash function to consistently assign colors
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
      hash = source.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  const handleReadMore = async () => {
    try {
      // Record the article view
      await newsAPI.recordArticleView(article.originalId);
      // Open the article in a new tab
      window.open(article.url, '_blank');
    } catch (error) {
      console.error('Error recording article view:', error);
      // Still open the article even if recording fails
      window.open(article.url, '_blank');
    }
  };

  return (
    <>
      <Card className={`
        group cursor-pointer transition-all duration-300 hover:shadow-card-hover
        ${isDragging ? 'rotate-1 shadow-card-hover' : 'shadow-card'}
        bg-gradient-card border-border
      `}>
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-48 md:flex-shrink-0">
            <div className="h-48 md:h-full overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none bg-muted">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
          
          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Badge className={getSourceStyle(article.source)}>
                  {article.source}
                </Badge>
                <Badge variant="outline">{article.category}</Badge>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTranslationOpen(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Languages className="h-4 w-4" />
                </Button>
                <GripVertical className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <h3 className="font-bold text-xl mb-3 line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                {article.views > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">👁 {article.views}</span>
                  </div>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                onClick={handleReadMore}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Read More
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <TranslationModal 
        isOpen={isTranslationOpen}
        onClose={() => setIsTranslationOpen(false)}
        article={article}
      />
    </>
  );
};