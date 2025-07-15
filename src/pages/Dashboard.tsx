import { useState, useMemo, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { CategoryTabs } from "@/components/CategoryTabs";
import { StatsOverview } from "@/components/StatsOverview";
import { OpportunityCard } from "@/components/OpportunityCard";
import { FilterPanel } from "@/components/FilterPanel";
import { OpportunityModal } from "@/components/OpportunityModal";
import { Opportunity, CategoryType, FilterState } from "@/types";
import { useToast } from "@/hooks/use-toast";
import GmailService from "@/services/gmailApi";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { MobileAppBanner } from "@/components/MobileAppBanner";

interface DashboardProps {
  accessToken?: string;
  email?: string;
}

export default function Dashboard({ accessToken, email }: DashboardProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priority: 'all',
    dateRange: 'all',
    company: ''
  });
  const [userProfile, setUserProfile] = useState<{ name?: string; email: string; avatarUrl?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

  const { toast } = useToast();

  useEffect(() => {
    if (accessToken) {
      loadGmailData();
    }
  }, [accessToken]);

  useEffect(() => {
    // Get user info from Supabase session
    const session = supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (user) {
        setUserProfile({
          name: user.user_metadata?.name || user.email,
          email: user.email,
          avatarUrl: user.user_metadata?.avatar_url,
        });
      }
    });
  }, []);

  // Persist savedOpportunities in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedOpportunities');
    if (saved) setSavedOpportunities(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem('savedOpportunities', JSON.stringify(savedOpportunities));
  }, [savedOpportunities]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const loadGmailData = async () => {
    if (!accessToken) return;

    setIsLoading(true);
    try {
      const gmailService = new GmailService(accessToken);
      const gmailOpportunities = await gmailService.getRecentEmails();
      
      if (gmailOpportunities.length > 0) {
        // Add isNew property and merge with any existing data
        const processedOpportunities = gmailOpportunities.map(opp => ({
          ...opp,
          isNew: true,
          description: opp.content || 'No description available'
        }));
        
        setOpportunities(processedOpportunities);
        toast({
          title: "Gmail Connected",
          description: `Loaded ${gmailOpportunities.length} opportunities from your Gmail.`,
        });
      } else {
        toast({
          title: "No Opportunities Found",
          description: "No career-related emails found in your recent Gmail messages.",
        });
      }
    } catch (error) {
      console.error('Error loading Gmail data:', error);
      toast({
        title: "Error",
        description: "Failed to load data from Gmail.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opportunity => {
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
  }, [searchQuery, activeCategory, filters, opportunities]);

  // Filtered lists
  const savedOpportunitiesList = opportunities.filter(opp => savedOpportunities.includes(opp.id));

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

    opportunities.forEach(opportunity => {
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
  }, [opportunities]);

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

  const newOpportunities = opportunities.filter(opp => opp.isNew).length;
  const urgentDeadlines = opportunities.filter(opp => 
    opp.deadline && new Date(opp.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={userProfile || { email: email || "" }}
        onLogout={handleLogout}
      />
      {/* Tabs for All/Saved */}
      <div className="container mx-auto px-6 pt-4">
        <Tabs value={activeTab} onValueChange={val => setActiveTab(val as 'all' | 'saved')} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {/* Category Tabs */}
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categoryStats={categoryStats}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
              {filteredOpportunities.map((opportunity, index) => (
                <div key={opportunity.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <OpportunityCard
                    opportunity={opportunity}
                    onSave={handleSaveOpportunity}
                    onView={handleViewOpportunity}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {savedOpportunitiesList.length > 0 ? savedOpportunitiesList.map((opportunity, index) => (
                <div key={opportunity.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <OpportunityCard
                    opportunity={opportunity}
                    onSave={handleSaveOpportunity}
                    onView={handleViewOpportunity}
                  />
                </div>
              )) : (
                <div className="text-center py-12 col-span-3">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-3xl">🔖</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No saved opportunities</h3>
                  <p className="text-muted-foreground">Save opportunities to view them here.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
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