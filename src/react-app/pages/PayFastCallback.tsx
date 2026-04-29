import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";

export function PayFastCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState<{ paymentId?: number; plan?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        setError("No payment ID found.");
        setVerifying(false);
        return;
      }

      try {
        const res = await fetch(`/api/payments/verify?payment_id=${paymentId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error || "Could not verify payment. Please try again.");
          setVerifying(false);
          return;
        }

        const data = await res.json();
        if (data.valid && data.status === "completed") {
          setPaymentData({ paymentId: Number(paymentId), plan: data.plan || "basic" });
          setVerifying(false);
          return;
        }

        if (data.status === "pending") {
          setError("Payment is still processing. Please wait a moment and refresh.");
        } else {
          setError("Payment verification failed. Please try again.");
        }
      } catch (err) {
        setError("Error verifying payment.");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [paymentId]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Payment Status</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button className="w-full text-white" onClick={() => navigate("/pricing")}>
            Return to Pricing
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md p-8 text-center relative space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your payment has been received. You can now create your account.
          </p>
        </div>

        <Button
          onClick={() => navigate(`/register?payment_id=${paymentData?.paymentId}&plan=${paymentData?.plan || "professional"}`)}
          className="w-full text-white"
          size="lg"
        >
          Continue to Sign Up
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <p className="text-xs text-muted-foreground">
          Payment ID: {paymentId}
        </p>
      </Card>
    </div>
  );
}
