import { TrendingUp, Clock, Star, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsOverviewProps {
  totalOpportunities: number;
  newOpportunities: number;
  urgentDeadlines: number;
  savedOpportunities: number;
}

export function StatsOverview({ 
  totalOpportunities, 
  newOpportunities, 
  urgentDeadlines, 
  savedOpportunities 
}: StatsOverviewProps) {
  const stats = [
    {
      title: "Total Opportunities",
      value: totalOpportunities,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "New This Week",
      value: newOpportunities,
      icon: Star,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Urgent Deadlines",
      value: urgentDeadlines,
      icon: Clock,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Saved Items",
      value: savedOpportunities,
      icon: Calendar,
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}