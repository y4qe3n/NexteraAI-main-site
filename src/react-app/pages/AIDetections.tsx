import { useEffect, useState, useCallback } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/react-app/components/ui/table";
import {
  AlertTriangle,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Brain,
  Mail,
  UserX,
  Phone,
  FileCheck,
  Play,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";

type Detection = {
  id: number;
  module: string;
  severity: string;
  risk_score: number;
  is_threat: number;
  title: string;
  description: string;
  action: string;
  source_type: string | null;
  source_id: string | null;
  status: string;
  created_at: string;
  raw_output: string | null;
};

type Stats = {
  total: number;
  threats: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unresolved: number;
};

type Summary = {
  last24h: { total: number; threats: number; critical: number };
  last7d: { total: number; threats: number };
  byModule: Array<{ module: string; count: number; threats: number; avgScore: number }>;
  recentCritical: Detection[];
};

const MODULE_ICONS: Record<string, typeof Brain> = {
  threat_detector: ShieldAlert,
  phishing_classifier: Mail,
  login_anomaly: UserX,
  missed_call_reply: Phone,
  popia_checker: FileCheck,
};

const MODULE_LABELS: Record<string, string> = {
  threat_detector: "Threat Detector",
  phishing_classifier: "Phishing Classifier",
  login_anomaly: "Login Anomaly",
  missed_call_reply: "Missed Call AI",
  popia_checker: "POPIA Checker",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/30",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  info: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-red-500/10 text-red-400 border-red-500/30",
  acknowledged: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  investigating: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  resolved: "bg-green-500/10 text-green-400 border-green-500/30",
  false_positive: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RiskBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-red-500" : score >= 60 ? "bg-orange-500" : score >= 40 ? "bg-yellow-500" : score >= 20 ? "bg-blue-500" : "bg-slate-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono">{score}</span>
    </div>
  );
}

