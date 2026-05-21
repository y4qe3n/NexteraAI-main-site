import { useEffect, useRef } from "react";
import { gsap } from "@/react-app/lib/gsap-init";
import { Activity, Radar as RadarIcon, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ThreatRadar() {
  const rootRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Mobile: radar spin on mount (no scroll trigger), reduced motion
      mm.add("(max-width: 767px)", () => {
        gsap.from(".tr-head > *", {
          y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
        });
        gsap.from(".tr-stat", {
          y: 15, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: ".tr-stats", start: "top 85%" },
        });
        // Radar spin on mount, not on scroll
        gsap.to(".tr-sweep", {
          rotate: 360, duration: 8, repeat: -1, ease: "none",
          transformOrigin: "50% 100%",
        });
        // Slower blips on mobile
        const blips = gsap.utils.toArray(".tr-blip");
        blips.forEach((blip, i) => {
          gsap.fromTo(blip,
            { scale: 0, opacity: 0 },
            {
              scale: 1.2, opacity: 1, duration: 1.8, ease: "power2.out",
              repeat: -1, repeatDelay: 3 + i * 0.8, delay: i * 0.6,
              yoyo: true,
            }
          );
        });
      });

      // Desktop: full animations with scroll trigger
      mm.add("(min-width: 768px)", () => {
        gsap.from(".tr-head > *", {
          y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
        });
        gsap.from(".tr-stat", {
          y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: ".tr-stats", start: "top 85%" },
        });

        // Continuous radar sweep
        gsap.to(".tr-sweep", {
          rotate: 360, duration: 6, repeat: -1, ease: "none",
          transformOrigin: "50% 100%",
        });

        // Animated counters (threats blocked + devices monitored)
        const counters = [
          { el: ".tr-count-threats", to: 12842 },
          { el: ".tr-count-devices", to: 48 },
          { el: ".tr-count-uptime", to: 99.98, decimals: 2 },
        ];
        counters.forEach(({ el, to, decimals = 0 }) => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: to, duration: 2, ease: "power2.out",
            onUpdate: () => {
              const node = rootRef.current?.querySelector(el);
              if (node) node.textContent = decimals
                ? obj.v.toFixed(decimals)
                : Math.floor(obj.v).toLocaleString();
            },
            scrollTrigger: { trigger: ".tr-stats", start: "top 85%" },
          });
        });

        // Blips appear and fade
        const blips = gsap.utils.toArray(".tr-blip");
        blips.forEach((blip, i) => {
          gsap.fromTo(blip,
            { scale: 0, opacity: 0 },
            {
              scale: 1.6, opacity: 1, duration: 1.2, ease: "power2.out",
              repeat: -1, repeatDelay: 2 + i * 0.6, delay: i * 0.5,
              yoyo: true,
            }
          );
        });
      });

      return () => mm.revert();
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} data-testid="threat-radar-section" className="relative nx-section overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(1000px 500px at 20% 50%, rgba(98,76,171,0.18), transparent 60%)",
      }} />

      <div className="relative nx-container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        {/* Left: Text + stats */}
        <div>
          <div className="tr-head">
            <span className="nx-badge">Live Threat Radar</span>
            <h2 className="font-display mt-5 text-white text-4xl md:text-5xl font-semibold leading-[1.05]">
              See every threat. <span className="nx-gradient-text">Before it lands.</span>
            </h2>
            <p className="mt-5 text-[#A89CC8] text-base md:text-lg leading-relaxed max-w-xl">
              A real-time map of every suspicious signal across your devices, inboxes and cloud —
              with autonomous AI taking action the moment something looks off.
            </p>
          </div>

          <div className="tr-stats mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatBox label="Threats blocked" prefix="" suffix="+" className="tr-count-threats" />
            <StatBox label="Devices monitored" prefix="" suffix="" className="tr-count-devices" />
            <StatBox label="Uptime" prefix="" suffix="%" className="tr-count-uptime" />
          </div>

          <div className="tr-stats mt-6 space-y-2.5">
            {[
              { icon: CheckCircle2, color: "text-emerald-400", text: "Ransomware attempt blocked — Cape Town · 2m ago" },
              { icon: AlertTriangle, color: "text-amber-400", text: "Phishing link quarantined — Sandton · 11m ago" },
              { icon: Activity, color: "text-[#9F86E8]", text: "Anomalous login pattern detected — Durban · 34m ago" },
            ].map((e, i) => (
              <div key={i} className="tr-stat flex items-center gap-3 px-4 py-3 rounded-xl nx-card !p-3.5">
                <e.icon className={`w-4 h-4 ${e.color}`} />
                <span className="text-[13.5px] text-[#D6CAF0]">{e.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Radar visual */}
        <div className="lg:order-last relative h-[280px] xs:h-[340px] sm:h-[400px] lg:h-[480px] flex items-center justify-center">
          <div className="relative w-[240px] h-[240px] xs:w-[300px] xs:h-[300px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px] max-w-full">
            {/* Concentric rings */}
            {[0.35, 0.55, 0.78, 1].map((scale, i) => (
              <div key={i}
                className="absolute rounded-full border border-[rgba(159,134,232,0.22)]"
                style={{
                  inset: `${(1 - scale) * 50}%`,
                  borderStyle: i === 1 ? "dashed" : "solid",
                }}
              />
            ))}
            {/* Crosshair */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[rgba(159,134,232,0.12)]" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[rgba(159,134,232,0.12)]" />

            {/* Radar sweep cone */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="tr-sweep w-1/2 h-1/2 origin-bottom" style={{
                background: "conic-gradient(from 0deg, transparent 0%, rgba(159,134,232,0.35) 10%, transparent 25%)",
                transform: "translateY(-25%)",
              }} />
            </div>

            {/* Center hub */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#624CAB] to-[#2d2250] flex items-center justify-center shadow-[0_0_40px_rgba(98,76,171,0.8)]">
              <RadarIcon className="w-6 h-6 text-white" />
            </div>

            {/* Blips */}
            {[
              { top: "22%", left: "68%" },
              { top: "60%", left: "28%" },
              { top: "72%", left: "72%" },
              { top: "30%", left: "35%" },
            ].map((pos, i) => (
              <div key={i} className="tr-blip absolute w-2.5 h-2.5 rounded-full bg-[#9F86E8]"
                style={{ ...pos, boxShadow: "0 0 20px rgba(159,134,232,0.9)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBox({ label, prefix, suffix, className }) {
  return (
    <div className="tr-stat nx-card p-4">
      <p className="font-display text-3xl font-semibold text-white tabular-nums">
        {prefix}<span className={className}>0</span>{suffix}
      </p>
      <p className="mt-1 text-[11.5px] uppercase tracking-wider text-[#A89CC8]">{label}</p>
    </div>
  );
}
