/**
 * Billing Durable Object
 * Monthly alarm (1st of month, 02:00 SAST) that:
 *  1. Records daily device snapshots for the closing month
 *  2. Calculates overage for each org
 *  3. Generates draft invoices
 *  4. Sends PayFast payment links via Resend
 *
 * Storage keys:
 *  - `last_run_period`: "YYYY-MM" of last completed run
 *  - `org_cursor`: last org ID processed (for resume on partial failure)
 */

// Cloudflare Durable Object type stub (provided by workers-types at build time)
declare const DurableObjectState: any;

import { calculateOverage } from './overage';
import { generateInvoice } from './invoice';
import { recordDailyDeviceSnapshots } from './snapshot';
import { buildPayFastPaymentRequest } from './payfast';

const ALARM_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours (reschedule daily, gate on calendar date)

export class BillingDurableObject {
  private state: any;
  private env: any;

  constructor(state: any, env: any) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/trigger') {
      await this.runBillingCycle();
      return new Response('OK', { status: 200 });
    }
    return new Response('Not found', { status: 404 });
  }

  async alarm(): Promise<void> {
    const now = new Date();
    const sast = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    const isFirstOfMonth = sast.getDate() === 1;
    const hour = sast.getHours();

    // Only run heavy billing logic on 1st of month at ~02:00 SAST
    if (isFirstOfMonth && hour >= 2) {
      await this.runBillingCycle();
    }

    // Always reschedule
    await this.state.storage.setAlarm(Date.now() + ALARM_INTERVAL_MS);
  }

  private async runBillingCycle(): Promise<void> {
    const db = this.env.DB as D1Database;
    const now = new Date();
    const periodEnd = new Date(now.getFullYear(), now.getMonth(), 0); // last day of prev month
    const periodStart = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1);
    const periodStartStr = periodStart.toISOString().split('T')[0];
    const periodEndStr = periodEnd.toISOString().split('T')[0];
    const periodKey = `${periodStartStr}_${periodEndStr}`;

    // Idempotency check
    const lastPeriod = (await this.state.storage.get('last_run_period')) as string | undefined;
    if (lastPeriod === periodKey) {
      console.log(`Billing cycle already completed for ${periodKey}`);
      return;
    }

    // 1. Snapshot closing month device counts
    await recordDailyDeviceSnapshots(db);

    // 2. Get all active orgs
    const orgs = await db
      .prepare(`SELECT id FROM organizations WHERE status = 'active'`)
      .all<{ id: string }>();

    // 3. Process each org
    let processed = 0;
    let invoicesCreated = 0;
    let overagesCreated = 0;

    for (const org of orgs.results ?? []) {
      try {
        // Overage
        const overage = await calculateOverage(db, org.id, periodStartStr, periodEndStr);
        if (overage) overagesCreated++;

        // Invoice (always generate, even if overage is 0)
        const invoice = await generateInvoice(db, org.id, periodStartStr, periodEndStr);
        if (invoice) {
          invoicesCreated++;
          await this.sendInvoiceEmail(invoice, org.id);
        }
        processed++;
      } catch (err) {
        console.error(`Billing error for org ${org.id}:`, err);
        // Continue with next org; cursor not needed since we just loop all
      }
    }

    console.log(
      `Billing cycle ${periodKey}: ${processed} orgs, ${invoicesCreated} invoices, ${overagesCreated} overages`
    );

    await this.state.storage.put('last_run_period', periodKey);
  }

  private async sendInvoiceEmail(invoice: any, orgId: string): Promise<void> {
    // Build PayFast payment request
    const { url } = buildPayFastPaymentRequest(invoice, this.env);

    // Get org admin email
    const db = this.env.DB as D1Database;
    const org = await db.prepare(
      `SELECT email FROM organizations WHERE id = ?`
    )
      .bind(orgId)
      .first<{ email: string }>();

    if (!org?.email) return;

    // Send via Resend (fallback to console if no key)
    if (this.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'billing@nexteraai.co.za',
            to: org.email,
            subject: `NexteraAI Invoice ${invoice.invoice_number}`,
            html: `<p>Your invoice for the period ${invoice.period_start} to ${invoice.period_end} is ready.</p>
                   <p>Total (incl. VAT): R${invoice.total_incl_vat_zar.toFixed(2)}</p>
                   <p><a href="${url}">Pay now</a></p>`,
          }),
        });
      } catch (e) {
        console.error('Failed to send invoice email:', e);
      }
    }
  }
}
