import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Loader2, ShieldCheck, ShieldX } from "lucide-react";

export function AuthCallback() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        await exchangeCodeForSessionToken();
        navigate("/dashboard");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Failed to complete sign in. Please try again.");
      }
    }

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Authentication Failed</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="text-white"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-primary" />
        <h1 className="text-xl font-semibold mb-2">Securing Your Session</h1>
        <p className="text-muted-foreground">Setting up your protected dashboard...</p>
      </div>
    </div>
  );
}
