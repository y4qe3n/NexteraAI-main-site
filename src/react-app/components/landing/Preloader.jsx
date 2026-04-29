import { useEffect, useRef } from "react";
import { gsap } from "@/react-app/lib/gsap-init";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_ai-ops-hub-19/artifacts/2qu5rneg_favlogo.svg";

export default function Preloader() {
  const rootRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: "power2.inOut" }
      );
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 1.0,
        pointerEvents: "none",
        ease: "power2.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      data-testid="preloader"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0A]"
    >
      <img src={LOGO_URL} alt="NexteraAI" className="w-14 h-14 mb-6 opacity-90" />
      <div className="h-[2px] w-[160px] bg-[#1b1824] overflow-hidden rounded-full">
        <div
          ref={barRef}
          className="h-full w-full origin-left"
          style={{
            background: "linear-gradient(90deg, #624CAB, #9F86E8)",
          }}
        />
      </div>
      <p className="mt-5 text-xs tracking-[0.3em] uppercase text-[#A89CC8]">
        Loading Operations Center
      </p>
    </div>
  );
}
