import { demoOrganisation } from "./demoOrg";

const now = Date.now();

function isoHoursAgo(hours: number) {
  return new Date(now - hours * 60 * 60 * 1000).toISOString();
}

export const demoDevices = [
  { id: 101, name: "Front Desk Laptop", device_type: "Laptop", os: "Windows 11", is_protected: 1, status: "active", created_at: isoHoursAgo(220), updated_at: isoHoursAgo(1) },
  { id: 102, name: "Finance Desktop", device_type: "Desktop", os: "Windows 11", is_protected: 1, status: "active", created_at: isoHoursAgo(214), updated_at: isoHoursAgo(2) },
  { id: 103, name: "Manager Laptop", device_type: "Laptop", os: "Windows 11", is_protected: 1, status: "warning", created_at: isoHoursAgo(200), updated_at: isoHoursAgo(8) },
  { id: 104, name: "Reception Mini PC", device_type: "Desktop", os: "Windows 10", is_protected: 1, status: "active", created_at: isoHoursAgo(180), updated_at: isoHoursAgo(3) },
  { id: 105, name: "Stockroom Tablet", device_type: "Mobile", os: "Android 14", is_protected: 0, status: "offline", created_at: isoHoursAgo(160), updated_at: isoHoursAgo(34) },
  { id: 106, name: "Owner Notebook", device_type: "Laptop", os: "macOS Ventura", is_protected: 1, status: "active", created_at: isoHoursAgo(144), updated_at: isoHoursAgo(4) },
  { id: 107, name: "POS Terminal", device_type: "Desktop", os: "Windows 10 IoT", is_protected: 1, status: "active", created_at: isoHoursAgo(120), updated_at: isoHoursAgo(5) },
  { id: 108, name: "Backup Server", device_type: "Server", os: "Ubuntu 24.04", is_protected: 1, status: "active", created_at: isoHoursAgo(96), updated_at: isoHoursAgo(6) },
];

export const demoAlerts = [
  {
    id: 501,
    threat_type: "Suspicious URL",
    severity: "medium",
    source: "finance@demo-organisation.local",
    target: "Finance Desktop",
    status: "warn_review",
    action_taken: "Warn-only review",
    detected_at: isoHoursAgo(2),
  },
  {
    id: 502,
    threat_type: "Phishing simulation",
    severity: "high",
    source: "supplier-update.example",
    target: "Front Desk Laptop",
    status: "resolved",
    action_taken: "Reported by staff",
    detected_at: isoHoursAgo(16),
  },
  {
    id: 503,
    threat_type: "Unusual login pattern",
    severity: "low",
    source: "Demo Admin",
    target: "Owner Notebook",
    status: "reviewed",
    action_taken: "MFA check recommended",
    detected_at: isoHoursAgo(30),
  },
];

export const demoComplianceItems = [
  { id: 701, category: "governance", title: "Information Officer identified", description: "Record the person responsible for privacy questions and escalation.", requirement_level: "required", sort_order: 1, completion_status: "completed", notes: "Demo data only", completed_at: isoHoursAgo(72) },
  { id: 702, category: "data_collection", title: "Customer data map drafted", description: "List where names, contact details, IDs, and payment details are stored.", requirement_level: "required", sort_order: 2, completion_status: "in_progress", notes: null, completed_at: null },
  { id: 703, category: "consent", title: "Privacy notice reviewed", description: "Make sure customers can see how personal information is used.", requirement_level: "required", sort_order: 3, completion_status: "completed", notes: "Demo data only", completed_at: isoHoursAgo(48) },
  { id: 704, category: "security", title: "MFA enabled on key accounts", description: "Enable MFA for email, accounting, cloud storage, and admin accounts where available.", requirement_level: "required", sort_order: 4, completion_status: "in_progress", notes: null, completed_at: null },
  { id: 705, category: "rights", title: "Data subject request process", description: "Define how the business receives and tracks access or correction requests.", requirement_level: "recommended", sort_order: 5, completion_status: "not_started", notes: null, completed_at: null },
  { id: 706, category: "security", title: "Breach escalation checklist", description: "Staff know who to contact when information is sent to the wrong person or exposed.", requirement_level: "required", sort_order: 6, completion_status: "completed", notes: "Demo data only", completed_at: isoHoursAgo(24) },
] as const;

export const demoDashboardStats = {
  organization: {
    id: demoOrganisation.id,
    name: demoOrganisation.name,
    devices_limit: demoOrganisation.devicesLimit,
  },
  threats: {
    total: demoAlerts.length,
    active: demoAlerts.filter((alert) => alert.status !== "resolved").length,
    blocked: 0,
    resolved: demoAlerts.filter((alert) => alert.status === "resolved").length,
    critical: demoAlerts.filter((alert) => alert.severity === "critical").length,
    high: demoAlerts.filter((alert) => alert.severity === "high").length,
  },
  devices: {
    total: demoDevices.length,
    protected: demoDevices.filter((device) => device.is_protected === 1).length,
    active: demoDevices.filter((device) => device.status === "active").length,
    limit: demoOrganisation.devicesLimit,
  },
  compliance: {
    score: 67,
    completed: demoComplianceItems.filter((item) => item.completion_status === "completed").length,
    total: demoComplianceItems.length,
  },
  emails: {
    scannedThisWeek: 418,
    threatsDetected: 3,
  },
};

export const demoBillingSummary = {
  tier: "pro",
  billing_cycle: "monthly",
  devices: {
    current: demoDevices.length,
    included: demoOrganisation.devicesLimit,
    overage: 0,
    pct_used: Math.round((demoDevices.length / demoOrganisation.devicesLimit) * 100),
  },
  next_invoice: {
    base_amount: 1499,
    discount_amount: 0,
    overage_amount: 0,
    vat_amount: 224.85,
    total_incl_vat: 1723.85,
  },
  annual_dates: null,
};

export const demoSubscription = {
  plan: "pro",
  status: "active",
  amount: 2000,
  current_period_start: "2026-06-01",
  current_period_end: "2026-06-30",
  payment_gateway: "demo",
  gateway_subscription_id: "demo_subscription_local_preview",
  cancel_at_period_end: 0,
  calculated_tier: "pro",
  formatted_renewal_date: "30 June 2026",
  days_remaining: 5,
};

export const demoInvoices = [
  { id: "demo-inv-001", invoice_number: "DEMO-INV-001", period_start: "2026-06-01", period_end: "2026-06-30", total_incl_vat_zar: 1723.85, status: "paid" },
  { id: "demo-inv-002", invoice_number: "DEMO-INV-002", period_start: "2026-05-01", period_end: "2026-05-31", total_incl_vat_zar: 1723.85, status: "paid" },
];
