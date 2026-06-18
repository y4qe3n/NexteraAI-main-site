import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/react-app/lib/AuthContext";
import { useAgentEnrollment } from "@/react-app/hooks/useAgentEnrollment";
import { ROLE_EMPLOYEE } from "@/react-app/constants/roles";
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
  ChevronDown,
  Users,
  PhoneOff,
  Briefcase,
  CreditCard,
  Menu,
  X,
  Search,
  ShieldCheck,
  Sparkles,
  Activity,
} from "lucide-react";

const navigationSections = [
  {
    id: "security",
    label: "Security",
    items: [
      { icon: Radar, label: "Threat Radar", path: "/dashboard/threats" },
      { icon: Shield, label: "Endpoint Shield", path: "/dashboard/endpoints" },
      { icon: Mail, label: "Email Guard", path: "/dashboard/email" },
    ],
  },
  {
    id: "client-area",
    label: "Client Area",
    items: [{ icon: PhoneOff, label: "Missed Calls", path: "/dashboard/missed-calls" }],
  },
  {
    id: "business",
    label: "Business",
    items: [
      { icon: Briefcase, label: "Operations", path: "/dashboard/operations" },
      { icon: Database, label: "Data Vault", path: "/dashboard/backups" },
      { icon: Lock, label: "Access Control", path: "/dashboard/access" },
      { icon: Users, label: "Users", path: "/dashboard/users" },
    ],
  },
  {
    id: "education",
    label: "Education",
    items: [{ icon: GraduationCap, label: "Academy", path: "/dashboard/training" }],
  },
  {
    id: "compliance",
    label: "Compliance",
    items: [{ icon: FileCheck, label: "POPIA", path: "/dashboard/compliance" }],
  },
];

const accountItems = [
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  { icon: CreditCard, label: "Billing", path: "/dashboard/billing" },
];

export function DashboardLayout() {
  const location = useLocation();
  const { admin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    security: true,
    "client-area": true,
    business: true,
    education: true,
    compliance: true,
  });

  useAgentEnrollment();

  const role = admin?.role || "admin";
  const isEmployee = role === ROLE_EMPLOYEE;

  const employeeAllowedPaths = new Set([
    "/dashboard",
    "/dashboard/endpoints",
    "/dashboard/email",
    "/dashboard/training",
    "/dashboard/settings",
    "/dashboard/missed-calls",
    "/dashboard/operations",
  ]);

  const filteredSections = navigationSections
    .map((section) => ({
      ...section,
      items: isEmployee ? section.items.filter((item) => employeeAllowedPaths.has(item.path)) : section.items,
    }))
    .filter((section) => section.items.length > 0);

  const initials = admin?.name
    ? admin.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
  const displayName = admin?.name?.split(" ")[0] || "User";

  const isActive = (path: string) =>
    path === "/dashboard" ? location.pathname === path : location.pathname.startsWith(path);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/8 px-5 py-5">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-[linear-gradient(135deg,rgba(126,240,195,0.95),rgba(147,197,253,0.82))] text-slate-950 shadow-[0_18px_40px_-18px_rgba(126,240,195,0.55)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-semibold tracking-[-0.02em] text-slate-100">
              Nextera<span className="text-emerald-300">AI</span>
            </span>
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Command portal</p>
          </div>
        </Link>
      </div>

      <div className="border-b border-white/6 px-5 py-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-[radial-gradient(circle_at_top,rgba(126,240,195,0.14),rgba(7,10,17,0.96))] text-emerald-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Live posture</p>
            <p className="truncate text-sm font-medium text-slate-200">{displayName}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <Link
          to="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition"
          style={{
            backgroundColor: isActive("/dashboard") ? "rgba(126,240,195,0.10)" : "transparent",
            border: isActive("/dashboard") ? "1px solid rgba(126,240,195,0.18)" : "1px solid transparent",
            color: isActive("/dashboard") ? "#E9FFF6" : "#A6B0C3",
          }}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="font-medium">Dashboard</span>
          <Activity className="ml-auto h-3.5 w-3.5 text-emerald-300 opacity-0 transition group-hover:opacity-100" />
        </Link>

        {filteredSections.map((section) => (
          <div key={section.id} className="pt-2">
            <button
              onClick={() => setExpandedSections((prev) => ({ ...prev, [section.id]: !prev[section.id] }))}
              className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-300"
            >
              <span>{section.label}</span>
              {expandedSections[section.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {expandedSections[section.id] && (
              <div className="space-y-1 px-1">
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition"
                      style={{
                        backgroundColor: active ? "rgba(126,240,195,0.10)" : "transparent",
                        border: active ? "1px solid rgba(126,240,195,0.16)" : "1px solid transparent",
                        color: active ? "#E9FFF6" : "#A6B0C3",
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        <div className="mt-4 border-t border-white/8 pt-3">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">Account</p>
          {accountItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition"
                style={{
                  backgroundColor: active ? "rgba(255,255,255,0.05)" : "transparent",
                  border: active ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
                  color: active ? "#E9FFF6" : "#A6B0C3",
                }}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/8 p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(126,240,195,0.95),rgba(147,197,253,0.9))] text-xs font-semibold text-slate-950">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-100">{admin?.name || "User"}</p>
            <p className="truncate text-xs text-slate-500">{admin?.email || ""}</p>
          </div>
          <button
            onClick={() => logout()}
            className="rounded-full border border-white/8 bg-white/[0.03] p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="nx-dashboard-shell flex min-h-screen overflow-hidden text-slate-100">
      <aside className="nx-dashboard-sidebar fixed inset-y-0 left-0 z-40 hidden w-72 lg:flex lg:flex-col">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="nx-dashboard-sidebar relative h-full w-80 max-w-[88vw]">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <header className="nx-dashboard-topbar sticky top-0 z-30 flex h-16 items-center gap-4 px-4 sm:px-6">
          <button
            className="rounded-full border border-white/8 bg-white/[0.03] p-2 text-slate-300 transition hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2.5 md:flex">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search the dashboard"
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative rounded-full border border-white/8 bg-white/[0.03] p-2.5 text-slate-300 transition hover:bg-white/10" title="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </button>
            <div className="hidden items-center gap-3 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(126,240,195,0.95),rgba(147,197,253,0.9))] text-xs font-semibold text-slate-950">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100">{displayName}</p>
                <p className="text-xs text-slate-500">Dashboard workspace</p>
              </div>
            </div>
          </div>
        </header>

        <main className="nx-dashboard-view flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
