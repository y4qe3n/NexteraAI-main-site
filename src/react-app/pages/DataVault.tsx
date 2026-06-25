import { useEffect, useState } from "react";
import { Database, RotateCcw, Plus, Loader2, Shield } from "lucide-react";

interface Backup {
  id: number;
  backup_name: string;
  backup_size: number;
  created_at: string;
  status: string;
}

export function DataVaultPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/backups", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setBackups(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBackup = async () => {
    setActionMsg(null);
    try {
      const res = await fetch("/api/backups", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ backup_name: `Backup ${new Date().toLocaleDateString()}` }) });
      if (res.ok) {
        const b = await res.json();
        setBackups((prev) => [b, ...prev]);
        setActionMsg("Backup created successfully.");
      } else { setActionMsg("Failed to create backup."); }
    } catch { setActionMsg("Failed to create backup."); }
  };

  const handleRestore = async (id: number) => {
    try {
      const res = await fetch(`/api/backups/${id}/restore`, { method: "POST", credentials: "include" });
      setActionMsg(res.ok ? "Restore initiated." : "Failed to restore.");
    } catch { setActionMsg("Failed to restore."); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#9F86E8" }} />
      </div>
    );
  }

  if (backups.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold" style={{ color: "#E0D4FF" }}>Data Vault</h1>
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <Database className="w-8 h-8 mx-auto mb-3" style={{ color: "#A89CC8", opacity: 0.5 }} />
          <p className="text-sm font-medium" style={{ color: "#E0D4FF" }}>Data Vault is not configured yet.</p>
          <p className="text-xs mt-1 max-w-md mx-auto" style={{ color: "#8778AD" }}>Secure storage and file protection features will appear here once enabled for your organisation.</p>
          <button onClick={handleBackup} className="mt-4 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "#624CAB", color: "#E0D4FF" }}>
            Create First Backup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#E0D4FF" }}>Data Vault</h1>
          <p className="text-sm mt-1" style={{ color: "#A89CC8" }}>Secure backups and data protection</p>
        </div>
        <button onClick={handleBackup} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "#624CAB", color: "#E0D4FF" }}>
          <Plus className="w-4 h-4" /> New Backup
        </button>
      </div>

      {actionMsg && <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "#141218", color: "#A89CC8" }}>{actionMsg}</p>}

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
        {backups.map((b) => (
          <div key={b.id} className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: "1px solid rgba(224,212,255,0.05)" }}>
            <Shield className="w-4 h-4 flex-shrink-0" style={{ color: "#10B981" }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#E0D4FF" }}>{b.backup_name}</p>
              <p className="text-xs" style={{ color: "#8778AD" }}>{new Date(b.created_at).toLocaleDateString()} · {(b.backup_size / 1024).toFixed(1)} KB</p>
            </div>
            <span className="text-xs capitalize" style={{ color: b.status === "completed" ? "#10B981" : "#F59E0B" }}>{b.status}</span>
            <button onClick={() => handleRestore(b.id)} className="p-1.5 rounded hover:bg-white/5" title="Restore">
              <RotateCcw className="w-4 h-4" style={{ color: "#A89CC8" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
