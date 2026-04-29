const ITEMS = [
  "ISO 27001 aligned",
  "POPIA compliant",
  "SOC 2 practices",
  "AES-256 encryption",
  "Argon2ID password hashing",
  "SAST & DAST tested",
  "24/7 AI monitoring",
  "Zero-trust design",
  "GDPR friendly",
];

export default function LogoMarquee() {
  return (
    <section data-testid="logo-marquee" className="relative py-10 border-y border-[rgba(224,212,255,0.06)] bg-[#0b0910]">
      <p className="text-center text-[11px] uppercase tracking-[0.3em] text-[#8778AD] mb-5">
        Trusted security standards
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="nx-marquee-track flex gap-12 whitespace-nowrap">
          {[...ITEMS, ...ITEMS].map((txt, i) => (
            <div key={i} className="flex items-center gap-3 text-[#A89CC8] text-[14px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#624CAB]" />
              {txt}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
