import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
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
import { MissedCallSettingsPage } from "@/react-app/pages/MissedCallSettings";
import { MissedCallLogsPage } from "@/react-app/pages/MissedCallLogs";
import { PaymentSuccess } from "@/react-app/pages/PaymentSuccess";
import { PaymentCancel } from "@/react-app/pages/PaymentCancel";
import { OnboardingPage } from "@/react-app/pages/Onboarding";
import { OnboardingWizard } from "@/react-app/pages/OnboardingWizard";
import { AIDetectionsPage } from "@/react-app/pages/AIDetections";
import { Login } from "@/react-app/pages/Login";
import { AuthCallback } from "@/react-app/pages/AuthCallback";
import { DashboardLayout } from "@/react-app/components/DashboardLayout";
import { ProtectedRoute } from "@/react-app/components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="dark">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingWizard /></ProtectedRoute>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="compliance" element={<ComplianceHub />} />
              <Route path="users" element={<UsersDatabase />} />
              <Route path="threats" element={<ThreatRadarPage />} />
              <Route path="ai-detections" element={<AIDetectionsPage />} />
              <Route path="endpoints" element={<EndpointShieldPage />} />
              <Route path="email" element={<EmailGuardPage />} />
              <Route path="access" element={<AccessControlPage />} />
              <Route path="backups" element={<DataVaultPage />} />
              <Route path="training" element={<AcademyPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="missed-calls" element={<MissedCallLogsPage />} />
              <Route path="missed-call-settings" element={<MissedCallSettingsPage />} />
              <Route path="onboarding" element={<OnboardingPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
