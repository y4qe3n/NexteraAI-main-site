import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Badge } from "@/react-app/components/ui/badge";
import { Switch } from "@/react-app/components/ui/switch";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Building2,
  Wrench,
  Shield,
  CreditCard,
  Rocket,
  Phone,
  Mail,
  MapPin,
  Monitor,
  Cloud,
  Lock,
  Bell,
  MessageSquare,
  Users,
  ExternalLink,
  PhoneOff,
  BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5;

type FormData = {
  // Step 1
  business_name: string;
  business_type: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  physical_address: string;
  // Step 2
  email_provider: string;
  cloud_storage: string[];
  device_count: string;
  existing_antivirus: string;
  uses_mfa: string;
  collects_customer_data: boolean;
  has_whatsapp_business: boolean;
  // Step 3
  preferred_alert_method: string;
  wants_missed_call_sms: boolean;
  security_concerns: string;
  staff_training_count: string;
  // Step 4 (plan)
  selected_plan: string;
};

const INITIAL: FormData = {
  business_name: "",
  business_type: "",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  physical_address: "",
  email_provider: "",
  cloud_storage: [],
  device_count: "",
  existing_antivirus: "",
  uses_mfa: "",
  collects_customer_data: false,
  has_whatsapp_business: false,
  preferred_alert_method: "",
  wants_missed_call_sms: false,
  security_concerns: "",
  staff_training_count: "1",
  selected_plan: "pro",
};

// ─── Option lists ─────────────────────────────────────────────────────────────

const BUSINESS_TYPES = [
  "Retail",
  "Salon / Beauty",
  "Mechanic / Auto",
  "Restaurant / Takeaway",
  "Office / Consulting",
  "Healthcare",
  "Education",
  "Construction",
  "Other",
];

const EMAIL_PROVIDERS = ["Microsoft 365", "Gmail / Google Workspace", "Zoho Mail", "Other"];
const CLOUD_OPTIONS = ["Google Drive", "OneDrive", "Dropbox", "iCloud", "None"];
const ANTIVIRUS_OPTIONS = ["None", "Windows Defender", "Avast", "Bitdefender", "Norton", "Other"];
const MFA_OPTIONS = [
  { value: "yes", label: "Yes – on all accounts" },
  { value: "some", label: "On some accounts" },
  { value: "no", label: "No" },
];
const ALERT_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "both", label: "Both" },
];
const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "R1000/mo",
    features: ["Up to 10 devices", "Endpoint Shield", "Email Guard", "Monthly reports"],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R2000/mo",
    features: ["Up to 25 devices", "All Basic features", "POPIA Compliance", "Missed Call SMS", "Priority support"],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "R3000/mo",
    features: ["Unlimited devices", "All Pro features", "Academy", "Dedicated account manager"],
    highlighted: false,
  },
];

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, icon: Building2, label: "Business" },
  { n: 2, icon: Wrench, label: "Setup" },
  { n: 3, icon: Shield, label: "Security" },
  { n: 4, icon: CreditCard, label: "Plan" },
  { n: 5, icon: Rocket, label: "Done" },
];

