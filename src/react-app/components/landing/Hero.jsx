import { useEffect, useRef } from "react";
import { gsap } from "@/react-app/lib/gsap-init";
import { ArrowRight, ShieldCheck, Sparkles, Play, Activity, Lock, Radar, Server } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_ai-ops-hub-19/artifacts/2qu5rneg_favlogo.svg";

export default function Hero() {
  const rootRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Mobile animations - reduced motion, fade only
      mm.add("(max-width: 479px)", () => {
        gsap.fromTo('.hero-badge, .hero-title-line, .hero-sub, .hero-cta > *, .hero-stats > *',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power1.out' }
        );
        gsap.fromTo('.hero-dash',
          { opacity: 0 },
          { opacity: 1, duration: 0.6, delay: 0.3 }
        );
        gsap.fromTo('.hero-dash-row',
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.05 }
        );
        // Orbs drift on mobile (slower)
        gsap.to(".hero-orb-a", { x: 15, y: -10, duration: 15, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".hero-orb-b", { x: -12, y: 8, duration: 18, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });

      // Desktop animations - full motion
      mm.add("(min-width: 480px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
        tl.from(".hero-badge", { y: 18, opacity: 0, duration: 0.7 })
          .from(".hero-title-line", { y: 40, opacity: 0, duration: 0.9, stagger: 0.08 }, "-=0.4")
          .from(".hero-sub", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
          .from(".hero-cta > *", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.4")
          .from(".hero-stats > *", { y: 12, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.4")
          .from(".hero-dash", { y: 60, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.8")
          .from(".hero-dash-row", { y: 10, opacity: 0, duration: 0.5, stagger: 0.06 }, "-=0.6");

        // Parallax on the floating dashboard
        gsap.to(".hero-dash", {
          y: -30,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Orbs slow drift
        gsap.to(".hero-orb-a", { x: 30, y: -20, duration: 10, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".hero-orb-b", { x: -25, y: 15, duration: 12, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });

      return () => mm.revert();
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      data-testid="hero-section"
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 nx-noise overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 nx-radial" />
      <div className="absolute inset-0 nx-grid-bg [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="hero-orb-a absolute -top-10 left-[6%] w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] lg:w-[340px] lg:h-[340px] nx-glow-ring" />
      <div className="hero-orb-b absolute top-[28%] right-[4%] w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[420px] lg:h-[420px] nx-glow-ring opacity-80" />

      <div className="relative nx-container">
        <div className="hero-badge nx-badge mx-auto w-fit max-w-full mb-7">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Built for South African SMEs · POPIA Ready</span>
        </div>

        <h1 className="font-display text-center text-white font-semibold leading-[1.02] text-[32px] xs:text-[40px] sm:text-5xl md:text-6xl lg:text-[82px] max-w-5xl mx-auto">
          <span className="hero-title-line block">One Platform.</span>
          <span className="hero-title-line block nx-gradient-text">Total Control.</span>
          <span className="hero-title-line block">Complete Security.</span>
        </h1>

        <p className="hero-sub mt-7 max-w-2xl mx-auto text-center text-[#A89CC8] text-sm xs:text-base md:text-[17px] lg:text-lg leading-relaxed">
          NexteraAI is the Online Business Operations Center with built-in enterprise-grade
          cybersecurity. Run your entire business, protect it with AI, and stay POPIA compliant —
          without managing a single extra tool.
        </p>

        <div className="hero-cta mt-9 flex flex-row items-center justify-center gap-3">
          <a href="#pricing" data-testid="hero-cta-primary" className="nx-btn-primary nx-shine !py-3 xs:!py-3.5">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span className="mx-1">Get Started</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </a>
          <a href="#solution" data-testid="hero-cta-secondary" className="nx-btn-ghost !py-3 xs:!py-3.5">
            <Play className="w-4 h-4 flex-shrink-0" />
            <span className="mx-1">See it in action</span>
            <span className="w-4 h-4 flex-shrink-0" aria-hidden="true"></span>
          </a>
        </div>

        <div className="hero-stats mt-10 grid grid-cols-2 xs:grid-cols-3 md:grid-cols-3 gap-x-4 gap-y-3 text-[13px] text-[#A89CC8]">
          <span className="inline-flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />99.98% uptime SLA</span>
          <span className="inline-flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9F86E8]" />POPIA & ISO-aligned</span>
          <span className="inline-flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" />24/7 AI threat response</span>
        </div>

        {/* Fake product dashboard */}
        <div className="hero-dash relative mt-16 max-w-6xl mx-auto">
          <div className="absolute -inset-8 bg-[radial-gradient(closest-side,rgba(98,76,171,0.35),transparent_70%)] blur-2xl" />
          <div className="relative rounded-[26px] border border-[rgba(224,212,255,0.10)] bg-gradient-to-b from-[#161220] to-[#0c0a10] overflow-hidden shadow-[0_40px_120px_-30px_rgba(98,76,171,0.6)]">
            {/* top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(224,212,255,0.06)] bg-[#0f0d13]">
              <div className="flex items-center gap-2">
                <img src={LOGO_URL} alt="NexteraAI Operations Center" className="w-5 h-5" style={{ filter: "brightness(0) invert(1)" }} />
                <span className="text-[13px] text-white/80 font-medium">Operations Center</span>
                <span className="ml-3 text-[11px] text-[#A89CC8] hidden sm:inline">/ Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Secure
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
              {/* sidebar - hidden on mobile for space */}
              <aside className="hidden md:block col-span-12 md:col-span-3 lg:col-span-2 space-y-1">
                {[
                  { icon: Activity, label: "Overview", active: true },
                  { icon: Radar, label: "Threat Radar" },
                  { icon: Lock, label: "Data Vault" },
                  { icon: Server, label: "Devices" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`hero-dash-row flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] ${
                      item.active
                        ? "bg-[#221a35] text-white border border-[rgba(159,134,232,0.25)]"
                        : "text-[#A89CC8] hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </div>
                ))}
              </aside>

              {/* main content */}
              <div className="col-span-12 md:col-span-9 lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
                <StatCard title="Threats blocked" value="1,284" sub="+18% this week" tone="violet" />
                <StatCard title="Devices online" value="47 / 48" sub="1 agent reconnecting" tone="emerald" />
                <StatCard title="POPIA score" value="94%" sub="Above target" tone="amber" />

                <div className="hero-dash-row col-span-1 sm:col-span-2 lg:col-span-4 rounded-xl border border-[rgba(224,212,255,0.08)] bg-[#120f18] p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[12.5px] text-[#A89CC8]">Live Threat Radar</p>
                    <span className="text-[11px] text-emerald-400">Realtime</span>
                  </div>
                  <FakeChart />
                </div>

                <div className="hero-dash-row col-span-1 sm:col-span-2 lg:col-span-2 rounded-xl border border-[rgba(224,212,255,0.08)] bg-[#120f18] p-4 sm:p-5">
                  <p className="text-[12.5px] text-[#A89CC8] mb-3">Recent Events</p>
                  <ul className="space-y-2.5">
                    {[
                      ["Phishing blocked", "2m ago"],
                      ["Backup complete", "12m ago"],
                      ["New device joined", "1h ago"],
                    ].map(([a, b], i) => (
                      <li key={i} className="flex items-center justify-between text-[12px]">
                        <span className="text-white/85">{a}</span>
                        <span className="text-[#A89CC8]">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value, sub, tone }) {
  const toneMap = {
    violet: "from-[#221a35] to-[#120f18]",
    emerald: "from-[#0f1f1a] to-[#0c0a10]",
    amber: "from-[#1f1a0f] to-[#0c0a10]",
  };
  return (
    <div className={`hero-dash-row col-span-1 rounded-xl border border-[rgba(224,212,255,0.08)] bg-gradient-to-b ${toneMap[tone]} p-4 sm:p-5`}>
      <p className="text-[11.5px] uppercase tracking-wider text-[#A89CC8]">{title}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11.5px] text-[#A89CC8]">{sub}</p>
    </div>
  );
}

function FakeChart() {
  // simple animated path
  const bars = Array.from({ length: 24 }, (_, i) => 20 + ((i * 13) % 70));
  return (
    <div className="h-20 sm:h-24 flex items-end gap-1 sm:gap-1.5">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{
            height: `${h}%`,
            background: `linear-gradient(180deg, #9F86E8 0%, #624CAB ${Math.min(80, h)}%, rgba(98,76,171,0.15) 100%)`,
          }}
        />
      ))}
    </div>
  );
}
