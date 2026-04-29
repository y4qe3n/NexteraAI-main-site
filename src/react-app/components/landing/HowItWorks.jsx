import { useEffect, useRef } from "react";
import { gsap } from "@/react-app/lib/gsap-init";
import { UserPlus, DownloadCloud, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    n: "01",
    title: "Sign up in 2 minutes",
    desc: "Create your NexteraAI workspace, invite your team, and choose the plan that fits your business.",
  },
  {
    icon: DownloadCloud,
    n: "02",
    title: "Deploy the silent agent",
    desc: "One-click install on every device. The featherweight agent starts monitoring and protecting instantly — no friction, no tickets.",
  },
  {
    icon: ShieldCheck,
    n: "03",
    title: "Run. Protected. Compliant.",
    desc: "Your dashboard goes live. AI watches threats 24/7, backups run nightly, and your POPIA score stays green — automatically.",
  },
];

export default function HowItWorks() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hiw-head > *", {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
      });
      gsap.from(".hiw-step", {
        y: 40, opacity: 0, scale: 0.96, duration: 0.8, stagger: 0.15,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".hiw-grid", start: "top 85%" },
      });
      // Animate the connecting line
      gsap.fromTo(".hiw-line",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.4, ease: "power2.inOut",
          transformOrigin: "left center",
          scrollTrigger: { trigger: ".hiw-grid", start: "top 80%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} data-testid="howitworks-section" className="relative py-24 md:py-32 overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 nx-radial opacity-60" />
      <div className="absolute inset-0 nx-grid-bg [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />

      <div className="relative max-w-7xl mx-auto px-5">
        <div className="hiw-head text-center max-w-2xl mx-auto">
          <span className="nx-badge mx-auto">How it works</span>
          <h2 className="font-display mt-5 text-white text-4xl md:text-5xl font-semibold leading-[1.05]">
            Up and running in <span className="nx-gradient-text">three steps</span>.
          </h2>
          <p className="mt-5 text-[#A89CC8] text-base md:text-lg leading-relaxed">
            No IT team. No long onboarding. Most SMEs are fully protected and operational within a single afternoon.
          </p>
        </div>

        <div className="hiw-grid relative mt-16">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-px">
            <div className="hiw-line h-full w-full" style={{
              background: "linear-gradient(90deg, transparent 0%, #624CAB 20%, #9F86E8 50%, #624CAB 80%, transparent 100%)",
            }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8 relative">
            {STEPS.map((s, i) => (
              <div
                key={i}
                data-testid={`howitworks-step-${i}`}
                className="hiw-step relative nx-card p-7 md:p-8"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#624CAB] to-[#2d2250] shadow-[0_10px_30px_-8px_rgba(98,76,171,0.8)] relative z-10">
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="mt-5 font-display text-[56px] leading-none font-semibold text-transparent" style={{
                  WebkitTextStroke: "1px rgba(159,134,232,0.25)",
                }}>
                  {s.n}
                </p>
                <h3 className="mt-3 font-display text-white text-xl font-semibold">{s.title}</h3>
                <p className="mt-2.5 text-[#A89CC8] text-[14.5px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