function StepBar({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute left-0 right-0 top-5 h-0.5 bg-border -z-10" />
      {STEPS.map((s) => {
        const Icon = s.icon;
        const done = current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                done
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : active
                  ? "bg-primary border-primary text-white"
                  : "bg-background border-border text-muted-foreground"
              }`}
            >
              {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            <span className={`text-xs font-medium ${active ? "text-primary" : done ? "text-emerald-400" : "text-muted-foreground"}`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Reusable selectors ───────────────────────────────────────────────────────

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-lg border text-sm transition-all text-left ${
        selected
          ? "border-primary bg-primary/10 text-primary font-medium"
          : "border-border text-muted-foreground hover:border-primary/40"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: any) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-primary" /> Business Basics
        </h3>
        <p className="text-sm text-muted-foreground">Tell us about your business so we can personalise your protection.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Business Name *</label>
          <Input placeholder="e.g. Jozi Auto Repairs" value={data.business_name} onChange={(e) => set("business_name", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Contact Person *</label>
          <Input placeholder="Your full name" value={data.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1"><Phone className="w-3 h-3" /> Phone (WhatsApp preferred) *</label>
          <Input placeholder="+27 82 123 4567" value={data.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1"><Mail className="w-3 h-3" /> Contact Email *</label>
          <Input type="email" placeholder="you@business.co.za" value={data.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> Physical Address / Suburb</label>
          <Input placeholder="e.g. Sandton, Johannesburg" value={data.physical_address} onChange={(e) => set("physical_address", e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Business Type *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BUSINESS_TYPES.map((t) => (
            <OptionButton key={t} label={t} selected={data.business_type === t} onClick={() => set("business_type", t)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: any) => void }) {
  const toggleCloud = (opt: string) => {
    if (opt === "None") {
      set("cloud_storage", ["None"]);
      return;
    }
    const current = data.cloud_storage.filter((c) => c !== "None");
    if (current.includes(opt)) {
      set("cloud_storage", current.filter((c) => c !== opt));
    } else {
      set("cloud_storage", [...current, opt]);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <Wrench className="w-5 h-5 text-primary" /> Current Tools & Setup
        </h3>
        <p className="text-sm text-muted-foreground">This helps us configure the right protection for your existing environment.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-1"><Mail className="w-3 h-3" /> Email Provider</label>
        <div className="grid grid-cols-2 gap-2">
          {EMAIL_PROVIDERS.map((p) => (
            <OptionButton key={p} label={p} selected={data.email_provider === p} onClick={() => set("email_provider", p)} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-1"><Cloud className="w-3 h-3" /> Cloud Storage (select all that apply)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CLOUD_OPTIONS.map((o) => (
            <OptionButton key={o} label={o} selected={data.cloud_storage.includes(o)} onClick={() => toggleCloud(o)} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1"><Monitor className="w-3 h-3" /> Number of Devices to Protect</label>
          <Input type="number" min="1" placeholder="e.g. 5" value={data.device_count} onChange={(e) => set("device_count", e.target.value)} />
          <p className="text-xs text-muted-foreground">Laptops, desktops, phones – rough estimate</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Existing Antivirus / Security</label>
          <div className="grid grid-cols-2 gap-2">
            {ANTIVIRUS_OPTIONS.map((a) => (
              <OptionButton key={a} label={a} selected={data.existing_antivirus === a} onClick={() => set("existing_antivirus", a)} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-1"><Lock className="w-3 h-3" /> Do you currently use MFA on email/accounts?</label>
        <div className="flex flex-wrap gap-2">
          {MFA_OPTIONS.map((m) => (
            <OptionButton key={m.value} label={m.label} selected={data.uses_mfa === m.value} onClick={() => set("uses_mfa", m.value)} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
          <div>
            <p className="text-sm font-medium">Do you collect customer phone numbers / emails?</p>
            <p className="text-xs text-muted-foreground">Enables POPIA data inventory tools</p>
          </div>
          <Switch checked={data.collects_customer_data} onCheckedChange={(v) => set("collects_customer_data", v)} />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
          <div>
            <p className="text-sm font-medium">Do you have a WhatsApp Business account?</p>
            <p className="text-xs text-muted-foreground">Enables missed-call SMS follow-up</p>
          </div>
          <Switch checked={data.has_whatsapp_business} onCheckedChange={(v) => set("has_whatsapp_business", v)} />
        </div>
      </div>
    </div>
  );
}

function Step3({ data, set }: { data: FormData; set: (k: keyof FormData, v: any) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-primary" /> Security & Preferences
        </h3>
        <p className="text-sm text-muted-foreground">Tailor how NexteraAI keeps you protected and informed.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-1"><Bell className="w-3 h-3" /> Preferred Alert Method</label>
        <div className="flex flex-wrap gap-2">
          {ALERT_OPTIONS.map((a) => (
            <OptionButton key={a.value} label={a.label} selected={data.preferred_alert_method === a.value} onClick={() => set("preferred_alert_method", a.value)} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-background/50 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <PhoneOff className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">Missed Call Follow-up</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We’ve paused the UI for this automation while we transition it to NexteraAI V2. The backend
            automations and logs remain active, and we’ll restore the full setup experience once the
            new workflow ships.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1"><Users className="w-3 h-3" /> Number of Staff Needing Training</label>
          <Input type="number" min="1" placeholder="e.g. 3" value={data.staff_training_count} onChange={(e) => set("staff_training_count", e.target.value)} />
          <p className="text-xs text-muted-foreground">For Academy phishing & POPIA modules</p>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Any specific concerns or priorities?</label>
        <textarea
          className="w-full min-h-[100px] rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g. Worried about phishing emails, Need POPIA help for customer bookings, Staff keep clicking bad links..."
          value={data.security_concerns}
          onChange={(e) => set("security_concerns", e.target.value)}
        />
      </div>
    </div>
  );
}

function Step4({ data, set }: { data: FormData; set: (k: keyof FormData, v: any) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <CreditCard className="w-5 h-5 text-primary" /> Choose Your Plan
        </h3>
        <p className="text-sm text-muted-foreground">Start with a 14-day free trial. No credit card required to explore.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => set("selected_plan", plan.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              data.selected_plan === plan.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/40"
            } ${plan.highlighted ? "relative" : ""}`}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-white bg-primary text-xs px-2">
                Most Popular
              </Badge>
            )}
            <p className="font-bold text-base">{plan.name}</p>
            <p className="text-primary font-semibold text-lg mb-3">{plan.price}</p>
            <ul className="space-y-1">
              {plan.features.map((f) => (
                <li key={f} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        You'll be redirected to PayFast to complete payment securely.
      </p>
    </div>
  );
}

function Step5({ data }: { data: FormData }) {
  const navigate = useNavigate();
  const quickWins = [
    {
      icon: Lock,
      title: "Turn on MFA for your email right now",
      desc: "Blocks 99% of account hijacks.",
      links: [
        { label: "Microsoft guide", url: "https://support.microsoft.com/en-us/account-billing/how-to-use-two-step-verification-with-your-microsoft-account-c7910146-672f-01e9-50a0-93b4585e7eb4" },
        { label: "Google guide", url: "https://myaccount.google.com/security" },
      ],
    },
    {
      icon: BookOpen,
      title: "Invite staff to Academy training",
      desc: "Phishing awareness & POPIA basics modules available.",
      links: [{ label: "Go to Academy", url: "/dashboard/training" }],
      internal: true,
    },
    {
      icon: Shield,
      title: "Run your first threat scan",
      desc: "See your current security posture at a glance.",
      links: [{ label: "Open Threat Radar", url: "/dashboard/threats" }],
      internal: true,
    },
    {
      icon: CheckCircle,
      title: "Review your POPIA compliance checklist",
      desc: "Start your data inventory and stay fine-free.",
      links: [{ label: "Open Compliance Hub", url: "/dashboard/compliance" }],
      internal: true,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold mb-1">Setup Complete!</h3>
        <p className="text-muted-foreground text-sm">
          Welcome to NexteraAI, <strong>{data.business_name || "your business"}</strong>. Your dashboard is ready. Here are your quick wins to get protected fast:
        </p>
      </div>

      <div className="space-y-3">
        {quickWins.map((w, i) => {
          const Icon = w.icon;
          return (
            <Card key={i} className="p-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{w.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{w.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {w.links.map((l) =>
                    (w as any).internal ? (
                      <Button
                        key={l.label}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => navigate(l.url)}
                      >
                        {l.label} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    ) : (
                      <a
                        key={l.label}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        {l.label} <ExternalLink className="w-3 h-3" />
                      </a>
                    )
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Button
        className="w-full text-white"
        size="lg"
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export function OnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormData, value: any) => setData((d) => ({ ...d, [key]: value }));

  const canProceed = (): boolean => {
    if (step === 1) return !!(data.business_name && data.contact_name && data.contact_phone && data.contact_email && data.business_type);
    return true;
  };

  const handleNext = async () => {
    setError("");

    // On step 4 (plan), save all data then proceed to step 5
    if (step === 4) {
      try {
        setSaving(true);
        const res = await fetch("/api/onboarding/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...data,
            cloud_storage: data.cloud_storage.join(","),
            device_count: parseInt(data.device_count) || 1,
            staff_training_count: parseInt(data.staff_training_count) || 1,
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          setError(d.error || "Failed to save setup. Please try again.");
          return;
        }
        // If paid plan selected, redirect to payment
        if (data.selected_plan !== "basic") {
          const pfRes = await fetch("/api/payfast/create-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ plan: data.selected_plan }),
          });
          if (pfRes.ok) {
            const pfData = await pfRes.json();
            if (pfData.redirectUrl && pfData.formData) {
              // Build and submit PayFast form
              const form = document.createElement("form");
              form.method = "POST";
              form.action = pfData.redirectUrl;
              Object.entries(pfData.formData).forEach(([k, v]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = k;
                input.value = String(v);
                form.appendChild(input);
              });
              document.body.appendChild(form);
              form.submit();
              return;
            }
          }
        }
        setStep(5);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (step < 5) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSkip = () => navigate("/dashboard");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Let's get you protected in under 5 minutes</h1>
          <p className="text-muted-foreground text-sm mt-1">Fill in the details below to personalise your NexteraAI security setup.</p>
        </div>

        <Card className="p-6 sm:p-8">
          <StepBar current={step} />

          {/* Step content */}
          {step === 1 && <Step1 data={data} set={set} />}
          {step === 2 && <Step2 data={data} set={set} />}
          {step === 3 && <Step3 data={data} set={set} />}
          {step === 4 && <Step4 data={data} set={set} />}
          {step === 5 && <Step5 data={data} />}

          {error && (
            <p className="text-sm text-destructive mt-4 p-3 rounded-lg bg-destructive/10">{error}</p>
          )}

          {/* Navigation */}
          {step < 5 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <div className="flex gap-2">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack} className="text-white">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                )}
                <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground text-sm">
                  Skip for now
                </Button>
              </div>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || saving}
                className="text-white"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {step === 4
                  ? data.selected_plan === "basic"
                    ? "Complete Setup"
                    : "Proceed to Payment"
                  : "Next"}
                {!saving && step !== 4 && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Step {step} of 5 · Your data is encrypted and never shared.
        </p>
      </div>
    </div>
  );
}
