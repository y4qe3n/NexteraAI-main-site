import { useState } from "react";
import { Badge } from "@/react-app/components/ui/badge";
import { Loader2 } from "lucide-react";
import { MagneticButton } from "@/react-app/components/ui/magnetic-button";

// PayFast receiver ID
const PAYFAST_RECEIVER = "18721639";
const PAYFAST_ACTION = "https://payment.payfast.io/eng/process";

const plans = [
  {
    id: "basic",
    name: "Basic",
    monthly: 1000,
    annual: 10800,
    features: [
      "Up to 10 devices",
      "Endpoint Shield",
      "Email Guard",
      "Monthly reports",
      "Email support",
    ],
    accent: "from-slate-900 via-slate-800 to-slate-900",
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 2000,
    annual: 21600,
    features: [
      "Up to 25 devices",
      "All Basic features",
      "POPIA Compliance Hub",
      "Priority support",
      "Missed call SMS automation",
      "🚀 V2: Financial Risk Assessment Tools",
      "🚀 V2: Transaction Monitoring System",
      "🚀 V2: FICA Compliance Automation",
    ],
    accent: "from-indigo-900 via-primary/80 to-slate-900",
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 3000,
    annual: 32400,
    features: [
      "Unlimited devices",
      "Dedicated account manager",
      "Academy & training",
      "Custom integrations",
      "SLA-backed SLAs",
      "🚀 V3: Advanced Financial Crime Detection",
      "🚀 V3: AML/KYC Integration Suite",
      "🚀 V3: Regulatory Reporting Automation",
      "🚀 V3: Blockchain Transaction Analysis",
    ],
    accent: "from-emerald-900 via-emerald-800 to-slate-900",
  },
];

type BillingPeriod = "monthly" | "annual";

function formatCurrency(value: number) {
  return `R${value.toLocaleString("en-ZA")}`;
}

