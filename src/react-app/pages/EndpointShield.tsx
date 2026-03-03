import { useEffect, useMemo, useState } from "react";
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
import { Loader2, Shield, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/react-app/components/ui/dialog";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";

type Device = {
  id: number;
  name: string;
  device_type: string | null;
  os: string | null;
  is_protected: number;
  status: string;
  created_at?: string;
  updated_at?: string;
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export function EndpointShieldPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("");
  const [newDeviceOs, setNewDeviceOs] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/devices", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load devices");
        const data = await res.json();
        setDevices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const stats = useMemo(() => {
    const total = devices.length;
    const protectedCount = devices.filter((d) => d.is_protected === 1).length;
    const offline = devices.filter((d) => d.status === "offline").length;
    const highRisk = devices.filter((d) => d.status === "critical").length;
    const protectedPct = total > 0 ? Math.round((protectedCount / total) * 100) : 0;
    return { total, protectedCount, protectedPct, offline, highRisk };
  }, [devices]);

  const handleAddDevice = async () => {
    try {
      setActionLoading(0); // Use 0 to indicate adding device action
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newDeviceName,
          device_type: newDeviceType || null,
          os: newDeviceOs || null
        }),
      });
      if (!res.ok) throw new Error("Failed to add device");
      const newDevice = await res.json();
      setDevices([...devices, newDevice]);
      setNewDeviceName("");
      setNewDeviceType("");
      setNewDeviceOs("");
      setIsAddingDevice(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add device");
    } finally {
      setActionLoading(null);
    }
  };

  const handleScanNow = async (deviceId: number) => {
    try {
      setActionLoading(deviceId);
      const res = await fetch(`/api/devices/${deviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "active" }),
      });
      if (!res.ok) throw new Error("Failed to scan device");
      const updatedDevice = await res.json();
      setDevices(devices.map(d => d.id === deviceId ? updatedDevice : d));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan device");
    } finally {
      setActionLoading(null);
    }
  };

  const handleIsolate = async (deviceId: number) => {
    try {
      setActionLoading(deviceId);
      const res = await fetch(`/api/devices/${deviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "isolated" }),
      });
      if (!res.ok) throw new Error("Failed to isolate device");
      const updatedDevice = await res.json();
      setDevices(devices.map(d => d.id === deviceId ? updatedDevice : d));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to isolate device");
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
          <AlertTriangle className="w-6 h-6" />
          <div>
            <p className="font-medium">Failed to load endpoints</p>
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
          <h2 className="text-2xl font-bold text-white">Endpoint Shield</h2>
          <p className="text-sm text-muted-foreground">
            Overview and management of protected devices and endpoints.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-white" onClick={() => window.open("https://docs.nexteraai.co.za/endpoint-deployment", "_blank")}>
            Deployment Guide
          </Button>
          <Dialog open={isAddingDevice} onOpenChange={setIsAddingDevice}>
            <DialogTrigger asChild>
              <Button size="sm" className="text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deviceName">Device Name</Label>
                  <Input
                    id="deviceName"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="e.g., Office Laptop"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceType">Device Type</Label>
                  <Input
                    id="deviceType"
                    value={newDeviceType}
                    onChange={(e) => setNewDeviceType(e.target.value)}
                    placeholder="e.g., Laptop"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceOs">Operating System</Label>
                  <Input
                    id="deviceOs"
                    value={newDeviceOs}
                    onChange={(e) => setNewDeviceOs(e.target.value)}
                    placeholder="e.g., Windows 11"
                  />
                </div>
                <Button
                  onClick={handleAddDevice}
                  disabled={actionLoading === 0 || !newDeviceName}
                  className="w-full text-white"
                >
                  {actionLoading === 0 ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Add Device
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total Devices
            </p>
            <p className="text-2xl font-semibold mt-1">{stats.total}</p>
          </div>
          <Shield className="w-6 h-6 text-primary" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Protected
            </p>
            <p className="text-2xl font-semibold mt-1">
              {stats.protectedCount} ({stats.protectedPct}%)
            </p>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-400" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Offline
            </p>
            <p className="text-2xl font-semibold mt-1">{stats.offline}</p>
          </div>
          <AlertTriangle className="w-6 h-6 text-amber-400" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              High-risk
            </p>
            <p className="text-2xl font-semibold mt-1">{stats.highRisk}</p>
          </div>
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Devices</h3>
            <p className="text-sm text-muted-foreground">
              Device inventory and protection status.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Protection Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No devices yet. Add your first endpoint to start protecting it.
                  </TableCell>
                </TableRow>
              ) : (
                devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.device_type || "—"}</TableCell>
                    <TableCell>{device.os || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(device.updated_at || device.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          device.status === "critical"
                            ? "border-red-500/40 text-red-400"
                            : device.status === "warning"
                            ? "border-amber-500/40 text-amber-400"
                            : "border-emerald-500/40 text-emerald-400"
                        }
                      >
                        {device.status || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white"
                          onClick={() => handleScanNow(device.id)}
                          disabled={actionLoading === device.id}
                        >
                          {actionLoading === device.id ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : null}
                          Scan Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white"
                          onClick={() => handleIsolate(device.id)}
                          disabled={actionLoading === device.id}
                        >
                          {actionLoading === device.id ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : null}
                          Isolate
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
