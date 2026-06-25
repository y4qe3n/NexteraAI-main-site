import { useEffect, useState } from "react";
import { useAuth } from "@/react-app/lib/AuthContext";
import { Users, Loader2 } from "lucide-react";

interface OrgUser {
  id: number;
  email: string;
  name?: string;
  username?: string;
  role?: string;
  created_at?: string;
  last_login?: string;
}

export function UsersDatabase() {
  const { admin } = useAuth();
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/users?limit=100", { credentials: "include" });
        if (res.status === 403) {
          // Not admin - show just current user
          setUsers(admin ? [{ id: Number(admin.id) || 0, email: admin.email, name: admin.name, role: admin.role || "owner" }] : []);
          return;
        }
        if (!res.ok) throw new Error("Unable to load users");
        const data = await res.json();
        setUsers(data.users ?? []);
      } catch {
        // Graceful fallback: show current user as the org member
        if (admin) {
          setUsers([{ id: 0, email: admin.email, name: admin.name, role: admin.role || "owner" }]);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [admin]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg(null);
    try {
      const res = await fetch("/api/admin/invite-employee", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: "employee" }),
      });
      if (res.ok) {
        setInviteMsg("Invitation sent successfully.");
        setInviteEmail("");
      } else {
        const d = await res.json().catch(() => ({}));
        setInviteMsg(d.error || "Failed to send invitation.");
      }
    } catch {
      setInviteMsg("Failed to send invitation.");
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#9F86E8" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#E0D4FF" }}>Users</h1>
          <p className="text-sm mt-1" style={{ color: "#A89CC8" }}>Organisation team members</p>
        </div>
        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "rgba(98,76,171,0.15)", color: "#9F86E8" }}>
          {users.length} member{users.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Invite */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
        <p className="text-sm font-medium mb-3" style={{ color: "#E0D4FF" }}>Invite team member</p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="colleague@company.co.za"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 h-9 px-3 rounded-lg text-sm outline-none"
            style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(224,212,255,0.08)", color: "#E0D4FF" }}
          />
          <button
            onClick={handleInvite}
            disabled={inviting}
            className="px-4 h-9 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: "#624CAB", color: "#E0D4FF" }}
          >
            {inviting ? "Sending…" : "Invite"}
          </button>
        </div>
        {inviteMsg && <p className="text-xs mt-2" style={{ color: "#A89CC8" }}>{inviteMsg}</p>}
      </div>

      {/* Users list */}
      {users.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <Users className="w-8 h-8 mx-auto mb-3" style={{ color: "#A89CC8", opacity: 0.5 }} />
          <p className="text-sm font-medium" style={{ color: "#E0D4FF" }}>No additional users yet.</p>
          <p className="text-xs mt-1" style={{ color: "#8778AD" }}>Invite team members when your organisation is ready.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: "1px solid rgba(224,212,255,0.05)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#221a35", color: "#9F86E8" }}>
                {(user.name || user.email)?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#E0D4FF" }}>{user.name || user.username || user.email}</p>
                <p className="text-xs truncate" style={{ color: "#8778AD" }}>{user.email}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ backgroundColor: "rgba(98,76,171,0.1)", color: "#9F86E8" }}>
                {user.role || "member"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
