"use client";
import { Card, CardContent, CardHeader } from "@/react-app/components/ui/card";
import { cn } from "@/react-app/lib/utils";
import { Loader2 } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic",
    description:
      "Essential cybersecurity protection for small businesses and startups",
    price: 1000,
    yearlyPrice: 10800,
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    includes: [
      "Core security features:",
      "Endpoint Shield",
      "Email Guard",
      "Access Control",
      "POPIA Compliance Hub",
      "24/7 Monitoring",
      "WhatsApp Alerts",
      "Monthly Reports",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description:
      "Best value for growing businesses that need advanced threat protection",
    price: 2000,
    yearlyPrice: 21600,
    buttonText: "Get started",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Everything in Basic, plus:",
      "Threat Radar",
      "Data Vault",
      "Advanced Analytics",
      "Priority Support",
      "Custom Integrations",
      "Audit Trail",
      "Team Training",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "Advanced plan with enhanced security and unlimited access for large teams",
    price: 3000,
    yearlyPrice: 32400,
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    includes: [
      "Everything in Pro, plus:",
      "Multi-location Support",
      "Custom Security Policies",
      "Dedicated Account Manager",
      "SLA Guarantee",
      "White-label Options",
      "API Access",
      "Unlimited Users",
    ],
  },
];

const PricingSwitch = ({ onSwitch, selected }: { onSwitch: (value: string) => void; selected: string }) => {
  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1">
        <button
          onClick={() => onSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0" ? "text-white" : "text-gray-200",
          )}
        >
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => onSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1" ? "text-white" : "text-gray-200",
          )}
        >
          <span className="relative flex items-center gap-2">Yearly</span>
        </button>
      </div>
    </div>
  );
};

interface PricingSection4Props {
  isYearly: boolean;
  onYearlyChange: (value: string) => void;
  onGetStarted: (planId: string) => void;
  loading: string | null;
}

export default function PricingSection4({ isYearly, onYearlyChange, onGetStarted, loading }: PricingSection4Props) {
  const selected = isYearly ? "1" : "0";

  return (
    <div className="min-h-screen mx-auto relative bg-black overflow-x-hidden">
      <div className="text-center mb-6 pt-32 max-w-3xl mx-auto space-y-2 relative z-50">
        <h2 className="text-4xl font-medium text-white">
          Plans that work best for your
        </h2>

        <p className="text-gray-300">
          Comprehensive cybersecurity solutions tailored for South African businesses.
          Choose the protection level that fits your needs.
        </p>

        <PricingSwitch onSwitch={onYearlyChange} selected={selected} />
      </div>

      {/* Test to verify rendering */}
      <div className="text-center py-10">
        <p className="text-white text-xl">Test: Pricing section is rendering</p>
      </div>

      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #6366f1 0%, transparent 70%)`,
          opacity: 0.3,
          mixBlendMode: "multiply",
        }}
      />

      <div className="grid md:grid-cols-3 max-w-5xl gap-4 py-6 mx-auto relative z-10">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative text-white border-neutral-800 ${
              plan.popular
                ? "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 shadow-[0px_-13px_300px_0px_#6366f1] z-20"
                : "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 z-10"
            }`}
          >
            <CardHeader className="text-left">
              <div className="flex justify-between">
                <h3 className="text-3xl mb-2">{plan.name}</h3>
                {plan.popular && (
                  <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-semibold">
                  R{(isYearly ? plan.yearlyPrice : plan.price).toLocaleString()}
                </span>
                <span className="text-gray-300 ml-1">
                  /{isYearly ? "year" : "month"}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-4">{plan.description}</p>
            </CardHeader>

            <CardContent className="pt-0">
              <button
                onClick={() => onGetStarted(plan.id)}
                disabled={loading === plan.id}
                className={`w-full mb-6 p-4 text-xl rounded-xl flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "bg-gradient-to-t from-primary to-purple-500 shadow-lg shadow-primary/50 border border-primary text-white"
                    : plan.buttonVariant === "outline"
                      ? "bg-gradient-to-t from-neutral-950 to-neutral-600 shadow-lg shadow-neutral-900 border border-neutral-800 text-white"
                      : ""
                }`}
              >
                {loading === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                {plan.buttonText}
              </button>

              <div className="space-y-3 pt-4 border-t border-neutral-700">
                <h4 className="font-medium text-base mb-3">
                  {plan.includes[0]}
                </h4>
                <ul className="space-y-2">
                  {plan.includes.slice(1).map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2"
                    >
                      <span className="h-2.5 w-2.5 bg-primary rounded-full grid place-content-center"></span>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
