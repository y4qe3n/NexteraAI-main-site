import { lazy, Suspense } from "react";
import { Activity, ArrowRight, Globe2, LockKeyhole, Network, ShieldCheck } from "lucide-react";

const GlobeDemo = lazy(() => import("@/react-app/components/globe-demo"));

const SIGNAL_STATS = [
  {
    icon: Activity,
    label: "Real-time Signals",
    detail: "Device and threat activity",
  },
  {
    icon: ShieldCheck,
    label: "Local Business Protection",
    detail: "Built for South African SMMEs",
  },
  {
    icon: Network,
    label: "Connected Security",
    detail: "Endpoints, alerts, access, and operations",
  },
];

function GlobeFallback() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[rgba(159,134,232,0.16)] bg-[#0f0d1a]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(159,134,232,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(98,76,171,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(98,76,171,0.22),transparent_34%),radial-gradient(circle_at_62%_58%,rgba(139,92,246,0.16),transparent_34%)]" />
      <div className="relative flex min-h-[360px] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-purple-300/30 bg-purple-400/10 shadow-[0_0_45px_rgba(98,76,171,0.32)]">
          <Globe2 className="h-9 w-9 text-[#CDBEFF]" />
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-300">
          Global signal view loading. The section remains available as a static security network if animation is unavailable.
        </p>
      </div>
    </div>
  );
}

export default function AttackMap() {
  return (
    <section
      id="final-cta"
      data-testid="attack-map-section"
      aria-labelledby="global-threat-intelligence-title"
      className="relative overflow-hidden bg-[#0A0A0A] py-24 text-slate-100 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 540px at 18% 20%, rgba(98,76,171,0.22), transparent 58%), radial-gradient(760px 520px at 86% 60%, rgba(159,134,232,0.14), transparent 62%), linear-gradient(180deg, #0A0A0A 0%, #0f0d1a 46%, #0A0A0A 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9F86E8]/35 to-transparent" />

      <div className="relative nx-container">
        <div className="grid items-center gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
          <div>
            <span className="nx-badge !border-[rgba(159,134,232,0.35)] !bg-[rgba(98,76,171,0.12)] !text-[#CDBEFF]">
              <Globe2 className="h-3.5 w-3.5" />
              Global Threat Intelligence
            </span>

            <h2
              id="global-threat-intelligence-title"
              className="font-display mt-6 max-w-2xl text-4xl font-semibold leading-[1.05] text-white md:text-5xl"
            >
              Global threat visibility. Local protection.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
              NexteraAI helps South African businesses understand security activity across devices, users, and digital operations from one protected dashboard.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {SIGNAL_STATS.map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  className="rounded-lg border border-[rgba(159,134,232,0.14)] bg-[rgba(98,76,171,0.06)] p-4 shadow-[0_18px_44px_-28px_rgba(98,76,171,0.58)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[rgba(159,134,232,0.28)] bg-[rgba(98,76,171,0.14)] text-[#CDBEFF]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{label}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#pricing" data-testid="attack-map-cta" className="nx-btn-primary nx-shine">
                <ShieldCheck className="h-4 w-4" />
                Get Started
                <ArrowRight className="h-4 w-4" data-icon-end />
              </a>
              <a href="#features" className="nx-btn-ghost">
                <LockKeyhole className="h-4 w-4" />
                Explore protection
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_50%_50%,rgba(98,76,171,0.24),transparent_58%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-lg border border-[rgba(159,134,232,0.14)] bg-[#0f0d1a] p-3 shadow-[0_40px_120px_-45px_rgba(98,76,171,0.68)] md:p-5">
              <Suspense fallback={<GlobeFallback />}>
                <GlobeDemo />
              </Suspense>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Illustrative security signal paths anchored around South African business protection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
