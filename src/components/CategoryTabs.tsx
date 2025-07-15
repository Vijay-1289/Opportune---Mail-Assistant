import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/types";
import { categoryLabels, categoryIcons } from "@/types";

interface CategoryTabsProps {
  activeCategory: CategoryType | 'all';
  onCategoryChange: (category: CategoryType | 'all') => void;
  categoryStats: Record<CategoryType | 'all', { total: number; new: number; urgent: number }>;
}

export function CategoryTabs({ activeCategory, onCategoryChange, categoryStats }: CategoryTabsProps) {
  const categories: (CategoryType | 'all')[] = ['all', 'internship', 'job', 'hackathon', 'scholarship', 'event', 'competition'];
  
  return (
    <div className="border-b bg-background/50 backdrop-blur-sm sticky top-[73px] z-40">
      <div className="container mx-auto px-6">
        <div className="flex items-center space-x-1 overflow-x-auto py-4">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const stats = categoryStats[category];
            
            return (
              <Button
                key={category}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onCategoryChange(category)}
                className={`
                  flex items-center space-x-2 min-w-fit transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                    : 'hover:bg-muted/50'
                  }
                `}
              >
                <span className="text-lg">
                  {category === 'all' ? '📋' : categoryIcons[category as CategoryType]}
                </span>
                <span className="font-medium">
                  {category === 'all' ? 'All' : categoryLabels[category as CategoryType]}
                </span>
                
                <div className="flex items-center space-x-1">
                  <Badge 
                    variant={isActive ? "secondary" : "outline"} 
                    className={`text-xs ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : ''}`}
                  >
                    {stats.total}
                  </Badge>
                  
                  {stats.new > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="text-xs animate-pulse-glow"
                    >
                      {stats.new} new
                    </Badge>
                  )}
                  
                  {stats.urgent > 0 && (
                    <Badge 
                      variant="outline" 
                      className="text-xs border-warning text-warning"
                    >
                      ⚠️ {stats.urgent}
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}