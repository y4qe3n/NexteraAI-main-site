import { Link, useLocation, Outlet } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Logo } from "./Logo";
import {
  LayoutDashboard,
  Radar,
  FileCheck,
  Shield,
  Mail,
  Lock,
  Database,
  GraduationCap,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Users,
  PhoneOff,
  Rocket,
  Brain,
} from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Brain, label: "AI Detection Center", path: "/dashboard/ai-detections" },
  { icon: Radar, label: "Threat Radar", path: "/dashboard/threats" },
  { icon: FileCheck, label: "POPIA Compliance", path: "/dashboard/compliance" },
  { icon: Users, label: "Users Database", path: "/dashboard/users" },
  { icon: Shield, label: "Endpoint Shield", path: "/dashboard/endpoints" },
  { icon: Mail, label: "Email Guard", path: "/dashboard/email" },
  { icon: Lock, label: "Access Control", path: "/dashboard/access" },
  { icon: Database, label: "Data Vault", path: "/dashboard/backups" },
  { icon: GraduationCap, label: "Academy", path: "/dashboard/training" },
  { icon: PhoneOff, label: "Missed Call Follow-up", path: "/dashboard/missed-calls" },
];

const secondaryItems = [
  { icon: Rocket, label: "Getting Started", path: "/dashboard/onboarding" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  { icon: Settings, label: "Call Settings", path: "/dashboard/missed-call-settings" },
];

export function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const userInitials = user?.google_user_data?.name
    ? user.google_user_data.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "U";

  const userName = user?.google_user_data?.name || user?.email?.split("@")[0] || "User";
  const displayName = userName.split(" ")[0];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col fixed h-full">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/dashboard">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
            Security
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                {item.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}

          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2 mt-6">
            Account
          </div>
          {secondaryItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/50">
            {user?.google_user_data?.picture ? (
              <img
                src={user.google_user_data.picture}
                alt={userName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{userInitials}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button className="text-white flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors h-8 w-8" onClick={logout} title="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-semibold">
              Welcome back, {displayName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button className="text-white flex items-center gap-2 bg-destructive hover:bg-destructive/90 transition-colors relative" variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Button className="text-white flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors" variant="outline" size="sm">
              Get Support
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
