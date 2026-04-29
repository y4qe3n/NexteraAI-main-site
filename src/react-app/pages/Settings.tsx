import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Switch } from "@/react-app/components/ui/switch";
import { Loader2, Settings, User, Mail, Bell, Lock, CheckCircle, Key, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/react-app/components/ui/tabs";
import { useAuth } from "@/react-app/lib/AuthContext";
import { ROLE_EMPLOYEE } from "@/react-app/constants/roles";
import { SubscriptionManagement } from "@/react-app/components/SubscriptionManagement";

type UserSettings = {
  id: number;
  full_name: string;
  email: string;
  notifications_enabled: boolean;
  notification_frequency: string;
  two_factor_enabled: boolean;
};

export function SettingsPage() {
  const { admin } = useAuth();
  const userRole = admin?.role || "admin";
  const isEmployee = userRole === ROLE_EMPLOYEE;
  
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Password change request state
  const [passwordRequestStatus, setPasswordRequestStatus] = useState<{
    id: number;
    status: string;
    requested_at: string;
    reviewed_at: string | null;
  } | null>(null);
  const [requestingPassword, setRequestingPassword] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/settings", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setSettings(data);
        
        // Fetch password change request status for employees
        if (isEmployee) {
          const reqRes = await fetch("/api/user/password-change-request", { credentials: "include" });
          if (reqRes.ok) {
            const reqData = await reqRes.json();
            setPasswordRequestStatus(reqData.request);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
    setSuccessMessage(null); // Clear success message on change
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => prev ? { ...prev, [name]: checked } : null);
    setSuccessMessage(null); // Clear success message on change
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setSaveLoading(true);
      setError(null);
      setSuccessMessage(null);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      const updatedSettings = await res.json();
      setSettings(updatedSettings);
      setSuccessMessage("Settings saved successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRequestPasswordChange = async () => {
    try {
      setRequestingPassword(true);
      setRequestError(null);
      const res = await fetch("/api/user/password-change-request", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit request");
      }
      const data = await res.json();
      setPasswordRequestStatus({
        id: data.requestId,
        status: "pending",
        requested_at: new Date().toISOString(),
        reviewed_at: null,
      });
      setSuccessMessage("Password change request submitted. An admin will review your request.");
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setRequestingPassword(false);
    }
  };

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
          <Settings className="w-6 h-6" />
          <div>
            <p className="font-medium">Failed to load settings</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-destructive">
          <Settings className="w-6 h-6" />
          <div>
            <p className="font-medium">Settings data unavailable</p>
            <p className="text-sm text-muted-foreground">Please try again later.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account and security preferences.
          </p>
        </div>
        <Button
          size="sm"
          className="text-white"
          onClick={handleSaveSettings}
          disabled={saveLoading}
        >
          {saveLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Save Changes
        </Button>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 p-3 rounded-md">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {!isEmployee && <TabsTrigger value="subscription">Subscription </TabsTrigger>}
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Account Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  Update your personal details.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={settings.full_name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    placeholder="Your email address"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email cannot be changed.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notification Preferences
                </h3>
                <p className="text-sm text-muted-foreground">
                  Control how and when you receive notifications.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications_enabled">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts about security events and updates.
                    </p>
                  </div>
                  <Switch
                    id="notifications_enabled"
                    checked={settings.notifications_enabled}
                    onCheckedChange={(checked) => handleSwitchChange("notifications_enabled", checked === true)}
                  />
                </div>

                <div className="space-y-2 opacity-80" hidden={!settings.notifications_enabled}>
                  <Label htmlFor="notification_frequency">Notification Frequency</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={settings.notification_frequency === "immediate" ? "default" : "outline"}
                      size="sm"
                      className={settings.notification_frequency === "immediate" ? "text-white" : ""}
                      onClick={() => setSettings(prev => prev ? { ...prev, notification_frequency: "immediate" } : null)}
                      disabled={!settings.notifications_enabled}
                    >
                      Immediate
                    </Button>
                    <Button
                      variant={settings.notification_frequency === "daily" ? "default" : "outline"}
                      size="sm"
                      className={settings.notification_frequency === "daily" ? "text-white" : ""}
                      onClick={() => setSettings(prev => prev ? { ...prev, notification_frequency: "daily" } : null)}
                      disabled={!settings.notifications_enabled}
                    >
                      Daily Digest
                    </Button>
                    <Button
                      variant={settings.notification_frequency === "weekly" ? "default" : "outline"}
                      size="sm"
                      className={settings.notification_frequency === "weekly" ? "text-white" : ""}
                      onClick={() => setSettings(prev => prev ? { ...prev, notification_frequency: "weekly" } : null)}
                      disabled={!settings.notifications_enabled}
                    >
                      Weekly Summary
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Security Settings
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enhance your account security.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="two_factor_enabled">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security by enabling 2FA.
                  </p>
                </div>
                <Switch
                  id="two_factor_enabled"
                  checked={settings.two_factor_enabled}
                  onCheckedChange={(checked) => handleSwitchChange("two_factor_enabled", checked === true)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-white"
                  onClick={() => setShowChangePassword(true)}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {!isEmployee && (
          <TabsContent value="subscription" className="mt-4">
            <SubscriptionManagement 
              onUpgrade={() => {
                fetch("/api/payfast/create-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ plan: "pro", billing_period: "monthly" }),
                }).then(r => r.json()).then(data => {
                  if (data.redirectUrl) window.location.href = `${data.redirectUrl}?${new URLSearchParams(data.formData).toString()}`;
                  else alert("Unable to start upgrade. Please try again.");
                }).catch(() => alert("Unable to start upgrade. Please try again."));
              }}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5" />
                {isEmployee ? "Request Password Change" : "Change Password"}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowChangePassword(false)}>
                ×
              </Button>
            </div>
            
            {isEmployee ? (
              // Employee password change request UI
              <div className="space-y-4">
                {passwordRequestStatus?.status === "pending" ? (
                  <div className="text-center py-4">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                    <p className="font-medium">Request Pending</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Your password change request is awaiting admin approval. You'll receive a new password once approved.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Requested: {new Date(passwordRequestStatus.requested_at).toLocaleString()}
                    </p>
                    <Button className="mt-4 w-full" onClick={() => setShowChangePassword(false)}>
                      Close
                    </Button>
                  </div>
                ) : passwordRequestStatus?.status === "approved" ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                    <p className="font-medium">Request Approved</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Your password has been reset. Please check with your admin for the new password.
                    </p>
                    <Button className="mt-4 w-full" onClick={() => setShowChangePassword(false)}>
                      Close
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      As an employee, you need admin approval to change your password. Submit a request and an admin will review it.
                    </p>
                    {requestError && (
                      <p className="text-sm text-destructive">{requestError}</p>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowChangePassword(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 text-white"
                        onClick={handleRequestPasswordChange}
                        disabled={requestingPassword}
                      >
                        {requestingPassword ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Key className="w-4 h-4 mr-2" />
                        )}
                        Request Change
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Admin change password UI (placeholder - direct change)
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Admins can directly change their password. This feature will be implemented soon.
                </p>
                <Button className="w-full" onClick={() => setShowChangePassword(false)}>
                  Close
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
