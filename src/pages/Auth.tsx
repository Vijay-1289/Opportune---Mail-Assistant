import { useState, useEffect } from "react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

const GMAIL_API_KEY = "AIzaSyCXM2sYclXOGweZ4PthNsyQ-EezYn7TTNc";
const CLIENT_ID = "503593557386-g5gt13h4p3rbseg8u72hhcbkji0s78dm.apps.googleusercontent.com"; // Real Google OAuth Client ID
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest";
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

interface AuthProps {
  onBack: () => void;
  onAuthSuccess: (accessToken: string) => void;
}

const Auth = ({ onBack, onAuthSuccess }: AuthProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeGapi();
  }, []);

  const initializeGapi = async () => {
    try {
      // Load Google API script
      if (!window.gapi) {
        await loadGoogleScript();
      }

      await window.gapi.load("client:auth2", async () => {
        await window.gapi.client.init({
          apiKey: GMAIL_API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOC],
          scope: SCOPES,
        });
        setIsInitialized(true);
      });
    } catch (error) {
      console.error("Error initializing Google API:", error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize Google API. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="apis.google.com"]')) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleGoogleSignIn = async () => {
    if (!isInitialized) {
      toast({
        title: "Not Ready",
        description: "Google API is still initializing. Please wait.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      const accessToken = user.getAuthResponse().access_token;
      
      toast({
        title: "Success!",
        description: "Successfully connected to Gmail.",
      });
      
      onAuthSuccess(accessToken);
    } catch (error) {
      console.error("Sign-in error:", error);
      toast({
        title: "Sign-in Failed",
        description: "Failed to connect to Gmail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-background/95 backdrop-blur-md border-border/50">
        <CardHeader className="text-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="self-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Connect Gmail</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Secure Gmail Integration</h3>
            <p className="text-sm text-muted-foreground">
              Connect your Gmail account to start organizing your career opportunities.
              We only read your emails to categorize them - we never store or share your data.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Read-only access to your Gmail</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Secure OAuth 2.0 authentication</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>No data stored on our servers</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading || !isInitialized}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Connecting..." : "Connect with Gmail"}
          </Button>

          {!isInitialized && (
            <p className="text-xs text-muted-foreground text-center">
              Initializing Google API...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;