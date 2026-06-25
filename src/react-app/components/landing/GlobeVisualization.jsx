import { useEffect, useMemo, useState } from "react";

const SIGNAL_POINTS = [
  { name: "Johannesburg", label: "ZA", x: 366, y: 448, anchor: true },
  { name: "Cape Town", label: "ZA", x: 330, y: 493, anchor: true },
  { name: "Nairobi", label: "KE", x: 390, y: 389 },
  { name: "London", label: "GB", x: 320, y: 237 },
  { name: "Frankfurt", label: "DE", x: 358, y: 245 },
  { name: "Dubai", label: "AE", x: 438, y: 320 },
  { name: "Singapore", label: "SG", x: 523, y: 408 },
  { name: "Tokyo", label: "JP", x: 589, y: 288 },
  { name: "New York", label: "US", x: 184, y: 278 },
  { name: "Sao Paulo", label: "BR", x: 244, y: 455 },
  { name: "Sydney", label: "AU", x: 598, y: 500 },
];

const SIGNAL_ARCS = [
  ["Johannesburg", "London", "#22D3EE"],
  ["Johannesburg", "Frankfurt", "#3B82F6"],
  ["Johannesburg", "Dubai", "#8B5CF6"],
  ["Cape Town", "New York", "#22D3EE"],
  ["Cape Town", "Sao Paulo", "#8B5CF6"],
  ["Johannesburg", "Singapore", "#3B82F6"],
  ["Johannesburg", "Tokyo", "#22D3EE"],
  ["Nairobi", "Sydney", "#8B5CF6"],
];

const pointByName = new Map(SIGNAL_POINTS.map((point) => [point.name, point]));

function createArcPath(start, end) {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const lift = Math.min(150, distance * 0.42);
  return `M ${start.x} ${start.y} Q ${midX} ${midY - lift} ${end.x} ${end.y}`;
}

function useStaticFallback() {
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallScreen = window.matchMedia("(max-width: 520px)");

    const update = () => setStaticMode(reducedMotion.matches || smallScreen.matches);
    update();

    reducedMotion.addEventListener("change", update);
    smallScreen.addEventListener("change", update);

    return () => {
      reducedMotion.removeEventListener("change", update);
      smallScreen.removeEventListener("change", update);
    };
  }, []);

  return staticMode;
}

export default function GlobeVisualization() {
  const staticMode = useStaticFallback();
  const arcs = useMemo(
    () =>
      SIGNAL_ARCS.map(([from, to, color], index) => ({
        id: `${from}-${to}`,
        color,
        delay: index * 0.42,
        path: createArcPath(pointByName.get(from), pointByName.get(to)),
      })),
    [],
  );

  return (
    <div className="global-globe-stage" data-static={staticMode ? "true" : "false"}>
      <div className="global-globe-grid" aria-hidden="true" />

      <svg
        className="global-globe-svg"
        viewBox="0 0 720 720"
        role="img"
        aria-label="Illustrative 3D globe showing cybersecurity signal paths connected to South Africa"
      >
        <defs>
          <radialGradient id="globe-core" cx="42%" cy="34%" r="68%">
            <stop offset="0%" stopColor="#123B7A" />
            <stop offset="48%" stopColor="#062056" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <radialGradient id="globe-atmosphere" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#22D3EE" stopOpacity="0" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.28" />
          </radialGradient>
          <filter id="globe-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="globe-arc-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="globe-sphere-clip">
            <circle cx="360" cy="360" r="258" />
          </clipPath>
        </defs>

        <circle cx="360" cy="360" r="292" fill="#22D3EE" opacity="0.08" filter="url(#globe-soft-glow)" />
        <circle cx="360" cy="360" r="258" fill="url(#globe-core)" />
        <circle cx="360" cy="360" r="258" fill="url(#globe-atmosphere)" />

        <g clipPath="url(#globe-sphere-clip)">
          <g className="global-globe-rotate">
            <path
              d="M180 210 C245 150 320 154 382 210 C448 270 510 276 580 220 L580 284 C494 326 434 316 372 270 C300 216 242 230 180 286 Z"
              fill="#0B3A66"
              opacity="0.45"
            />
            <path
              d="M198 368 C270 318 356 326 420 386 C470 432 520 446 584 418 L584 510 C502 558 424 536 366 480 C304 420 254 426 198 472 Z"
              fill="#0F4A78"
              opacity="0.36"
            />
            <path
              d="M370 228 C432 194 506 202 570 254 L570 332 C500 292 438 286 374 318 Z"
              fill="#163B77"
              opacity="0.44"
            />
          </g>

          <g className="global-globe-lines" stroke="rgba(148, 221, 255, 0.24)" strokeWidth="1" fill="none">
            <ellipse cx="360" cy="360" rx="250" ry="74" />
            <ellipse cx="360" cy="360" rx="250" ry="132" />
            <ellipse cx="360" cy="360" rx="250" ry="198" />
            <ellipse cx="360" cy="360" rx="86" ry="255" />
            <ellipse cx="360" cy="360" rx="156" ry="255" />
            <ellipse cx="360" cy="360" rx="226" ry="255" />
            <line x1="102" y1="360" x2="618" y2="360" />
            <line x1="360" y1="102" x2="360" y2="618" />
          </g>

          <g className="global-globe-arcs" fill="none">
            {arcs.map((arc) => (
              <path
                key={arc.id}
                d={arc.path}
                stroke={arc.color}
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#globe-arc-glow)"
                style={{ "--arc-delay": `${arc.delay}s` }}
              />
            ))}
          </g>

          <g>
            {SIGNAL_POINTS.map((point) => (
              <g key={point.name}>
                <circle
                  className={point.anchor ? "global-globe-anchor-pulse" : "global-globe-node-pulse"}
                  cx={point.x}
                  cy={point.y}
                  r={point.anchor ? 15 : 10}
                  fill="none"
                  stroke={point.anchor ? "#22D3EE" : "#8B5CF6"}
                  strokeWidth="1.3"
                  opacity="0.55"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={point.anchor ? 4.8 : 3.2}
                  fill={point.anchor ? "#67E8F9" : "#C4B5FD"}
                  filter="url(#globe-arc-glow)"
                />
                {point.anchor && (
                  <text x={point.x + 12} y={point.y - 10} fill="#ECFEFF" fontSize="15" fontWeight="700">
                    {point.label}
                  </text>
                )}
              </g>
            ))}
          </g>
        </g>

        <circle cx="360" cy="360" r="258" fill="none" stroke="rgba(125, 211, 252, 0.34)" strokeWidth="1.4" />
        <circle cx="360" cy="360" r="260" fill="none" stroke="rgba(139, 92, 246, 0.18)" strokeWidth="8" />
      </svg>

      <div className="global-globe-caption">
        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.9)]" />
        South Africa anchored signal view
      </div>
    </div>
  );
}
