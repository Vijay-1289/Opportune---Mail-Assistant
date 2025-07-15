import { useState } from "react";
import { Mail, Sparkles, ArrowRight, Shield, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Dashboard from "./Dashboard";
import Auth from "./Auth";

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  if (showDemo) {
    return <Dashboard accessToken={accessToken || undefined} />;
  }

  if (showAuth) {
    return (
      <Auth
        onBack={() => setShowAuth(false)}
        onAuthSuccess={(token) => {
          setAccessToken(token);
          setShowAuth(false);
          setShowDemo(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-glow">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                OpportuniSort
              </h1>
              <p className="text-white/80 text-lg">Your Career Mail Assistant</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl md:text-3xl text-white/90 font-medium leading-relaxed">
              Transform your Gmail chaos into an 
              <span className="font-bold text-white"> organized dashboard</span> of career opportunities! 
              🚀📩
            </h2>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Smart AI-powered email categorization that sorts internships, jobs, hackathons, 
              scholarships, and events automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg"
                onClick={() => setShowDemo(true)}
                className="bg-white text-primary hover:bg-white/90 shadow-elevated text-lg px-8 py-6"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try Demo Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setShowAuth(true)}
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                Connect Gmail
                <Mail className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why OpportuniSort?</h3>
            <p className="text-xl text-muted-foreground">Turn your inbox into your career command center</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Smart Categorization",
                description: "AI-powered classification automatically sorts emails into internships, jobs, hackathons, and more.",
                color: "text-primary"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Gmail OAuth integration ensures your data stays secure. We never store your emails.",
                color: "text-success"
              },
              {
                icon: Star,
                title: "Never Miss Out",
                description: "Get deadline alerts, save opportunities, and export to your calendar with one click.",
                color: "text-warning"
              }
            ].map((feature, index) => (
              <Card key={feature.title} className="bg-gradient-card border-border/50 hover:shadow-elevated transition-all duration-300" style={{ animationDelay: `${index * 200}ms` }}>
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-${feature.color === 'text-primary' ? 'primary' : feature.color === 'text-success' ? 'success' : 'warning'}/10 rounded-2xl flex items-center justify-center`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Smart Categories</h3>
          <p className="text-xl text-muted-foreground">Automatically organize opportunities by type</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { emoji: "🎓", label: "Internships", count: "24", color: "bg-category-internship" },
            { emoji: "💼", label: "Jobs", count: "18", color: "bg-category-job" },
            { emoji: "⚔️", label: "Hackathons", count: "12", color: "bg-category-hackathon" },
            { emoji: "🏆", label: "Scholarships", count: "8", color: "bg-category-scholarship" },
            { emoji: "📅", label: "Events", count: "15", color: "bg-category-event" },
            { emoji: "🏅", label: "Competitions", count: "6", color: "bg-category-competition" }
          ].map((category, index) => (
            <Card key={category.label} className="text-center p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-3xl mb-2">{category.emoji}</div>
              <h4 className="font-semibold text-sm">{category.label}</h4>
              <p className="text-xs text-muted-foreground mt-1">{category.count} new</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-primary py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Organize Your Career Opportunities?
          </h3>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who never miss an opportunity.
          </p>
          <Button 
            size="lg"
            onClick={() => setShowDemo(true)}
            className="bg-white text-primary hover:bg-white/90 shadow-elevated text-lg px-8 py-6"
          >
            Start Your Free Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
