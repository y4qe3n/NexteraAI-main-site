import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_ai-ops-hub-19/artifacts/2qu5rneg_favlogo.svg";

const NAV = [
  { label: "Product", href: "#solution" },
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5">
        <div
          className={`flex items-center justify-between rounded-full px-4 sm:px-5 py-2.5 transition-all duration-300 ${
            scrolled
              ? "bg-[#0f0d13cc] backdrop-blur-xl border border-[rgba(224,212,255,0.10)] shadow-[0_20px_60px_-30px_rgba(98,76,171,0.6)]"
              : "bg-transparent border border-transparent"
          }`}
        >
          <a href="#top" data-testid="nav-logo" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#624CAB] to-[#2d2250] shadow-[0_8px_20px_-6px_rgba(98,76,171,0.7)]">
              <img src={LOGO_URL} alt="NexteraAI logo" className="w-6 h-6" style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <span className="font-display font-semibold text-[17px] tracking-tight text-white">
              Nextera<span className="text-[#9F86E8]">AI</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                data-testid={`nav-link-${n.label.toLowerCase()}`}
                className="text-[13.5px] text-[#C2B6E0] hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="/login"
              data-testid="nav-signin-btn"
              className="text-[13.5px] text-[#C2B6E0] hover:text-white px-4 py-2 transition"
            >
              Sign in
            </a>
            <a href="#pricing" data-testid="nav-cta-btn" className="nx-btn-primary nx-shine text-[13.5px] !py-2 !px-4">
              <ShieldCheck className="w-4 h-4" />
              Get Started
            </a>
          </div>

          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-[#C2B6E0] hover:text-white"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div data-testid="nav-mobile-panel" className="md:hidden mt-2 rounded-2xl nx-glass p-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-sm text-[#C2B6E0] hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              data-testid="nav-mobile-cta"
              className="nx-btn-primary mt-2 justify-center text-sm"
            >
              <ShieldCheck className="w-4 h-4" /> Get Started
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
