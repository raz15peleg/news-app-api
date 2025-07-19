import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface NewsFilterProps {
  selectedSource: string | null;
  onSourceChange: (source: string | null) => void;
  articleCounts: { [key: string]: number };
}

export const NewsFilter = ({ selectedSource, onSourceChange, articleCounts }: NewsFilterProps) => {
  const sources = [
    { id: 'CNN', name: 'CNN', color: 'bg-news-cnn', count: articleCounts['CNN'] || 0 },
    { id: 'BBC', name: 'BBC', color: 'bg-news-bbc', count: articleCounts['BBC'] || 0 }
  ];

  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-card-foreground">Filter by Source</h3>
        </div>
        {selectedSource && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSourceChange(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <Button
            key={source.id}
            variant={selectedSource === source.id ? "default" : "outline"}
            onClick={() => onSourceChange(selectedSource === source.id ? null : source.id)}
            className="flex items-center space-x-2"
          >
            <span className={`w-3 h-3 rounded-full ${source.color}`} />
            <span>{source.name}</span>
            <Badge variant="secondary" className="ml-2">
              {source.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};