import { Mail, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  user?: {
    name?: string;
    email: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
}

export function Header({ searchQuery, onSearchChange, user, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Mail className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Opportune
              </h1>
              <p className="text-xs text-muted-foreground">Your Career Mail Assistant</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {/* User Profile */}
          {user && (
            <div className="flex items-center space-x-3">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name || user.email}
                  className="w-10 h-10 rounded-full border shadow"
                />
              )}
              <div className="text-right">
                <div className="font-semibold text-sm text-foreground">{user.name || user.email}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
              {onLogout && (
                <Button variant="ghost" size="icon" onClick={onLogout} title="Logout">
                  <LogOut className="w-5 h-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}