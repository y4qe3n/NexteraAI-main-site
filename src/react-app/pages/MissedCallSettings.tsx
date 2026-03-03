import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Switch } from "@/react-app/components/ui/switch";
import { Badge } from "@/react-app/components/ui/badge";
import {
  Loader2,
  Phone,
  MessageSquare,
  Send,
  Save,
  CheckCircle,
  AlertCircle,
  PhoneOff,
} from "lucide-react";

type MissedCallSettingsData = {
  id: number;
  organization_id: number;
  enabled: boolean | number;
  sms_template: string;
  business_name: string;
  virtual_number: string;
  max_sms_per_caller_per_day: number;
};

export function MissedCallSettingsPage() {
  const [settings, setSettings] = useState<MissedCallSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testPhone, setTestPhone] = useState("");
  const [testSending, setTestSending] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/missed-call-settings", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      setSettings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/missed-call-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      const data = await res.json();
      setSettings(data);
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestSms = async () => {
    if (!testPhone) return;
    try {
      setTestSending(true);
      setError(null);
      const res = await fetch("/api/missed-call-settings/test-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone_number: testPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send test SMS");
      setSuccess("Test SMS sent to " + testPhone);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTestSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <PhoneOff className="w-6 h-6 text-primary" />
            Missed Call Follow-up
          </h2>
          <p className="text-muted-foreground mt-1">
            Automatically send SMS to callers when you miss their call. Recover leads and keep customers engaged.
          </p>
        </div>
        <Badge
          variant="outline"
          className={settings?.enabled ? "border-emerald-500/40 text-emerald-400" : "border-red-500/40 text-red-400"}
        >
          {settings?.enabled ? "Active" : "Inactive"}
        </Badge>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Main Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-primary" />
            Configuration
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Missed Call SMS</p>
                <p className="text-sm text-muted-foreground">
                  When active, missed calls trigger an automatic SMS to the caller.
                </p>
              </div>
              <Switch
                checked={!!settings?.enabled}
                onCheckedChange={(checked) =>
                  setSettings((s) => s ? { ...s, enabled: checked } : s)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <Input
                placeholder="e.g. NexteraAI Security"
                value={settings?.business_name || ""}
                onChange={(e) =>
                  setSettings((s) => s ? { ...s, business_name: e.target.value } : s)
                }
              />
              <p className="text-xs text-muted-foreground">Used in the SMS via {"{business_name}"} placeholder.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Virtual Number</label>
              <Input
                placeholder="e.g. +27211234567"
                value={settings?.virtual_number || ""}
                onChange={(e) =>
                  setSettings((s) => s ? { ...s, virtual_number: e.target.value } : s)
                }
              />
              <p className="text-xs text-muted-foreground">
                Your Africa's Talking virtual number. Forward your business line to this number.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max SMS per caller per day</label>
              <Input
                type="number"
                min={1}
                max={5}
                value={settings?.max_sms_per_caller_per_day || 1}
                onChange={(e) =>
                  setSettings((s) => s ? { ...s, max_sms_per_caller_per_day: parseInt(e.target.value) || 1 } : s)
                }
              />
              <p className="text-xs text-muted-foreground">Prevents spamming the same caller.</p>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Settings
            </Button>
          </div>
        </Card>

        {/* SMS Template & Test */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              SMS Template
            </h3>
            <div className="space-y-3">
              <textarea
                className="w-full min-h-[120px] rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={settings?.sms_template || ""}
                onChange={(e) =>
                  setSettings((s) => s ? { ...s, sms_template: e.target.value } : s)
                }
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Available placeholders:</p>
                <ul className="list-disc ml-4 space-y-0.5">
                  <li><code>{"{business_name}"}</code> — Your business name</li>
                  <li><code>{"{time}"}</code> — Time of the missed call</li>
                </ul>
                <p className="mt-2 text-amber-400/80">"Reply STOP to opt out" is automatically appended.</p>
              </div>

              {/* Preview */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs font-medium text-muted-foreground mb-1">Preview:</p>
                <p className="text-sm">
                  {(settings?.sms_template || "")
                    .replace("{business_name}", settings?.business_name || "YourBusiness")
                    .replace("{time}", new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }))}
                  {"\n"}Reply STOP to opt out.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Send className="w-5 h-5 text-primary" />
              Send Test SMS
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="+27821234567"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
              />
              <Button onClick={handleTestSms} disabled={testSending || !testPhone} className="text-white whitespace-nowrap">
                {testSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Send Test
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Sends a sample SMS using your current template to verify the integration works.
            </p>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-medium text-sm mb-2">Setup Checklist</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${settings?.business_name ? "text-emerald-400" : "text-muted-foreground/50"}`} />
                Set business name
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${settings?.virtual_number ? "text-emerald-400" : "text-muted-foreground/50"}`} />
                Configure virtual number
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${settings?.sms_template ? "text-emerald-400" : "text-muted-foreground/50"}`} />
                Customize SMS template
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${settings?.enabled ? "text-emerald-400" : "text-muted-foreground/50"}`} />
                Enable the feature
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
