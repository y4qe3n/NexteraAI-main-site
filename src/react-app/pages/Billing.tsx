import { useEffect, useState } from "react";
import { CreditCard, Calendar, Loader2 } from "lucide-react";

interface BillingSummary {
  tier: string;
  billing_cycle?: string;
  devices?: { current: number; included: number; overage: number; pct_used: number };
  next_invoice?: { base_amount: number; discount_amount: number; overage_amount: number; vat_amount: number; total_incl_vat: number };
  annual_dates?: { start: string; end: string } | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  period_start: string;
  period_end: string;
  total_incl_vat_zar: number;
  status: string;
}

export function Billing() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        let nextError: string | null = null;
        const [sumRes, invRes] = await Promise.all([
          fetch("/api/billing/summary", { credentials: "include" }),
          fetch("/api/billing/invoices?limit=10", { credentials: "include" }),
        ]);
        if (sumRes.ok) {
          setSummary(await sumRes.json());
        } else {
          nextError = sumRes.status === 401 ? "Billing access is not available for this account yet." : "Billing data could not be loaded.";
        }
        if (invRes.ok) {
          const d = await invRes.json();
          setInvoices(d.invoices ?? []);
        } else if (!nextError) {
          nextError = "Invoice history could not be loaded.";
        }
        setError(nextError);
      } catch {
        setError("Billing data could not be loaded. Please try again shortly.");
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#9F86E8" }} />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold" style={{ color: "#E0D4FF" }}>Billing</h1>
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <CreditCard className="w-8 h-8 mx-auto mb-3" style={{ color: "#A89CC8", opacity: 0.5 }} />
          <p className="text-sm font-medium" style={{ color: "#E0D4FF" }}>
            {error ?? "No billing records available yet."}
          </p>
          <p className="text-xs mt-1" style={{ color: "#8778AD" }}>
            {error ? "The dashboard is still available while billing catches up." : "Your subscription information will appear here once billing is active."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold" style={{ color: "#E0D4FF" }}>Billing</h1>

      {/* Plan card */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: "#8778AD" }}>Current plan</span>
            <span className="text-xs px-2 py-0.5 rounded capitalize font-medium" style={{ backgroundColor: "rgba(98,76,171,0.15)", color: "#9F86E8" }}>
              {summary.tier}
            </span>
          </div>
          <p className="text-2xl font-bold capitalize" style={{ color: "#E0D4FF" }}>{summary.tier?.replace("_", " ")}</p>
          {summary.billing_cycle && (
            <p className="text-xs mt-1" style={{ color: "#8778AD" }}>Billing cycle: {summary.billing_cycle}</p>
          )}
        </div>

        {summary.devices && (
          <div className="rounded-xl p-5" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: "#8778AD" }}>Device usage</span>
              <span className="text-xs font-medium" style={{ color: summary.devices.pct_used >= 80 ? "#F59E0B" : "#10B981" }}>
                {summary.devices.current} / {summary.devices.included}
              </span>
            </div>
            <div className="h-1.5 rounded-full mt-3" style={{ backgroundColor: "#1b1824" }}>
              <div className="h-1.5 rounded-full" style={{ width: `${Math.min(summary.devices.pct_used, 100)}%`, backgroundColor: "#7A5FD1" }} />
            </div>
            {summary.devices.overage > 0 && (
              <p className="text-xs mt-2" style={{ color: "#F59E0B" }}>{summary.devices.overage} devices in overage</p>
            )}
          </div>
        )}
      </div>

      {/* Next invoice */}
      {summary.next_invoice && (
        <div className="rounded-xl p-5" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4" style={{ color: "#9F86E8" }} />
            <h2 className="text-sm font-semibold" style={{ color: "#E0D4FF" }}>Next invoice preview</h2>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs" style={{ color: "#8778AD" }}>Total (incl. VAT)</span>
            <span className="text-xl font-bold" style={{ color: "#E0D4FF" }}>
              R{summary.next_invoice.total_incl_vat?.toLocaleString("en-ZA") ?? "0"}
            </span>
          </div>
        </div>
      )}

      {/* Invoices */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#141218", border: "1px solid rgba(224,212,255,0.08)" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(224,212,255,0.08)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#E0D4FF" }}>Invoice history</h2>
        </div>
        {invoices.length === 0 ? (
          <p className="px-5 py-6 text-sm text-center" style={{ color: "#8778AD" }}>No invoices yet.</p>
        ) : (
          <div>
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(224,212,255,0.05)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#E0D4FF" }}>{inv.invoice_number}</p>
                  <p className="text-xs" style={{ color: "#8778AD" }}>{inv.period_start} → {inv.period_end}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium" style={{ color: "#E0D4FF" }}>R{inv.total_incl_vat_zar?.toFixed(2)}</p>
                  <span className="text-xs capitalize" style={{ color: inv.status === "paid" ? "#10B981" : "#F59E0B" }}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
