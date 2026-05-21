import { useEffect, useRef } from "react";
import { gsap } from "@/react-app/lib/gsap-init";
import { ShieldCheck, BrainCircuit, Scale, Radar, Lock } from "lucide-react";

const PILLARS = [
  { icon: BrainCircuit, title: "AI Cybersecurity", desc: "Autonomous agents detect, correlate, and respond to threats across email, endpoints and cloud — faster than any human SOC." },
  { icon: Scale, title: "POPIA Compliance", desc: "Continuous compliance monitoring with automated consent, data-subject, and breach-response workflows." },
  { icon: Radar, title: "Real-time Protection", desc: "Behavior-based detection, zero-trust policies, and instant quarantine on any suspicious signal — day or night." },
];

export default function Security() {
  const rootRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Mobile: reduced motion
      mm.add("(max-width: 767px)", () => {
        gsap.from(".sec-head > *", {
          y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
        });
        gsap.from(".sec-pillar", {
          y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: ".sec-grid", start: "top 85%" },
        });
        // Slower ring rotation on mobile
        gsap.to(".sec-ring", {
          rotate: 360, duration: 35, repeat: -1, ease: "none", transformOrigin: "50% 50%",
        });
        gsap.to(".sec-ring-2", {
          rotate: -360, duration: 50, repeat: -1, ease: "none", transformOrigin: "50% 50%",
        });
      });

      // Desktop: full animations
      mm.add("(min-width: 768px)", () => {
        gsap.from(".sec-head > *", {
          y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
        });
        gsap.from(".sec-pillar", {
          y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".sec-grid", start: "top 85%" },
        });
        gsap.to(".sec-ring", {
          rotate: 360, duration: 28, repeat: -1, ease: "none", transformOrigin: "50% 50%",
        });
        gsap.to(".sec-ring-2", {
          rotate: -360, duration: 40, repeat: -1, ease: "none", transformOrigin: "50% 50%",
        });
      });

      return () => mm.revert();
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="security" ref={rootRef} data-testid="security-section" className="relative nx-section overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_20%,rgba(98,76,171,0.2),transparent_60%)]" />

      <div className="relative nx-container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        {/* visual */}
        <div className="relative h-[280px] xs:h-[340px] md:h-[420px] lg:h-[520px] flex items-center justify-center">
          <div className="sec-ring absolute inset-6 xs:inset-8 md:inset-10 rounded-full border border-[rgba(159,134,232,0.18)]" />
          <div className="sec-ring absolute inset-14 xs:inset-18 md:inset-24 rounded-full border border-[rgba(159,134,232,0.22)] border-dashed" />
          <div className="sec-ring-2 absolute inset-24 xs:inset-30 md:inset-40 rounded-full border border-[rgba(159,134,232,0.28)]" />

          <div className="relative z-10 w-20 h-20 xs:w-24 xs:h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-[#3c2a73] to-[#1a1230] border border-[rgba(159,134,232,0.35)] flex items-center justify-center shadow-[0_30px_80px_-20px_rgba(98,76,171,0.8)]">
            <ShieldCheck className="w-14 h-14 text-[#CDBEFF]" />
          </div>

          {/* floating badges */}
          {[
            { icon: Lock, label: "AES-256 · Argon2ID", pos: "top-4 left-6" },
            { icon: BrainCircuit, label: "AI SOC", pos: "top-10 right-6" },
            { icon: Scale, label: "POPIA", pos: "bottom-10 left-12" },
            { icon: Radar, label: "Zero Trust", pos: "bottom-6 right-10" },
          ].map((b, i) => (
            <div
              key={i}
              className={`absolute ${b.pos} nx-glass px-3 py-2 flex items-center gap-2 text-[12px] text-white/85 nx-float`}
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <b.icon className="w-3.5 h-3.5 text-[#9F86E8]" />
              {b.label}
            </div>
          ))}
        </div>

        <div className="sec-head">
          <span className="nx-badge">Enterprise-grade Security</span>
          <h2 className="font-display mt-5 text-white text-4xl md:text-5xl font-semibold leading-[1.05]">
            Security that <span className="nx-gradient-text">never sleeps</span>. Compliance that never slips.
          </h2>
          <p className="mt-5 text-[#A89CC8] text-base md:text-lg leading-relaxed max-w-xl">
            NexteraAI is engineered on a zero-trust foundation and powered by AI agents that learn
            your business to detect threats the moment they emerge. You run the company — we run the defense.
          </p>

          <div className="sec-grid mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILLARS.map((p, i) => (
              <div key={i} data-testid={`security-pillar-${i}`} className="sec-pillar nx-card p-5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#2a1f49] to-[#17122a] border border-[rgba(159,134,232,0.25)]">
                  <p.icon className="w-4.5 h-4.5 text-[#CDBEFF]" />
                </div>
                <p className="mt-4 font-display text-white font-semibold text-[15px]">{p.title}</p>
                <p className="mt-1.5 text-[12.5px] text-[#A89CC8] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
