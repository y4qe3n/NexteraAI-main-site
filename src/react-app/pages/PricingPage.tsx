import { useState } from "react";
import { Badge } from "@/react-app/components/ui/badge";
import { EnterpriseEstimator } from "@/react-app/components/EnterpriseEstimator";
import { ArrowRight } from "lucide-react";

// PayFast payment is handled server-side via /register flow
const PRICING_VERSION = "2026-05-31-v4"; // Forces new build hash

const PLANS = [
  {
    id:          "basic",
    name:        "Basic",
    monthlyZar:  2999,
    annualZar:   32388,   // Exact value from Payfast form
    devices:     "Up to 10 devices",
    overageNote: "R350/device/mo over limit",
    badge:       null,
    ctaLabel:    "Subscribe",
    ctaHref:     "/register?plan=basic",
    features: [
      "Silent Windows desktop agent",
      "Real-time threat detection (heuristics)",
      "Live dashboard",
      "POPIA compliance toolkit",
      "Encrypted backup vault (R2)",
      "Email support (business hours)",
      "Up to 10 devices",
    ],
    accent: "from-slate-900 via-slate-800 to-slate-900",
  },
  {
    id:          "pro",
    name:        "Pro",
    monthlyZar:  3999,
    annualZar:   43188,   // Exact value from Payfast form
    devices:     "Up to 25 devices",
    overageNote: "R200/device/mo over limit",
    badge:       "Most popular",
    ctaLabel:    "Subscribe",
    ctaHref:     "/register?plan=pro",
    features: [
      "Everything in Basic",
      "WhatsApp alert notifications",
      "2-hour P1 incident response",
      "Monthly availability report",
      "Up to 25 devices",
    ],
    accent: "from-indigo-900 via-primary/80 to-slate-900",
  },
  {
    id:          "max",
    name:        "Max",
    monthlyZar:  5999,
    annualZar:   61188,   // Exact value from Payfast form
    devices:     "Up to 50 devices",
    overageNote: null,
    badge:       null,
    ctaLabel:    "Subscribe",
    ctaHref:     "/register?plan=max",
    features: [
      "Everything in Pro",
      "Up to 50 devices",
      "Advanced support",
      "Compliance features",
      "Dashboard alerts",
      "Priority handling",
      "ONNX ML detection (Q4 2026)",
    ],
    accent: "from-emerald-900 via-emerald-800 to-slate-900",
  },
  {
    id:          "enterprise_custom",
    name:        "Enterprise Custom",
    monthlyZar:  null,     // no fixed price
    annualZar:   null,
    devices:     "50+ devices",
    overageNote: null,
    badge:       "Tailored",
    ctaLabel:    "Contact us",
    ctaHref:     "#enterprise-estimator",   // scrolls to estimator section
    features: [
      "Everything in Max",
      "Custom device count & pricing",
      "Dedicated support SLA",
      "Custom data-residency config",
      "On-site onboarding (Gauteng)",
      "Volume discounts from 50 devices",
      "Custom MSA terms",
    ],
    accent: "from-purple-900 via-purple-800 to-slate-900",
  },
] as const;

type BillingPeriod = "monthly" | "annual";

function formatCurrency(value: number) {
  return `R${value.toLocaleString("en-ZA")}`;
}

export function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  const computedPlans = PLANS.map((plan) => ({
    ...plan,
    badge: plan.badge,
    displayPrice: plan.monthlyZar !== null
      ? (billingPeriod === "monthly" ? plan.monthlyZar : Math.round(plan.annualZar! / 12))
      : null,
    periodLabel: billingPeriod === "monthly" ? "/month" : "/year",
  }));

  return (
    <div className="min-h-screen bg-background text-white px-4 sm:px-6 lg:px-10 py-12" data-pricing-version={PRICING_VERSION}>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-primary">Choose your protection</p>
          <h1 className="text-4xl sm:text-5xl font-bold">Plans built for South African businesses</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            All plans include POPIA compliance tools, real-time detections, and human-level support. Pick the cadence that fits your budget and we'll guide you through the rest of the onboarding flow.
          </p>
          <div className="mt-4 mx-auto max-w-2xl rounded-xl border border-primary/30 bg-primary/5 px-5 py-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Controlled beta subscriptions include manual onboarding and direct support. Month-to-month access is available while selected operational features are refined.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <button className={`px-4 py-2 rounded-full ${billingPeriod === "monthly" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`} onClick={() => setBillingPeriod("monthly")}>Monthly</button>
            <button className={`px-4 py-2 rounded-full ${billingPeriod === "annual" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`} onClick={() => setBillingPeriod("annual")}>Annual <span className="ml-1 text-xs opacity-80">(save 10%)</span></button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {computedPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 relative h-full flex flex-col justify-between space-y-4 bg-gradient-to-b ${plan.badge ? plan.accent : plan.id === "max" ? "from-emerald-900 via-emerald-800 to-slate-900" : plan.accent} border ${plan.badge ? "border-primary/30" : plan.id === "max" ? "border-emerald-500/30" : "border-border/30"} shadow-2xl transition-all duration-500 hover:shadow-2xl hover:scale-105 rounded-lg`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  {plan.badge && <Badge className="text-xs uppercase tracking-[0.3em] bg-primary/80 border-white/40">{plan.badge}</Badge>}
                </div>
                <div>
                  {plan.displayPrice !== null ? (
                    <>
                      <p className="text-4xl font-bold leading-tight">
                        {formatCurrency(plan.displayPrice)}
                        <span className="text-base text-muted-foreground">{plan.periodLabel}</span>
                      </p>
                      {billingPeriod === "annual" && plan.monthlyZar !== null && (
                        <p className="text-xs text-emerald-400 mt-1">
                          Save {formatCurrency(plan.monthlyZar * 12 - plan.annualZar!)} / year
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-white">Custom pricing</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on your requirements
                      </p>
                    </>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.id === "basic" ? "Essential protection for small teams" :
                     plan.id === "pro" ? "Complete security + V2 financial protection suite" :
                     plan.id === "max" ? "Full protection + V3 advanced financial crime detection" :
                     "Tailored solution for 50+ device deployments"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.devices} {plan.overageNote && `· ${plan.overageNote}`}
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
                {plan.id === "enterprise_custom" ? (
                  <button
                    className="nx-enterprise-btn"
                    onClick={() => {
                      document.getElementById("enterprise-estimator")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {plan.ctaLabel}
                    <ArrowRight className="w-4 h-4" data-icon-end />
                  </button>
                ) : (
                  <a
                    href={`/register?plan=${plan.id}&billing=${billingPeriod}`}
                    className={`nx-subscribe-btn ${plan.id === "pro" || plan.id === "max" ? "nx-subscribe-btn-featured" : ""}`}
                    data-testid={`pricing-${plan.id}-cta`}
                  >
                    {plan.ctaLabel}
                    <ArrowRight className="w-4 h-4" data-icon-end />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Estimator */}
        <section className="mt-24 px-4 sm:px-6" id="enterprise-estimator">
          <EnterpriseEstimator />
        </section>

        <div className="relative mt-8">
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-b from-indigo-900/80 via-primary/70 to-card/80 blur-3xl opacity-60" />
          <div className="relative z-10 p-6 bg-card/70 border border-primary/60 shadow-[0_25px_60px_-30px_rgba(59,130,246,0.85)] text-sm text-white rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Important notice</p>
                <p className="mt-1 text-sm text-white/80">
                  The one-time setup fee is charged separately during onboarding and is <strong>not</strong> included in the monthly or annual subscription amounts shown above. Overage charges are billed monthly based on peak device count.
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
