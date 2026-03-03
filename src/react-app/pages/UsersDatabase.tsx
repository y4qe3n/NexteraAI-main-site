import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/react-app/components/ui/table";
import { Users, Loader2, AlertCircle, RefreshCw, Lock, CheckCircle, Plus, X } from "lucide-react";

type UserRow = {
  id: number;
  email: string;
  username: string | null;
  created_at: string;
  last_login: string | null;
  failed_attempts: number;
  lockout_until: string | null;
};

export function UsersDatabase() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", username: "", password: "" });
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/users?limit=100", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString();
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAdding(true);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("Failed to add user");
      setNewUser({ email: "", username: "", password: "" });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user");
    } finally {
      setAdding(false);
    }
  };

  function isLocked(lockoutUntil: string | null) {
    if (!lockoutUntil) return false;
    return new Date(lockoutUntil) > new Date();
  }

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
            <p className="font-medium">Failed to load users</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button variant="outline" size="sm" className="text-white" onClick={fetchUsers}>
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
          <h2 className="text-2xl font-bold text-white">Users Database</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage internal staff and admin users who access the NexteraAI dashboard.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-white" onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".csv";
            input.onchange = async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (!file) return;
              const text = await file.text();
              const lines = text.split("\n").filter(l => l.trim());
              const header = lines[0].toLowerCase();
              const emailIdx = header.split(",").findIndex(h => h.trim().includes("email"));
              if (emailIdx < 0) { setError("CSV must have an 'email' column"); return; }
              let imported = 0;
              for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ""));
                const email = cols[emailIdx];
                if (!email) continue;
                try {
                  await fetch("/api/admin/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email, password: "Changeme1!" }),
                  });
                  imported++;
                } catch {}
              }
              setError(null);
              alert(`Imported ${imported} users. Default password: Changeme1!`);
              fetchUsers();
            };
            input.click();
          }}>
            Bulk Import (CSV)
          </Button>
          <Button size="sm" className="text-white" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
          <Button variant="outline" size="sm" className="text-white" onClick={fetchUsers}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="p-4 border border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Add New User</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@company.com"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="johndoe"
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Min 8 characters"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={adding}>
                {adding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add User
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{total} users</p>
              <p className="text-xs text-muted-foreground">
                Passwords stored with Argon2id (hybrid Argon2i + Argon2d)
              </p>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Failed Attempts</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.filter(u => 
                !searchQuery || 
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.username?.toLowerCase() || "").includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No users yet. Sign up to create the first account.
                  </TableCell>
                </TableRow>
              ) : (
                users.filter(u => 
                  !searchQuery || 
                  u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (u.username?.toLowerCase() || "").includes(searchQuery.toLowerCase())
                ).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-sm">{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.last_login)}
                    </TableCell>
                    <TableCell>{user.failed_attempts ?? 0}</TableCell>
                    <TableCell>
                      {isLocked(user.lockout_until) ? (
                        <Badge variant="destructive" className="gap-1">
                          <Lock className="w-3 h-3" />
                          Locked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-green-500/30 text-green-500">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </Badge>
                      )}
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
