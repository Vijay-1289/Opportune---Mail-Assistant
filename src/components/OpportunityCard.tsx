import { Calendar, MapPin, Clock, Paperclip, Star, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Opportunity } from "@/types";
import { categoryIcons } from "@/data/mockData";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSave: (id: string) => void;
  onView: (opportunity: Opportunity) => void;
}

export function OpportunityCard({ opportunity, onSave, onView }: OpportunityCardProps) {
  const getCategoryColor = (category: Opportunity['category']) => {
    const colors = {
      internship: "bg-category-internship text-white",
      job: "bg-category-job text-white", 
      hackathon: "bg-category-hackathon text-white",
      scholarship: "bg-category-scholarship text-white",
      event: "bg-category-event text-white",
      competition: "bg-category-competition text-white"
    };
    return colors[category];
  };

  const getPriorityColor = (priority: Opportunity['priority']) => {
    const colors = {
      high: "bg-destructive text-destructive-foreground",
      medium: "bg-warning text-warning-foreground",
      low: "bg-muted text-muted-foreground"
    };
    return colors[priority];
  };

  const isUrgent = opportunity.deadline && new Date(opportunity.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 animate-fade-in">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{categoryIcons[opportunity.category]}</span>
            <div>
              <Badge className={getCategoryColor(opportunity.category)} variant="secondary">
                {opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
              </Badge>
              {opportunity.isNew && (
                <Badge className="ml-2 bg-primary text-primary-foreground animate-pulse-glow">
                  ✨ New
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(opportunity.priority)} variant="outline">
              {opportunity.priority.toUpperCase()}
            </Badge>
            <Button variant="ghost" size="icon" onClick={() => onSave(opportunity.id)}>
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {opportunity.subject}
            </h3>
            <p className="text-primary font-medium">{opportunity.company}</p>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2">
            {opportunity.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(opportunity.date).toLocaleDateString()}</span>
            </div>
            
            {opportunity.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{opportunity.location}</span>
              </div>
            )}

            {opportunity.deadline && (
              <div className={`flex items-center space-x-1 ${isUrgent ? 'text-destructive font-medium' : ''}`}>
                <Clock className="w-4 h-4" />
                <span>Due: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                {isUrgent && <span className="text-destructive">⚠️</span>}
              </div>
            )}

            {opportunity.attachments && opportunity.attachments > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="w-4 h-4" />
                <span>{opportunity.attachments} files</span>
              </div>
            )}

            {opportunity.salary && (
              <div className="flex items-center space-x-1 text-success font-medium">
                <span>💰</span>
                <span>{opportunity.salary}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {opportunity.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                📄 Export
              </Button>
              <Button variant="outline" size="sm">
                📅 Calendar
              </Button>
            </div>
            <Button 
              onClick={() => onView(opportunity)}
              className="bg-gradient-primary text-primary-foreground hover:shadow-glow"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}