import { useEffect, useRef } from "react";
import { gsap } from "@/react-app/lib/gsap-init";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const TIERS = [
  {
    name: "Basic",
    price: "R1,000",
    tagline: "For small teams getting serious about security.",
    cta: "Start with Basic",
    testid: "pricing-basic",
    features: [
      "Operations Dashboard (up to 10 users)",
      "Silent Desktop Agent (10 devices)",
      "Email Guard — essential protection",
      "Daily encrypted backups",
      "Basic POPIA toolkit",
      "Business-hours support",
    ],
  },
  {
    name: "Pro",
    price: "R2,000",
    tagline: "Most popular for growing SMEs that want total peace of mind.",
    cta: "Get Pro",
    popular: true,
    testid: "pricing-pro",
    features: [
      "Everything in Basic",
      "Unlimited users & up to 50 devices",
      "Real-time AI Threat Detection",
      "Live Device Monitoring",
      "Full POPIA Compliance Toolkit",
      "Staff Cybersecurity Academy",
      "Priority 24/7 support",
    ],
  },
  {
    name: "Enterprise",
    price: "R3,000",
    tagline: "For established businesses that demand the highest assurance.",
    cta: "Talk to us",
    testid: "pricing-enterprise",
    features: [
      "Everything in Pro",
      "Unlimited devices",
      "Dedicated AI SOC analyst",
      "Custom compliance reports",
      "Advanced threat-hunting playbooks",
      "SLA-backed response times",
      "Dedicated success manager",
    ],
  },
];

export default function Pricing() {
  const rootRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Mobile: no stagger for single-column cards
      mm.add("(max-width: 767px)", () => {
        gsap.from(".pricing-head > *", {
          y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 95%" },
        });
        gsap.from(".pricing-card", {
          y: 15, duration: 0.5, stagger: 0, ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: ".pricing-grid", start: "top 95%", toggleActions: "play none none none" },
        });
      });

      // Desktop: full animations with stagger
      mm.add("(min-width: 768px)", () => {
        gsap.from(".pricing-head > *", {
          y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 95%" },
        });
        // Pricing cards render immediately (no initial hidden state) to guarantee visibility
        // regardless of ScrollTrigger / font-loading timing. Subtle lift only.
        gsap.from(".pricing-card", {
          y: 24, duration: 0.7, stagger: 0.1, ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: ".pricing-grid", start: "top 95%", toggleActions: "play none none none" },
        });
      });

      return () => mm.revert();
    }, rootRef);
    return () => ctx.revert();
  }, []);

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
            All plans include our AI security engine, POPIA toolkit and silent desktop agent.
            Upgrade anytime — cancel anytime.
          </p>
        </div>

        <div className="pricing-grid mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {TIERS.map((t) => (
            <div
              key={t.name}
              data-testid={t.testid}
              className={`pricing-card relative rounded-[22px] p-7 md:p-8 border transition-all ${
                t.popular
                  ? "pricing-popular bg-gradient-to-b from-[#1a1430] to-[#0d0b14] border-[rgba(159,134,232,0.5)] md:scale-[1.03] z-10"
                  : "bg-[#141218] border-[rgba(224,212,255,0.08)]"
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="nx-badge !bg-[#624CAB] !border-[#7A5FD1] !text-white">
                    <Sparkles className="w-3.5 h-3.5" /> Most Popular
                  </div>
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-white text-xl font-semibold">{t.name}</h3>
              </div>
              <p className="mt-2 text-[13px] text-[#A89CC8] leading-relaxed min-h-[42px]">{t.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-semibold text-white">{t.price}</span>
                <span className="text-[#A89CC8] text-[14px]">/ month</span>
              </div>
              <p className="mt-1 text-[11.5px] text-[#8778AD] uppercase tracking-wider">Excl. VAT — billed monthly in ZAR</p>

              <a
                href="#demo"
                data-testid={`${t.testid}-cta`}
                className={`mt-6 w-full inline-flex items-center justify-center gap-2 ${
                  t.popular ? "nx-btn-primary nx-shine" : "nx-btn-ghost"
                }`}
              >
                {t.cta}
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="mt-7 h-px bg-[rgba(224,212,255,0.08)]" />

              <ul className="mt-6 space-y-3">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs xs:text-[13px] md:text-[13.5px] text-[#D6CAF0]">
                    <Check className="w-4 h-4 mt-0.5 text-[#9F86E8] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-[13px] text-[#A89CC8]">
          Need a custom plan for 200+ devices?{" "}
          <a href="#demo" className="text-[#CDBEFF] underline underline-offset-4 hover:text-white">
            Contact our team
          </a>.
        </p>
      </div>
    </section>
  );
}
