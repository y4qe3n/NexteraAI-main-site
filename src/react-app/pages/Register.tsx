import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/react-app/lib/AuthContext";
import SignUp from "@/react-app/components/ui/signup-page";
import { Card } from "@/react-app/components/ui/card";
import { Shield } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router";

export function Register() {
  const navigate = useNavigate();
  const { admin, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [verifying, setVerifying] = useState(true);
  const [paymentValid, setPaymentValid] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (!loading && admin) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, admin, navigate]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        setPaymentMessage("Payment is required before creating an account.");
        setVerifying(false);
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
