import { ReactNode } from "react";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/react-app/lib/AuthContext";
import { ROLE_ADMIN } from "@/react-app/constants/roles";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function RoleProtectedRoute({ children, allowedRoles = [ROLE_ADMIN] }: RoleProtectedRouteProps) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // Get role from admin user, default to admin for now
  const role = admin.role || ROLE_ADMIN;
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
