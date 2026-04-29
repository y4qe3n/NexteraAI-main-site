import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/react-app/lib/AuthContext";
import { Loader2, ShieldCheck } from "lucide-react";

export function AuthCallback() {
  const navigate = useNavigate();
  const { admin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (admin) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [loading, admin, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-primary" />
        <h1 className="text-xl font-semibold mb-2">Completing Sign In</h1>
        <p className="text-muted-foreground">Redirecting you to the dashboard...</p>
      </div>
    </div>
  );
}
