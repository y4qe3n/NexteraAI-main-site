import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/react-app/lib/AuthContext";
import { Shield, Loader2, Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import { Logo } from "@/react-app/components/Logo";

export function Login() {
  const navigate = useNavigate();
  const { admin, loading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState<'email' | 'password' | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (admin) {
      navigate('/dashboard');
    }
  }, [admin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Navigation will happen via the useEffect above
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none bg-[hsl(var(--background))]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--primary))]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--primary))]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--accent))]/5 rounded-full blur-3xl" />
      </div>

      {/* Main card */}
      <div className="w-full max-w-lg relative z-10">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--muted))]/20 rounded-full blur-2xl" />

        <div className="bg-[hsl(var(--card))]/80 backdrop-blur-xl border border-[hsl(var(--border))]/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
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
              Nextera<span className="text-[hsl(var(--primary))]">AI</span>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">
              Secure authentication portal
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Enterprise Security</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-center gap-2">
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <div className={`relative transition-all duration-300 ${isFocused === 'email' ? 'scale-[1.02]' : ''}`}>
              <label htmlFor="email" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 transition-colors duration-300 ${isFocused === 'email' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  className="w-full pl-10 pr-4 py-3 bg-[hsl(var(--background))]/50 border border-[hsl(var(--input))] rounded-xl text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-[hsl(var(--primary))] transition-all duration-300"
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className={`relative transition-all duration-300 ${isFocused === 'password' ? 'scale-[1.02]' : ''}`}>
              <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors duration-300 ${isFocused === 'password' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  className="w-full pl-10 pr-12 py-3 bg-[hsl(var(--background))]/50 border border-[hsl(var(--input))] rounded-xl text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-[hsl(var(--primary))] transition-all duration-300"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[hsl(var(--primary))]/25 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[hsl(var(--border))] text-center">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Protected by enterprise-grade encryption. All access is monitored.
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            NexteraAI Security Dashboard
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
