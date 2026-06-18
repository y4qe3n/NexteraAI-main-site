import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/react-app/lib/AuthContext";
import { useAccessControl } from "@/react-app/hooks/useAccessControl";
import { EmployeeDashboard } from "./EmployeeDashboard";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Monitor,
  Mail,
  Database,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  Radar,
  Activity,
  Sparkles,
  BadgeInfo,
  FileCheck,
  CreditCard,
} from "lucide-react";

type DashboardStats = {
  organization: { id: number; name: string; devices_limit: number };
  threats: { total: number; active: number; blocked: number; resolved: number; critical: number; high: number };
  devices: { total: number; protected: number; active: number; limit: number };
  compliance: { score: number; completed: number; total: number };
  emails: { scannedThisWeek: number; threatsDetected: number };
};

type Threat = {
  id: number;
  threat_type: string;
  severity: string;
  source: string | null;
  target: string | null;
  status: string;
  detected_at: string;
};

const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function timeAgo(dateStr: string) {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function severityTone(severity: string) {
  switch (severity) {
    case "critical":
      return {
        dot: "#F87171",
        chipBg: "rgba(248,113,113,0.14)",
        chipText: "#FCA5A5",
      };
    case "high":
      return {
        dot: "#FB923C",
        chipBg: "rgba(251,146,60,0.14)",
        chipText: "#FDBA74",
      };
    case "medium":
      return {
        dot: "#FACC15",
        chipBg: "rgba(250,204,21,0.14)",
        chipText: "#FDE68A",
      };
    default:
      return {
        dot: "#7EF0C3",
        chipBg: "rgba(126,240,195,0.14)",
        chipText: "#A7F3D0",
      };
  }
}

function formatCurrency(value: number) {
  return `R${value.toLocaleString("en-ZA")}`;
}

function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

export function Dashboard() {
  const { admin } = useAuth();
  const { isBasic, isEmployee } = useAccessControl();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [billingSummary, setBillingSummary] = useState<{
    tier: string;
    deviceCount: number;
    deviceLimit: number | null;
    nextInvoiceEstimateZar: number;
    billingCycle: string;
  } | null>(null);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    let revoked = false;

    fetch("/api/organization/logo", { credentials: "include" })
      .then((r) => {
        if (r.ok && r.headers.get("content-type")?.startsWith("image")) {
          return r.blob();
        }
        return null;
      })
      .then((blob) => {
        if (!blob || revoked) return;
        setLogoUrl(URL.createObjectURL(blob));
      })
      .catch(() => {});

    return () => {
      revoked = true;
    };
  }, []);

  useEffect(() => {
    fetch("/api/billing/summary", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setBillingSummary({
            tier: data.tier,
            deviceCount: data.devices?.current ?? 0,
            deviceLimit: data.devices?.included ?? null,
            nextInvoiceEstimateZar: data.next_invoice?.total_incl_vat ?? 0,
            billingCycle: data.billing_cycle,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [sRes, tRes] = await Promise.all([
          fetch("/api/dashboard/stats", { credentials: "include" }),
          fetch("/api/threats?limit=5", { credentials: "include" }),
        ]);

        if (sRes.ok) setStats(await sRes.json());
        if (tRes.ok) setThreats(await tRes.json());
        if (!sRes.ok && !tRes.ok) setError("Failed to load dashboard data.");
      } catch {
        setError("Something went wrong. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (isEmployee) return <EmployeeDashboard />;

  const firstName = admin?.name?.split(" ")[0] || "there";
  const t = stats?.threats ?? { blocked: 0, active: 0, total: 0, resolved: 0, critical: 0, high: 0 };
  const d = stats?.devices ?? { total: 0, protected: 0, active: 0, limit: 0 };
  const c = stats?.compliance ?? { score: 0, completed: 0, total: 0 };
  const e = stats?.emails ?? { scannedThisWeek: 0, threatsDetected: 0 };

  const deviceCoverage = useMemo(() => {
    if (!d.limit) return 0;
    return Math.round((d.protected / d.limit) * 100);
  }, [d.limit, d.protected]);

  const complianceCoverage = useMemo(() => {
    if (!c.total) return 0;
    return Math.round((c.completed / c.total) * 100);
  }, [c.completed, c.total]);

  const posturing = useMemo(() => {
    if (t.active > 0 || t.critical > 0) return "attention";
    if (deviceCoverage < 100 || complianceCoverage < 100) return "watch";
    return "steady";
  }, [complianceCoverage, deviceCoverage, t.active, t.critical]);

  const postureLabel =
    posturing === "attention"
      ? "Active response needed"
      : posturing === "watch"
        ? "Coverage improving"
        : "Security posture steady";

  const postureCopy =
    posturing === "attention"
      ? `${t.active} active alert${t.active === 1 ? "" : "s"} and ${t.critical} critical item${t.critical === 1 ? "" : "s"} need attention.`
      : posturing === "watch"
        ? `Coverage is solid, but there is still room to finish device and compliance work.`
        : `All clear, ${firstName}. Device, email, and compliance signals are aligned.`;

  if (loading) {
    return (
      <div className="min-h-[55vh] rounded-[2rem] border border-white/5 bg-[radial-gradient(circle_at_top,rgba(126,240,195,0.08),transparent_35%),linear-gradient(180deg,rgba(8,12,18,0.96),rgba(8,12,18,0.88))] p-6">
        <div className="mx-auto flex min-h-[50vh] max-w-5xl flex-col items-center justify-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full border border-emerald-400/30" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-300" />
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Security command deck</p>
            <p className="mt-2 text-lg text-slate-200">Loading live posture, billing, and threat signals.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[1.75rem] border border-rose-400/15 bg-rose-500/5 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-rose-300">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold text-slate-100">Dashboard could not load</h2>
            <p className="mt-1 text-sm text-slate-300">{error}</p>
            <button
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tone = severityTone(t.critical > 0 ? "critical" : t.active > 0 ? "high" : "default");

  return (
    <motion.div
      className="relative overflow-hidden rounded-[2.25rem] border border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(126,240,195,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_24%),linear-gradient(180deg,rgba(8,12,18,0.96),rgba(8,12,18,0.92))] p-4 sm:p-6 lg:p-8"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="nx-grid-bg absolute inset-0 opacity-30" />
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
      </div>

      <div className="relative space-y-6 lg:space-y-8">
        <motion.section
          className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]"
          variants={sectionVariants}
        >
          <div className="nx-glass rounded-[2rem] p-6 sm:p-7 lg:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200">
                Security command deck
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
                {stats?.organization.name ?? "Your organisation"}
              </span>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)] lg:items-end">
              <div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                  Live threat, device, and compliance signals
                </div>
                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-slate-50 sm:text-5xl xl:text-6xl">
                  {postureLabel}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  {postureCopy}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/dashboard/threats"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                  >
                    View alerts
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/dashboard/endpoints"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Open devices
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/dashboard/billing"
                    className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:bg-amber-300/15"
                  >
                    Review billing
                    <CreditCard className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.75)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Posture core</p>
                    <p className="mt-1 text-sm font-medium text-slate-200">Coverage and response</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                    {formatPercent(deviceCoverage)} devices
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-center">
                  <div
                    className="relative flex h-56 w-56 items-center justify-center rounded-full border border-white/10"
                    style={{
                      background: `conic-gradient(from 210deg, ${tone.dot} 0 ${Math.max(deviceCoverage, 6)}%, rgba(255,255,255,0.07) ${Math.max(deviceCoverage, 6)}% 100%)`,
                    }}
                  >
                    <div className="absolute inset-4 rounded-full border border-white/8 bg-slate-950/90 shadow-inner" />
                    <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,rgba(126,240,195,0.14),rgba(8,12,18,0.95))]">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Organisation logo" className="h-16 w-16 rounded-full object-contain" />
                      ) : (
                        <Shield className="h-12 w-12 text-emerald-300" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <KpiChip icon={<ShieldCheck className="h-4 w-4" />} label="Blocked" value={t.blocked} accent="#7EF0C3" />
                  <KpiChip icon={<ShieldAlert className="h-4 w-4" />} label="Active" value={t.active} accent={t.active > 0 ? "#F97316" : "#7EF0C3"} />
                  <KpiChip icon={<FileCheck className="h-4 w-4" />} label="Compliance" value={formatPercent(complianceCoverage)} accent="#FACC15" />
                </div>

                <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
                    <span>Environment pulse</span>
                    <span>{stats?.emails.scannedThisWeek ?? 0} emails scanned</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-white/8 bg-slate-950/50 p-3">
                      <p className="text-slate-500">Devices protected</p>
                      <p className="mt-1 text-lg font-semibold text-slate-100">{d.protected} / {d.limit || d.total}</p>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-slate-950/50 p-3">
                      <p className="text-slate-500">Threats stopped</p>
                      <p className="mt-1 text-lg font-semibold text-slate-100">{e.threatsDetected}</p>
                    </div>
                  </div>
                </div>

                <label
                  className="mt-4 flex cursor-pointer items-center justify-center rounded-full border border-dashed border-white/12 bg-white/[0.02] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05]"
                  title="Upload your company logo"
                >
                  <span>{logoUploading ? "Uploading logo..." : "Update company logo"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLogoUploading(true);
                      const fd = new FormData();
                      fd.append("logo", file);
                      try {
                        const res = await fetch("/api/organization/logo", {
                          method: "POST",
                          credentials: "include",
                          body: fd,
                        });
                        if (res.ok) {
                          setLogoUrl(URL.createObjectURL(file));
                        }
                      } catch {
                        // no-op
                      } finally {
                        setLogoUploading(false);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" variants={sectionVariants}>
          <MetricTile
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Threats blocked"
            value={t.blocked}
            sub={`${t.resolved} resolved`}
            accent="#7EF0C3"
          />
          <MetricTile
            icon={<ShieldAlert className="h-5 w-5" />}
            label="Active alerts"
            value={t.active}
            sub={t.critical > 0 ? `${t.critical} critical` : "No critical items"}
            accent={t.active > 0 ? "#F97316" : "#7EF0C3"}
          />
          <MetricTile
            icon={<Monitor className="h-5 w-5" />}
            label="Device coverage"
            value={`${d.protected}/${d.limit || d.total}`}
            sub={`${d.active} online now`}
            accent="#93C5FD"
          />
          <MetricTile
            icon={<Mail className="h-5 w-5" />}
            label="Email threats stopped"
            value={e.threatsDetected}
            sub={`${e.scannedThisWeek} scanned this week`}
            accent="#FACC15"
          />
        </motion.section>

        <motion.section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]" variants={sectionVariants}>
          <div className="nx-glass rounded-[2rem] p-0">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                  <Activity className="h-4 w-4 text-emerald-300" />
                  Live incident stream
                </div>
                <h2 className="mt-2 text-lg font-semibold text-slate-50">Recent security activity</h2>
              </div>
              <Link to="/dashboard/threats" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-300 transition hover:text-emerald-200">
                All events
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {threats.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="rounded-full border border-emerald-400/15 bg-emerald-400/10 p-4 text-emerald-200">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <p className="mt-4 text-lg font-medium text-slate-100">No recent threats</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  The environment looks calm right now. The next event that arrives will appear here with source, target, and severity.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/6">
                {threats.map((threat) => {
                  const tone = severityTone(threat.severity);

                  return (
                    <div key={threat.id} className="grid gap-4 px-5 py-4 sm:px-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
                      <div
                        className="mt-1 h-3 w-3 rounded-full shadow-[0_0_18px_rgba(255,255,255,0.2)]"
                        style={{ backgroundColor: tone.dot }}
                      />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-100">{threat.threat_type}</p>
                          <span
                            className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                            style={{ backgroundColor: tone.chipBg, color: tone.chipText }}
                          >
                            {threat.severity}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-slate-400">
                          {threat.source ?? "Unknown source"} to {threat.target ?? "Unknown target"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 md:justify-end">
                        <span
                          className="rounded-full border border-white/8 px-3 py-1 text-xs font-medium capitalize text-slate-200"
                          style={{
                            backgroundColor:
                              threat.status === "blocked" || threat.status === "resolved"
                                ? "rgba(126,240,195,0.12)"
                                : "rgba(251,191,36,0.12)",
                            color:
                              threat.status === "blocked" || threat.status === "resolved"
                                ? "#A7F3D0"
                                : "#FDE68A",
                          }}
                        >
                          {threat.status}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{timeAgo(threat.detected_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <InfoCard
              icon={<Radar className="h-4 w-4" />}
              title="Systems"
              eyebrow="Operational status"
            >
              <div className="space-y-3">
                <SystemLine name="Endpoint Shield" active />
                <SystemLine name="Email Guard" active />
                <SystemLine name="Access Control" active />
                <SystemLine name="Data Vault" active />
              </div>
            </InfoCard>

            <InfoCard
              icon={<Database className="h-4 w-4" />}
              title="Billing"
              eyebrow="Capacity and plan"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Plan tier</p>
                    <p className="mt-1 text-lg font-semibold text-slate-100 capitalize">
                      {billingSummary?.tier ?? "basic"}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                    {billingSummary?.billingCycle ?? "monthly"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Device capacity</span>
                    <span>
                      {billingSummary?.deviceCount ?? 0}
                      {billingSummary?.deviceLimit ? ` / ${billingSummary.deviceLimit}` : ""}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/6">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((billingSummary?.deviceCount ?? 0) / (billingSummary?.deviceLimit ?? Math.max(d.limit, 1))) * 100,
                          100,
                        )}%`,
                        background: "linear-gradient(90deg, #7EF0C3 0%, #93C5FD 100%)",
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-slate-400">Next invoice</span>
                  <span className="text-2xl font-semibold tracking-[-0.04em] text-slate-100">
                    {formatCurrency(billingSummary?.nextInvoiceEstimateZar ?? 0)}
                  </span>
                </div>

                <Link
                  to="/dashboard/billing"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  Manage billing
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </InfoCard>

            <InfoCard
              icon={<BadgeInfo className="h-4 w-4" />}
              title="Coverage snapshot"
              eyebrow="At a glance"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TinyStat label="Devices protected" value={`${d.protected} / ${d.limit || d.total}`} />
                <TinyStat label="Compliance" value={`${c.completed} / ${c.total}`} />
                <TinyStat label="Threats blocked" value={String(t.blocked)} />
                <TinyStat label="Email alerts" value={String(e.threatsDetected)} />
              </div>
            </InfoCard>

            {isBasic && (
              <Link
                to="/dashboard/billing"
                className="block rounded-[1.75rem] border border-amber-300/20 bg-[linear-gradient(135deg,rgba(250,204,21,0.12),rgba(126,240,195,0.08))] p-5 transition hover:-translate-y-0.5 hover:border-amber-300/35"
              >
                <p className="text-sm font-semibold text-slate-100">Upgrade to Pro</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Unlock advanced detection, higher device capacity, and a stronger support tier.
                </p>
              </Link>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

function MetricTile({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <div className="nx-glass rounded-[1.5rem] p-5 transition hover:-translate-y-1 hover:border-white/15">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-50">{value}</p>
        </div>
        <div className="rounded-2xl border border-white/8 p-3" style={{ backgroundColor: `${accent}18`, color: accent }}>
          {icon}
        </div>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/6">
        <div className="h-full w-2/3 rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.25))` }} />
      </div>
      <p className="mt-3 text-sm text-slate-400">{sub}</p>
    </div>
  );
}

function InfoCard({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="nx-glass rounded-[1.75rem] p-5">
      <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            {icon}
            {eyebrow}
          </div>
          <h2 className="mt-2 text-lg font-semibold text-slate-50">{title}</h2>
        </div>
      </div>
      <div className="pt-5">{children}</div>
    </div>
  );
}

function SystemLine({ name, active }: { name: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-3 py-3">
      <div className={`h-2.5 w-2.5 rounded-full ${active ? "bg-emerald-300 shadow-[0_0_18px_rgba(126,240,195,0.45)]" : "bg-slate-500"}`} />
      <span className="flex-1 text-sm text-slate-100">{name}</span>
      <span className="text-xs font-medium text-slate-400">{active ? "Active" : "Muted"}</span>
    </div>
  );
}

function TinyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function KpiChip({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  accent: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
