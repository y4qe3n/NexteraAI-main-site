import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function InviteAcceptance() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<{
    email: string;
    organizationName: string;
    role: string;
    inviterName: string;
  } | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid invite link");
      setLoading(false);
      return;
    }

    const validateInvite = async () => {
      try {
        const res = await fetch(`/api/invite/${token}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Invalid invite link");
        }
        const data = await res.json();
        setInviteData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to validate invite. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    validateInvite();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const res = await fetch(`/api/invite/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password, name: name.trim() }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to accept invite");
      }

      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invite");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Card className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#667eea]" />
            <p className="mt-4 text-gray-600">Validating invite...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Card className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Invalid Invite</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate("/login")} className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg">
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Card className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Account Created!</h2>
            <p className="text-gray-600 mb-6">
              Your account has been successfully created. Redirecting to dashboard...
            </p>
            <Loader2 className="w-6 h-6 animate-spin text-[#667eea]" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Accept Invite</h1>
        <p className="text-gray-600 text-center mb-6 text-sm">
          You've been invited to join <strong>{inviteData?.organizationName}</strong>
        </p>

        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm">
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 font-medium text-gray-800">{inviteData?.email}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Role:</span>
            <span className="ml-2 font-medium text-gray-800">{inviteData?.role}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Invited by:</span>
            <span className="ml-2 font-medium text-gray-800">{inviteData?.inviterName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea] transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea] transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea] transition-colors"
              required
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}
          <Button type="submit" className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="text-xs text-gray-600 text-center mt-6">
          By creating an account, you agree to the NexteraAI Terms of Service
        </p>
      </div>
    </div>
  );
}
