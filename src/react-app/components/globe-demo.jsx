"use client";

import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Globe2 } from "lucide-react";

const GlobeWorldStage = lazy(() => import("@/react-app/components/globe-world-stage"));

const colors = ["#8B5CF6", "#9F86E8", "#624CAB"];
const arcColor = (index) => colors[index % colors.length];

const sampleArcs = [
  { order: 1, startLat: -26.2041, startLng: 28.0473, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: arcColor(0) },
  { order: 1, startLat: -33.9249, startLng: 18.4241, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.24, color: arcColor(1) },
  { order: 2, startLat: -26.2041, startLng: 28.0473, endLat: 50.1109, endLng: 8.6821, arcAlt: 0.2, color: arcColor(2) },
  { order: 2, startLat: -1.2921, startLng: 36.8219, endLat: -33.9249, endLng: 18.4241, arcAlt: 0.18, color: arcColor(3) },
  { order: 3, startLat: -26.2041, startLng: 28.0473, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.45, color: arcColor(4) },
  { order: 3, startLat: 35.6762, startLng: 139.6503, endLat: -26.2041, endLng: 28.0473, arcAlt: 0.5, color: arcColor(5) },
  { order: 4, startLat: 40.7128, startLng: -74.006, endLat: -33.9249, endLng: 18.4241, arcAlt: 0.42, color: arcColor(6) },
  { order: 4, startLat: -23.5505, startLng: -46.6333, endLat: -26.2041, endLng: 28.0473, arcAlt: 0.44, color: arcColor(7) },
  { order: 5, startLat: -33.8688, startLng: 151.2093, endLat: -26.2041, endLng: 28.0473, arcAlt: 0.5, color: arcColor(8) },
  { order: 5, startLat: 52.52, startLng: 13.405, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.1, color: arcColor(9) },
  { order: 6, startLat: 28.6139, startLng: 77.209, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.2, color: arcColor(10) },
  { order: 6, startLat: 34.0522, startLng: -118.2437, endLat: 40.7128, endLng: -74.006, arcAlt: 0.18, color: arcColor(11) },
  { order: 7, startLat: 37.5665, startLng: 126.978, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.1, color: arcColor(12) },
  { order: 7, startLat: 48.8566, startLng: 2.3522, endLat: 52.52, endLng: 13.405, arcAlt: 0.1, color: arcColor(13) },
  { order: 8, startLat: -8.8332, startLng: 13.2648, endLat: -33.9249, endLng: 18.4241, arcAlt: 0.2, color: arcColor(14) },
  { order: 8, startLat: 49.2827, startLng: -123.1207, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.24, color: arcColor(15) },
  { order: 9, startLat: 22.3193, startLng: 114.1694, endLat: -26.2041, endLng: 28.0473, arcAlt: 0.44, color: arcColor(16) },
  { order: 9, startLat: 14.5995, startLng: 120.9842, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.32, color: arcColor(17) },
  { order: 10, startLat: 31.2304, startLng: 121.4737, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.32, color: arcColor(18) },
  { order: 10, startLat: -34.6037, startLng: -58.3816, endLat: -23.5505, endLng: -46.6333, arcAlt: 0.1, color: arcColor(19) },
  { order: 11, startLat: 21.3891, startLng: 39.8579, endLat: -33.9249, endLng: 18.4241, arcAlt: 0.28, color: arcColor(20) },
];

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function useStaticGlobeMode() {
  const [staticMode, setStaticMode] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallScreen = window.matchMedia("(max-width: 520px)");
    const update = () => setStaticMode(reducedMotion.matches || smallScreen.matches || !supportsWebGL());

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

function StaticGlobeFallback() {
  return (
    <div className="relative h-[22rem] overflow-hidden rounded-lg bg-[#0f0d1a] md:h-[30rem]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(159,134,232,0.065)_1px,transparent_1px),linear-gradient(90deg,rgba(98,76,171,0.065)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute left-1/2 top-[62%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/25 bg-[radial-gradient(circle_at_42%_34%,rgba(159,134,232,0.32),rgba(36,20,71,0.86)_54%,rgba(10,10,10,0.96)_100%)] shadow-[0_0_70px_rgba(98,76,171,0.28)] md:h-72 md:w-72" />
      <div className="absolute left-1/2 top-[62%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/20 md:h-60 md:w-60" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0f0d1a]" />
      <div className="relative flex h-full items-end justify-center pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/25 bg-purple-400/10 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#CDBEFF]">
          <Globe2 className="h-4 w-4" />
          Static security signal view
        </div>
      </div>
    </div>
  );
}

export default function GlobeDemo() {
  const staticMode = useStaticGlobeMode();
  const globeConfig = useMemo(
    () => ({
      pointSize: 4,
      globeColor: "#1b1235",
      showAtmosphere: true,
      atmosphereColor: "#FFFFFF",
      atmosphereAltitude: 0.1,
      emissive: "#241447",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      polygonColor: "rgba(205,190,255,0.72)",
      ambientLight: "#8B5CF6",
      directionalLeftLight: "#CDBEFF",
      directionalTopLight: "#ffffff",
      pointLight: "#9F86E8",
      arcTime: 1000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      initialPosition: { lat: -26.2041, lng: 28.0473 },
      autoRotate: true,
      autoRotateSpeed: 0.5,
    }),
    [],
  );

  return (
    <div className="relative flex min-h-[28rem] w-full flex-row items-center justify-center overflow-hidden rounded-lg bg-[#0f0d1a] md:min-h-[34rem]">
      <div className="relative mx-auto h-full min-h-[28rem] w-full overflow-hidden bg-[#0f0d1a] px-4 md:min-h-[34rem]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-20 mx-auto max-w-2xl pt-8 text-center md:pt-10">
          <h3 className="text-xl font-bold text-white md:text-4xl">Cybersecurity signals across your business network.</h3>
          <p className="mx-auto mt-3 max-w-md text-sm font-normal leading-6 text-slate-300 md:text-base">
            Illustrative global routes show how NexteraAI connects endpoint, access, alert, and operations visibility around South African protection.
          </p>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-32 select-none bg-gradient-to-b from-transparent to-[#0f0d1a]" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 md:-bottom-5">
          <div className="h-[20rem] w-full max-w-[24rem] overflow-hidden rounded-lg bg-[#0f0d1a] md:h-[27rem] md:max-w-[34rem]">
            {staticMode ? (
              <StaticGlobeFallback />
            ) : (
              <Suspense fallback={<StaticGlobeFallback />}>
                <GlobeWorldStage data={sampleArcs} globeConfig={globeConfig} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
