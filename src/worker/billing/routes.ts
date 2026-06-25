/**
 * Billing API routes wired into the main Hono app in worker/index.ts.
 */

import { generateInvoice } from './invoice';
import { verifyITNCallback } from './payfast';
import { calculateEnterpriseEstimate } from './quote';
import type { Invoice, EnterpriseEstimatorInput } from './types';

function getUserFromContext(c: any): { id: string; email?: string; organization_id?: string | number } | null {
  return c.get('user') ?? null;
}

async function resolveOrganizationId(c: any): Promise<number | null> {
  const user = getUserFromContext(c);
  if (!user) return null;
  if (user.organization_id) return Number(user.organization_id);

  const numericId = Number(user.id);
  if (!Number.isNaN(numericId)) {
    const row = await c.env.DB.prepare('SELECT organization_id FROM users WHERE id = ?')
      .bind(numericId)
      .first() as { organization_id?: number | null } | null;
    if (row?.organization_id) return row.organization_id;
  }

  const org = await c.env.DB.prepare('SELECT id FROM organizations WHERE user_id = ?')
    .bind(user.id)
    .first() as { id: number } | null;
  return org?.id ?? null;
}

async function countActiveDevices(db: D1Database, orgId: number): Promise<number> {
  try {
    const row = await db.prepare(
      `SELECT COUNT(*) as cnt FROM device_credentials
       WHERE organization_id = ? AND status = 'active'`
    ).bind(orgId).first<{ cnt: number }>();
    return row?.cnt ?? 0;
  } catch {
    try {
      const row = await db.prepare(
        `SELECT COUNT(*) as cnt FROM devices
         WHERE organization_id = ? AND status = 'active'`
      ).bind(orgId).first<{ cnt: number }>();
      return row?.cnt ?? 0;
    } catch {
      return 0;
    }
  }
}

export async function handleBillingSummary(c: any) {
  const orgId = await resolveOrganizationId(c);
  if (!orgId) return c.json({ error: 'Unauthorized' }, 401);
  const db: D1Database = c.env.DB;

  const org = await db.prepare(
    `SELECT o.plan, o.devices_limit,
            s.billing_cycle, s.amount,
            s.current_period_start, s.current_period_end
     FROM organizations o
     LEFT JOIN subscriptions s ON s.organization_id = o.id
     WHERE o.id = ?`
  ).bind(orgId).first<{
    plan: string;
    devices_limit: number | null;
    billing_cycle?: string | null;
    amount?: number | null;
    current_period_start?: string | null;
    current_period_end?: string | null;
  }>();

  if (!org) return c.json({ error: 'Organization not found' }, 404);

  const currentDevices = await countActiveDevices(db, orgId);
  const included = org.devices_limit ?? 0;
  const overage = Math.max(0, currentDevices - included);
  const pctUsed = included > 0 ? Math.min(100, Math.round((currentDevices / included) * 100)) : 0;

  const now = new Date();
  const periodStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const periodEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;

  const tier = org.plan ?? 'basic';
  const baseAmount = org.amount ?? (tier === 'pro' ? 2000 : tier === 'enterprise' ? 3000 : 1000);
  const isAnnual = org.billing_cycle === 'annual';
  const discountAmount = isAnnual ? Math.round(baseAmount * 0.10 * 100) / 100 : 0;
  const overageCharge = 0;
  const totalExclVat = baseAmount - discountAmount + overageCharge;
  const vat = Math.round(totalExclVat * 0.15 * 100) / 100;

  return c.json({
    tier,
    billing_cycle: org.billing_cycle ?? 'monthly',
    devices: { current: currentDevices, included, overage, pct_used: pctUsed },
    next_invoice: {
      period_start: periodStart,
      period_end: periodEnd,
      base_amount: baseAmount,
      discount_amount: discountAmount,
      overage_amount: overageCharge,
      vat_amount: vat,
      total_incl_vat: Math.round((totalExclVat + vat) * 100) / 100,
    },
    annual_dates: isAnnual ? { start: org.current_period_start, end: org.current_period_end } : null,
  });
}

export async function handleInvoiceList(c: any) {
  const orgId = await resolveOrganizationId(c);
  if (!orgId) return c.json({ error: 'Unauthorized' }, 401);
  const db: D1Database = c.env.DB;

  const limit = Math.min(Number(c.req.query('limit') || '20'), 100);
  const offset = Number(c.req.query('offset') || '0');

  try {
    const invoices = await db.prepare(
      `SELECT id, invoice_number, period_start, period_end,
              total_incl_vat_zar, status, paid_at, created_at
       FROM invoices WHERE org_id = ?
       ORDER BY period_end DESC LIMIT ? OFFSET ?`
    ).bind(orgId, limit, offset).all<Invoice>();

    const countRow = await db.prepare('SELECT COUNT(*) as total FROM invoices WHERE org_id = ?')
      .bind(orgId)
      .first<{ total: number }>();

    return c.json({
      invoices: invoices.results ?? [],
      total: countRow?.total ?? 0,
      limit,
      offset,
    });
  } catch {
    return c.json({ invoices: [], total: 0, limit, offset });
  }
}

