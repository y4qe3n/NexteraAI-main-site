// Billing model types — mirrors auth-service schema (0022_pricing_model.sql)

export type Tier = 'basic' | 'pro' | 'enterprise' | 'enterprise_custom';
export type BillingCycle = 'monthly' | 'annual';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';

export interface TierDefault {
  tier: Tier;
  included_devices: number;
  overage_rate_zar: number;
  monthly_base_zar: number;
  annual_base_zar: number;
}

export interface OverageEvent {
  id: string;
  org_id: string;
  period_start: string;
  period_end: string;
  devices_included: number;
  devices_peak: number;
  devices_billed: number;
  overage_rate_zar: number;
  overage_charge_zar: number;
  invoice_id?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  org_id: string;
  invoice_number: string;
  period_start: string;
  period_end: string;
  base_amount_zar: number;
  overage_amount_zar: number;
  discount_amount_zar: number;
  total_excl_vat_zar: number;
  vat_amount_zar: number;
  total_incl_vat_zar: number;
  status: InvoiceStatus;
  payfast_token?: string;
  paid_at?: string;
  created_at: string;
}

/** Row returned by the billing JOIN query (org + subscription). */
export interface OrgBillingRow {
  org_id: string;
  tier: Tier;
  device_limit: number | null;
  included_devices: number | null;
  overage_rate_zar: number | null;
  billing_cycle?: BillingCycle;
  custom_base_price_zar?: number;
  annual_discount_pct?: number;
}

export interface AnnualPriceResult {
  annualTotal: number;
  effectiveMonthly: number;
  saving: number;
}

export interface EnterpriseQuoteResult {
  monthlyBase: number;
  annualTotal: number;
  overageRate: number;
  totalContractValue: number;
}

// ─── Enterprise Estimator Types ────────────────────────────────────────────

export type Sector =
  | 'professional_services'
  | 'healthcare'
  | 'financial_services'
  | 'logistics'
  | 'retail'
  | 'manufacturing'
  | 'education'
  | 'government'
  | 'other';

export type ComplianceNeed =
  | 'popia'
  | 'fica'
  | 'pci_dss'
  | 'iso27001'
  | 'none';

export interface EnterpriseEstimatorInput {
  deviceCount: number;          // 50–2000
  employeeCount: number;        // 1–5000
  sector: Sector;
  complianceNeeds: ComplianceNeed[];
  supportTier: 'business_hours' | 'twentyfour_seven';
  backupVaultGb: number;        // 0, 100, 500, 1000, 5000
  namedAccountManager: boolean;
}

export interface EstimateLineItem {
  label: string;
  monthlyZar: number;
}

export interface ContactFormPrefill {
  deviceCount: number;
  employeeCount: number;
  sector: string;
  estimatedMonthly: string;   // formatted string e.g. "R12,000 – R15,000/mo"
  complianceNeeds: string;
}

export interface EnterpriseEstimate {
  monthlyLow: number;    // ZAR, excl. VAT
  monthlyHigh: number;   // ZAR, excl. VAT
  annualLow: number;     // with 10% annual discount
  annualHigh: number;
  lineItems: EstimateLineItem[];
  recommendedTier: 'enterprise' | 'enterprise_custom';
  contactFormPrefill: ContactFormPrefill;
}
