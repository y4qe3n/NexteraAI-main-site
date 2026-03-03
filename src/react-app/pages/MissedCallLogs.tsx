import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import {
  Loader2,
  PhoneOff,
  MessageSquare,
  Reply,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";

type CallLog = {
  id: number;
  caller_number: string;
  call_time: string;
  call_status: string;
  sms_sent: number;
  sms_sent_at: string | null;
  sms_message: string | null;
  reply_received: number;
  reply_text: string | null;
  reply_at: string | null;
  created_at: string;
};

type Stats = {
  missedCallsThisWeek: number;
  smsSentThisWeek: number;
  repliesThisWeek: number;
  responseRate: number;
};

export function MissedCallLogsPage() {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [stats, setStats] = useState<Stats>({ missedCallsThisWeek: 0, smsSentThisWeek: 0, repliesThisWeek: 0, responseRate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/missed-call-logs", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load logs");
      const data = await res.json();
      setLogs(data.logs || []);
      setStats(data.stats || { missedCallsThisWeek: 0, smsSentThisWeek: 0, repliesThisWeek: 0, responseRate: 0 });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ["Caller Number", "Call Time", "SMS Sent", "SMS Sent At", "Reply", "Reply Text", "Reply At"];
    const rows = logs.map((l) => [
      l.caller_number,
      l.call_time,
      l.sms_sent ? "Yes" : "No",
      l.sms_sent_at || "",
      l.reply_received ? "Yes" : "No",
      l.reply_text || "",
      l.reply_at || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `missed-call-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <PhoneOff className="w-6 h-6 text-primary" />
            Missed Call Logs
          </h2>
          <p className="text-muted-foreground mt-1">
            Track missed calls, SMS follow-ups, and customer replies.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-white" onClick={fetchLogs}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="text-white" onClick={handleExportCSV} disabled={logs.length === 0}>
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <PhoneOff className="w-5 h-5 mx-auto mb-2 text-red-400" />
          <p className="text-2xl font-bold">{stats.missedCallsThisWeek}</p>
          <p className="text-xs text-muted-foreground">Missed Calls (7d)</p>
        </Card>
        <Card className="p-4 text-center">
          <MessageSquare className="w-5 h-5 mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-bold">{stats.smsSentThisWeek}</p>
          <p className="text-xs text-muted-foreground">SMS Sent (7d)</p>
        </Card>
        <Card className="p-4 text-center">
          <Reply className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
          <p className="text-2xl font-bold">{stats.repliesThisWeek}</p>
          <p className="text-xs text-muted-foreground">Replies (7d)</p>
        </Card>
        <Card className="p-4 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-2 text-purple-400" />
          <p className="text-2xl font-bold">{stats.responseRate}%</p>
          <p className="text-xs text-muted-foreground">Response Rate</p>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium">Caller</th>
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">SMS</th>
                <th className="text-left px-4 py-3 font-medium">Reply</th>
                <th className="text-left px-4 py-3 font-medium">Reply Text</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    No missed call logs yet. Once calls come in through your virtual number, they'll appear here.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono text-xs">{log.caller_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(log.call_time).toLocaleString("en-ZA", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          log.sms_sent
                            ? "border-emerald-500/40 text-emerald-400"
                            : "border-red-500/40 text-red-400"
                        }
                      >
                        {log.sms_sent ? "Sent" : "Not sent"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {log.reply_received ? (
                        <Badge variant="outline" className="border-blue-500/40 text-blue-400">
                          Replied
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">
                      {log.reply_text || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