export function AIDetectionsPage() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [simResult, setSimResult] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ limit: "100" });
      if (moduleFilter !== "all") params.set("module", moduleFilter);
      if (severityFilter !== "all") params.set("severity", severityFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const [detectionsRes, summaryRes] = await Promise.all([
        fetch(`/api/ai/detections?${params}`, { credentials: "include" }),
        fetch("/api/ai/summary", { credentials: "include" }),
      ]);

      if (!detectionsRes.ok) throw new Error("Failed to load detections");
      if (!summaryRes.ok) throw new Error("Failed to load summary");

      const detectionsData = await detectionsRes.json();
      const summaryData = await summaryRes.json();

      setDetections(detectionsData.detections || []);
      setStats(detectionsData.stats || null);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [moduleFilter, severityFilter, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSimulate = async () => {
    setSimulating(true);
    setSimResult(null);
    try {
      const res = await fetch("/api/ai/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: "all" }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Simulation failed");
      const data = await res.json();
      setSimResult(
        `${data.summary.total} scenarios run: ${data.summary.threats} threats detected, ${data.summary.critical} critical, ${data.summary.high} high`
      );
      await fetchData();
    } catch (err) {
      setSimResult("Simulation failed. Check console.");
    } finally {
      setSimulating(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    setSimResult(null);
    try {
      const res = await fetch("/api/ai/clear", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to clear detections");
      setSimResult("AI detections cleared – dashboard refreshed.");
      await fetchData();
    } catch (err) {
      setSimResult(err instanceof Error ? err.message : "Clear request failed.");
    } finally {
      setClearing(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await fetch(`/api/ai/detections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });
      setDetections((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
    } catch {
      // silent fail
    }
  };

  const filteredDetections = detections.filter((d) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const haystack = [d.title, d.description, d.source_id, d.module]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  if (loading && !detections.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" />
            AI Detection Center
          </h2>
          <p className="text-sm text-muted-foreground">
            5 independent AI modules monitoring threats, phishing, login anomalies, missed calls, and POPIA compliance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-white"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            className="text-white bg-primary hover:bg-primary/90"
            onClick={handleSimulate}
            disabled={simulating || clearing}
          >
            {simulating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Simulate Threats
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white border border-white/30"
            onClick={handleClear}
            disabled={clearing || simulating}
          >
            {clearing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            Clear Detections
          </Button>
        </div>
      </div>

      {/* Simulation result banner */}
      {simResult && (
        <Card className="p-3 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{simResult}</span>
            <button
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setSimResult(null)}
            >
              Dismiss
            </button>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Last 24h</p>
            <p className="text-2xl font-bold mt-1">{summary.last24h.total}</p>
            <p className="text-xs text-muted-foreground">
              {summary.last24h.threats} threats
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Critical (24h)</p>
            <p className="text-2xl font-bold mt-1 text-red-400">{summary.last24h.critical}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Last 7 Days</p>
            <p className="text-2xl font-bold mt-1">{summary.last7d.total}</p>
            <p className="text-xs text-muted-foreground">
              {summary.last7d.threats} threats
            </p>
          </Card>
          {stats && (
            <>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Unresolved</p>
                <p className="text-2xl font-bold mt-1 text-orange-400">{stats.unresolved}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Scanned</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Threat Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.total > 0 ? Math.round((stats.threats / stats.total) * 100) : 0}%
                </p>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Module breakdown */}
      {summary && summary.byModule.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {summary.byModule.map((m) => {
            const Icon = MODULE_ICONS[m.module] || Brain;
            return (
              <Card key={m.module} className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {MODULE_LABELS[m.module] || m.module}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.count} scans · {m.threats} threats · avg {m.avgScore}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 bg-background flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search detections..."
              className="bg-transparent outline-none text-sm placeholder:text-muted-foreground w-full"
            />
          </div>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="border rounded-md px-3 py-1.5 bg-background text-sm"
          >
            <option value="all">All Modules</option>
            <option value="threat_detector">Threat Detector</option>
            <option value="phishing_classifier">Phishing Classifier</option>
            <option value="login_anomaly">Login Anomaly</option>
            <option value="missed_call_reply">Missed Call AI</option>
            <option value="popia_checker">POPIA Checker</option>
          </select>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="border rounded-md px-3 py-1.5 bg-background text-sm"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-1.5 bg-background text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="false_positive">False Positive</option>
          </select>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="p-4 border-destructive/30 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {/* Detection Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">AI Detection Feed</h3>
          <p className="text-sm text-muted-foreground">
            {filteredDetections.length} detection{filteredDetections.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDetections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    {detections.length === 0
                      ? 'No detections yet. Click "Simulate Threats" to generate test data.'
                      : "No detections match the current filters."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDetections.map((d) => {
                  const Icon = MODULE_ICONS[d.module] || Brain;
                  const isExpanded = expandedRow === d.id;
                  return (
                    <TableRow key={d.id} className="group">
                      <TableCell>
                        <button onClick={() => setExpandedRow(isExpanded ? null : d.id)}>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDateTime(d.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs">{MODULE_LABELS[d.module] || d.module}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="flex items-center gap-2">
                          {d.is_threat ? (
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                          )}
                          <span className="text-sm truncate">{d.title}</span>
                        </div>
                        {isExpanded && (
                          <div className="mt-3 space-y-2 text-xs">
                            <p className="text-muted-foreground">{d.description}</p>
                            <p className="font-medium text-primary">Action: {d.action}</p>
                            {d.source_id && (
                              <p className="text-muted-foreground">Source: {d.source_id}</p>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <RiskBar score={d.risk_score} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={SEVERITY_COLORS[d.severity] || ""}>
                          {d.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={STATUS_COLORS[d.status] || ""}>
                          {d.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {d.status === "new" && (
                            <>
                              <button
                                title="Acknowledge"
                                onClick={() => handleUpdateStatus(d.id, "acknowledged")}
                                className="p-1 rounded hover:bg-muted"
                              >
                                <Eye className="w-4 h-4 text-yellow-400" />
                              </button>
                              <button
                                title="Resolve"
                                onClick={() => handleUpdateStatus(d.id, "resolved")}
                                className="p-1 rounded hover:bg-muted"
                              >
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              </button>
                              <button
                                title="False positive"
                                onClick={() => handleUpdateStatus(d.id, "false_positive")}
                                className="p-1 rounded hover:bg-muted"
                              >
                                <XCircle className="w-4 h-4 text-slate-400" />
                              </button>
                            </>
                          )}
                          {d.status === "acknowledged" && (
                            <button
                              title="Resolve"
                              onClick={() => handleUpdateStatus(d.id, "resolved")}
                              className="p-1 rounded hover:bg-muted"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
