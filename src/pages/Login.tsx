import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginProps {
  onLoginSuccess: (accessToken: string, email: string) => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/gmail.readonly email profile openid',
          queryParams: { access_type: 'offline', prompt: 'consent' }
        }
      });
      if (error) throw error;
      // The redirect will happen automatically. After redirect, handle session in parent.
    } catch (error: any) {
      toast({
        title: "Sign-in Failed",
        description: error.message || "Failed to connect to Gmail. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Listen for Supabase session changes (after redirect)
  useState(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.provider_token && session.user?.email) {
        onLoginSuccess(session.provider_token, session.user.email);
      }
    });
    return () => subscription.unsubscribe();
  });

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-background/95 backdrop-blur-md border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Login with Google</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Secure Gmail Integration</h3>
            <p className="text-sm text-muted-foreground">
              Sign in with your Google account to access and sort your emails securely.
            </p>
          </div>
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Connecting..." : "Login with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 