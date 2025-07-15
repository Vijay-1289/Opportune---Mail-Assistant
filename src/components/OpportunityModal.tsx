import { X, Calendar, MapPin, Clock, Paperclip, ExternalLink, Download, Share } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Opportunity } from "@/types";
import { categoryIcons } from "@/data/mockData";

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OpportunityModal({ opportunity, isOpen, onClose }: OpportunityModalProps) {
  if (!opportunity) return null;

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

  const isUrgent = opportunity.deadline && new Date(opportunity.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{categoryIcons[opportunity.category]}</span>
              <div>
                <DialogTitle className="text-xl font-bold">{opportunity.subject}</DialogTitle>
                <p className="text-lg text-primary font-semibold">{opportunity.company}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getCategoryColor(opportunity.category)}>
              {opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
            </Badge>
            {opportunity.isNew && (
              <Badge className="bg-primary text-primary-foreground animate-pulse-glow">
                ✨ New
              </Badge>
            )}
            {opportunity.priority === 'high' && (
              <Badge variant="destructive">🔴 High Priority</Badge>
            )}
            {opportunity.type && (
              <Badge variant="outline">{opportunity.type}</Badge>
            )}
          </div>
        </DialogHeader>

        <Separator />

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Key Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Received:</span>
                    <p className="font-medium">{new Date(opportunity.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>

                {opportunity.deadline && (
                  <div className="flex items-center space-x-3">
                    <Clock className={`w-4 h-4 ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`} />
                    <div>
                      <span className="text-sm text-muted-foreground">Deadline:</span>
                      <p className={`font-medium ${isUrgent ? 'text-destructive' : ''}`}>
                        {new Date(opportunity.deadline).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        {isUrgent && <span className="ml-2 text-destructive">⚠️ Urgent</span>}
                      </p>
                    </div>
                  </div>
                )}

                {opportunity.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <p className="font-medium">{opportunity.location}</p>
                    </div>
                  </div>
                )}

                {opportunity.salary && (
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💰</span>
                    <div>
                      <span className="text-sm text-muted-foreground">Compensation:</span>
                      <p className="font-medium text-success">{opportunity.salary}</p>
                    </div>
                  </div>
                )}

                {opportunity.attachments && opportunity.attachments > 0 && (
                  <div className="flex items-center space-x-3">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">Attachments:</span>
                      <p className="font-medium">{opportunity.attachments} files</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Tags & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Email
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Description</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed">{opportunity.description}</p>
            
            {/* Mock detailed content */}
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>
                This is an excellent opportunity to grow your career and work with cutting-edge technology. 
                The role offers competitive compensation, comprehensive benefits, and opportunities for professional development.
              </p>
              
              {opportunity.category === 'internship' && (
                <div>
                  <h4 className="font-medium text-foreground">What you'll learn:</h4>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Industry best practices and modern development workflows</li>
                    <li>Collaboration with experienced engineers and product teams</li>
                    <li>Hands-on experience with production systems at scale</li>
                  </ul>
                </div>
              )}

              {opportunity.category === 'hackathon' && (
                <div>
                  <h4 className="font-medium text-foreground">Event Schedule:</h4>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Friday 6PM: Registration and team formation</li>
                    <li>Saturday-Sunday: Development period (48 hours)</li>
                    <li>Sunday 6PM: Final presentations and judging</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline">
            📧 Reply to Email
          </Button>
          <div className="space-x-3">
            <Button variant="outline">
              Save for Later
            </Button>
            <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow">
              Apply Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}