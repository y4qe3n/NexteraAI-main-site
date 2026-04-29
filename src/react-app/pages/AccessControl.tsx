import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Switch } from "@/react-app/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/react-app/components/ui/table";
import { Badge } from "@/react-app/components/ui/badge";
import { Loader2, Lock, Smartphone, Monitor, X, Trash2, Eye } from "lucide-react";
import { PieChart, AlertTriangle } from "lucide-react";

type LoginActivity = {
  id: number;
  user_id: number;
  login_time: string;
  ip_address: string;
  user_agent: string;
  login_method: string;
  status: string;
};

type LoginEvent = {
  id: number;
  user: string;
  time: string;
  ip: string;
  location: string;
  device: string;
  status: "success" | "failed";
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function getDeviceIcon(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile")) return <Smartphone className="w-4 h-4" />;
  if (ua.includes("tablet")) return <Smartphone className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

export function AccessControlPage() {
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<LoginEvent[]>([]);
  const [showEditPolicy, setShowEditPolicy] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [policy, setPolicy] = useState({
    minLength: 12,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: true,
    expiryDays: 90,
    historyCount: 5,
    mfaRequired: false
  });
  const [sessions, setSessions] = useState([
    { id: 1, user: "admin@nexara.ai", device: "Chrome / Windows", ip: "192.168.1.1", started: "2026-02-26 10:30", active: true },
    { id: 2, user: "user1@company.com", device: "Safari / macOS", ip: "10.0.0.5", started: "2026-02-26 09:15", active: true },
  ]);

  useEffect(() => {
    const fetchLoginActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/login-activities", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load login activities");
        const data = await res.json();
        setLoginActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchLoginActivities();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
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
          <Lock className="w-6 h-6" />
          <div>
            <p className="font-medium">Failed to load access control data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  const totalUsers = 10;
  const withMfa = 7;
  const withoutMfa = totalUsers - withMfa;
  const mfaPct = Math.round((withMfa / totalUsers) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Access Control</h2>
          <p className="text-sm text-muted-foreground">
            Manage authentication, MFA and session security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Users with MFA
            </p>
            <p className="text-2xl font-semibold mt-1">
              {withMfa} of {totalUsers} ({mfaPct}%)
            </p>
          </div>
          <PieChart className="w-6 h-6 text-primary" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Without MFA
            </p>
            <p className="text-2xl font-semibold mt-1">{withoutMfa}</p>
          </div>
          <AlertTriangle className="w-6 h-6 text-amber-400" />
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Password policy
          </p>
          <p className="mt-2 text-sm">
            Minimum 12 characters, expires every 90 days, history of 5 passwords.
          </p>
          <Button variant="outline" size="sm" className="text-white mt-3" onClick={() => setShowEditPolicy(true)}>
            Edit Policy
          </Button>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Login Activity</h3>
            <p className="text-sm text-muted-foreground">
              Track successful and failed login attempts.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Login activity will appear here once users start signing in.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.user}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>{event.ip}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.device}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          event.status === "success"
                            ? "border-emerald-500/40 text-emerald-400"
                            : "border-red-500/40 text-red-400"
                        }
                      >
                        {event.status === "success" ? "Success" : "Failed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Recent Login Activity</h3>
            <p className="text-sm text-muted-foreground">
              Monitor user access patterns and suspicious activities.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginActivities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No login activity recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                loginActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(activity.login_time)}
                    </TableCell>
                    <TableCell>{activity.ip_address}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {getDeviceIcon(activity.user_agent)}
                        <span className="text-sm text-muted-foreground">
                          {activity.user_agent.split(" ")[0]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.login_method}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          activity.status === "success"
                            ? "border-emerald-500/40 text-emerald-400"
                            : activity.status === "failed"
                            ? "border-red-500/40 text-red-400"
                            : "border-amber-500/40 text-amber-400"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-sm">Active Sessions</p>
              <p className="text-xs text-muted-foreground">
                Review and revoke active user sessions.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-white" onClick={() => setShowSessions(true)}>
            <Eye className="w-4 h-4 mr-2" />
            View Sessions
          </Button>
        </div>
      </Card>

      {/* Edit Policy Modal */}
      {showEditPolicy && (
        <Card className="p-4 border border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Edit Password Policy</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowEditPolicy(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Minimum Length</Label>
              <Input 
                type="number" 
                value={policy.minLength} 
                onChange={(e) => setPolicy({...policy, minLength: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label>Expiry (days)</Label>
              <Input 
                type="number" 
                value={policy.expiryDays} 
                onChange={(e) => setPolicy({...policy, expiryDays: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={policy.requireUppercase} 
                onCheckedChange={(v) => setPolicy({...policy, requireUppercase: v})}
              />
              <Label>Require Uppercase</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={policy.requireNumbers} 
                onCheckedChange={(v) => setPolicy({...policy, requireNumbers: v})}
              />
              <Label>Require Numbers</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={policy.mfaRequired} 
                onCheckedChange={(v) => setPolicy({...policy, mfaRequired: v})}
              />
              <Label>MFA Required</Label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setShowEditPolicy(false)}>Save Policy</Button>
            <Button variant="outline" onClick={() => setShowEditPolicy(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* View Sessions Modal */}
      {showSessions && (
        <Card className="p-4 border border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Active Sessions</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowSessions(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <div>
                  <p className="font-medium text-sm">{session.user}</p>
                  <p className="text-xs text-muted-foreground">{session.device} • {session.ip}</p>
                  <p className="text-xs text-muted-foreground">Started: {session.started}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSessions(sessions.filter(s => s.id !== session.id))}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
