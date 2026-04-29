import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { mockSecurityRail } from "@/react-app/lib/mockData";

interface DashboardStats {
  threats: { active: number; blocked: number; critical: number; high: number };
  devices: { total: number; protected: number };
  compliance: { score: number };
}

/**
 * Compact right-rail security widget shown alongside Business Operations
 * pages. Polls /api/dashboard/stats every 30 s and falls back to a static
 * mock so the panel is never blank.
 */
export function SecurityRailPanel() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard/stats", {
          credentials: "include",
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as DashboardStats;
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setStats(mockSecurityRail);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    load();
    const interval = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const data = stats ?? mockSecurityRail;
  const protectedRatio =
    data.devices.total > 0
      ? Math.round((data.devices.protected / data.devices.total) * 100)
      : 100;

  return (
    <Card className="p-4 sticky top-20">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">Security at a glance</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            Active threats
          </span>
          <Badge
            variant="outline"
            className={
              data.threats.active > 0
                ? "border-orange-500/30 text-orange-500"
                : ""
            }
          >
            {data.threats.active}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Critical / High
          </span>
          <span className="font-medium">
            {data.threats.critical} / {data.threats.high}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Blocked today
          </span>
          <span className="font-medium">{data.threats.blocked}</span>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-muted-foreground">Devices protected</span>
            <span className="font-medium">{protectedRatio}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded">
            <div
              className="h-1.5 bg-green-500 rounded transition-all"
              style={{ width: `${protectedRatio}%` }}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-muted-foreground">POPIA score</span>
          <Badge variant="outline">{data.compliance.score}%</Badge>
        </div>
      </div>

      {!loaded && (
        <p className="mt-3 text-[11px] text-muted-foreground">Loading live data…</p>
      )}
    </Card>
  );
}
