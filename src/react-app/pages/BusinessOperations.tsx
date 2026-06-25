import { useEffect, useState } from "react";
import { Briefcase, AlertTriangle, Monitor, Loader2 } from "lucide-react";

interface OperationItem {
  id: string;
  title: string;
  type: "alert" | "device" | "task";
  severity: string;
  status: string;
  created_at: string;
}

export function BusinessOperations() {
  const [operations, setOperations] = useState<OperationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const ops: OperationItem[] = [];
      try {
        // Compute operations from active threats
        const tRes = await fetch("/api/threats?limit=10", { credentials: "include" });
        if (tRes.ok) {
          const threats = await tRes.json();
          (Array.isArray(threats) ? threats : []).filter((t: any) => t.status === "active" || t.status === "detected").forEach((t: any) => {
            ops.push({ id: `threat-${t.id}`, title: `${t.threat_type || "Threat"} — ${t.severity}`, type: "alert", severity: t.severity, status: "needs attention", created_at: t.detected_at });
          });
        }
      } catch {}
      try {
        // Compute operations from offline devices
        const dRes = await fetch("/api/devices", { credentials: "include" });
        if (dRes.ok) {
          const devices = await dRes.json();
          (Array.isArray(devices) ? devices : []).filter((d: any) => d.status === "offline").forEach((d: any) => {
            ops.push({ id: `device-${d.id}`, title: `${d.name || "Device"} is offline`, type: "device", severity: "medium", status: "follow up", created_at: d.last_heartbeat || new Date().toISOString() });
          });
        }
      } catch {}
      setOperations(ops);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#9F86E8" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#E0D4FF" }}>Operations</h1>
        <p className="text-sm mt-1" style={{ color: "#A89CC8" }}>Security operations and follow-up tasks</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-5" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <p className="text-xs" style={{ color: "#8778AD" }}>Active Operations</p>
          <p className="text-2xl font-bold mt-1" style={{ color: "#E0D4FF" }}>{operations.length}</p>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <p className="text-xs" style={{ color: "#8778AD" }}>Security Alerts</p>
          <p className="text-2xl font-bold mt-1" style={{ color: "#E0D4FF" }}>{operations.filter((o) => o.type === "alert").length}</p>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <p className="text-xs" style={{ color: "#8778AD" }}>Device Follow-ups</p>
          <p className="text-2xl font-bold mt-1" style={{ color: "#E0D4FF" }}>{operations.filter((o) => o.type === "device").length}</p>
        </div>
      </div>

      {/* Operations list */}
      {operations.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <Briefcase className="w-8 h-8 mx-auto mb-3" style={{ color: "#A89CC8", opacity: 0.5 }} />
          <p className="text-sm font-medium" style={{ color: "#E0D4FF" }}>No active operations at the moment.</p>
          <p className="text-xs mt-1 max-w-md mx-auto" style={{ color: "#8778AD" }}>
            NexteraAI tracks protection workflows, device follow-ups, and security tasks for your organisation. Items will appear here when action is needed.
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(224,212,255,0.08)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "#E0D4FF" }}>Active Operations</h2>
          </div>
          {operations.map((op) => (
            <div key={op.id} className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: "1px solid rgba(224,212,255,0.05)" }}>
              {op.type === "alert" ? <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#F59E0B" }} /> : <Monitor className="w-4 h-4 flex-shrink-0" style={{ color: "#9F86E8" }} />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#E0D4FF" }}>{op.title}</p>
                <p className="text-xs" style={{ color: "#8778AD" }}>{new Date(op.created_at).toLocaleDateString()}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: op.type === "alert" ? "rgba(245,158,11,0.1)" : "rgba(159,134,232,0.1)", color: op.type === "alert" ? "#F59E0B" : "#9F86E8" }}>
                {op.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
