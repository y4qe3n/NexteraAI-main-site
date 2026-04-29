import { Link, useLocation, Outlet } from "react-router";
import { useAuth } from "@/react-app/lib/AuthContext";
import { useAgentEnrollment } from "@/react-app/hooks/useAgentEnrollment";
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
  ChevronDown,
  Users,
  PhoneOff,
  Rocket,
  Briefcase,
} from "lucide-react";
import { Button } from "./ui/button";
import { ROLE_EMPLOYEE } from "@/react-app/constants/roles";
import { useState } from "react";

// Define navigation sections with collapsible groups
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
    items: [
      { icon: PhoneOff, label: "Missed Call Follow-up", path: "/dashboard/missed-calls" },
    ],
  },
  {
    id: "business",
    label: "Business",
    items: [
      { icon: Briefcase, label: "Operations", path: "/dashboard/operations" },
      { icon: Database, label: "Data Vault", path: "/dashboard/backups" },
      { icon: Lock, label: "Access Control", path: "/dashboard/access" },
      { icon: Users, label: "Users Database", path: "/dashboard/users" },
    ],
  },
  {
    id: "education",
    label: "Education",
    items: [
      { icon: GraduationCap, label: "Academy", path: "/dashboard/training" },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    items: [
      { icon: FileCheck, label: "POPIA Compliance", path: "/dashboard/compliance" },
    ],
  },
];

const secondaryItems = [
  { icon: Rocket, label: "Getting Started", path: "/dashboard/onboarding" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function DashboardLayout() {
  const location = useLocation();
  const { admin, logout } = useAuth();

  // Silently enrol the local desktop agent (Tauri only) once the user lands
  // in the dashboard. No-ops in plain browsers.
  useAgentEnrollment();

  // Get role from admin
  const role = admin?.role || "admin";
  const isEmployee = role === ROLE_EMPLOYEE;

  // State for collapsible sections (default all expanded)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    security: true,
    "client-area": true,
    business: true,
    education: true,
    compliance: true,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Employee allowed paths
  const employeeAllowedPaths = new Set([
    "/dashboard",
    "/dashboard/endpoints",
    "/dashboard/email",
    "/dashboard/training",
    "/dashboard/settings",
    "/dashboard/missed-calls",
    "/dashboard/operations",
  ]);

  // Filter sections and items based on role
  const filteredSections = navigationSections
    .map((section) => ({
      ...section,
      items: isEmployee
        ? section.items.filter((item) => employeeAllowedPaths.has(item.path))
        : section.items,
    }))
    .filter((section) => section.items.length > 0);

  const userInitials = admin?.name
    ? admin.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : admin?.email?.slice(0, 2).toUpperCase() || "U";

  const userName = admin?.name || admin?.email?.split("@")[0] || "User";
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
          {/* Dashboard - always visible */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
              location.pathname === "/dashboard"
                ? "bg-gradient-to-b from-indigo-900/80 via-primary/70 to-card/90 border border-primary/60 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.8)] text-white"
                : "text-sidebar-foreground/70 hover:text-white hover:bg-gradient-to-b hover:from-indigo-900/70 hover:via-primary/60 hover:to-card/90 hover:border hover:border-primary/60 hover:shadow-[0_12px_30px_-20px_rgba(15,23,42,0.8)]"
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${location.pathname === "/dashboard" ? "text-primary" : ""}`} />
            Dashboard
            {location.pathname === "/dashboard" && <ChevronRight className="w-4 h-4 ml-auto" />}
          </Link>

          {/* Collapsible Sections */}
          {filteredSections.map((section) => (
            <div key={section.id} className="mt-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-sidebar-foreground transition-colors"
              >
                <span>{section.label}</span>
                {expandedSections[section.id] ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
              {expandedSections[section.id] && (
                <div className="space-y-0.5 mt-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isActive
                            ? "bg-gradient-to-b from-indigo-900/80 via-primary/70 to-card/90 border border-primary/60 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.8)] text-white"
                            : "text-sidebar-foreground/70 hover:text-white hover:bg-gradient-to-b hover:from-indigo-900/70 hover:via-primary/60 hover:to-card/90 hover:border hover:border-primary/60 hover:shadow-[0_12px_30px_-20px_rgba(15,23,42,0.8)]"
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                        {item.label}
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Account Section */}
          <div className="mt-6">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
              Account
            </div>
            {secondaryItems
              .filter((item) => !(isEmployee && item.label === "Getting Started"))
              .map((item) => {
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
          </div>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/50">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">{userInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground">{admin?.email}</p>
            </div>
            <Button className="text-white flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors h-8 w-8" onClick={() => logout()} title="Sign out">
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
