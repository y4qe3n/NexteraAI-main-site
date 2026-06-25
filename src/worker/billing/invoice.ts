/**
 * Invoice generation and sequential numbering.
 */

import type { Invoice } from './types';

const TIER_PRICES: Record<string, { monthly: number }> = {
  basic: { monthly: 1000 },
  pro: { monthly: 2000 },
  enterprise: { monthly: 3000 },
};

const SA_VAT_RATE = 0.15;

/**
 * Atomically get the next invoice number (INV-YYYY-NNNNN format).
 * Uses D1 UPDATE … RETURNING for atomicity.
 */
export async function nextInvoiceNumber(db: D1Database): Promise<string> {
  const year = new Date().getUTCFullYear();

  // Ensure counter row exists
  await db
    .prepare(
      `INSERT OR IGNORE INTO invoice_counter (year, next_seq) VALUES (?, 1)`
    )
    .bind(year)
    .run();

  const row = await db
    .prepare(
      `UPDATE invoice_counter SET next_seq = next_seq + 1 WHERE year = ? RETURNING next_seq`
    )
    .bind(year)
    .first<{ next_seq: number }>();

  const seq = row?.next_seq ?? 1;
  return `INV-${year}-${String(seq).padStart(5, '0')}`;
}

/**
 * Generate a draft invoice for a billing period.
 * Reads org tier + subscription commercial fields from D1.
 */
export async function generateInvoice(
  db: D1Database,
  orgId: string,
  periodStart: string,
  periodEnd: string
): Promise<Invoice | null> {
  // Fetch org + subscription commercial fields
  const orgRow = await db
    .prepare(
      `SELECT
        o.tier,
        o.device_limit,
        s.billing_cycle,
        s.included_devices,
        s.overage_rate_zar,
        s.custom_base_price_zar,
        s.annual_discount_pct
      FROM organizations o
      LEFT JOIN subscriptions s ON s.organization_id = o.id
      WHERE o.id = ?`
    )
    .bind(orgId)
    .first<{
      tier: string;
      device_limit: number | null;
      billing_cycle: string;
      included_devices: number;
      overage_rate_zar: number;
      custom_base_price_zar: number;
      annual_discount_pct: number;
    }>();

  if (!orgRow) return null;

  // Base amount
  const baseAmount =
    orgRow.custom_base_price_zar ?? TIER_PRICES[orgRow.tier]?.monthly ?? 1000;

  // Annual discount
  const isAnnual = orgRow.billing_cycle === 'annual';
  const discountPct = orgRow.annual_discount_pct ?? 0.10;
  const discountAmount = isAnnual
    ? Math.round(baseAmount * discountPct * 100) / 100
    : 0;

  // Overage (unlinked to any invoice yet)
  const overageRow = await db
    .prepare(
      `SELECT SUM(overage_charge_zar) as total
       FROM overage_events
       WHERE org_id = ? AND period_start = ? AND invoice_id IS NULL`
    )
    .bind(orgId, periodStart)
    .first<{ total: number }>();

  const overageAmount = overageRow?.total ?? 0;

  // VAT calculation
  const totalExclVat =
    Math.round((baseAmount - discountAmount + overageAmount) * 100) / 100;
  const vatAmount = Math.round(totalExclVat * SA_VAT_RATE * 100) / 100;
  const totalInclVat = Math.round((totalExclVat + vatAmount) * 100) / 100;

  const invoiceNumber = await nextInvoiceNumber(db);

  const invoice = await db
    .prepare(
      `INSERT INTO invoices
       (org_id, invoice_number, period_start, period_end,
        base_amount_zar, overage_amount_zar, discount_amount_zar,
        total_excl_vat_zar, vat_amount_zar, total_incl_vat_zar)
       VALUES (?,?,?,?,?,?,?,?,?,?)
       RETURNING *`
    )
    .bind(
      orgId,
      invoiceNumber,
      periodStart,
      periodEnd,
      baseAmount,
      overageAmount,
      discountAmount,
      totalExclVat,
      vatAmount,
      totalInclVat
    )
    .first<Invoice>();

  if (!invoice) return null;

  // Link overage rows to this invoice
  await db
    .prepare(
      `UPDATE overage_events
       SET invoice_id = ?
       WHERE org_id = ? AND period_start = ? AND invoice_id IS NULL`
    )
    .bind(invoice.id, orgId, periodStart)
    .run();

  return invoice;
}
