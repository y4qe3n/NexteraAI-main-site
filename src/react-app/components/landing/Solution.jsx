import { useEffect, useRef } from "react";
import { gsap } from "@/react-app/lib/gsap-init";
import { CheckCircle2, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";

export default function Solution() {
  const rootRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Mobile: reduced motion, fade only
      mm.add("(max-width: 767px)", () => {
        gsap.from(".sol-left > *", {
          opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
        });
        gsap.from(".sol-right", {
          opacity: 0, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
        });
        gsap.from(".sol-bullet", {
          opacity: 0, duration: 0.4, stagger: 0.06, ease: "power2.out",
          scrollTrigger: { trigger: ".sol-bullets", start: "top 90%" },
        });
      });

      // Desktop: full animations with x movement
      mm.add("(min-width: 768px)", () => {
        gsap.from(".sol-left > *", {
          x: -40, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
        });
        gsap.from(".sol-right", {
          x: 40, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
        });
        gsap.from(".sol-bullet", {
          y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: ".sol-bullets", start: "top 90%" },
        });
      });

      return () => mm.revert();
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const bullets = [
    "Centralised ops, security & compliance in one platform",
    "Silent desktop agent that monitors every device 24/7",
    "POPIA readiness baked-in from day one",
    "Enterprise-grade protection at SME-friendly pricing",
  ];

  return (
    <section
      id="solution"
      ref={rootRef}
      data-testid="solution-section"
      className="relative nx-section overflow-hidden bg-[#0A0A0A]"
    >
      <div className="absolute inset-0 nx-radial opacity-80" />
      <div className="absolute inset-0 nx-grid-bg [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />

      <div className="relative nx-container grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-center">
        <div className="sol-left max-w-prose lg:max-w-none">
          <span className="nx-badge">The Solution</span>
          <h2 className="font-display mt-5 text-white text-4xl md:text-5xl font-semibold leading-[1.05]">
            Your All-in-One <span className="nx-gradient-text">Operations Center</span>
          </h2>
          <p className="mt-5 text-[#A89CC8] text-base md:text-lg max-w-xl leading-relaxed">
            NexteraAI replaces the chaos of five disconnected tools with one unified command
            center. Run operations, protect your business with AI cybersecurity, and stay POPIA-
            compliant — all from a single, elegant dashboard.
          </p>

          <ul className="sol-bullets mt-8 space-y-3.5">
            {bullets.map((b, i) => (
              <li key={i} className="sol-bullet flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-[#9F86E8] shrink-0" />
                <span className="text-[#D6CAF0] text-sm md:text-[15px] font-medium">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#features"
              data-testid="solution-cta-features"
              className="nx-btn-primary nx-shine"
            >
              Explore the platform
            </a>
            <a
              href="#pricing"
              data-testid="solution-cta-pricing"
              className="nx-btn-ghost"
            >
              View pricing
            </a>
          </div>
        </div>

        <div className="sol-right relative">
          <div className="relative rounded-[22px] p-6 md:p-8 nx-glass shadow-[0_30px_80px_-20px_rgba(98,76,171,0.35)]">
            <div className="grid grid-cols-2 gap-4">
              <Tile icon={LayoutDashboard} title="Operations" desc="Centralised dashboard for tasks, teams, and data." />
              <Tile icon={ShieldCheck} title="Security" desc="AI-driven protection across devices, email & cloud." />
              <Tile icon={Zap} title="Automation" desc="Workflows that run themselves so you can focus on growth." />
              <Tile icon={CheckCircle2} title="Compliance" desc="Always-on POPIA toolkit with audit-ready reports." />
            </div>

            <div className="mt-6 rounded-xl border border-[rgba(224,212,255,0.08)] bg-[#141218] p-5">
              <div className="flex items-center justify-between">
                <p className="text-[12px] uppercase tracking-wider text-[#A89CC8] font-semibold">Today's status</p>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> All systems healthy
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Mini label="Devices" val="48" />
                <Mini label="Backups" val="12" />
                <Mini label="Alerts" val="0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-xl p-5 bg-[#141218] border border-[rgba(224,212,255,0.08)] hover:border-[rgba(159,134,232,0.35)] hover:bg-[#1b1824] transition">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#624CAB] to-[#2d2250] text-white">
        <Icon className="w-5 h-5" />
      </div>
      <p className="mt-3 font-display text-white font-semibold">{title}</p>
      <p className="mt-1 text-[13px] text-[#A89CC8] leading-relaxed">{desc}</p>
    </div>
  );
}
function Mini({ label, val }) {
  return (
    <div className="rounded-lg bg-[#1b1824] border border-[rgba(224,212,255,0.06)] py-3">
      <p className="font-display text-xl font-semibold text-white">{val}</p>
      <p className="text-[11px] text-[#A89CC8] uppercase tracking-wider">{label}</p>
    </div>
  );
}
