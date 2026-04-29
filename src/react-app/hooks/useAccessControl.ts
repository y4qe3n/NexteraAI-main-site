import { useAuth } from "@/react-app/lib/AuthContext";
import { useSubscription } from "./useSubscription";

export function useAccessControl() {
  const { admin } = useAuth();
  const { currentPlan } = useSubscription();
  
  const role = admin?.role || "admin";
  const isEmployee = role === "employee";
  const isAdmin = role === "admin";
  
  const isBasic = currentPlan === "basic";
  const isPro = currentPlan === "pro" || currentPlan === "enterprise";
  
  return {
    role,
    isEmployee,
    isAdmin,
    isBasic,
    isPro,
    // Helper to check if feature is available
    canAccess: (options: { minPlan?: "basic" | "pro"; adminOnly?: boolean }) => {
      if (options.adminOnly && isEmployee) return false;
      if (options.minPlan === "pro" && isBasic) return false;
      return true;
    }
  };
}
