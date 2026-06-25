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
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
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
    items: [{ icon: PhoneOff, label: "Missed Calls V2", path: "/dashboard/missed-calls" }],
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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

  const renderSidebar = (collapsed = false) => (
    <div className="flex h-full min-h-0 flex-col">
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-3">
        <Link
          to="/dashboard"
          onClick={() => setMobileOpen(false)}
          className={`group flex items-center rounded-lg text-sm transition ${
            collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
          }`}
          style={{
            backgroundColor: isActive("/dashboard") ? "rgba(139,92,246,0.18)" : "transparent",
            border: isActive("/dashboard") ? "1px solid rgba(196,181,253,0.18)" : "1px solid transparent",
            color: isActive("/dashboard") ? "#F8FAFC" : "#A6B0C3",
          }}
          title="Dashboard"
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="font-medium">Dashboard</span>
              <Activity className="ml-auto h-3.5 w-3.5 text-purple-200 opacity-0 transition group-hover:opacity-100" />
            </>
          )}
        </Link>

        {filteredSections.map((section) => (
          <div key={section.id} className="pt-2">
            {!collapsed && (
              <button
                onClick={() => setExpandedSections((prev) => ({ ...prev, [section.id]: !prev[section.id] }))}
                className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-300"
              >
                <span>{section.label}</span>
                {expandedSections[section.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            )}
            {(collapsed || expandedSections[section.id]) && (
              <div className={`space-y-1 ${collapsed ? "" : "px-1"}`}>
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center rounded-lg text-sm transition ${
                        collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
                      }`}
                      style={{
                        backgroundColor: active ? "rgba(139,92,246,0.14)" : "transparent",
                        border: active ? "1px solid rgba(196,181,253,0.15)" : "1px solid transparent",
                        color: active ? "#F8FAFC" : "#A6B0C3",
                      }}
                      title={item.label}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        <div className={`mt-4 border-t border-[#8B5CF6]/12 pt-3 ${collapsed ? "space-y-1" : ""}`}>
          {!collapsed && (
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">Account</p>
          )}
          {accountItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-lg text-sm transition ${
                  collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
                }`}
                style={{
                  backgroundColor: active ? "rgba(139,92,246,0.14)" : "transparent",
                  border: active ? "1px solid rgba(196,181,253,0.15)" : "1px solid transparent",
                  color: active ? "#F8FAFC" : "#A6B0C3",
                }}
                title={item.label}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[#8B5CF6]/12 p-2">
        <div
          className={`flex items-center rounded-lg border border-[#8B5CF6]/12 bg-[#0b0910] p-3 ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,rgba(139,92,246,0.95),rgba(196,181,253,0.9))] text-stone-950">
            {initials}
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-100">{admin?.name || "User"}</p>
                <p className="truncate text-xs text-slate-500">{admin?.email || ""}</p>
              </div>
              <button
                onClick={() => logout()}
                className="rounded-lg border border-[#8B5CF6]/12 bg-[#0b0910] p-2 text-slate-400 transition hover:bg-[#14101d] hover:text-slate-100"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        {collapsed && (
          <button
            onClick={() => logout()}
            className="mt-2 flex w-full justify-center rounded-lg border border-[#8B5CF6]/12 bg-[#0b0910] p-2 text-slate-400 transition hover:bg-[#14101d] hover:text-slate-100"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="nx-dashboard-shell flex min-h-screen overflow-hidden text-slate-100">
      <aside
        className={`nx-dashboard-sidebar fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-300 lg:flex lg:flex-col ${
          sidebarCollapsed ? "w-20" : "w-56"
        }`}
      >
        {renderSidebar(sidebarCollapsed)}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="nx-dashboard-sidebar relative h-full w-80 max-w-[88vw]">{renderSidebar(false)}</aside>
        </div>
      )}

      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-[padding] duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-56"
        }`}
      >
        <header className="nx-dashboard-topbar sticky top-0 z-30 flex h-12 items-center gap-3 px-3 sm:px-4">
          <button
            type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
            className="hidden rounded-lg border border-[#8B5CF6]/12 bg-[#0b0910] p-2 text-slate-400 transition hover:bg-[#14101d] hover:text-slate-100 lg:inline-flex"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>

          <button
            className="rounded-lg border border-[#8B5CF6]/12 bg-[#0b0910] p-2 text-slate-300 transition hover:bg-[#14101d] lg:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="relative ml-auto flex items-center gap-3">
            <button
              className="relative rounded-lg border border-[#8B5CF6]/12 bg-[#0b0910] p-2 text-slate-300 transition hover:bg-[#14101d]"
              title="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((open) => !open)}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-purple-200" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-11 z-40 w-80 rounded-xl border border-purple-200/12 bg-[#0b0910] p-3 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)]">
                <div className="flex items-center justify-between border-b border-[#8B5CF6]/12 pb-3">
                  <p className="text-sm font-semibold text-slate-100">Notifications</p>
                  <span className="rounded-md bg-purple-300/12 px-2 py-1 text-[11px] font-semibold text-purple-100">0 new</span>
                </div>
                <div className="py-5 text-center">
                  <Bell className="mx-auto h-5 w-5 text-purple-200" />
                  <p className="mt-2 text-sm font-medium text-slate-100">No alerts right now</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Critical security, billing, and onboarding notices will appear here.</p>
                </div>
              </div>
            )}
            <div className="hidden items-center gap-3 rounded-lg border border-[#8B5CF6]/12 bg-[#0b0910] px-3 py-1.5 md:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[linear-gradient(135deg,rgba(139,92,246,0.95),rgba(196,181,253,0.9))] text-xs font-semibold text-stone-950">
                {initials}
              </div>
              <div className="flex min-h-7 items-center">
                <p className="text-sm font-medium text-slate-100">{displayName}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="nx-dashboard-view flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
