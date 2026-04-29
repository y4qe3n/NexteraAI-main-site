import { useEffect, useRef } from "react";
import { gsap } from "@/react-app/lib/gsap-init";
import {
  LayoutDashboard, Radar, Terminal, Database, FileCheck2, Mail, GraduationCap, MonitorSmartphone,
} from "lucide-react";

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Centralised Operations Dashboard",
    desc: "One real-time command view of your entire business — tasks, teams, devices, finance and security.",
    accent: "from-[#3a2866] to-[#17122a]",
  },
  {
    icon: Radar,
    title: "Real-time AI Threat Detection",
    desc: "Autonomous agents hunt anomalies, block intrusions and neutralise attacks 24/7 — before humans can react.",
    accent: "from-[#472e82] to-[#17122a]",
  },
  {
    icon: Terminal,
    title: "Silent Desktop Agent",
    desc: "A featherweight agent runs invisibly on every device, streaming telemetry and enforcing policy without friction.",
    accent: "from-[#2e2258] to-[#17122a]",
  },
  {
    icon: Database,
    title: "Secure Data Vault Backups",
    desc: "Immutable, AES-256 encrypted backups with Argon2ID-protected access — ransomware can’t touch what it can’t see.",
    accent: "from-[#3a2866] to-[#17122a]",
  },
  {
    icon: FileCheck2,
    title: "POPIA Compliance Toolkit",
    desc: "Automated assessments, consent logs, and audit-ready reports that keep you compliant without the paperwork.",
    accent: "from-[#472e82] to-[#17122a]",
  },
  {
    icon: Mail,
    title: "Email Guard & Threat Radar",
    desc: "Stops phishing, impersonation, and malicious attachments at the gate — protecting every inbox automatically.",
    accent: "from-[#2e2258] to-[#17122a]",
  },
  {
    icon: GraduationCap,
    title: "Staff Cybersecurity Academy",
    desc: "Gamified training that turns your team into your strongest line of defense — tracked, certified, effortless.",
    accent: "from-[#3a2866] to-[#17122a]",
  },
  {
    icon: MonitorSmartphone,
    title: "Live Device Monitoring",
    desc: "See every endpoint in real time. Patch status, risk score, activity timeline — all in one pane of glass.",
    accent: "from-[#472e82] to-[#17122a]",
  },
];

export default function Features() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feat-head > *", {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
      });
      gsap.from(".feat-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: ".feat-grid", start: "top 85%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={rootRef} data-testid="features-section" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5">
        <div className="feat-head max-w-3xl mx-auto text-center">
          <span className="nx-badge mx-auto">Features</span>
          <h2 className="font-display mt-5 text-white text-4xl md:text-5xl font-semibold leading-[1.05]">
            Everything you need to run and <span className="nx-gradient-text">protect</span> your business.
          </h2>
          <p className="mt-5 text-[#A89CC8] text-base md:text-lg leading-relaxed">
            Eight tightly integrated modules — engineered to replace a shelf of enterprise tools
            with a single, elegant platform your whole team will love.
          </p>
        </div>

        <div className="feat-grid mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <article
              key={i}
              data-testid={`feature-card-${i}`}
              className="feat-card nx-card p-6 relative overflow-hidden"
            >
              <div className={`absolute -top-20 -right-20 w-44 h-44 rounded-full bg-gradient-to-br ${f.accent} opacity-60 blur-2xl`} />
              <div className="relative">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#2a1f49] to-[#17122a] border border-[rgba(159,134,232,0.28)]">
                  <f.icon className="w-5 h-5 text-[#CDBEFF]" />
                </div>
                <h3 className="font-display mt-5 text-white text-[17px] font-semibold leading-snug">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] text-[#A89CC8] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