export function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const computedPlans = plans.map((plan) => ({
    ...plan,
    displayPrice: billingPeriod === "monthly" ? plan.monthly : plan.annual,
    periodLabel: billingPeriod === "monthly" ? "/month" : "/year",
  }));

  const handleGetStarted = async (planId: string) => {
    if (planId === "basic") {
      window.location.assign("/register?plan=basic");
      return;
    }

    setLoading(planId);
    
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        alert("Invalid plan selected.");
        setLoading(null);
        return;
      }

      const amount = billingPeriod === "monthly" ? plan.monthly : plan.annual;
      
      console.log("Creating PayFast payment:", { planId, billingPeriod, amount });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch("/api/payfast/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          plan: planId, 
          billing_period: billingPeriod,
          amount: amount 
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to initialize payment. Please try again.");
        setLoading(null);
        return;
      }

      const data = await res.json();
      
      const form = document.getElementById(`payfast-form-${planId}`) as HTMLFormElement;
      if (form) {
        const paymentIdInput = form.querySelector('input[name="custom_int1"]') as HTMLInputElement;
        if (paymentIdInput && data.paymentId) {
          paymentIdInput.value = String(data.paymentId);
        }
        form.submit();
      } else {
        alert("Payment form not found. Please try again.");
        setLoading(null);
      }
      
    } catch (error: any) {
      console.error("Payment creation error:", error);
      if (error.name === 'AbortError') {
        alert("Payment request timed out. Please check your connection and try again.");
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
      setLoading(null);
    }
  };

  const handleBypassPayment = (planId: string) => {
    setLoading(planId);

    // Simulate payment success and redirect to PaymentSuccess page (same flow as real payments)
    setTimeout(() => {
      setLoading(null);
      // Store selected plan in sessionStorage for post-registration handling
      sessionStorage.setItem('selectedPlan', planId);
      sessionStorage.setItem('billingPeriod', billingPeriod);
      sessionStorage.setItem('bypassPayment', 'true');

      // Generate a demo payment ID
      const demoPaymentId = 'demo-' + crypto.randomUUID();

      // Redirect to PaymentSuccess page with demo payment ID (same flow as regular payment)
      window.location.assign("/payment/success?payment_id=" + demoPaymentId);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-white px-4 sm:px-6 lg:px-10 py-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-primary">Choose your protection</p>
          <h1 className="text-4xl sm:text-5xl font-bold">Plans built for South African businesses</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            All plans include POPIA compliance tools, AI-powered detections, and human-level support. Pick the cadence that fits your budget and we'll guide you through the rest of the onboarding flow.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <button className={`px-4 py-2 rounded-full ${billingPeriod === "monthly" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`} onClick={() => setBillingPeriod("monthly")}>Monthly</button>
            <button className={`px-4 py-2 rounded-full ${billingPeriod === "annual" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`} onClick={() => setBillingPeriod("annual")}>Annual (10% off)</button>
          </div>
        </div>

        {/* Hidden PayFast forms */}
        {plans.filter(p => p.id !== "basic").map((plan) => {
          const amount = billingPeriod === "monthly" ? plan.monthly : plan.annual;
          const frequency = billingPeriod === "monthly" ? "3" : "6";
          const itemName = `${plan.name} ${billingPeriod}`;
          
          return (
            <form
              key={plan.id}
              id={`payfast-form-${plan.id}`}
              name="PayFastPayNowForm"
              action={PAYFAST_ACTION}
              method="post"
              className="hidden"
            >
              <input type="hidden" name="cmd" value="_paynow" />
              <input type="hidden" name="receiver" value={PAYFAST_RECEIVER} />
              <input type="hidden" name="amount" value={amount} />
              <input type="hidden" name="item_name" value={itemName} />
              <input type="hidden" name="subscription_type" value="1" />
              <input type="hidden" name="recurring_amount" value={amount} />
              <input type="hidden" name="cycles" value="0" />
              <input type="hidden" name="frequency" value={frequency} />
              <input type="hidden" name="custom_int1" value="" />
            </form>
          );
        })}

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {computedPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 relative h-full flex flex-col justify-between space-y-4 bg-gradient-to-b ${plan.recommended ? plan.accent : plan.id === "enterprise" ? "from-emerald-900 via-emerald-800 to-slate-900" : plan.accent} border ${plan.recommended ? "border-primary/30" : plan.id === "enterprise" ? "border-emerald-500/30" : "border-border/30"} shadow-2xl transition-all duration-500 hover:shadow-2xl hover:scale-105 rounded-lg`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  {plan.recommended && <Badge className="text-xs uppercase tracking-[0.3em] bg-primary/80 border-white/40">Recommended</Badge>}
                  {plan.id === "enterprise" && <Badge className="text-xs uppercase tracking-[0.3em] bg-emerald-500/80 border-white/40">Best Value</Badge>}
                </div>
                <div>
                  <p className="text-4xl font-bold leading-tight">
                    {formatCurrency(plan.displayPrice)}
                    <span className="text-base text-muted-foreground">{plan.periodLabel}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.id === "basic" ? "Essential protection for small teams" : 
                     plan.id === "pro" ? "Complete security + V2 financial protection suite" : 
                     "Full protection + V3 advanced financial crime detection"}
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mt-4">
                  {plan.features.map((feature) => (
                    <li 
                      key={feature} 
                      className={`flex items-start gap-2 ${
                        feature.includes('🚀') 
                          ? 'text-emerald-300 font-medium bg-emerald-500/10 p-2 rounded-md border border-emerald-500/20' 
                          : ''
                      }`}
                    >
                      <span className="text-primary">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <MagneticButton>
                  <button
                    className={`w-full text-white transition-all ${
                      plan.id === "enterprise"
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
                        : "bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-400"
                    } px-6 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl`}
                    onClick={() => handleGetStarted(plan.id)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : null}
                    Get Started
                  </button>
                </MagneticButton>
                <button
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors underline"
                  onClick={() => handleBypassPayment(plan.id)}
                  disabled={loading === plan.id}
                >
                  Bypass payment (Demo)
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-8">
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-b from-indigo-900/80 via-primary/70 to-card/80 blur-3xl opacity-60" />
          <div className="relative z-10 p-6 bg-card/70 border border-primary/60 shadow-[0_25px_60px_-30px_rgba(59,130,246,0.85)] text-sm text-white rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Important notice</p>
                <p className="mt-1 text-sm text-white/80">
                  The one-time setup fee is charged separately during onboarding and is <strong>not</strong> included in the monthly or annual subscription amounts shown above.
                </p>
              </div>
              <Badge className="bg-white text-primary text-[0.55rem] uppercase tracking-[0.4em]">Setup fee separate</Badge>
            </div>
            <p className="mt-3 text-xs text-white/60">
              This fee is collected during the onboarding session once payment is confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
