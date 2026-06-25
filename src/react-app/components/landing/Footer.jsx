const LOGO_URL = "https://customer-assets.emergentagent.com/job_ai-ops-hub-19/artifacts/2qu5rneg_favlogo.svg";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Security", href: "/#security" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "POPIA Guide", href: "/popia-guide" },
      { label: "Threat Reports", href: "/threat-reports" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "DPA", href: "/dpa" },
      { label: "POPIA Compliance", href: "/popia-compliance" },
    ],
  },
];

export default function Footer() {
  return (
    <footer data-testid="footer" className="relative pt-20 pb-10 border-t border-[rgba(224,212,255,0.08)]">
      <div className="nx-container">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-6 gap-8 md:gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#624CAB] to-[#2d2250]">
                <img src={LOGO_URL} alt="NexteraAI logo" className="w-6 h-6" style={{ filter: "brightness(0) invert(1)" }} />
              </div>
              <span className="font-display font-semibold text-[17px] tracking-tight text-white">
                Nextera<span className="text-[#9F86E8]">AI</span>
              </span>
            </div>
            <p className="mt-5 text-[13.5px] text-[#A89CC8] leading-relaxed max-w-sm">
              The Online Business Operations Center with built-in enterprise-grade security —
              purpose-built for South African SMEs.
            </p>
            <p className="mt-5 text-[12px] text-[#6E6389]">
              Proudly built in South Africa · POPIA ready
            </p>
          </div>

          {COLS.map((c, i) => (
            <div key={i}>
              <p className="text-[12px] uppercase tracking-wider text-[#8778AD] font-medium">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      data-testid={`footer-link-${c.title.toLowerCase()}-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-xs xs:text-[13px] md:text-[13.5px] text-[#C2B6E0] hover:text-white transition"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-[rgba(224,212,255,0.08)] flex flex-col gap-6">
          <div className="text-center md:text-left">
            <p className="text-[12.5px] text-[#8778AD] font-semibold mb-3">NexteraAI (Pty) Ltd</p>
            <p className="text-[11.5px] text-[#6E6389] mb-1">Registered Information Regulator (IR) Registration: 2026-017190</p>
            <p className="text-[11.5px] text-[#6E6389] mb-1">Companies and Intellectual Property Commission (CIPC) Registration: 2026/250621/07</p>
            <p className="text-[11.5px] text-[#6E6389] mb-1">South African Registered Company · POPIA Compliant</p>
            <p className="text-[11.5px] text-[#A78BFA] mt-2">Currently onboarding selected businesses through a controlled beta programme.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12.5px] text-[#8778AD]">
              © {new Date().getFullYear()} NexteraAI. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-[12.5px] text-[#8778AD]">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                All systems operational
              </span>
              <a href="/status" className="hover:text-white">Status</a>
              <a href="/#security" className="hover:text-white">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
