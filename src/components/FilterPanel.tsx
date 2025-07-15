import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterState } from "@/types";

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function FilterPanel({ filters, onFiltersChange, isOpen, onToggle }: FilterPanelProps) {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      priority: 'all',
      dateRange: 'all',
      company: ''
    });
  };

  const hasActiveFilters = filters.priority !== 'all' || 
    filters.dateRange !== 'all' || 
    filters.company !== '';

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50 rounded-l-lg rounded-r-none border-r-0 shadow-elevated"
      >
        <Filter className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background/95 backdrop-blur-md border-l z-50 animate-slide-in">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Priority Filter */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={filters.priority} 
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">🔴 High Priority</SelectItem>
                <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                <SelectItem value="low">🟢 Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label htmlFor="dateRange">Date Range</Label>
            <Select 
              value={filters.dateRange} 
              onValueChange={(value) => handleFilterChange('dateRange', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">📅 Today</SelectItem>
                <SelectItem value="week">📆 This Week</SelectItem>
                <SelectItem value="month">🗓️ This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Company Filter */}
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Filter by company..."
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
              className="bg-muted/50"
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}

          {/* Filter Summary */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2 text-sm text-muted-foreground">Active Filters:</h4>
            <div className="space-y-1 text-sm">
              {filters.priority !== 'all' && (
                <div className="flex items-center justify-between">
                  <span>Priority:</span>
                  <span className="font-medium">{filters.priority}</span>
                </div>
              )}
              {filters.dateRange !== 'all' && (
                <div className="flex items-center justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{filters.dateRange}</span>
                </div>
              )}
              {filters.company && (
                <div className="flex items-center justify-between">
                  <span>Company:</span>
                  <span className="font-medium">{filters.company}</span>
                </div>
              )}
              {!hasActiveFilters && (
                <span className="text-muted-foreground italic">No active filters</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}