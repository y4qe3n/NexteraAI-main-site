import { useState, useCallback, useEffect } from "react";
import { ChevronDown, Send, Loader2, Calculator, X } from "lucide-react";

// ─── Types (inline to avoid Worker import in React) ──────────────────────────

type Sector =
  | "professional_services" | "healthcare" | "financial_services"
  | "logistics" | "retail" | "manufacturing" | "education"
  | "government" | "other";

type ComplianceNeed = "popia" | "fica" | "pci_dss" | "iso27001" | "none";

interface FormState {
  deviceCount:         number;
  employeeCount:       number;
  sector:              Sector;
  complianceNeeds:     ComplianceNeed[];
  supportTier:         "business_hours" | "twentyfour_seven";
  backupVaultGb:       number;
  namedAccountManager: boolean;
}

interface EstimateResult {
  monthlyLow:   number;
  monthlyHigh:  number;
  annualLow:    number;
  annualHigh:   number;
  lineItems:    { label: string; monthlyZar: number }[];
  recommendedTier: string;
  contactFormPrefill: {
    deviceCount:       number;
    employeeCount:     number;
    sector:            string;
    estimatedMonthly:  string;
    complianceNeeds:   string;
  };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SECTOR_LABELS: Record<Sector, string> = {
  professional_services: "Professional Services (Legal, Accounting, Consulting)",
  healthcare:            "Healthcare & Medical",
  financial_services:    "Financial Services & Insurance",
  logistics:             "Logistics & Transport",
  retail:                "Retail & E-commerce",
  manufacturing:         "Manufacturing & Engineering",
  education:             "Education",
  government:            "Government & Public Sector",
  other:                 "Other",
};

const COMPLIANCE_LABELS: Record<ComplianceNeed, string> = {
  popia:    "POPIA",
  fica:     "FICA (Financial Intelligence Centre Act)",
  pci_dss:  "PCI-DSS (Card payment processing)",
  iso27001: "ISO 27001 readiness",
  none:     "None / Standard compliance only",
};

const BACKUP_OPTIONS = [
  { value: 0,    label: "No backup vault" },
  { value: 100,  label: "100 GB" },
  { value: 500,  label: "500 GB" },
  { value: 1000, label: "1 TB" },
  { value: 5000, label: "5 TB" },
];

const DEFAULT_FORM: FormState = {
  deviceCount:         50,
  employeeCount:       50,
  sector:              "professional_services",
  complianceNeeds:     ["popia"],
  supportTier:         "business_hours",
  backupVaultGb:       0,
  namedAccountManager: false,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  "R" + n.toLocaleString("en-ZA", { minimumFractionDigits: 0 });

// ─── Component ───────────────────────────────────────────────────────────────

interface EnterpriseEstimatorProps {
  onClose?: () => void;
}

export function EnterpriseEstimator({ onClose }: EnterpriseEstimatorProps) {
  const [form, setForm]         = useState<FormState>(DEFAULT_FORM);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Contact form state
  const [contact, setContact] = useState({
    name: "", company: "", email: "", phone: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Debounced estimate fetch — recalculates 400ms after last input change
  useEffect(() => {
    // Basic validation: need at least 50 devices to call the API
    if (form.deviceCount < 50) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/billing/estimate", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(form),
        });
        if (res.ok) {
          const data: EstimateResult = await res.json();
          setEstimate(data);
          // Pre-fill contact form from estimate
          setContact(prev => ({
            ...prev,
            message:
              `Estimated monthly: ${data.contactFormPrefill.estimatedMonthly}\n` +
              `Devices: ${data.contactFormPrefill.deviceCount}\n` +
              `Employees: ${data.contactFormPrefill.employeeCount}\n` +
              `Sector: ${data.contactFormPrefill.sector}\n` +
              `Compliance: ${data.contactFormPrefill.complianceNeeds}`,
          }));
        }
      } catch (_) {
        // Silently fail — estimate is best-effort
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [form]);

  const toggleCompliance = useCallback((need: ComplianceNeed) => {
    setForm(prev => {
      if (need === "none") return { ...prev, complianceNeeds: ["none"] };
      const without = prev.complianceNeeds.filter(c => c !== "none" && c !== need);
      const has = prev.complianceNeeds.includes(need);
      return { ...prev, complianceNeeds: has ? without : [...without, need] };
    });
  }, []);

  const handleContactSubmit = async () => {
    setSubmitLoading(true);
    try {
      // Uses the existing contact / lead-capture endpoint.
      // Falls back to a mailto: if the endpoint isn't live yet.
      const res = await fetch("/api/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...contact,
          source:   "enterprise_estimator",
          tier:     "enterprise_custom",
          estimate: estimate?.contactFormPrefill,
        }),
      });
      if (res.ok) setSubmitted(true);
      else throw new Error("API error");
    } catch (_) {
      // Fallback: open mailto
      window.location.href =
        `mailto:sales@nexteraai.co.za?subject=Enterprise%20Enquiry&body=${encodeURIComponent(contact.message)}`;
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full relative" id="enterprise-estimator">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 right-0 z-10 p-2 rounded-xl bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] text-[#A78BFA] hover:bg-[rgba(139,92,246,0.25)] hover:text-white transition-colors"
          aria-label="Close estimator"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      {/* Premium Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] text-[#A78BFA] text-sm font-medium mb-4">
          <Calculator className="w-4 h-4" />
          Enterprise Price Estimator
        </div>
        <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
          Get an instant estimate
        </h3>
        <p className="text-[#A89CC8] text-base max-w-xl mx-auto">
          Adjust the inputs below to see a real-time price range. No commitment — our team will confirm the exact figure based on your MSA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Inputs ── */}
        <div className="relative rounded-2xl overflow-hidden border border-[rgba(224,212,255,0.1)] bg-[#141218]">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(139,92,246,0.05)] via-transparent to-transparent" />
          <div className="relative p-6 md:p-8 flex flex-col gap-6">

          {/* Devices */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-zinc-300">
                Number of Devices
              </label>
              <span className="text-sm font-bold text-white">
                {form.deviceCount}
              </span>
            </div>
            <input
              type="range"
              min={50} max={500} step={10}
              value={form.deviceCount}
              onChange={e => setForm(f => ({ ...f, deviceCount: +e.target.value }))}
              className="w-full accent-[#8B5CF6] h-2 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>50</span><span>500+</span>
            </div>
            {form.deviceCount >= 490 && (
              <p className="text-xs text-purple-400 mt-1">
                For 500+ devices, pricing is negotiated directly — our team will reach out.
              </p>
            )}
          </div>

          {/* Employees */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-zinc-300">
                Number of Employees
              </label>
              <span className="text-sm font-bold text-white">
                {form.employeeCount}
              </span>
            </div>
            <input
              type="range"
              min={10} max={1000} step={10}
              value={form.employeeCount}
              onChange={e => setForm(f => ({ ...f, employeeCount: +e.target.value }))}
              className="w-full accent-[#8B5CF6] h-2 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>10</span><span>1,000</span>
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Industry / Sector
            </label>
            <div className="relative">
              <select
                value={form.sector}
                onChange={e => setForm(f => ({ ...f, sector: e.target.value as Sector }))}
                className="w-full appearance-none bg-[#0A0A0A] border border-[rgba(224,212,255,0.1)] rounded-xl px-4 py-3 text-sm text-white pr-8 focus:outline-none focus:border-[#8B5CF6] transition-colors"
              >
                {(Object.entries(SECTOR_LABELS) as [Sector, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Compliance */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Compliance Obligations
              <span className="text-zinc-500 font-normal ml-1">(select all that apply)</span>
            </label>
            <div className="flex flex-col gap-2">
              {(Object.entries(COMPLIANCE_LABELS) as [ComplianceNeed, string][]).map(([v, l]) => (
                <label key={v} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => toggleCompliance(v)}
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                      form.complianceNeeds.includes(v)
                        ? "bg-[#624CAB] border-[#624CAB]"
                        : "border-white/20 group-hover:border-white/40"
                    }`}
                  >
                    {form.complianceNeeds.includes(v) && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span
                    onClick={() => toggleCompliance(v)}
                    className="text-sm text-zinc-300 group-hover:text-white transition-colors"
                  >
                    {l}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Support tier */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Support Coverage
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["business_hours", "twentyfour_seven"] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setForm(f => ({ ...f, supportTier: v }))}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                    form.supportTier === v
                      ? "bg-[#8B5CF6] border-[#8B5CF6] text-white"
                      : "bg-transparent border-[rgba(224,212,255,0.1)] text-[#A89CC8] hover:border-[rgba(224,212,255,0.3)]"
                  }`}
                >
                  {v === "business_hours" ? "Business hours (8–5 SAST)" : "24×7 on-call"}
                </button>
              ))}
            </div>
          </div>

          {/* Backup vault */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Backup Vault Size
            </label>
            <div className="flex flex-wrap gap-2">
              {BACKUP_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setForm(f => ({ ...f, backupVaultGb: value }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    form.backupVaultGb === value
                      ? "bg-[#8B5CF6] border-[#8B5CF6] text-white"
                      : "bg-transparent border-[rgba(224,212,255,0.1)] text-[#A89CC8] hover:border-[rgba(224,212,255,0.3)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Named account manager */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setForm(f => ({ ...f, namedAccountManager: !f.namedAccountManager }))}
              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                form.namedAccountManager
                  ? "bg-[#8B5CF6] border-[#8B5CF6]"
                  : "border-[rgba(224,212,255,0.2)] group-hover:border-[rgba(224,212,255,0.4)]"
              }`}
            >
              {form.namedAccountManager && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span
              onClick={() => setForm(f => ({ ...f, namedAccountManager: !f.namedAccountManager }))}
              className="text-sm text-zinc-300 group-hover:text-white transition-colors"
            >
              Include dedicated account manager
            </span>
          </label>
          </div>
        </div>

        {/* ── Right: Estimate output ── */}
        <div className="flex flex-col gap-4">
          {/* Estimate card */}
          <div className="relative rounded-2xl overflow-hidden border border-[rgba(139,92,246,0.4)] bg-[#0f0d1a] flex-1">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(139,92,246,0.1)] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                  Your Estimate
                </h4>
                {loading && (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                )}
              </div>

              {estimate ? (
              <>
                {/* Price range */}
                <div className="mb-6">
                  <p className="text-xs text-zinc-500 mb-1">Monthly (excl. VAT)</p>
                  <p className="text-3xl font-bold text-white">
                    {fmt(estimate.monthlyLow)}
                    <span className="text-zinc-400 text-xl mx-2">–</span>
                    {fmt(estimate.monthlyHigh)}
                    <span className="text-base font-normal text-zinc-400 ml-1">/mo</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Annual (10% discount):{" "}
                    <span className="text-green-400 font-medium">
                      {fmt(estimate.annualLow)} – {fmt(estimate.annualHigh)}/yr
                    </span>
                  </p>
                </div>

                {/* Line items */}
                <div className="border-t border-white/10 pt-4 mb-4">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
                    Breakdown
                  </p>
                  <div className="flex flex-col gap-2">
                    {estimate.lineItems.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-zinc-400">{item.label}</span>
                        <span className="text-white font-medium">
                          {fmt(item.monthlyZar)}/mo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-zinc-500 italic">
                  This is an indicative range. Final pricing is confirmed by our team
                  based on your MSA and specific configuration.
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calculator className="w-8 h-8 text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-500">
                  Adjust the inputs to see your estimate
                </p>
              </div>
            )}
            </div>
          </div>

          {/* Contact / CTA */}
          {!showContact ? (
            <button
              onClick={() => setShowContact(true)}
              disabled={!estimate}
              className="w-full py-4 px-6 rounded-xl font-semibold text-base bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9B6CF6] hover:to-[#8B5CF6] text-white shadow-lg shadow-[rgba(139,92,246,0.3)] hover:shadow-[rgba(139,92,246,0.5)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Get a formal quote
            </button>
          ) : submitted ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
              <p className="text-green-400 font-semibold text-sm mb-1">Enquiry received!</p>
              <p className="text-zinc-400 text-xs">
                Our team will be in touch within 1 business day.
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-[rgba(224,212,255,0.1)] bg-[#141218] p-6 flex flex-col gap-4">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(139,92,246,0.05)] via-transparent to-transparent" />
              <div className="relative">
                <h4 className="text-sm font-semibold text-white">Your details</h4>

              {/* Pre-fill summary */}
              {estimate && (
                <div className="bg-[#624CAB]/10 border border-[#624CAB]/30 rounded-lg px-4 py-3 text-xs text-purple-300">
                  Estimate included: {estimate.contactFormPrefill.estimatedMonthly}
                </div>
              )}

              <input
                type="text"
                placeholder="Your name *"
                value={contact.name}
                onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                className="bg-[#0A0A0A] border border-[rgba(224,212,255,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
              <input
                type="text"
                placeholder="Company name *"
                value={contact.company}
                onChange={e => setContact(c => ({ ...c, company: e.target.value }))}
                className="bg-[#0A0A0A] border border-[rgba(224,212,255,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
              <input
                type="email"
                placeholder="Work email *"
                value={contact.email}
                onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                className="bg-[#0A0A0A] border border-[rgba(224,212,255,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={contact.phone}
                onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                className="bg-[#0A0A0A] border border-[rgba(224,212,255,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
              <textarea
                rows={4}
                placeholder="Any additional context…"
                value={contact.message}
                onChange={e => setContact(c => ({ ...c, message: e.target.value }))}
                className="bg-[#0A0A0A] border border-[rgba(224,212,255,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#8B5CF6] transition-colors resize-none"
              />

              <button
                onClick={handleContactSubmit}
                disabled={!contact.name || !contact.email || !contact.company || submitLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9B6CF6] hover:to-[#8B5CF6] text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send enquiry
              </button>
              </div>

              <p className="relative text-xs text-zinc-500 text-center">
                By submitting you agree to be contacted by the NexteraAI sales team.
                We never share your details with third parties.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
