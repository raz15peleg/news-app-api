import { useState, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { NewsHeader } from './NewsHeader';
import { NewsFilter } from './NewsFilter';
import { NewsCard } from './NewsCard';
import { NewsArticle, convertAPIToDisplayArticle, getLanguageCode } from '@/types/news';
import { newsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const NewsApp = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default to English
  const { toast } = useToast();

  // Fetch articles from API
  const fetchArticles = async (languageName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const languageCode = getLanguageCode(languageName);
      const response = await newsAPI.getArticles(languageCode, 0, 50); // Fetch more articles
      
      const convertedArticles = response.articles.map(convertAPIToDisplayArticle);
      setArticles(convertedArticles);
      
      toast({
        title: "Articles loaded",
        description: `Loaded ${convertedArticles.length} articles in ${languageName}`,
      });
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      setArticles([]); // Clear articles on error
      
      toast({
        title: "Error loading articles",
        description: "Failed to fetch articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load English articles by default when component mounts
  useEffect(() => {
    fetchArticles('English');
  }, []);

  // Fetch new articles when language changes
  useEffect(() => {
    if (selectedLanguage !== 'English' || articles.length === 0) {
      fetchArticles(selectedLanguage);
    }
  }, [selectedLanguage]);

  const filteredArticles = useMemo(() => {
    if (loading) return [];
    
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSource = !selectedSource || article.source === selectedSource;
      const matchesLanguage = article.language === selectedLanguage;
      return matchesSearch && matchesSource && matchesLanguage;
    });
  }, [articles, searchTerm, selectedSource, selectedLanguage, loading]);

  const articleCounts = useMemo(() => {
    if (loading) return {};
    
    const languageFiltered = articles.filter(article => article.language === selectedLanguage);
    return languageFiltered.reduce((acc, article) => {
      acc[article.source] = (acc[article.source] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }, [articles, selectedLanguage, loading]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredArticles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the main articles array while preserving the new order
    const newArticles = [...articles];
    const sourceArticle = filteredArticles[result.source.index];
    const sourceIndex = newArticles.findIndex(a => a.id === sourceArticle.id);
    
    if (sourceIndex !== -1) {
      newArticles.splice(sourceIndex, 1);
      const destinationArticle = items[result.destination.index];
      const destinationIndex = newArticles.findIndex(a => a.id === destinationArticle.id);
      
      if (destinationIndex !== -1) {
        newArticles.splice(destinationIndex, 0, sourceArticle);
      } else {
        newArticles.splice(result.destination.index, 0, sourceArticle);
      }
    }

    setArticles(newArticles);
    toast({
      title: "Article moved",
      description: `"${sourceArticle.title}" has been repositioned.`,
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    // Clear search and source filters when changing language
    setSearchTerm('');
    setSelectedSource(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <NewsHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
      
      <div className="container mx-auto px-4 py-8">
        <NewsFilter 
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
          articleCounts={articleCounts}
        />
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading articles...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">Error loading articles</p>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
            <button 
              onClick={() => fetchArticles(selectedLanguage)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        )}

        {/* Articles List */}
        {!loading && !error && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="news-articles">
              {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="max-w-4xl mx-auto space-y-6"
                  >
                  {filteredArticles.map((article, index) => (
                    <Draggable key={article.id} draggableId={article.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="transition-transform duration-200"
                        >
                          <NewsCard 
                            article={article} 
                            isDragging={snapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        
        {/* No Articles State */}
        {!loading && !error && filteredArticles.length === 0 && articles.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
            <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filter settings.</p>
          </div>
        )}

        {/* No Articles for Language */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No articles available for {selectedLanguage}.</p>
            <p className="text-muted-foreground text-sm mt-2">Try selecting a different language or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};