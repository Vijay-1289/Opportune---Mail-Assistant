import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { CategoryTabs } from "@/components/CategoryTabs";
import { StatsOverview } from "@/components/StatsOverview";
import { OpportunityCard } from "@/components/OpportunityCard";
import { FilterPanel } from "@/components/FilterPanel";
import { OpportunityModal } from "@/components/OpportunityModal";
import { mockOpportunities } from "@/data/mockData";
import { Opportunity, CategoryType, FilterState } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priority: 'all',
    dateRange: 'all',
    company: ''
  });

  const { toast } = useToast();

  // Filter and search opportunities
  const filteredOpportunities = useMemo(() => {
    return mockOpportunities.filter(opportunity => {
      // Category filter
      if (activeCategory !== 'all' && opportunity.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (!opportunity.subject.toLowerCase().includes(searchLower) &&
            !opportunity.company.toLowerCase().includes(searchLower) &&
            !opportunity.description.toLowerCase().includes(searchLower) &&
            !opportunity.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
          return false;
        }
      }

      // Priority filter
      if (filters.priority !== 'all' && opportunity.priority !== filters.priority) {
        return false;
      }

      // Company filter
      if (filters.company && !opportunity.company.toLowerCase().includes(filters.company.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const opportunityDate = new Date(opportunity.date);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            if (opportunityDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (opportunityDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (opportunityDate < monthAgo) return false;
            break;
        }
      }

      return true;
    });
  }, [searchQuery, activeCategory, filters]);

  // Calculate category statistics
  const categoryStats = useMemo(() => {
    const stats: Record<CategoryType | 'all', { total: number; new: number; urgent: number }> = {
      all: { total: 0, new: 0, urgent: 0 },
      internship: { total: 0, new: 0, urgent: 0 },
      job: { total: 0, new: 0, urgent: 0 },
      hackathon: { total: 0, new: 0, urgent: 0 },
      scholarship: { total: 0, new: 0, urgent: 0 },
      event: { total: 0, new: 0, urgent: 0 },
      competition: { total: 0, new: 0, urgent: 0 }
    };

    mockOpportunities.forEach(opportunity => {
      const isUrgent = opportunity.deadline && 
        new Date(opportunity.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // All category
      stats.all.total++;
      if (opportunity.isNew) stats.all.new++;
      if (isUrgent) stats.all.urgent++;

      // Specific category
      stats[opportunity.category].total++;
      if (opportunity.isNew) stats[opportunity.category].new++;
      if (isUrgent) stats[opportunity.category].urgent++;
    });

    return stats;
  }, []);

  const handleSaveOpportunity = (id: string) => {
    setSavedOpportunities(prev => {
      const newSaved = prev.includes(id) 
        ? prev.filter(savedId => savedId !== id)
        : [...prev, id];
      
      toast({
        title: prev.includes(id) ? "Removed from saved" : "Saved successfully",
        description: prev.includes(id) 
          ? "Opportunity removed from your saved list" 
          : "Opportunity added to your saved list"
      });
      
      return newSaved;
    });
  };

  const handleViewOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const newOpportunities = mockOpportunities.filter(opp => opp.isNew).length;
  const urgentDeadlines = mockOpportunities.filter(opp => 
    opp.deadline && new Date(opp.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {/* Category Tabs */}
      <CategoryTabs 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryStats={categoryStats}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <StatsOverview 
          totalOpportunities={mockOpportunities.length}
          newOpportunities={newOpportunities}
          urgentDeadlines={urgentDeadlines}
          savedOpportunities={savedOpportunities.length}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {activeCategory === 'all' ? 'All Opportunities' : 
               activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </h2>
            <p className="text-muted-foreground">
              Showing {filteredOpportunities.length} of {mockOpportunities.length} opportunities
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity, index) => (
              <div 
                key={opportunity.id} 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <OpportunityCard
                  opportunity={opportunity}
                  onSave={handleSaveOpportunity}
                  onView={handleViewOpportunity}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">No opportunities found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find more opportunities.
            </p>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel 
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
      />

      {/* Opportunity Modal */}
      <OpportunityModal 
        opportunity={selectedOpportunity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}