import { useEffect, useState } from "react";
import { useAuth } from "@getmocha/users-service/react";
import { Logo } from "@/react-app/components/Logo";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Shield, Loader2 } from "lucide-react";

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const OTP_EXPIRY_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 60;

export function Login() {
  const { user, isPending, redirectToLogin, fetchUser } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [payfastLoading, setPayfastLoading] = useState(false);
  const [plan, setPlan] = useState<"basic" | "pro">("basic");

  useEffect(() => {
    if (user) {
      localStorage.clear();
      sessionStorage.clear();
      const target = "/dashboard";
      window.location.assign(`${target}?fresh=${Date.now()}`);
    }
  }, [user]);

  // Resend cooldown tick
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        setError("");
        setPayfastLoading(true);
        try {
          const res = await fetch("/api/payfast/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name, plan }),
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.error || "Failed to start payment");
            return;
          }
          if (data.url) {
            window.location.href = data.url;
          }
          return;
        } catch (err) {
          setError("Unable to start PayFast checkout. Try again.");
        } finally {
          setPayfastLoading(false);
        }
      }
      const res = await fetch("/api/auth/email-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      if (data.requireOtp && data.otpToken) {
        setOtpToken(data.otpToken);
        setOtpExpiresAt(Date.now() + (data.expiresIn || OTP_EXPIRY_SECONDS) * 1000);
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        setStep("otp");
        setError("");
        if (data.message) setError(data.message);
      } else {
        await fetchUser();
        setError("");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/email-login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpToken, code: otpCode }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid code.");
        return;
      }
      await fetchUser();
      setError("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/email-login/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpToken }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not resend code.");
        return;
      }
      setOtpExpiresAt(Date.now() + (data.expiresIn || OTP_EXPIRY_SECONDS) * 1000);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setError(data.message || "New code sent.");
    } catch (err) {
      setError("Could not resend. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const otpSecondsLeft = step === "otp" ? Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000)) : 0;
  const canResend = resendCooldown <= 0 && otpSecondsLeft < OTP_EXPIRY_SECONDS - 30;
  const otpExpired = otpSecondsLeft <= 0;

  const handleOAuthLogin = async (provider: string) => {
    const res = await fetch(`/api/oauth/${provider}/redirect_url`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || `Sign in with ${provider} is coming soon.`);
      return;
    }
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md p-8 relative">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {step === "otp" ? "Check your email" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {step === "otp"
              ? "Enter the 7-digit code we sent to your email"
              : "Sign in to access your security dashboard"}
          </p>
        </div>

        {step === "otp" ? (
          /* OTP entry step */
          <form onSubmit={handleVerifyOtp} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={7}
                placeholder="0000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 7))}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                autoComplete="one-time-code"
                disabled={otpExpired}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {otpExpired
                  ? "Code expired"
                  : `Valid for ${Math.floor(otpSecondsLeft / 60)}:${String(otpSecondsLeft % 60).padStart(2, "0")}`}
              </span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading}
                className="text-primary hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
              </button>
            </div>
            {error && (
              <p className={`text-sm ${error.includes("sent") ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                {error}
              </p>
            )}
            <Button type="submit" className="w-full text-white" size="lg" disabled={loading || otpCode.length !== 7 || otpExpired}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify and sign in"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setOtpToken("");
                setOtpCode("");
                setError("");
              }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to sign in
            </button>
          </form>
        ) : (
        /* Email & Password Form */
        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === "register"}
                autoComplete="name"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.co.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "register" ? 8 : undefined}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full text-white" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : mode === "login" ? (
              "Sign In with Email"
            ) : (
              "Create Account"
            )}
          </Button>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </form>
        )}

        {step === "credentials" && (
        <>
        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <Button
            onClick={redirectToLogin}
            variant="outline"
            className="w-full text-white"
            size="lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            onClick={() => handleOAuthLogin("apple")}
            variant="outline"
            className="w-full text-white"
            size="lg"
          >
            <AppleLogo className="w-5 h-5 mr-2" />
            Continue with Apple
          </Button>

          <Button
            onClick={() => handleOAuthLogin("facebook")}
            variant="outline"
            className="w-full text-white"
            size="lg"
          >
            <FacebookLogo className="w-5 h-5 mr-2" />
            Continue with Facebook
          </Button>

          <Button
            onClick={() => handleOAuthLogin("linkedin")}
            variant="outline"
            className="w-full text-white"
            size="lg"
          >
            <LinkedInLogo className="w-5 h-5 mr-2" />
            Continue with LinkedIn
          </Button>
        </div>
        </>
        )}

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <span>Your data is protected with enterprise-grade security</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
