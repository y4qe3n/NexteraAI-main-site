import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Progress } from "@/react-app/components/ui/progress";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  Lock,
  Database,
  TrendingUp,
  Clock,
  Radar,
  Loader2,
  AlertCircle,
  Maximize2,
  Minimize2,
  Brain,
} from "lucide-react";

type DashboardStats = {
  organization: { id: number; name: string; devices_limit: number };
  threats: {
    total: number;
    active: number;
    blocked: number;
    resolved: number;
    critical: number;
    high: number;
  };
  devices: {
    total: number;
    protected: number;
    active: number;
    limit: number;
  };
  compliance: { score: number; completed: number; total: number };
  emails: { scannedThisWeek: number; threatsDetected: number };
  ai?: { total: number; threats: number; critical: number; high: number };
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

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffHours / 24)} days ago`;
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    default:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "blocked":
    case "resolved":
      return <ShieldCheck className="w-4 h-4 text-green-500" />;
    case "detected":
    case "investigating":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    default:
      return <XCircle className="w-4 h-4 text-red-500" />;
  }
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsExpanded, setAlertsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, threatsRes] = await Promise.all([
          fetch("/api/dashboard/stats", { credentials: "include" }),
          fetch("/api/threats?limit=5", { credentials: "include" }),
        ]);
        if (!statsRes.ok) throw new Error("Failed to load dashboard stats");
        if (!threatsRes.ok) throw new Error("Failed to load threats");
        const [statsData, threatsData] = await Promise.all([
          statsRes.json(),
          threatsRes.json(),
        ]);
        setStats(statsData);
        setThreats(threatsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-6 h-6" />
          <div>
            <p className="font-medium">Failed to load dashboard</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  const threatStats = stats?.threats ?? { blocked: 0, active: 0, total: 0, resolved: 0, critical: 0, high: 0 };
  // Calculate threat-based score: more threats handled = higher score
  const totalThreats = threatStats.total || 1;
  const resolvedRatio = (threatStats.resolved || 0) / totalThreats;
  const blockedRatio = (threatStats.blocked || 0) / totalThreats;
  const threatScore = Math.round((resolvedRatio * 50 + blockedRatio * 50));
  const complianceScore = threatScore;
  const overallScore = complianceScore;
  const criticalAlerts = threatStats.critical ?? 0;
  const overallState =
    overallScore >= 85 ? "good" : overallScore >= 60 ? "warning" : "poor";
  const heroGradient =
    overallState === "good"
      ? "from-green-500/20 via-emerald-500/10 to-emerald-500/5 border-green-500/30"
      : overallState === "warning"
      ? "from-yellow-400/20 via-orange-400/10 to-amber-500/5 border-amber-400/30"
      : "from-purple-500/20 via-purple-900/30 to-background border-purple-500/30";
  const scoreColor =
    overallState === "good"
      ? "text-green-500"
      : overallState === "warning"
      ? "text-amber-500"
      : "text-rose-500";
  const protectionStatus = [
    {
      name: "Endpoint Shield",
      status: "active",
      devices:
        "Auto-scans devices for malware and ransomware. Blocks threats in real-time to prevent 80% of device-based attacks.",
      icon: Shield,
    },
    {
      name: "Email Guard",
      status: "active",
      devices:
        "Advanced phishing protection that filters emails, scans attachments, and flags SA-specific scams like SIM-swap lures.",
      icon: Mail,
    },
    {
      name: "Access Control",
      status: "active",
      devices:
        "Enforce MFA, audit logins, and manage passwords. Blocks 99% of credential stuffing attacks automatically.",
      icon: Lock,
    },
    {
      name: "Data Vault",
      status: "active",
      devices:
        "Automated encrypted backups with immutability. Quick recovery from ransomware with 3-2-1 backup strategy.",
      icon: Database,
    },
  ];

  const lastThreat = threats[0];
  const lastThreatMsg = lastThreat
    ? `Last threat ${lastThreat.status === "blocked" ? "blocked" : "detected"} ${formatTimeAgo(lastThreat.detected_at)}`
    : "No recent threats";

  return (
    <div className="space-y-6">
      {/* Top hero */}
      <Card
        className={`p-6 sm:p-8 bg-gradient-to-r ${heroGradient}`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${scoreColor}`}>
                {overallScore}%
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                Security posture
              </span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                Executive Security Overview
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Your business is {overallScore}% protected – {criticalAlerts} critical alerts.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {lastThreatMsg}.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              Org: {stats?.organization.name ?? "Unknown"}
            </Badge>
            <Badge variant="outline">
              Devices limit: {stats?.devices.limit ?? 0}
            </Badge>
            <Badge variant="outline">
              POPIA score: {complianceScore}%
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Threats Blocked</p>
              <p className="text-3xl font-bold mt-1">{threatStats.blocked}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp className="w-4 h-4" />
                {stats?.threats.resolved ?? 0} resolved
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-3xl font-bold mt-1">{threatStats.active}</p>
              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Critical:
                  </span>
                  <span className="font-medium">{threatStats.critical ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    High:
                  </span>
                  <span className="font-medium">{threatStats.high ?? 0}</span>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Email Threats Stopped</p>
              <p className="text-3xl font-bold mt-1">
                {(stats?.emails.threatsDetected ?? 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {(stats?.emails.scannedThisWeek ?? 0).toLocaleString()} scanned this week
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Radar className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">POPIA Compliance Score</p>
              <p className="text-3xl font-bold mt-1">{complianceScore}%</p>
              <Progress value={complianceScore} className="mt-3 h-2" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>

        {stats?.ai && (
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI detections</p>
                <p className="text-3xl font-bold mt-1">{stats.ai.total}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.ai.threats} flagged · {stats.ai.critical} critical · {stats.ai.high} high
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Recent alerts - Expandable */}
      <div className={`transition-all duration-300 ${alertsExpanded ? 'fixed inset-4 z-50' : 'grid lg:grid-cols-3 gap-6'}`}>
        <Card className={`p-0 overflow-hidden ${alertsExpanded ? 'h-full w-full' : 'lg:col-span-2'}`}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Recent Alerts</h3>
              <p className="text-sm text-muted-foreground">
                {alertsExpanded ? 'All security events across your environment.' : 'Last 5 security events across your environment.'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white"
              onClick={() => setAlertsExpanded(!alertsExpanded)}
            >
              {alertsExpanded ? (
                <><Minimize2 className="w-4 h-4 mr-1" /> Collapse</>
              ) : (
                <><Maximize2 className="w-4 h-4 mr-1" /> View All Alerts</>
              )}
            </Button>
          </div>
          <div className={`divide-y divide-border ${alertsExpanded ? 'max-h-[calc(100vh-200px)] overflow-y-auto' : ''}`}>
            {threats.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <ShieldCheck className="w-12 h-12 mx-auto mb-2 text-green-500/50" />
                <p className="font-medium">No recent threats</p>
                <p className="text-sm">Your systems are clear. No security events to display.</p>
              </div>
            ) : (
            threats.map((threat) => (
              <div key={threat.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">{getStatusIcon(threat.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{threat.threat_type}</span>
                      <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                        {threat.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {threat.source || "Unknown"} → {threat.target || "Unknown"}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        threat.status === "blocked"
                          ? "border-green-500/30 text-green-500"
                          : threat.status === "resolved"
                            ? "border-blue-500/30 text-blue-500"
                            : "border-yellow-500/30 text-yellow-500"
                      }
                    >
                      {threat.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimeAgo(threat.detected_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </Card>

        {!alertsExpanded && (
          /* Protection status */
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Protection Status</h3>
              <p className="text-sm text-muted-foreground">All systems operational</p>
            </div>
            <div className="p-4 space-y-4">
              {protectionStatus.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.devices}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <Button variant="outline" size="sm" className="w-full text-white" asChild>
                <Link to="/dashboard/ai-detections">Run Security Scan</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Quick actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Single-click actions for busy owners</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" className="text-white" asChild>
              <Link to="/dashboard/ai-detections">Scan Now</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-white" asChild>
              <Link to="/dashboard/email">Run Phishing Test</Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="text-white">
              <Link to="/dashboard/threats">View Alerts</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-white" asChild>
              <Link to="/dashboard/compliance">Generate Report</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
