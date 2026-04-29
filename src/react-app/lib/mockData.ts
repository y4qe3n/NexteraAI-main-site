// Mock data fixtures used as a fallback whenever live API calls fail.
// Keeping these in one place lets us swap demo data in/out without changing
// page components.

export const mockSecurityRail = {
  threats: { active: 0, blocked: 0, critical: 0, high: 0 },
  devices: { total: 0, protected: 0 },
  compliance: { score: 0 },
};

export const mockOperationsOverview = {
  organization: { id: 0, name: "Demo Organization" },
  orders: {
    total: 124,
    pending: 8,
    processing: 14,
    shipped: 21,
    delivered: 81,
    revenue_cents: 125_400_00,
  },
  inventory: { total: 56, low_stock: 4 },
  crm: { total: 312 },
};

export interface MockOrder {
  id: number;
  organization_id: number;
  order_number: string;
  customer_name: string | null;
  total_cents: number;
  currency: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const mockOrders: MockOrder[] = [
  {
    id: 1,
    organization_id: 0,
    order_number: "ORD-1024",
    customer_name: "Bongani Dlamini",
    total_cents: 145_00,
    currency: "ZAR",
    status: "pending",
    notes: "Urgent — same-day delivery",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 2,
    organization_id: 0,
    order_number: "ORD-1023",
    customer_name: "Lerato Mokoena",
    total_cents: 880_00,
    currency: "ZAR",
    status: "processing",
    notes: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 3,
    organization_id: 0,
    order_number: "ORD-1022",
    customer_name: "Kagiso Phiri",
    total_cents: 425_00,
    currency: "ZAR",
    status: "shipped",
    notes: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export interface MockInventoryItem {
  id: number;
  organization_id: number;
  sku: string;
  name: string;
  description: string | null;
  quantity: number;
  low_stock_threshold: number;
  unit_price_cents: number;
  currency: string;
  updated_at: string;
}

export const mockInventory: MockInventoryItem[] = [
  {
    id: 1,
    organization_id: 0,
    sku: "SKU-001",
    name: "Branded T-Shirt (M)",
    description: "100% cotton, navy",
    quantity: 12,
    low_stock_threshold: 5,
    unit_price_cents: 199_00,
    currency: "ZAR",
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    organization_id: 0,
    sku: "SKU-002",
    name: "Hoodie (L)",
    description: "Heavyweight, charcoal",
    quantity: 3,
    low_stock_threshold: 5,
    unit_price_cents: 549_00,
    currency: "ZAR",
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    organization_id: 0,
    sku: "SKU-003",
    name: "Cap (One Size)",
    description: "Snapback",
    quantity: 28,
    low_stock_threshold: 10,
    unit_price_cents: 149_00,
    currency: "ZAR",
    updated_at: new Date().toISOString(),
  },
];

export interface MockCustomer {
  id: number;
  organization_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  tags: string | null;
  updated_at: string;
}

export const mockCustomers: MockCustomer[] = [
  {
    id: 1,
    organization_id: 0,
    name: "Thandi Nkosi",
    email: "thandi@example.co.za",
    phone: "+27 82 555 0100",
    company: "Nkosi Designs",
    tags: '["vip","retail"]',
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    organization_id: 0,
    name: "Sipho Khumalo",
    email: "sipho@example.co.za",
    phone: "+27 71 555 0102",
    company: null,
    tags: null,
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
  },
];

export interface MockStaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  online: boolean;
  last_seen: string;
}

export const mockStaff: MockStaffMember[] = [
  {
    id: "u1",
    name: "Asanda M.",
    email: "asanda@example.co.za",
    role: "manager",
    online: true,
    last_seen: new Date().toISOString(),
  },
  {
    id: "u2",
    name: "Tinashe K.",
    email: "tinashe@example.co.za",
    role: "employee",
    online: false,
    last_seen: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];
