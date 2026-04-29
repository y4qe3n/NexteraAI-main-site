import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Clock,
  Radar,
  Loader2,
  AlertCircle,
  Laptop,
  Database,
} from "lucide-react";

type Device = {
  id: number;
  name: string;
  device_type: string;
  os: string;
  is_protected: number;
  status: string;
  created_at: string;
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

type Backup = {
  id: number;
  backup_name: string;
  backup_size: number;
  status: string;
  created_at: string;
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

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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

export function EmployeeDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [devicesRes, threatsRes, backupsRes] = await Promise.all([
          fetch("/api/employee/devices", { credentials: "include" }),
          fetch("/api/employee/threats", { credentials: "include" }),
          fetch("/api/employee/backups", { credentials: "include" }),
        ]);

        if (devicesRes.ok) {
          setDevices(await devicesRes.json());
        }
        if (threatsRes.ok) {
          setThreats(await threatsRes.json());
        }
        if (backupsRes.ok) {
          setBackups(await backupsRes.json());
        }
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

  const activeThreats = threats.filter(t => t.status === "detected" || t.status === "investigating");
  const protectedDevices = devices.filter(d => d.is_protected === 1).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
        <p className="text-muted-foreground mt-2">View your assigned devices, threats, and backups</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">My Devices</p>
              <p className="text-2xl font-bold">{devices.length}</p>
            </div>
            <Laptop className="w-8 h-8 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {protectedDevices} protected
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Threats</p>
              <p className="text-2xl font-bold">{activeThreats.length}</p>
            </div>
            <Radar className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {threats.length} total
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Backups</p>
              <p className="text-2xl font-bold">{backups.length}</p>
            </div>
            <Database className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Organization-wide
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Protection Status</p>
              <p className="text-2xl font-bold">
                {devices.length > 0 ? Math.round((protectedDevices / devices.length) * 100) : 0}%
              </p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {protectedDevices}/{devices.length} devices
          </p>
        </Card>
      </div>

      {/* My Devices */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Laptop className="w-5 h-5" />
            My Devices
          </h2>
          <Badge variant="outline">{devices.length}</Badge>
        </div>
        {devices.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No devices assigned to you yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <Card key={device.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{device.name}</h3>
                    <p className="text-sm text-muted-foreground">{device.os}</p>
                    <p className="text-xs text-muted-foreground mt-1">{device.device_type}</p>
                  </div>
                  {device.is_protected === 1 ? (
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <Shield className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge
                    variant={device.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {device.status}
                  </Badge>
                  <Badge
                    variant={device.is_protected === 1 ? "outline" : "secondary"}
                    className={`text-xs ${
                      device.is_protected === 1
                        ? "border-green-500/30 text-green-500"
                        : ""
                    }`}
                  >
                    {device.is_protected === 1 ? "Protected" : "Unprotected"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Threats Affecting My Devices */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Radar className="w-5 h-5" />
            Threats Affecting My Devices
          </h2>
          <Badge variant={activeThreats.length > 0 ? "destructive" : "outline"}>
            {activeThreats.length} active
          </Badge>
        </div>
        {threats.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No threats detected on your devices.
          </p>
        ) : (
          <div className="space-y-3">
            {threats.slice(0, 10).map((threat) => (
              <Card key={threat.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs ${getSeverityColor(threat.severity)}`}>
                        {threat.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{threat.threat_type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(threat.status)}
                        {threat.status}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(threat.detected_at)}
                      </span>
                    </div>
                  </div>
                  {threat.status === "detected" && (
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Organization Backups (Read-only) */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="w-5 h-5" />
            Organization Backups
          </h2>
          <Badge variant="outline">{backups.length}</Badge>
        </div>
        {backups.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No backups available.
          </p>
        ) : (
          <div className="space-y-3">
            {backups.slice(0, 5).map((backup) => (
              <Card key={backup.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{backup.backup_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{formatBytes(backup.backup_size)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(backup.created_at)}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={backup.status === "completed" ? "outline" : "secondary"}
                    className={
                      backup.status === "completed"
                        ? "border-green-500/30 text-green-500"
                        : ""
                    }
                  >
                    {backup.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
