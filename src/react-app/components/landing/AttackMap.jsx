import { useEffect, useRef, useState } from "react";
import { gsap } from "@/react-app/lib/gsap-init";
import { ArrowRight, ShieldCheck, Radar as RadarIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/* World-map generation                                                */
/* SVG viewBox: 0 0 960 480  (equirectangular)                         */
/* lon/lat -> x/y projection:                                          */
/*    x = (lon + 180) * (960 / 360)                                    */
/*    y = (90 - lat) * (480 / 180)                                     */
/* ------------------------------------------------------------------ */
const W = 960;
const H = 480;

// Rough continent bounding-boxes with density to generate dotted silhouette.
// Tuned empirically — good enough for a stylised cyber map.
const CONTINENTS = [
  // North America (main)
  { x0: 140, y0: 80, x1: 300, y1: 200, p: 0.45 },
  // Central + Caribbean
  { x0: 210, y0: 195, x1: 280, y1: 240, p: 0.45 },
  // South America
  { x0: 260, y0: 230, x1: 340, y1: 390, p: 0.55 },
  // Greenland
  { x0: 330, y0: 60, x1: 400, y1: 110, p: 0.45 },
  // Europe
  { x0: 440, y0: 95, x1: 555, y1: 170, p: 0.55 },
  // Africa
  { x0: 470, y0: 175, x1: 580, y1: 335, p: 0.58 },
  // Middle East
  { x0: 560, y0: 160, x1: 630, y1: 210, p: 0.5 },
  // Central + East Asia
  { x0: 600, y0: 100, x1: 820, y1: 230, p: 0.5 },
  // SE Asia / Indonesia
  { x0: 700, y0: 230, x1: 810, y1: 280, p: 0.5 },
  // Russia (wide north strip)
  { x0: 500, y0: 80, x1: 830, y1: 130, p: 0.42 },
  // Australia
  { x0: 780, y0: 300, x1: 880, y1: 365, p: 0.55 },
  // NZ
  { x0: 885, y0: 340, x1: 915, y1: 370, p: 0.5 },
];

function generateDots() {
  const out = [];
  const step = 9; // grid spacing
  let seed = 1;
  const rand = () => {
    // deterministic PRNG for stable render
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  CONTINENTS.forEach((c) => {
    for (let x = c.x0; x <= c.x1; x += step) {
      for (let y = c.y0; y <= c.y1; y += step) {
        if (rand() < c.p) {
          out.push({
            x: x + (rand() - 0.5) * 3,
            y: y + (rand() - 0.5) * 3,
          });
        }
      }
    }
  });
  return out;
}

/* Major cities for attack simulation. Coordinates projected to our viewBox. */
const CITIES = [
  { name: "Johannesburg", cc: "ZA", x: 533, y: 293 },
  { name: "Cape Town",    cc: "ZA", x: 525, y: 322 },
  { name: "Nairobi",      cc: "KE", x: 556, y: 258 },
  { name: "Lagos",        cc: "NG", x: 492, y: 240 },
  { name: "Cairo",        cc: "EG", x: 548, y: 186 },
  { name: "London",       cc: "GB", x: 478, y: 127 },
  { name: "Paris",        cc: "FR", x: 485, y: 140 },
  { name: "Berlin",       cc: "DE", x: 505, y: 130 },
  { name: "Moscow",       cc: "RU", x: 570, y: 118 },
  { name: "Dubai",        cc: "AE", x: 608, y: 192 },
  { name: "Mumbai",       cc: "IN", x: 655, y: 220 },
  { name: "Beijing",      cc: "CN", x: 760, y: 155 },
  { name: "Shanghai",     cc: "CN", x: 778, y: 175 },
  { name: "Tokyo",        cc: "JP", x: 815, y: 168 },
  { name: "Singapore",    cc: "SG", x: 728, y: 250 },
  { name: "Sydney",       cc: "AU", x: 855, y: 346 },
  { name: "New York",     cc: "US", x: 275, y: 158 },
  { name: "Los Angeles",  cc: "US", x: 180, y: 175 },
  { name: "Toronto",      cc: "CA", x: 263, y: 140 },
  { name: "Mexico City",  cc: "MX", x: 215, y: 210 },
  { name: "São Paulo",    cc: "BR", x: 320, y: 330 },
  { name: "Buenos Aires", cc: "AR", x: 305, y: 365 },
];

export default function AttackMap() {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const [dots] = useState(() => generateDots());

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".am-head > *", {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
      });
      gsap.from(".am-stage", {
        y: 40, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
      });

      // fade-in continent dots once section is in view
      gsap.fromTo(
        ".am-dot",
        { opacity: 0, scale: 0 },
        {
          opacity: 0.55, scale: 1, duration: 0.6, ease: "power2.out",
          stagger: { each: 0.002, from: "random" },
          transformOrigin: "center center",
          scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* Attack loop ------------------------------------------------------ */
  useEffect(() => {
    const NS = "http://www.w3.org/2000/svg";
    let active = true;
    let running = 0;

    const launchAttack = () => {
      if (!active || !svgRef.current) return;
      const src = CITIES[Math.floor(Math.random() * CITIES.length)];
      let dst = src;
      while (dst === src) dst = CITIES[Math.floor(Math.random() * CITIES.length)];

      const svg = svgRef.current;
      const midX = (src.x + dst.x) / 2;
      const dist = Math.hypot(dst.x - src.x, dst.y - src.y);
      const arcH = Math.min(110, dist * 0.35);
      const midY = Math.min(src.y, dst.y) - arcH;
      const d = `M ${src.x} ${src.y} Q ${midX} ${midY} ${dst.x} ${dst.y}`;

      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("stroke", "#ff3b5c");
      path.setAttribute("stroke-width", "1.4");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("fill", "none");
      path.setAttribute("filter", "url(#am-red-glow)");
      path.style.opacity = "0.85";
      svg.appendChild(path);

      const L = path.getTotalLength();
      path.style.strokeDasharray = `${L}`;
      path.style.strokeDashoffset = `${L}`;

      // Dest impact (expanding ring at destination city)
      const hit = document.createElementNS(NS, "circle");
      hit.setAttribute("cx", dst.x);
      hit.setAttribute("cy", dst.y);
      hit.setAttribute("r", 0);
      hit.setAttribute("fill", "transparent");
      hit.setAttribute("stroke", "#ff3b5c");
      hit.setAttribute("stroke-width", "1.2");
      hit.style.opacity = "0";
      svg.appendChild(hit);

      running++;

      const tl = gsap.timeline({
        onComplete: () => {
          path.remove();
          hit.remove();
          running = Math.max(0, running - 1);
        },
      });

      // Slow, smooth line draw then a gentle impact ring at destination
      tl.to(path, { strokeDashoffset: 0, duration: 2.6, ease: "power1.inOut" })
        .fromTo(hit,
          { attr: { r: 0 }, opacity: 0.75 },
          { attr: { r: 14 }, opacity: 0, duration: 1.2, ease: "power2.out" },
          "-=0.15"
        )
        .to(path, { opacity: 0, duration: 1.0, ease: "power2.out" }, "-=0.6");
    };

    // spawn a new attack every 1.4s — plenty of breathing room
    const id = setInterval(launchAttack, 1400);
    // prime with one immediate attack
    launchAttack();
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section id="final-cta" ref={rootRef} data-testid="attack-map-section" className="relative py-24 md:py-32 overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(900px 500px at 50% 0%, rgba(98,76,171,0.18), transparent 60%), radial-gradient(700px 400px at 80% 80%, rgba(255,59,92,0.10), transparent 60%)",
      }} />

      <div className="relative max-w-7xl mx-auto px-5">
        <div className="am-head text-center max-w-3xl mx-auto">
          <span className="nx-badge mx-auto !bg-[rgba(255,59,92,0.1)] !border-[rgba(255,59,92,0.4)] !text-[#ffb3c1]">
            <RadarIcon className="w-3.5 h-3.5" /> Live Global Threat Map
          </span>
          <h2 className="font-display mt-5 text-white text-4xl md:text-5xl font-semibold leading-[1.05]">
            Cyber attacks are happening <span className="nx-gradient-text">right now</span>.
          </h2>
          <p className="mt-5 text-[#A89CC8] text-base md:text-lg leading-relaxed">
            Every arc you see below is a simulated attack pattern our AI neutralises across the
            globe — every second of every day. While you sleep, NexteraAI stands watch.
          </p>
        </div>

        {/* Map stage */}
        <div className="am-stage mt-12 relative rounded-[24px] border border-[rgba(224,212,255,0.08)] bg-gradient-to-b from-[#120f1a] to-[#07060c] p-5 md:p-8 shadow-[0_40px_120px_-30px_rgba(98,76,171,0.5)] overflow-hidden">
          {/* Live indicator pill */}
          <div className="absolute top-5 right-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,59,92,0.12)] border border-[rgba(255,59,92,0.35)] text-[11px] font-medium tracking-wider uppercase text-[#ffb3c1] z-10">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-[#ff3b5c] animate-ping opacity-75" />
              <span className="relative rounded-full w-2 h-2 bg-[#ff3b5c]" />
            </span>
            Live
          </div>

          <div className="flex flex-col gap-6">
            {/* Map — full width */}
            <div className="relative rounded-xl bg-[#07060c] border border-[rgba(224,212,255,0.06)] overflow-hidden">
              <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="am-red-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="am-city-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#9F86E8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#9F86E8" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Latitude & longitude lines */}
                <g stroke="rgba(159,134,232,0.05)" strokeWidth="0.5">
                  {[60, 120, 180, 240, 300, 360, 420].map((y) => (
                    <line key={`h${y}`} x1="0" y1={y} x2={W} y2={y} />
                  ))}
                  {[120, 240, 360, 480, 600, 720, 840].map((x) => (
                    <line key={`v${x}`} x1={x} y1="0" x2={x} y2={H} />
                  ))}
                </g>

                {/* Continent dots */}
                <g fill="#4a3d6d">
                  {dots.map((d, i) => (
                    <circle key={i} className="am-dot" cx={d.x} cy={d.y} r={1.4} />
                  ))}
                </g>

                {/* Cities */}
                <g>
                  {CITIES.map((c) => (
                    <g key={c.name}>
                      <circle cx={c.x} cy={c.y} r={10} fill="url(#am-city-glow)" opacity="0.35" />
                      <circle cx={c.x} cy={c.y} r={2.3} fill="#CDBEFF" />
                      <circle cx={c.x} cy={c.y} r={4.5} fill="none" stroke="rgba(205,190,255,0.35)" strokeWidth="0.6" />
                    </g>
                  ))}
                </g>

                {/* Attack paths/pings injected here via DOM */}
              </svg>
            </div>

            {/* Static legend + CTA under the map */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2.5 text-[12.5px] text-[#A89CC8]">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#CDBEFF] shadow-[0_0_8px_#CDBEFF]" />
                  Protected endpoint
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-0.5 bg-[#ff3b5c] shadow-[0_0_6px_#ff3b5c]" />
                  Inbound attack
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Neutralised by AI
                </span>
              </div>
              <a
                href="#pricing"
                data-testid="attack-map-cta"
                className="nx-btn-primary nx-shine"
              >
                <ShieldCheck className="w-4 h-4" />
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <p className="text-center text-[11.5px] text-[#8778AD] -mt-2">
              POPIA ready · AES-256 · Argon2ID · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
