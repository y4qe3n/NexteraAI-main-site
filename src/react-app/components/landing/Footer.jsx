const LOGO_URL = "https://customer-assets.emergentagent.com/job_ai-ops-hub-19/artifacts/2qu5rneg_favlogo.svg";

const COLS = [
  {
    title: "Product",
    links: ["Features", "Security", "Pricing", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
  {
    title: "Resources",
    links: ["Documentation", "POPIA Guide", "Threat Reports", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "DPA", "POPIA Compliance"],
  },
];

export default function Footer() {
  return (
    <footer data-testid="footer" className="relative pt-20 pb-10 border-t border-[rgba(224,212,255,0.08)]">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
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
                  <li key={l}>
                    <a
                      href="#"
                      data-testid={`footer-link-${c.title.toLowerCase()}-${l.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-[13.5px] text-[#C2B6E0] hover:text-white transition"
                    >
                      {l}
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
            <p className="text-[11.5px] text-[#6E6389] mb-1">Registered Information Regulator (IR) Registration: [Registration Number]</p>
            <p className="text-[11.5px] text-[#6E6389] mb-1">Companies and Intellectual Property Commission (CIPC) Registration: [Registration Number]</p>
            <p className="text-[11.5px] text-[#6E6389]">South African Registered Company · POPIA Compliant</p>
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
              <a href="#" className="hover:text-white">Status</a>
              <a href="#" className="hover:text-white">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
