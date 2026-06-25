/**
 * Overage calculation — runs inside the Billing Durable Object alarm.
 */

import type { OverageEvent } from './types';

export async function calculateOverage(
  db: D1Database,
  orgId: string,
  periodStart: string,
  periodEnd: string
): Promise<OverageEvent | null> {
  // Read commercial fields from subscriptions (not organizations)
  const sub = await db
    .prepare(
      `SELECT included_devices, overage_rate_zar, billing_cycle
       FROM subscriptions WHERE organization_id = ?`
    )
    .bind(orgId)
    .first<{
      included_devices: number | null;
      overage_rate_zar: number | null;
      billing_cycle: string | null;
    }>();

  if (!sub || sub.overage_rate_zar === null) return null;

  // Peak device count in period (from daily heartbeat snapshots)
  const peakRow = await db
    .prepare(
      `SELECT MAX(device_count) as peak
       FROM device_daily_snapshots
       WHERE org_id = ? AND snapshot_date BETWEEN ? AND ?`
    )
    .bind(orgId, periodStart, periodEnd)
    .first<{ peak: number }>();

  const peak = peakRow?.peak ?? 0;
  const included = sub.included_devices ?? 0;
  const devicesBilled = Math.max(0, peak - included);
  if (devicesBilled === 0) return null;

  const charge = Math.round(devicesBilled * sub.overage_rate_zar * 100) / 100;

  return db
    .prepare(
      `INSERT INTO overage_events
       (org_id, period_start, period_end,
        devices_included, devices_peak, devices_billed,
        overage_rate_zar, overage_charge_zar)
       VALUES (?,?,?,?,?,?,?,?)
       RETURNING *`
    )
    .bind(
      orgId,
      periodStart,
      periodEnd,
      included,
      peak,
      devicesBilled,
      sub.overage_rate_zar,
      charge
    )
    .first<OverageEvent>();
}
