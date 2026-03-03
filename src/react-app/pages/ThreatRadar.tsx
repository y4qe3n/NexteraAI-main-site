import { useEffect, useMemo, useState } from "react";
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
import { Select } from "@/react-app/components/ui/select";
import {
  AlertTriangle,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Filter,
  Download,
} from "lucide-react";

type ThreatEvent = {
  id: number;
  threat_type: string;
  severity: "low" | "medium" | "high" | "critical" | string;
  source: string | null;
  target: string | null;
  status: string;
  detected_at: string;
  action_taken?: string | null;
};

type TimeRange = "today" | "7d" | "30d" | "all";

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function severityBadgeClasses(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    case "high":
      return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    case "medium":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    default:
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
  }
}

export function ThreatRadarPage() {
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/threats?limit=200", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to load threats");
        }
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchThreats();
  }, []);

  const now = new Date();

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const detected = new Date(e.detected_at);
      if (Number.isNaN(detected.getTime())) {
        return false;
      }

      if (timeRange !== "all") {
        const diffMs = now.getTime() - detected.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (timeRange === "today" && diffDays > 1) return false;
        if (timeRange === "7d" && diffDays > 7) return false;
        if (timeRange === "30d" && diffDays > 30) return false;
      }

      if (severityFilter !== "all" && e.severity !== severityFilter) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = [
          e.threat_type,
          e.source,
          e.target,
          e.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [events, timeRange, severityFilter, search, now]);

  const summary = useMemo(() => {
    const totalBlocked = filteredEvents.filter(
      (e) => e.status === "blocked" || e.status === "resolved"
    ).length;
    const byType: Record<string, number> = {};
    const byTarget: Record<string, number> = {};
    for (const e of filteredEvents) {
      byType[e.threat_type] = (byType[e.threat_type] || 0) + 1;
      const key = e.target || "Unknown";
      byTarget[key] = (byTarget[key] || 0) + 1;
    }
    const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
    const topTarget = Object.entries(byTarget).sort((a, b) => b[1] - a[1])[0];
    return {
      totalBlocked,
      topType,
      topTarget,
    };
  }, [filteredEvents]);

  const handleExportCSV = () => {
    const headers = ["Date/Time", "Threat Type", "Severity", "Source", "Target", "Action Taken", "Status"];
    const rows = filteredEvents.map(e => [
      formatDateTime(e.detected_at),
      e.threat_type,
      e.severity,
      e.source || "Unknown",
      e.target || "Unknown",
      e.action_taken || e.status,
      e.status
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `threats-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
          <div className="flex-1">
            <p className="font-medium">Failed to load threat data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-white"
            onClick={() => {
              setLoading(true);
              setError(null);
              fetch("/api/threats?limit=200", { credentials: "include" })
                .then((res) => res.json())
                .then((data) => setEvents(data))
                .catch((err) =>
                  setError(
                    err instanceof Error ? err.message : "Something went wrong"
                  )
                )
                .finally(() => setLoading(false));
            }}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Threat Radar</h2>
          <p className="text-sm text-muted-foreground">
            Deep dive into security events and real-time monitoring.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as TimeRange)}
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </Select>
          <Select
            value={severityFilter}
            onValueChange={(v) => setSeverityFilter(v)}
          >
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
          <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 bg-background">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events"
              className="bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="outline" size="sm" className="text-white" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total events
            </p>
            <p className="text-2xl font-semibold mt-1">{filteredEvents.length}</p>
          </div>
          <AlertTriangle className="w-6 h-6 text-amber-400" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Blocked or resolved
            </p>
            <p className="text-2xl font-semibold mt-1">
              {summary.totalBlocked}
            </p>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Top threat type
          </p>
          {summary.topType ? (
            <div className="mt-2">
              <p className="font-medium">{summary.topType[0]}</p>
              <p className="text-xs text-muted-foreground">
                {summary.topType[1]} events in selected range
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">No data yet.</p>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Most attacked target
          </p>
          {summary.topTarget ? (
            <div className="mt-2">
              <p className="font-medium">{summary.topTarget[0]}</p>
              <p className="text-xs text-muted-foreground">
                {summary.topTarget[1]} events in selected range
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">No data yet.</p>
          )}
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Event log</h3>
            <p className="text-sm text-muted-foreground">
              Filterable list of recent security events.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Threat Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Action Taken</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No events match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(event.detected_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {event.threat_type}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={severityBadgeClasses(event.severity)}
                      >
                        {event.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.source || "Unknown"}</TableCell>
                    <TableCell>{event.target || "Unknown"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {event.action_taken || event.status}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
