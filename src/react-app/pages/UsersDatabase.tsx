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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/react-app/components/ui/dialog";
import {
  Users,
  Loader2,
  AlertCircle,
  RefreshCw,
  Lock,
  CheckCircle,
  Plus,
  X,
  Trash2,
  Copy,
  Check,
  Clock,
  Key,
  MoreHorizontal,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";
import { ROLE_ADMIN, ROLE_EMPLOYEE } from "@/react-app/constants/roles";

type UserRow = {
  id: number;
  email: string;
  username: string | null;
  full_name?: string | null;
  role: string;
  created_at: string;
  last_login: string | null;
  failed_attempts: number;
  lockout_until: string | null;
};

type PasswordRequest = {
  id: number;
  user_id: number;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
  reviewed_at: string | null;
  email: string;
  username: string | null;
  reviewed_by_email: string | null;
};

type NewUserResponse = {
  user: { id: number; email: string; username: string | null; role: string };
  generatedPassword?: string;
};

export function UsersDatabase() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", username: "", role: ROLE_EMPLOYEE, fullName: "" });
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingDeleteUser, setPendingDeleteUser] = useState<UserRow | null>(null);
  
  // Delete confirmation state
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Credentials popup state
  const [createdUser, setCreatedUser] = useState<NewUserResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Password change requests state
  const [passwordRequests, setPasswordRequests] = useState<PasswordRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [reviewingRequest, setReviewingRequest] = useState<number | null>(null);
  const [approvedPassword, setApprovedPassword] = useState<string | null>(null);

  // Invite employee state
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState(ROLE_EMPLOYEE);
  const [inviting, setInviting] = useState(false);
  const [invites, setInvites] = useState<any[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

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

  const copyUserEmail = (email: string) => {
    navigator.clipboard.writeText(email);
  };

  const scrollToPasswordRequests = () => {
    document.getElementById("password-requests")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDropdownOpenChange = (open: boolean) => {
    if (!open) {
      if (pendingDeleteUser) {
        setUserToDelete(pendingDeleteUser);
        setPendingDeleteUser(null);
      }
    } else {
      setPendingDeleteUser(null);
    }
  };

  const fetchPasswordRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await fetch("/api/admin/password-requests", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load password requests");
      const data = await res.json();
      setPasswordRequests(data.requests);
    } catch (err) {
      console.error("Failed to load password requests", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchInvites = async () => {
    try {
      setLoadingInvites(true);
      const res = await fetch("/api/admin/invites", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load invites");
      const data = await res.json();
      setInvites(data.invites || []);
    } catch (err) {
      console.error("Failed to load invites", err);
    } finally {
      setLoadingInvites(false);
    }
  };

  const handleInviteEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setInviting(true);
      const res = await fetch("/api/admin/invite-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send invite");
      }
      setInviteEmail("");
      setShowInviteForm(false);
      fetchInvites();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invite");
    } finally {
      setInviting(false);
    }
  };

  const handleResendInvite = async (inviteId: number) => {
    try {
      const res = await fetch(`/api/admin/resend-invite/${inviteId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to resend invite");
      fetchInvites();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend invite");
    }
  };

  const handleCancelInvite = async (inviteId: number) => {
    try {
      const res = await fetch(`/api/admin/invites/${inviteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to cancel invite");
      fetchInvites();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel invite");
    }
  };

  const handleReviewRequest = async (requestId: number, action: "approve" | "reject") => {
    try {
      setReviewingRequest(requestId);
      const res = await fetch(`/api/admin/password-requests/${requestId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Failed to review request");
      const data = await res.json();
      if (action === "approve" && data.newPassword) {
        setApprovedPassword(data.newPassword);
      }
      fetchPasswordRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to review request");
    } finally {
      setReviewingRequest(null);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPasswordRequests();
    fetchInvites();
  }, []);

  function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString();
  }

  const handleChangeRole = async (user: UserRow) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/role`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Unable to change role");
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change role");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAdding(true);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...newUser,
          full_name: newUser.fullName,
        }),
      });
      if (!res.ok) throw new Error("Failed to add user");
      const data: NewUserResponse = await res.json();
      setNewUser({ email: "", username: "", role: ROLE_EMPLOYEE, fullName: "" });
      setShowAddForm(false);
      setCreatedUser(data);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const copyCredentials = () => {
    if (!createdUser) return;
    const text = `Email: ${createdUser.user.email}\nPassword: ${createdUser.generatedPassword}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyApprovedPassword = () => {
    if (!approvedPassword) return;
    navigator.clipboard.writeText(approvedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Button variant="outline" size="sm" className="text-white" onClick={() => setShowInviteForm(!showInviteForm)}>
            <Mail className="w-4 h-4 mr-2" />
            Invite Employee
          </Button>
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
                <Label htmlFor="full-name">Full name</Label>
                <Input
                  id="full-name"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="Jamie Patel"
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
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm outline-none text-white"
                >
                  <option value={ROLE_EMPLOYEE}>Employee</option>
                  <option value={ROLE_ADMIN}>Admin</option>
                </select>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm outline-none text-white"
                >
                  <option value={ROLE_EMPLOYEE}>Employee</option>
                  <option value={ROLE_ADMIN}>Admin</option>
                </select>
              </div>
              {newUser.role === ROLE_ADMIN && (
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    required={newUser.role === ROLE_ADMIN}
                    placeholder="Min 8 characters"
                  />
                </div>
              )}
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

      {showInviteForm && (
        <Card className="p-4 border border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Invite Employee</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowInviteForm(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <form onSubmit={handleInviteEmployee} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invite-email">Email *</Label>
                <Input
                  id="invite-email"
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="employee@company.com"
                />
              </div>
              <div>
                <Label htmlFor="invite-role">Role</Label>
                <select
                  id="invite-role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm outline-none text-white"
                >
                  <option value={ROLE_EMPLOYEE}>Employee</option>
                  <option value={ROLE_ADMIN}>Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={inviting}>
                {inviting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                Send Invite
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowInviteForm(false)}>
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
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Failed Attempts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.filter(u => 
                !searchQuery || 
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.username?.toLowerCase() || "").includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
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
                    <TableCell>
                      <Badge variant={user.role === ROLE_ADMIN ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
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
                    <TableCell>
                      <DropdownMenu onOpenChange={handleDropdownOpenChange}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-white"
                            aria-label="Open user actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[200px] bg-gradient-to-br from-purple-950/90 via-purple-900/80 to-purple-900 border border-purple-600 text-white shadow-[0_20px_50px_rgba(79,70,229,0.4)]">
                          <DropdownMenuItem className="text-sm text-white hover:bg-primary/20" onSelect={() => copyUserEmail(user.email)}>
                            <Copy className="w-4 h-4" />
                            Copy email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-sm text-white hover:bg-primary/20"
                            onSelect={() => scrollToPasswordRequests()}
                          >
                            <Clock className="w-4 h-4" />
                            Review password requests
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-sm text-white hover:bg-primary/20"
                            onSelect={() => handleChangeRole(user)}
                          >
                            <Users className="w-4 h-4" />
                            Make {user.role === ROLE_ADMIN ? "employee" : "admin"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="border-purple-700/60" />
                          <DropdownMenuItem
                            className="text-sm text-white hover:bg-destructive/30"
                            variant="destructive"
                            disabled={user.role === ROLE_ADMIN}
                            onSelect={() => user.role !== ROLE_ADMIN && setPendingDeleteUser(user)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Password Change Requests Section */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-medium">Password Change Requests</p>
              <p className="text-xs text-muted-foreground">
                Review and approve employee password reset requests
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-white" onClick={fetchPasswordRequests} disabled={loadingRequests}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingRequests ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Reviewed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passwordRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No password change requests at this time.
                  </TableCell>
                </TableRow>
              ) : (
                passwordRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono text-sm">{request.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{request.email}</div>
                      {request.username && (
                        <div className="text-xs text-muted-foreground">{request.username}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" ? (
                        <Badge variant="outline" className="gap-1 border-amber-500/30 text-amber-500">
                          <Clock className="w-3 h-3" />
                          Pending
                        </Badge>
                      ) : request.status === "approved" ? (
                        <Badge variant="outline" className="gap-1 border-green-500/30 text-green-500">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-red-500/30 text-red-500">
                          <X className="w-3 h-3" />
                          Rejected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(request.requested_at)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {request.reviewed_at ? (
                        <div>
                          {formatDate(request.reviewed_at)}
                          {request.reviewed_by_email && (
                            <div className="text-xs">by {request.reviewed_by_email}</div>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-500 border-green-500/30 hover:bg-green-500/10"
                            onClick={() => handleReviewRequest(request.id, "approve")}
                            disabled={reviewingRequest === request.id}
                          >
                            {reviewingRequest === request.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                            onClick={() => handleReviewRequest(request.id, "reject")}
                            disabled={reviewingRequest === request.id}
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pending Invites Section */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Pending Invites</p>
              <p className="text-xs text-muted-foreground">
                Manage employee invitations and their status
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-white" onClick={fetchInvites} disabled={loadingInvites}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingInvites ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No pending invites at this time.
                  </TableCell>
                </TableRow>
              ) : (
                invites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant={invite.role === ROLE_ADMIN ? "default" : "secondary"}>
                        {invite.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invite.used === 1 ? (
                        <Badge variant="outline" className="gap-1 border-green-500/30 text-green-500">
                          <CheckCircle className="w-3 h-3" />
                          Accepted
                        </Badge>
                      ) : new Date(invite.expires_at) < new Date() ? (
                        <Badge variant="outline" className="gap-1 border-red-500/30 text-red-500">
                          <X className="w-3 h-3" />
                          Expired
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-amber-500/30 text-amber-500">
                          <Clock className="w-3 h-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(invite.expires_at)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {invite.inviter_name || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {invite.used === 0 && new Date(invite.expires_at) > new Date() && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-500 border-blue-500/30 hover:bg-blue-500/10"
                              onClick={() => handleResendInvite(invite.id)}
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Resend
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                              onClick={() => handleCancelInvite(invite.id)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!userToDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.email}</strong>? This action cannot be undone and will permanently remove the user from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credentials Popup Dialog */}
      <Dialog open={!!createdUser} onOpenChange={() => setCreatedUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Employee Created Successfully</DialogTitle>
            <DialogDescription>
              The employee account has been created. Please save these credentials securely.
            </DialogDescription>
          </DialogHeader>
          {createdUser && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-4 space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{createdUser.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Password:</span>
                  <span className="font-medium text-primary">{createdUser.generatedPassword}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{createdUser.user.role}</span>
                </div>
              </div>
              <Button
                onClick={copyCredentials}
                className="w-full"
                variant={copied ? "outline" : "default"}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All Credentials
                  </>
                )}
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setCreatedUser(null)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approved Password Dialog */}
      <Dialog open={!!approvedPassword} onOpenChange={() => setApprovedPassword(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Password Reset Approved</DialogTitle>
            <DialogDescription>
              A new password has been generated for the employee. Please share this securely.
            </DialogDescription>
          </DialogHeader>
          {approvedPassword && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="font-mono text-lg text-center text-primary font-semibold">
                  {approvedPassword}
                </div>
              </div>
              <Button
                onClick={copyApprovedPassword}
                className="w-full"
                variant={copied ? "outline" : "default"}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Password
                  </>
                )}
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setApprovedPassword(null)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
