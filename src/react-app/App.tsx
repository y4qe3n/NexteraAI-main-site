import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import React from "react";
import { Landing } from "@/react-app/pages/Landing";
import { Dashboard } from "@/react-app/pages/Dashboard";
import { ComplianceHub } from "@/react-app/pages/ComplianceHub";
import { UsersDatabase } from "@/react-app/pages/UsersDatabase";
import { ThreatRadarPage } from "@/react-app/pages/ThreatRadar";
import { EndpointShieldPage } from "@/react-app/pages/EndpointShield";
import { EmailGuardPage } from "@/react-app/pages/EmailGuard";
import { AccessControlPage } from "@/react-app/pages/AccessControl";
import { DataVaultPage } from "@/react-app/pages/DataVault";
import { AcademyPage } from "@/react-app/pages/Academy";
import { SettingsPage } from "@/react-app/pages/Settings";
import { MissedCallLogsPage } from "@/react-app/pages/MissedCallLogs";
import { BusinessOperations } from "@/react-app/pages/BusinessOperations";
import { PaymentSuccess } from "@/react-app/pages/PaymentSuccess";
import { PaymentCancel } from "@/react-app/pages/PaymentCancel";
import { OnboardingPage } from "@/react-app/pages/Onboarding";
import { OnboardingWizard } from "@/react-app/pages/OnboardingWizard";
import { Login } from "@/react-app/pages/Login";
import { Register } from "@/react-app/pages/Register";
import { BusinessSetup } from "@/react-app/pages/BusinessSetup";
import { AuthCallback } from "@/react-app/pages/AuthCallback";
import { Terms } from "@/react-app/pages/Terms";
import { Privacy } from "@/react-app/pages/Privacy";
import { DashboardLayout } from "@/react-app/components/DashboardLayout";
import { ProtectedRoute } from "@/react-app/components/ProtectedRoute";
import { RoleProtectedRoute } from "@/react-app/components/RoleProtectedRoute";
import { ROLE_ADMIN, ROLE_EMPLOYEE } from "@/react-app/constants/roles";
import { DemoDashboard } from "@/react-app/pages/DemoDashboard";
import { PricingPage } from "@/react-app/pages/PricingPage";
import { PayFastCallback } from "@/react-app/pages/PayFastCallback";
import { AuthProvider } from "@/react-app/lib/AuthContext";
import { InviteAcceptance } from "@/react-app/pages/InviteAcceptance";

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
            <p className="text-muted-foreground">Please refresh the page and try again.</p>
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground">Error details</summary>
              <pre className="mt-2 text-xs text-destructive overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="dark">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/*" element={<Register />} />
              <Route path="/business-setup" element={<BusinessSetup />} />
              <Route path="/invite/:token" element={<InviteAcceptance />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/demo" element={<DemoDashboard />} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingWizard /></ProtectedRoute>} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/payfast-callback" element={<PayFastCallback />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="compliance" element={<RoleProtectedRoute><ComplianceHub /></RoleProtectedRoute>} />
                <Route path="users" element={<RoleProtectedRoute><UsersDatabase /></RoleProtectedRoute>} />
                <Route path="threats" element={<RoleProtectedRoute><ThreatRadarPage /></RoleProtectedRoute>} />
                <Route path="endpoints" element={<EndpointShieldPage />} />
                <Route path="email" element={<EmailGuardPage />} />
                <Route path="access" element={<RoleProtectedRoute><AccessControlPage /></RoleProtectedRoute>} />
                <Route path="backups" element={<RoleProtectedRoute><DataVaultPage /></RoleProtectedRoute>} />
                <Route path="training" element={<AcademyPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="missed-calls" element={<RoleProtectedRoute allowedRoles={[ROLE_EMPLOYEE, ROLE_ADMIN]}><MissedCallLogsPage /></RoleProtectedRoute>} />
                <Route path="operations" element={<RoleProtectedRoute><BusinessOperations /></RoleProtectedRoute>} />
                <Route path="onboarding" element={<OnboardingPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
