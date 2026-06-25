import { useEffect, useState } from "react";
import { Lock, Shield, Clock, Users, Loader2 } from "lucide-react";

interface LoginActivity {
  id: number;
  user_id: number;
  login_time: string;
  ip_address: string;
  user_agent?: string;
  login_method?: string;
  status: string;
}

export function AccessControlPage() {
  const [activities, setActivities] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/login-activities", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
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
        <h1 className="text-xl font-semibold" style={{ color: "#E0D4FF" }}>Access Control</h1>
        <p className="text-sm mt-1" style={{ color: "#A89CC8" }}>Monitor login activity and security for your organisation</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-5" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-4 h-4" style={{ color: "#10B981" }} />
            <span className="text-xs" style={{ color: "#8778AD" }}>Security Status</span>
          </div>
          <p className="text-lg font-bold" style={{ color: "#E0D4FF" }}>Active</p>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-4 h-4" style={{ color: "#9F86E8" }} />
            <span className="text-xs" style={{ color: "#8778AD" }}>Recent Logins</span>
          </div>
          <p className="text-lg font-bold" style={{ color: "#E0D4FF" }}>{activities.length}</p>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-4 h-4" style={{ color: "#9F86E8" }} />
            <span className="text-xs" style={{ color: "#8778AD" }}>Failed Attempts</span>
          </div>
          <p className="text-lg font-bold" style={{ color: "#E0D4FF" }}>
            {activities.filter((a) => a.status === "failed").length}
          </p>
        </div>
      </div>

      {/* Login Activity */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(224,212,255,0.08)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#E0D4FF" }}>Recent Login Activity</h2>
        </div>
        {activities.length === 0 ? (
          <div className="py-8 text-center">
            <Lock className="w-6 h-6 mx-auto mb-2" style={{ color: "#A89CC8", opacity: 0.5 }} />
            <p className="text-sm" style={{ color: "#8778AD" }}>No login activity recorded yet.</p>
            <p className="text-xs mt-1" style={{ color: "#8778AD" }}>Access controls are available for your organisation users.</p>
          </div>
        ) : (
          <div>
            {activities.slice(0, 20).map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: "1px solid rgba(224,212,255,0.05)" }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.status === "success" ? "#10B981" : "#F43F5E" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "#E0D4FF" }}>{a.login_method || "Login"} — {a.ip_address}</p>
                  <p className="text-xs" style={{ color: "#8778AD" }}>{new Date(a.login_time).toLocaleString()}</p>
                </div>
                <span className="text-xs capitalize" style={{ color: a.status === "success" ? "#10B981" : "#F43F5E" }}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
