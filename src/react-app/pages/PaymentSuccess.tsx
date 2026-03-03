import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        if (!paymentId) return;
        const res = await fetch(`/api/subscription`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setPlan(data.plan || "basic");
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md p-8 text-center relative">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          {plan
            ? `Your ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan is now active.`
            : "Your subscription has been activated."}
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full text-white"
            size="lg"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/settings")}
            className="w-full text-white"
          >
            View Subscription Details
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Payment ID: {paymentId || "N/A"}. A confirmation email will be sent shortly.
        </p>
      </Card>
    </div>
  );
}
