import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/react-app/lib/AuthContext";
import SignUp from "@/react-app/components/ui/signup-page";
import { Card } from "@/react-app/components/ui/card";
import { Shield } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
  const { admin, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const plan = searchParams.get("plan");
  const [verifying, setVerifying] = useState(true);
  const [paymentValid, setPaymentValid] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [payFastData, setPayFastData] = useState<{ url: string; formData: Record<string, string> } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!loading && admin) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, admin, navigate]);

  // Auto-redirect to PayFast when plan is present but no payment_id
  useEffect(() => {
    const createPayment = async () => {
      // If we have a payment_id, verify it (normal flow)
      if (paymentId) {
        return;
      }

      // If no plan specified, show error
      if (!plan) {
        setPaymentMessage("Please select a plan from the pricing page.");
        setVerifying(false);
        return;
      }

      // Create payment and redirect to PayFast
      setCreatingPayment(true);
      try {
        const res = await fetch("/api/payfast/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            plan: plan, 
            billing_period: "monthly" // Default to monthly, can be made configurable
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setPaymentMessage(data?.error || "Failed to create payment. Please try again.");
          setVerifying(false);
          setCreatingPayment(false);
          return;
        }

        const data = await res.json();
        if (data.redirectUrl && data.formData) {
          setPayFastData({ url: data.redirectUrl, formData: data.formData });
          // Form will auto-submit via useEffect below
        } else {
          setPaymentMessage("Invalid payment response. Please try again.");
          setVerifying(false);
        }
      } catch (err) {
        setPaymentMessage("Failed to create payment. Please try again.");
        setVerifying(false);
      } finally {
        setCreatingPayment(false);
      }
    };

    if (!paymentId && plan) {
      createPayment();
    }
  }, [paymentId, plan]);

  // Auto-submit PayFast form when data is ready
  useEffect(() => {
    if (payFastData && formRef.current) {
      formRef.current.submit();
    }
  }, [payFastData]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        // If no paymentId but we have a plan, we're creating the payment above
        // Don't show error yet, let the payment creation flow handle it
        if (!plan) {
          setPaymentMessage("Payment is required before creating an account.");
          setVerifying(false);
        }
        return;
      }

      // Skip verification for demo payments and go directly to signup
      if (paymentId.startsWith('demo-')) {
        setPaymentValid(true);
        setPaymentMessage("Demo payment - no verification required");
        setVerifying(false);
        setShowSignup(true);
        return;
      }

      try {
        const res = await fetch(`/api/payments/verify?payment_id=${paymentId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setPaymentMessage(data?.message || "Unable to verify payment. Please try again.");
          return;
        }

        const data = await res.json();
        setPaymentValid(data.valid);
        setPaymentMessage(data.message || "");
      } catch (err) {
        setPaymentMessage("Unable to verify payment. Please try again.");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [paymentId]);

  const handleSignupSuccess = () => {
    navigate("/business-setup", { replace: true });
  };

  // Show loading while creating payment and preparing PayFast redirect
  if (creatingPayment || payFastData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <h2 className="text-xl font-bold text-white">Preparing Payment...</h2>
          <p className="text-muted-foreground">
            We're setting up your secure payment with PayFast. You will be redirected shortly.
          </p>
          <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-left">
            <p className="text-xs text-muted-foreground leading-relaxed">
              You're joining the NexteraAI Controlled Beta. The platform is live and monitored, and our team will assist with setup. Some operational features may still be refined during the beta period.
            </p>
          </div>
          {/* Hidden form that auto-submits to PayFast */}
          {payFastData && (
            <form ref={formRef} action={payFastData.url} method="POST" className="hidden">
              {Object.entries(payFastData.formData).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
            </form>
          )}
        </Card>
      </div>
    );
  }

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!paymentValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Payment Required</h2>
          <p className="text-muted-foreground">
            {paymentMessage || "We could not confirm your payment. Please complete the checkout before registering."}
          </p>
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-left">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By continuing, you understand this is a paid controlled beta subscription with manual onboarding. You may cancel before your next billing cycle.
            </p>
          </div>
          <div className="space-y-3">
            <Button className="w-full text-white" onClick={() => navigate(`/pricing`)}>
              Return to Checkout
            </Button>
            <Button variant="outline" className="w-full text-white" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!showSignup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Payment Verified!</h2>
          <p className="text-muted-foreground">
            Your payment has been successfully verified. You can now create your admin account.
          </p>
          <Button 
            className="w-full text-white" 
            onClick={() => setShowSignup(true)}
          >
            Continue to Create Account
          </Button>
        </Card>
      </div>
    );
  }

  return <SignUp onSuccess={handleSignupSuccess} />;
}
