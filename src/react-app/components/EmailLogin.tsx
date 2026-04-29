import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Loader2, ArrowLeft, Shield, Eye, EyeOff, Mail, Lock, ChevronRight } from "lucide-react";
import { Logo } from "@/react-app/components/Logo";

export function EmailLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/email-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.requireOtp) {
        setOtpToken(data.otpToken);
        setStep("otp");
      } else {
        // Login successful without OTP
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/email-login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpToken, code: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid code");
      }

      // OTP verification successful
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/email-login/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      setError("New code sent to your email");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

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

        <Card className="bg-[hsl(var(--card))]/80 backdrop-blur-xl border border-[hsl(var(--border))]/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--foreground))]/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

          {/* Header */}
          <div className="text-center mb-10 relative">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[hsl(var(--primary))]/20 blur-xl rounded-full animate-pulse" />
                <Logo onClick={() => navigate("/")} className="h-40 w-auto cursor-pointer" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2 tracking-tight">
              Nextera<span className="text-[hsl(var(--primary))]">AI</span>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">
              {step === "email" ? "Secure authentication portal" : "Enter verification code"}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Enterprise Security</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[hsl(var(--foreground))]">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3 bg-[hsl(var(--background))]/50 border border-[hsl(var(--input))] rounded-xl text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-[hsl(var(--primary))] transition-all duration-300"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[hsl(var(--foreground))]">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 bg-[hsl(var(--background))]/50 border border-[hsl(var(--input))] rounded-xl text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-[hsl(var(--primary))] transition-all duration-300"
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
              <Button type="submit" className="w-full py-3 px-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[hsl(var(--primary))]/25 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-[hsl(var(--foreground))]">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 7))}
                  placeholder="Enter 7-digit code"
                  maxLength={7}
                  className="w-full px-4 py-3 bg-[hsl(var(--background))]/50 border border-[hsl(var(--input))] rounded-xl text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-[hsl(var(--primary))] transition-all duration-300 text-center text-2xl tracking-widest"
                  required
                />
                <p className="text-xs text-[hsl(var(--muted-foreground))] text-center">
                  Enter the 7-digit code sent to your email
                </p>
              </div>
              <Button type="submit" className="w-full py-3 px-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[hsl(var(--primary))]/25 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80"
                >
                  {loading ? "Sending..." : "Resend Code"}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (step === "otp") {
                  setStep("email");
                  setError("");
                } else {
                  navigate("/register");
                }
              }}
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === "otp" ? "Back to Login" : "Sign Up"}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[hsl(var(--border))] text-center">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Protected by enterprise-grade encryption. All access is monitored.
            </p>
          </div>
        </Card>

        {/* Bottom text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Don't have an account? <span className="text-[hsl(var(--primary))]">Contact your administrator</span>
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
