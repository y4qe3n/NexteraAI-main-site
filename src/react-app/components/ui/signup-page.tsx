import { useState } from "react";
import { Loader2, Shield, Users, Mail, Lock, Sparkles, Eye, EyeOff, CheckCircle, ChevronRight } from "lucide-react";
import { Logo } from "@/react-app/components/Logo";

interface SignUpProps {
  onSuccess?: () => void;
}

const SignUp = ({ onSuccess }: SignUpProps) => {
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regFocused, setRegFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/email-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: regFullName,
          email: regEmail,
          password: regPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Failed to create account");
        return;
      }

      // Session is established via httpOnly cookie set by the server.
      // Do NOT persist tokens or identity in localStorage.

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[hsl(var(--background))]">
      <div className="bg-[hsl(var(--card))]/80 backdrop-blur-xl border border-[hsl(var(--border))]/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden w-full max-w-md">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--foreground))]/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

        {/* Header */}
        <div className="text-center mb-10 relative">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[hsl(var(--primary))]/20 blur-xl rounded-full animate-pulse" />
              <Logo className="h-40 w-auto" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2 tracking-tight">
            Create Your Administrator Account
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] text-sm">
            Set up your admin access
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Secure Registration</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name input */}
          <div className={`relative transition-all duration-300 ${regFocused === 'fullName' ? 'scale-[1.02]' : ''}`}>
            <label htmlFor="fullName" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Full name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className={`w-5 h-5 transition-colors duration-300 ${regFocused === 'fullName' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
              </div>
              <input
                id="fullName"
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                onFocus={() => setRegFocused('fullName')}
                onBlur={() => setRegFocused(null)}
                className="w-full pl-10 pr-4 py-3 bg-[hsl(var(--background))]/50 border border-[hsl(var(--input))] rounded-xl text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-[hsl(var(--primary))] transition-all duration-300"
                placeholder="Full name"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Sparkles className={`w-4 h-4 transition-all duration-300 ${regFullName ? 'text-[hsl(var(--primary))] opacity-100' : 'opacity-0'}`} />
              </div>
            </div>
          </div>

          {/* Email input */}
          <div className={`relative transition-all duration-300 ${regFocused === 'email' ? 'scale-[1.02]' : ''}`}>
            <label htmlFor="regEmail" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 transition-colors duration-300 ${regFocused === 'email' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
              </div>
              <input
                id="regEmail"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                onFocus={() => setRegFocused('email')}
                onBlur={() => setRegFocused(null)}
                className="w-full pl-10 pr-4 py-3 bg-[hsl(var(--background))]/50 border border-[hsl(var(--input))] rounded-xl text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-[hsl(var(--primary))] transition-all duration-300"
                placeholder="you@example.com"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Sparkles className={`w-4 h-4 transition-all duration-300 ${regEmail ? 'text-[hsl(var(--primary))] opacity-100' : 'opacity-0'}`} />
              </div>
            </div>
          </div>

          {/* Password input */}
          <div className={`relative transition-all duration-300 ${regFocused === 'password' ? 'scale-[1.02]' : ''}`}>
            <label htmlFor="regPassword" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 transition-colors duration-300 ${regFocused === 'password' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
              </div>
              <input
                id="regPassword"
                type={regShowPassword ? 'text' : 'password'}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                onFocus={() => setRegFocused('password')}
                onBlur={() => setRegFocused(null)}
                className="w-full pl-10 pr-12 py-3 bg-[hsl(var(--background))]/50 border border-[hsl(var(--input))] rounded-xl text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-[hsl(var(--primary))] transition-all duration-300"
                placeholder="Min 8 characters"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setRegShowPassword(!regShowPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                {regShowPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password input */}
          <div className={`relative transition-all duration-300 ${regFocused === 'confirmPassword' ? 'scale-[1.02]' : ''}`}>
            <label htmlFor="regConfirmPassword" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 transition-colors duration-300 ${regFocused === 'confirmPassword' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
              </div>
              <input
                id="regConfirmPassword"
                type={regShowPassword ? 'text' : 'password'}
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                onFocus={() => setRegFocused('confirmPassword')}
                onBlur={() => setRegFocused(null)}
                className="w-full pl-10 pr-12 py-3 bg-[hsl(var(--background))]/50 border border-[hsl(var(--input))] rounded-xl text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-[hsl(var(--primary))] transition-all duration-300"
                placeholder="Re-enter password"
                required
              />
              {regPassword && regConfirmPassword && regPassword === regConfirmPassword && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[hsl(var(--primary))]/25 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <span>Create Account and Proceed to Business Registration</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[hsl(var(--border))] text-center">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
