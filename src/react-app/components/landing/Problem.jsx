import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/react-app/lib/gsap-init";
import { Layers3, ShieldAlert, FileWarning, EyeOff } from "lucide-react";

const PAINS = [
  {
    icon: Layers3,
    title: "Too many tools, no cohesion",
    desc: "CRM here, email security there, backups somewhere else. Your team spends hours stitching workflows together instead of serving customers.",
  },
  {
    icon: ShieldAlert,
    title: "Cyber threats on the rise",
    desc: "South African SMEs are now prime targets. One phishing click or ransomware attack can end years of hard work overnight.",
  },
  {
    icon: FileWarning,
    title: "POPIA compliance stress",
    desc: "Regulations are getting stricter. Manual compliance checklists eat weeks and still leave you exposed to costly fines.",
  },
  {
    icon: EyeOff,
    title: "No visibility, no control",
    desc: "You can’t secure what you can’t see. Most owners have no idea what’s happening on their staff’s devices, emails or data vaults.",
  },
];

export default function Problem() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".problem-head > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
      });
      gsap.from(".problem-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".problem-grid", start: "top 85%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} data-testid="problem-section" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5">
        <div className="problem-head max-w-3xl">
          <span className="nx-badge">The Problem</span>
          <h2 className="font-display mt-5 text-white text-4xl md:text-5xl font-semibold leading-[1.05]">
            Running a business shouldn’t mean <span className="nx-gradient-text">fighting fires</span> every day.
          </h2>
          <p className="mt-5 text-[#A89CC8] text-base md:text-lg max-w-2xl leading-relaxed">
            Most SMEs operate with a patchwork of disconnected tools, hope-based security,
            and compliance anxiety. The result: wasted time, preventable breaches, and a constant
            feeling that something important is slipping through the cracks.
          </p>
        </div>

        <div className="problem-grid mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
          {PAINS.map((p, i) => (
            <div
              key={i}
              data-testid={`problem-card-${i}`}
              className="problem-card nx-card p-7 md:p-8 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#2a1f49] to-[#17122a] border border-[rgba(159,134,232,0.25)]">
                  <p.icon className="w-5 h-5 text-[#CDBEFF]" />
                </div>
                <h3 className="font-display text-white text-lg font-semibold">{p.title}</h3>
              </div>
              <p className="mt-4 text-[#A89CC8] text-[14.5px] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
