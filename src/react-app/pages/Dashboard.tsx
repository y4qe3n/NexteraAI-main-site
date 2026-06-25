import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeInfo,
  Database,
  Loader2,
  Monitor,
  Radar,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/react-app/lib/AuthContext";
import { useAccessControl } from "@/react-app/hooks/useAccessControl";
import { EmployeeDashboard } from "./EmployeeDashboard";

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

type BillingSummary = {
  tier: string;
  deviceCount: number;
  deviceLimit: number | null;
  nextInvoiceEstimateZar: number;
  billingCycle: string;
} | null;

function timeAgo(dateStr: string) {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatCurrency(value: number) {
  return `R${value.toLocaleString("en-ZA")}`;
}

function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

function StatCard({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-5 shadow-[0_20px_60px_-35px_rgba(124,58,237,0.55)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#8778AD]">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{value}</p>
        </div>
        <div className="rounded-xl border border-[#8B5CF6]/20 bg-[#1A102B] p-3 text-[#C4B5FD]">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#A89CC8]">{note}</p>
    </div>
  );
}

function SectionCard({
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
    <section className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-5">
      <div className="flex items-center justify-between gap-4 border-b border-[#8B5CF6]/12 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#8778AD]">
            {icon}
            {eyebrow}
          </div>
          <h2 className="mt-2 text-lg font-semibold text-white">{title}</h2>
        </div>
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

export function Dashboard() {
  const { admin } = useAuth();
  const { isEmployee } = useAccessControl();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [billingSummary, setBillingSummary] = useState<BillingSummary>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, threatsRes, billingRes] = await Promise.all([
          fetch("/api/dashboard/stats", { credentials: "include" }),
          fetch("/api/threats?limit=3", { credentials: "include" }),
          fetch("/api/billing/summary", { credentials: "include" }),
        ]);

        if (cancelled) return;

        if (statsRes.ok) setStats(await statsRes.json());
        if (threatsRes.ok) setThreats(await threatsRes.json());
        if (billingRes.ok) {
          const data = await billingRes.json();
          setBillingSummary({
            tier: data.tier,
            deviceCount: data.devices?.current ?? 0,
            deviceLimit: data.devices?.included ?? null,
            nextInvoiceEstimateZar: data.next_invoice?.total_incl_vat ?? 0,
            billingCycle: data.billing_cycle,
          });
        }

        if (!statsRes.ok && !threatsRes.ok && !billingRes.ok) {
          setError("Dashboard data could not load.");
        }
      } catch {
        if (!cancelled) setError("Something went wrong. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isEmployee) return <EmployeeDashboard />;

  const businessName = stats?.organization?.name || admin?.name || "NexteraAI Operations";
  const devices = stats?.devices ?? { total: 0, protected: 0, active: 0, limit: 0 };
  const threatsSummary = stats?.threats ?? { total: 0, active: 0, blocked: 0, resolved: 0, critical: 0, high: 0 };
  const compliance = stats?.compliance ?? { score: 0, completed: 0, total: 0 };
  const emails = stats?.emails ?? { scannedThisWeek: 0, threatsDetected: 0 };

  const deviceCoverage = devices.limit ? Math.round((devices.protected / devices.limit) * 100) : 0;
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-6xl items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 rounded-full border border-[#8B5CF6]/12 bg-[#0c0a11] px-5 py-3 text-sm text-[#A89CC8]">
          <Loader2 className="h-4 w-4 animate-spin text-[#C4B5FD]" />
          Loading dashboard
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-rose-400/15 bg-rose-500/5 p-6">
          <p className="text-sm font-semibold text-white">Dashboard could not load</p>
          <p className="mt-2 text-sm text-slate-300">{error}</p>
          <button
            className="mt-4 rounded-full border border-[#8B5CF6]/14 bg-[#0b0910] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#14101d]"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const recentThreats = threats.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[#8B5CF6]/12 bg-[linear-gradient(180deg,rgba(12,10,18,0.99),rgba(5,4,10,0.99))] p-6 shadow-[0_35px_90px_-45px_rgba(124,58,237,0.55)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8778AD]">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              {businessName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A89CC8] sm:text-base">
              Quick status for devices, threats, compliance, and billing. Open Agents when you need to check enrolled devices or roll out a new one.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
            <Link
              to="/dashboard/agents"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6D28D9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8B5CF6]"
            >
              Open agents
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard/threats"
              className="inline-flex items-center justify-center rounded-full border border-[#8B5CF6]/14 bg-[#0b0910] px-4 py-2.5 text-sm font-medium text-[#E9D5FF] transition hover:bg-[#14101d]"
            >
              Review threats
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0a0810] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#8778AD]">Devices</p>
            <p className="mt-2 text-2xl font-semibold text-white">{devices.protected} / {devices.limit || devices.total}</p>
          </div>
          <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0a0810] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#8778AD]">Threats</p>
            <p className="mt-2 text-2xl font-semibold text-white">{threatsSummary.active} open</p>
          </div>
          <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0a0810] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#8778AD]">Compliance</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatPercent(compliance.score)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard
          label="Protected devices"
          value={`${devices.protected}`}
          note={`Coverage sits at ${formatPercent(deviceCoverage)} across the current fleet.`}
          icon={<Monitor className="h-5 w-5" />}
        />
        <StatCard
          label="Open threats"
          value={`${threatsSummary.active}`}
          note={`${threatsSummary.blocked} threats have already been blocked or resolved.`}
          icon={<Radar className="h-5 w-5" />}
        />
        <StatCard
          label="Compliance score"
          value={formatPercent(compliance.score)}
          note={`${compliance.completed} of ${compliance.total} checks are complete.`}
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard eyebrow="Recent" title="Threats" icon={<BadgeInfo className="h-4 w-4" />}>
          {recentThreats.length ? (
            <div className="space-y-3">
              {recentThreats.map((threat) => (
                <div key={threat.id} className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0b0910] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{threat.threat_type}</p>
                      <p className="mt-1 text-sm text-[#A89CC8]">
                        {threat.source ?? "Unknown source"} to {threat.target ?? "Unknown target"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex rounded-full border border-[#8B5CF6]/20 bg-[#1A102B] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E9D5FF]">
                        {threat.severity}
                      </span>
                      <p className="mt-2 text-xs text-[#8778AD]">{timeAgo(threat.detected_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#8B5CF6]/14 bg-[#0b0910] p-5 text-sm text-[#A89CC8]">
              No recent threats.
            </div>
          )}
        </SectionCard>

        <div className="space-y-6">
          <SectionCard eyebrow="Agents" title="Device rollout" icon={<ShieldCheck className="h-4 w-4" />}>
            <p className="text-sm leading-6 text-[#A89CC8]">
              Check enrolled agents, invite a new device, or review the fleet from one place.
            </p>
            <Link
              to="/dashboard/agents"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#C4B5FD] transition hover:text-white"
            >
              Go to agents
              <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionCard>

          <SectionCard eyebrow="Billing" title="Plan" icon={<Database className="h-4 w-4" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#A89CC8]">Current tier</p>
                  <p className="mt-1 text-lg font-semibold text-white capitalize">
                    {billingSummary?.tier ?? "basic"}
                  </p>
                </div>
                <div className="rounded-full border border-[#8B5CF6]/14 bg-[#0b0910] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#D8B4FE]">
                  {billingSummary?.billingCycle ?? "monthly"}
                </div>
              </div>

              <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0b0910] p-4">
                <div className="flex items-center justify-between text-xs text-[#8f7dbf]">
                  <span>Device capacity</span>
                  <span>
                    {billingSummary?.deviceCount ?? 0}
                    {billingSummary?.deviceLimit ? ` / ${billingSummary.deviceLimit}` : ""}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/6">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#C4B5FD]"
                    style={{
                      width: `${Math.min(
                        ((billingSummary?.deviceCount ?? 0) / (billingSummary?.deviceLimit ?? Math.max(devices.limit, 1))) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-sm text-[#A89CC8]">Next invoice</span>
                <span className="text-2xl font-semibold tracking-[-0.04em] text-white">
                  {formatCurrency(billingSummary?.nextInvoiceEstimateZar ?? 0)}
                </span>
              </div>

              <Link
                to="/dashboard/billing"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C4B5FD] transition hover:text-white"
              >
                Manage billing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Mail" title="Weekly email checks" icon={<ShieldCheck className="h-4 w-4" />}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0b0910] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8778AD]">Scanned</p>
                <p className="mt-2 text-xl font-semibold text-white">{emails.scannedThisWeek}</p>
              </div>
              <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0b0910] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8778AD]">Threats</p>
                <p className="mt-2 text-xl font-semibold text-white">{emails.threatsDetected}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