export async function handleAnnualUpgrade(c: any) {
  const orgId = await resolveOrganizationId(c);
  if (!orgId) return c.json({ error: 'Unauthorized' }, 401);
  const db: D1Database = c.env.DB;

  const today = new Date().toISOString().split('T')[0];
  const endOfYear = new Date();
  endOfYear.setUTCFullYear(endOfYear.getUTCFullYear() + 1);
  const endDate = endOfYear.toISOString().split('T')[0];

  await db.prepare(
    `UPDATE subscriptions
     SET billing_cycle = 'annual',
         current_period_start = ?,
         current_period_end = ?,
         updated_at = datetime('now')
     WHERE organization_id = ?`
  ).bind(today, endDate, orgId).run();

  let invoice = null;
  try {
    invoice = await generateInvoice(db, String(orgId), today, endDate);
  } catch (err) {
    console.warn('Annual upgrade completed without invoice generation:', err);
  }

  return c.json({
    success: true,
    message: 'Switched to annual billing.',
    annual_start: today,
    annual_end: endDate,
    invoice: invoice ?? null,
  });
}

export async function handlePayFastITN(c: any) {
  const body = await c.req.parseBody();
  const data = Object.fromEntries(Object.entries(body).map(([k, v]) => [k, String(v)]));

  const result = verifyITNCallback(data, c.env.PAYFAST_PASSPHRASE);
  if (!result.valid) {
    console.error('PayFast ITN rejected:', result.error);
    return c.json({ error: result.error }, 403);
  }

  const paymentStatus = data.payment_status;
  const invoiceNumber = data.m_payment_id;

  if (paymentStatus === 'COMPLETE') {
    await c.env.DB.prepare(
      `UPDATE invoices
       SET status = 'paid', payfast_token = ?, paid_at = datetime('now')
       WHERE invoice_number = ?`
    )
      .bind(data.token || null, invoiceNumber)
      .run();
  }

  return c.json({ success: true });
}

export async function handleEnterpriseEstimate(c: any) {
  try {
    const body = await c.req.json();
    const errors: string[] = [];

    if (typeof body.deviceCount !== 'number' || body.deviceCount < 50 || body.deviceCount > 2000) {
      errors.push('deviceCount must be between 50 and 2000');
    }
    if (typeof body.employeeCount !== 'number' || body.employeeCount < 1 || body.employeeCount > 5000) {
      errors.push('employeeCount must be between 1 and 5000');
    }
    const validSectors = ['professional_services', 'healthcare', 'financial_services', 'logistics', 'retail', 'manufacturing', 'education', 'government', 'other'];
    if (!validSectors.includes(body.sector)) {
      errors.push('sector must be one of: ' + validSectors.join(', '));
    }
    if (!Array.isArray(body.complianceNeeds) || body.complianceNeeds.length === 0) {
      errors.push('complianceNeeds must be a non-empty array');
    }
    const validSupportTiers = ['business_hours', 'twentyfour_seven'];
    if (!validSupportTiers.includes(body.supportTier)) {
      errors.push('supportTier must be business_hours or twentyfour_seven');
    }
    const validBackupSizes = [0, 100, 500, 1000, 5000];
    if (!validBackupSizes.includes(body.backupVaultGb)) {
      errors.push('backupVaultGb must be one of: 0, 100, 500, 1000, 5000');
    }
    if (typeof body.namedAccountManager !== 'boolean') {
      errors.push('namedAccountManager must be a boolean');
    }

    if (errors.length > 0) {
      return c.json({ error: 'Invalid input', details: errors }, 400);
    }

    const input: EnterpriseEstimatorInput = {
      deviceCount: body.deviceCount,
      employeeCount: body.employeeCount,
      sector: body.sector,
      complianceNeeds: body.complianceNeeds,
      supportTier: body.supportTier,
      backupVaultGb: body.backupVaultGb,
      namedAccountManager: body.namedAccountManager,
    };

    return c.json(calculateEnterpriseEstimate(input), 200);
  } catch {
    return c.json({ error: 'Failed to calculate estimate' }, 500);
  }
}
