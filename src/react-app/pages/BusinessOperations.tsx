import { useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { SecurityRailPanel } from "@/react-app/components/SecurityRailPanel";
import { usePolling } from "@/react-app/hooks/usePolling";
import {
  mockOperationsOverview,
  mockOrders,
  mockInventory,
  mockCustomers,
  mockStaff,
  type MockOrder,
  type MockInventoryItem,
  type MockCustomer,
  type MockStaffMember,
} from "@/react-app/lib/mockData";
import {
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";

interface OperationsOverview {
  organization: { id: number; name: string };
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    revenue_cents: number;
  };
  inventory: { total: number; low_stock: number };
  crm: { total: number };
}

function formatZAR(cents: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format((cents || 0) / 100);
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return (await res.json()) as T;
}

export function BusinessOperations() {
  const [tab, setTab] = useState<"orders" | "inventory" | "staff" | "crm">(
    "orders"
  );

  const overview = usePolling<OperationsOverview>(
    () => fetchJSON("/api/operations/overview"),
    { intervalMs: 30_000, fallback: mockOperationsOverview }
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      {/* Main column */}
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Business Operations</h1>
          <p className="text-muted-foreground mt-1">
            Orders, inventory, staff and customer relationships — all in one
            place.
          </p>
        </header>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            icon={<ShoppingCart className="w-5 h-5 text-primary" />}
            label="Open orders"
            value={`${
              (overview.data?.orders.pending ?? 0) +
              (overview.data?.orders.processing ?? 0)
            }`}
            sub={`${overview.data?.orders.total ?? 0} total`}
          />
          <KpiCard
            icon={<TrendingUp className="w-5 h-5 text-green-500" />}
            label="Revenue"
            value={formatZAR(overview.data?.orders.revenue_cents ?? 0)}
            sub={`${overview.data?.orders.delivered ?? 0} delivered`}
          />
          <KpiCard
            icon={<Package className="w-5 h-5 text-blue-500" />}
            label="Inventory items"
            value={`${overview.data?.inventory.total ?? 0}`}
            sub={
              overview.data?.inventory.low_stock
                ? `${overview.data.inventory.low_stock} low-stock`
                : "All stocked"
            }
            warning={(overview.data?.inventory.low_stock ?? 0) > 0}
          />
          <KpiCard
            icon={<Users className="w-5 h-5 text-purple-500" />}
            label="Customers (CRM)"
            value={`${overview.data?.crm.total ?? 0}`}
            sub="Active records"
          />
        </div>

        {/* Tabs */}
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-border flex flex-wrap">
            {(["orders", "inventory", "staff", "crm"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "crm" ? "Customer DB" : t}
              </button>
            ))}
            <div className="ml-auto flex items-center pr-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => overview.refresh()}
                title="Refresh now"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              {overview.isLive ? (
                <Badge variant="outline" className="border-green-500/30 text-green-500">
                  <Wifi className="w-3 h-3 mr-1" /> Live
                </Badge>
              ) : (
                <Badge variant="outline" className="border-amber-500/30 text-amber-500">
                  <WifiOff className="w-3 h-3 mr-1" /> Demo data
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4">
            {tab === "orders" && <OrdersSection />}
            {tab === "inventory" && <InventorySection />}
            {tab === "staff" && <StaffSection />}
            {tab === "crm" && <CRMSection />}
          </div>
        </Card>
      </div>

      {/* Right rail security panel */}
      <aside className="hidden xl:block">
        <SecurityRailPanel />
      </aside>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  warning = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  warning?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {sub && (
        <p
          className={`text-xs mt-1 flex items-center gap-1 ${
            warning ? "text-amber-500" : "text-muted-foreground"
          }`}
        >
          {warning && <AlertTriangle className="w-3 h-3" />}
          {sub}
        </p>
      )}
    </Card>
  );
}

// ---------- Orders ----------
function OrdersSection() {
  const { data, isLive } = usePolling<MockOrder[]>(
    () => fetchJSON("/api/orders?limit=50"),
    { intervalMs: 20_000, fallback: mockOrders }
  );
  const rows = data ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground uppercase">
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2">Order #</th>
            <th className="text-left py-2 px-2">Customer</th>
            <th className="text-right py-2 px-2">Total</th>
            <th className="text-left py-2 px-2">Status</th>
            <th className="text-left py-2 px-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-b border-border/50">
              <td className="py-2 px-2 font-medium">{o.order_number}</td>
              <td className="py-2 px-2">{o.customer_name || "—"}</td>
              <td className="py-2 px-2 text-right">
                {formatZAR(o.total_cents)}
              </td>
              <td className="py-2 px-2">
                <Badge variant="outline">{o.status}</Badge>
              </td>
              <td className="py-2 px-2 text-muted-foreground">
                {new Date(o.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-muted-foreground">
                No orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!isLive && (
        <p className="mt-3 text-xs text-amber-500">
          Showing demo orders — live API unavailable.
        </p>
      )}
    </div>
  );
}

// ---------- Inventory ----------
function InventorySection() {
  const { data, isLive } = usePolling<MockInventoryItem[]>(
    () => fetchJSON("/api/inventory"),
    { intervalMs: 30_000, fallback: mockInventory }
  );
  const rows = data ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground uppercase">
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2">SKU</th>
            <th className="text-left py-2 px-2">Name</th>
            <th className="text-right py-2 px-2">Qty</th>
            <th className="text-right py-2 px-2">Threshold</th>
            <th className="text-right py-2 px-2">Unit price</th>
            <th className="text-left py-2 px-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((i) => {
            const low = i.quantity <= i.low_stock_threshold;
            return (
              <tr key={i.id} className="border-b border-border/50">
                <td className="py-2 px-2 font-mono text-xs">{i.sku}</td>
                <td className="py-2 px-2">{i.name}</td>
                <td className="py-2 px-2 text-right font-medium">{i.quantity}</td>
                <td className="py-2 px-2 text-right">{i.low_stock_threshold}</td>
                <td className="py-2 px-2 text-right">
                  {formatZAR(i.unit_price_cents)}
                </td>
                <td className="py-2 px-2">
                  {low ? (
                    <Badge
                      variant="outline"
                      className="border-amber-500/30 text-amber-500"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" /> Low stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-green-500/30 text-green-500">
                      OK
                    </Badge>
                  )}
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-muted-foreground">
                No inventory items yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!isLive && (
        <p className="mt-3 text-xs text-amber-500">
          Showing demo inventory — live API unavailable.
        </p>
      )}
    </div>
  );
}

// ---------- Staff (presence via heartbeat) ----------
function StaffSection() {
  // The main worker exposes employees via /api/admin/users; presence comes
  // from a future device-heartbeat aggregation. For now we fall back to
  // mock data so the UI is always populated.
  const { data, isLive } = usePolling<MockStaffMember[]>(
    async () => {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) throw new Error(String(res.status));
      const list = (await res.json()) as Array<{
        id: string;
        email: string;
        username?: string;
        google_user_data?: { name?: string };
        role?: string;
      }>;
      return list.map((u) => ({
        id: u.id,
        name: u.google_user_data?.name || u.username || u.email,
        email: u.email,
        role: u.role || "employee",
        // Live presence is not yet available on this endpoint. A follow-up
        // task wires the desktop-agent heartbeat aggregation here.
        online: false,
        last_seen: new Date().toISOString(),
      }));
    },
    { intervalMs: 30_000, fallback: mockStaff }
  );
  const rows = data ?? [];

  return (
    <div className="space-y-3">
      {rows.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
        >
          <div>
            <p className="font-medium">{s.name}</p>
            <p className="text-xs text-muted-foreground">{s.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="capitalize">
              {s.role}
            </Badge>
            {s.online ? (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Online
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Last seen {new Date(s.last_seen).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      ))}
      {rows.length === 0 && (
        <p className="text-center py-6 text-muted-foreground">
          No staff members yet.
        </p>
      )}
      {!isLive && (
        <p className="text-xs text-amber-500">
          Showing demo staff list — live API unavailable.
        </p>
      )}
    </div>
  );
}

// ---------- CRM ----------
function CRMSection() {
  const [query, setQuery] = useState("");
  const { data, isLive } = usePolling<MockCustomer[]>(
    () =>
      fetchJSON(
        `/api/crm/customers${query ? `?q=${encodeURIComponent(query)}` : ""}`
      ),
    { intervalMs: 30_000, fallback: mockCustomers, deps: [query] }
  );
  const rows = data ?? [];

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, email, phone or company"
        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="grid md:grid-cols-2 gap-3">
        {rows.map((c) => {
          let tags: string[] = [];
          try {
            tags = c.tags ? (JSON.parse(c.tags) as string[]) : [];
          } catch {
            tags = [];
          }
          return (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{c.name}</p>
                  {c.company && (
                    <p className="text-xs text-muted-foreground truncate">
                      {c.company}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                {c.email && <p>📧 {c.email}</p>}
                {c.phone && <p>📞 {c.phone}</p>}
              </div>
            </Card>
          );
        })}
        {rows.length === 0 && (
          <p className="col-span-full text-center py-6 text-muted-foreground">
            No customers found.
          </p>
        )}
      </div>
      {!isLive && (
        <p className="text-xs text-amber-500">
          Showing demo customers — live API unavailable.
        </p>
      )}
    </div>
  );
}
