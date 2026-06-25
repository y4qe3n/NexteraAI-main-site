import { useEffect, useRef, useState } from "react";
import { gsap } from "@/react-app/lib/gsap-init";
import { Check, Sparkles, ArrowRight, Building2, Mail, Calculator } from "lucide-react";
import { Toggle, GooeyFilter } from "@/react-app/components/ui/gooey-toggle";
import { EnterpriseEstimator } from "@/react-app/components/EnterpriseEstimator";

// Helper to format price from raw number
const formatPrice = (n) => "R" + n.toLocaleString("en-ZA");

const TIERS = [
  {
    name: "Basic",
    monthlyPrice: "R2,999",
    annualPrice: "R2,699",
    monthlyPriceRaw: 2999,
    annualPriceRaw: 32388,
    tagline: "Essential protection for small teams",
    cta: "Start with Basic",
    testid: "pricing-basic",
    features: [
      "Up to 10 devices",
      "Silent Windows agent",
      "Real-time threat detection",
      "POPIA compliance toolkit",
      "Business-hours support",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: "R3,999",
    annualPrice: "R3,599",
    monthlyPriceRaw: 3999,
    annualPriceRaw: 43188,
    tagline: "Most popular for growing SMEs",
    cta: "Get Pro",
    popular: true,
    testid: "pricing-pro",
    features: [
      "Up to 25 devices",
      "Unlimited users",
      "Instant alerts & API access",
      "Forensic event timeline",
      "Priority 24/7 support",
    ],
  },
  {
    name: "Max",
    monthlyPrice: "R5,999",
    annualPrice: "R5,099",
    monthlyPriceRaw: 5999,
    annualPriceRaw: 61188,
    tagline: "Up to 50 devices & compliance",
    cta: "Get Max",
    max: true,
    testid: "pricing-max",
    features: [
      "Up to 50 devices",
      "Dedicated CS analyst",
      "Custom compliance reports",
      "Advanced threat hunting",
      "SLA-backed response times",
    ],
  },
];

const CUSTOM_TIER = {
  name: "Enterprise Custom",
  headline: "Need 51+ devices?",
  description: "Custom pricing with volume discounts, bespoke security policies, and a named account manager.",
  cta: "Get custom quote",
  testid: "pricing-custom",
  email: "sales@nexteraai.co.za",
};

export default function Pricing() {
  const rootRef = useRef(null);
  const [showEstimator, setShowEstimator] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const customCardRef = useRef(null);
  const estimatorRef = useRef(null);

  const handleEstimateClick = (e) => {
    e.preventDefault();
    
    // Animate card sliding left and fading out
    if (customCardRef.current) {
      gsap.to(customCardRef.current, {
        x: -1200,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => setShowEstimator(true)
      });
    } else {
      setShowEstimator(true);
    }
  };

  const handleCloseEstimator = () => {
    // Animate estimator sliding right and fading out
    if (estimatorRef.current) {
      gsap.to(estimatorRef.current, {
        x: 800,
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          setShowEstimator(false);
          // Reset custom card position and animate it back in
          if (customCardRef.current) {
            gsap.set(customCardRef.current, { x: -1200, opacity: 0, scale: 0.9 });
            gsap.to(customCardRef.current, {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power3.out"
            });
          }
        }
      });
    } else {
      setShowEstimator(false);
    }
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Mobile
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".pricing-head > *", {
          y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 95%" },
        });
        gsap.from(".pricing-card", {
          y: 15, duration: 0.5, stagger: 0.1, ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: ".pricing-grid", start: "top 95%", toggleActions: "play none none none" },
        });
        gsap.from(".pricing-banner", {
          y: 20, opacity: 0, duration: 0.6, delay: 0.3,
          scrollTrigger: { trigger: ".pricing-banner", start: "top 95%" },
        });
      });

      // Desktop
      mm.add("(min-width: 1024px)", () => {
        gsap.from(".pricing-head > *", {
          y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 95%" },
        });
        gsap.from(".pricing-card-pro", {
          y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".pricing-grid", start: "top 95%" },
        });
        gsap.from(".pricing-card-standard", {
          y: 24, opacity: 0, duration: 0.7, stagger: 0.15, ease: "power3.out", delay: 0.2,
          scrollTrigger: { trigger: ".pricing-grid", start: "top 95%" },
        });
        gsap.from(".pricing-banner", {
          y: 20, opacity: 0, duration: 0.6, delay: 0.5,
          scrollTrigger: { trigger: ".pricing-banner", start: "top 95%" },
        });
      });

      return () => mm.revert();
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Animate estimator when it appears
  useEffect(() => {
    if (showEstimator && estimatorRef.current) {
      gsap.fromTo(estimatorRef.current,
        { x: 800, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }
      );
    }
  }, [showEstimator]);

  return (
    <section id="pricing" ref={rootRef} data-testid="pricing-section" className="relative nx-section">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_0%,rgba(98,76,171,0.18),transparent_60%)]" />

      <div className="relative nx-container">
        <div className="pricing-head text-center max-w-3xl mx-auto">
          <span className="nx-badge mx-auto">Pricing</span>
          <h2 className="font-display mt-5 text-white text-4xl md:text-5xl font-semibold leading-[1.05]">
            One platform. <span className="nx-gradient-text">Transparent pricing.</span>
          </h2>
          <p className="mt-5 text-[#A89CC8] text-base md:text-lg leading-relaxed">
            All plans include our security engine, POPIA toolkit and silent desktop agent.
            Upgrade anytime — cancel anytime.
          </p>
          <div className="mt-4 mx-auto max-w-2xl rounded-xl border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.06)] px-5 py-3">
            <p className="text-sm text-[#D6CAF0] leading-relaxed">
              Controlled beta subscriptions include manual onboarding and direct support. Month-to-month access is available while selected operational features are refined.
            </p>
          </div>
          
          {/* Billing Toggle */}
          <div className="mt-6 inline-flex items-center gap-3">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-white" : "text-[#A89CC8]"}`}>Monthly</span>
            <Toggle checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-white" : "text-[#A89CC8]"}`}>
              Annual
              <span className="ml-1.5 text-xs text-green-400">-15%</span>
            </span>
          </div>
          <GooeyFilter />
          {isAnnual && (
            <p className="mt-2 text-xs text-green-400">Save up to 15% with annual billing</p>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="pricing-grid mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div
              key={t.name}
              data-testid={t.testid}
              className={`pricing-card relative rounded-2xl p-6 md:p-8 border transition-all ${
                t.popular
                  ? "pricing-popular bg-gradient-to-b from-[#1a1430] to-[#0d0b14] border-[rgba(159,134,232,0.5)] shadow-[0_0_60px_-15px_rgba(159,134,232,0.3)] z-10"
                  : t.max
                    ? "bg-gradient-to-b from-[#2a2048] via-[#1a1430] to-[#0d0b14] border-[rgba(180,140,255,0.6)] shadow-[0_0_50px_-10px_rgba(180,140,255,0.4)] z-10"
                    : "bg-[#141218] border-[rgba(224,212,255,0.08)] hover:border-[rgba(224,212,255,0.15)]"
              }`}
            >
              {t.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="nx-badge !bg-[#624CAB] !border-[#7A5FD1] !text-white text-sm px-4 py-1.5">
                    <Sparkles className="w-4 h-4 mr-1.5" /> Most Popular
                  </div>
                </div>
              )}
              {t.max && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="nx-badge !bg-[#8B5CF6] !border-[#A78BFA] !text-white text-sm px-4 py-1.5">
                    <Sparkles className="w-4 h-4 mr-1.5" /> Power User
                  </div>
                </div>
              )}

              <div className={t.popular ? "pt-2" : ""}>
                <h3 className={`font-display text-white font-semibold ${t.popular ? "text-2xl" : "text-xl"}`}>{t.name}</h3>
                <p className={`mt-2 text-[#A89CC8] ${t.popular ? "text-[14px] leading-relaxed" : "text-[13px] leading-snug"}`}>{t.tagline}</p>

                <div className={`mt-4 flex items-baseline gap-1.5 ${t.popular ? "mt-6 gap-2" : ""}`}>
                  <span className={`font-display font-semibold text-white ${t.popular ? "text-5xl" : "text-4xl"}`}>
                    {isAnnual ? t.annualPrice : t.monthlyPrice}
                  </span>
                  <span className="text-[#A89CC8] text-sm">/mo</span>
                </div>
                <p className="mt-1 text-[11px] text-[#8778AD] uppercase tracking-wider">
                  {isAnnual ? `Billed annually (${formatPrice(t.annualPriceRaw)}/yr) • Excl. VAT` : 'Excl. VAT'}
                </p>

                <a
                  href={`/register?plan=${t.name.toLowerCase()}&billing=${isAnnual ? "annual" : "monthly"}`}
                  className={`nx-subscribe-btn ${t.popular || t.max ? "nx-subscribe-btn-featured" : ""} mt-4 ${t.popular ? "mt-6" : ""}`}
                  data-testid={`${t.testid}-cta`}
                >
                  {t.cta}
                  <ArrowRight className="w-4 h-4" data-icon-end />
                </a>

                <div className={`mt-5 h-px bg-[rgba(224,212,255,0.08)] ${t.popular ? "mt-8 bg-[rgba(224,212,255,0.1)]" : ""}`} />

                <ul className={`mt-5 space-y-2.5 ${t.popular ? "mt-6 space-y-3" : ""}`}>
                  {t.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-2.5 ${t.popular ? "gap-3 text-[14px]" : "text-[13px]"} text-[#D6CAF0]`}>
                      <Check className={`mt-0.5 text-[#9F86E8] shrink-0 ${t.popular ? "w-5 h-5" : "w-4 h-4"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Custom - Premium Card */}
        <div
          ref={customCardRef}
          data-testid={CUSTOM_TIER.testid}
          className="pricing-banner mt-8 relative rounded-2xl overflow-hidden border border-[rgba(139,92,246,0.4)] bg-[#0f0d1a]"
          style={{ 
            opacity: showEstimator ? 0 : 1,
            visibility: showEstimator ? 'hidden' : 'visible',
            position: showEstimator ? 'absolute' : 'relative',
            pointerEvents: showEstimator ? 'none' : 'auto'
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(139,92,246,0.15)] via-transparent to-[rgba(124,58,237,0.1)]" />
          
          {/* Animated glow effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[rgba(139,92,246,0.15)] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative p-8 md:p-10">
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] mb-6">
              <Building2 className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-sm font-medium text-[#A78BFA]">Enterprise Solution</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left content */}
              <div>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                  {CUSTOM_TIER.headline}
                </h3>
                <p className="text-[15px] text-[#A89CC8] leading-relaxed mb-6">
                  {CUSTOM_TIER.description}
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-sm text-[#D6CAF0]">
                    Volume discounts
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-sm text-[#D6CAF0]">
                    Custom SLA
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-sm text-[#D6CAF0]">
                    Dedicated manager
                  </span>
                </div>
              </div>
              
              {/* Right CTA section */}
              <div className="flex flex-col gap-4">
                <a
                  href="/register?plan=enterprise_custom"
                  data-testid={`${CUSTOM_TIER.testid}-cta`}
                  className="nx-subscribe-btn nx-subscribe-btn-featured"
                >
                  {CUSTOM_TIER.cta}
                  <ArrowRight className="w-5 h-5" data-icon-end />
                </a>
                
                <button
                  onClick={handleEstimateClick}
                  data-testid={`${CUSTOM_TIER.testid}-estimate`}
                  className="nx-enterprise-btn"
                >
                  <Calculator className="w-4 h-4" />
                  Estimate your price
                </button>
                
                <a
                  href={`mailto:${CUSTOM_TIER.email}`}
                  data-testid={`${CUSTOM_TIER.testid}-email`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-2 text-sm font-medium text-[#A78BFA] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/70"
                >
                  <Mail className="w-4 h-4" />
                  Or email sales@nexteraai.co.za
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Estimator - Full Width */}
        {showEstimator && (
          <div
            ref={estimatorRef}
            id="enterprise-estimator"
            className="mt-8"
          >
            <EnterpriseEstimator onClose={handleCloseEstimator} />
          </div>
        )}

      </div>
    </section>
  );
}
