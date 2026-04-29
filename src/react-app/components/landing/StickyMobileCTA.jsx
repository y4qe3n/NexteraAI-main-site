import { useEffect, useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-testid="sticky-mobile-cta"
      className={`md:hidden fixed bottom-3 left-3 right-3 z-40 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <a
        href="#pricing"
        className="nx-btn-primary nx-shine w-full justify-center !py-3.5 shadow-[0_20px_60px_-10px_rgba(98,76,171,0.8)]"
      >
        <ShieldCheck className="w-4 h-4" />
        Start Protecting My Business
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
