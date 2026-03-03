import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/react-app/components/ui/table";
import { Badge } from "@/react-app/components/ui/badge";
import { Loader2, Database, Download, RefreshCw } from "lucide-react";

type Backup = {
  id: number;
  backup_name: string;
  backup_size: number;
  created_at: string;
  status: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
}

export function DataVaultPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/backups", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load backups");
        const data = await res.json();
        setBackups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchBackups();
  }, []);

  const handleBackupNow = async () => {
    try {
      setActionLoading(0); // Use 0 to indicate backup action
      const res = await fetch("/api/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ backup_name: `Manual Backup ${new Date().toLocaleString()}` }),
      });
      if (!res.ok) throw new Error("Failed to initiate backup");
      const newBackup = await res.json();
      setBackups([newBackup, ...backups]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate backup");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (backupId: number) => {
    try {
      setActionLoading(backupId);
      const res = await fetch(`/api/backups/${backupId}/restore`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to restore backup");
      // Optionally update UI or refresh backups list
      setError("Restore initiated. This may take some time.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore backup");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (backupId: number) => {
    try {
      setActionLoading(backupId);
      const res = await fetch(`/api/backups/${backupId}/download`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to download backup");
      // This would typically open a download dialog in a real app
      setError("Download link would be provided here (placeholder).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download backup");
    } finally {
      setActionLoading(null);
    }
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
          <Database className="w-6 h-6" />
          <div>
            <p className="font-medium">Failed to load data vault</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Data Vault</h2>
          <p className="text-sm text-muted-foreground">
            Secure backups and data recovery management.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-white"
            onClick={handleBackupNow}
            disabled={actionLoading === 0}
          >
            {actionLoading === 0 ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Backup Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total Backups
            </p>
            <p className="text-2xl font-semibold mt-1">{backups.length}</p>
          </div>
          <Database className="w-6 h-6 text-primary" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Last Backup
            </p>
            <p className="text-2xl font-semibold mt-1">
              {backups.length > 0 ? formatDate(backups[0].created_at) : "Never"}
            </p>
          </div>
          <RefreshCw className="w-6 h-6 text-primary" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total Storage Used
            </p>
            <p className="text-2xl font-semibold mt-1">
              {formatSize(backups.reduce((sum, b) => sum + b.backup_size, 0))}
            </p>
          </div>
          <Database className="w-6 h-6 text-primary" />
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Backup History</h3>
            <p className="text-sm text-muted-foreground">
              Review and restore from previous backups.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Backup Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No backups created yet. Click "Backup Now" to create your first backup.
                  </TableCell>
                </TableRow>
              ) : (
                backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.backup_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(backup.created_at)}
                    </TableCell>
                    <TableCell>{formatSize(backup.backup_size)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          backup.status === "completed"
                            ? "border-emerald-500/40 text-emerald-400"
                            : backup.status === "failed"
                            ? "border-red-500/40 text-red-400"
                            : "border-amber-500/40 text-amber-400"
                        }
                      >
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white"
                          onClick={() => handleRestore(backup.id)}
                          disabled={actionLoading === backup.id || backup.status !== "completed"}
                        >
                          {actionLoading === backup.id ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : null}
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white"
                          onClick={() => handleDownload(backup.id)}
                          disabled={actionLoading === backup.id || backup.status !== "completed"}
                        >
                          {actionLoading === backup.id ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : null}
                          Download
                          <Download className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
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
