/**
 * PayFast helpers extracted from the main worker for reuse by billing modules.
 * Includes payment-request builder and ITN verification.
 */

import { generatePayfastSignature, verifyPayfastITN } from '../payfast-core';

/**
 * Build a one-off PayFast payment request for an invoice.
 * Returns the payment URL + POST form data.
 */
export function buildPayFastPaymentRequest(
  invoice: {
    invoice_number: string;
    total_incl_vat_zar: number;
    org_id: string;
  },
  env: {
    PAYFAST_MERCHANT_ID: string;
    PAYFAST_MERCHANT_KEY: string;
    PAYFAST_PASSPHRASE?: string;
    PAYFAST_SANDBOX: string;
    APP_URL: string;
  }
): { url: string; formData: Record<string, string> } {
  const isSandbox = env.PAYFAST_SANDBOX === 'true';
  const pfUrl = isSandbox
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process';

  const amount = invoice.total_incl_vat_zar.toFixed(2);
  const appUrl = env.APP_URL || 'https://nexteraai.security';

  const pfData: Record<string, string> = {
    merchant_id: env.PAYFAST_MERCHANT_ID,
    merchant_key: env.PAYFAST_MERCHANT_KEY,
    return_url: `${appUrl}/billing/payment-success?invoice=${invoice.invoice_number}`,
    cancel_url: `${appUrl}/billing/payment-cancel?invoice=${invoice.invoice_number}`,
    notify_url: `${appUrl}/api/billing/payfast/itn`,
    m_payment_id: invoice.invoice_number,
    amount,
    item_name: `NexteraAI Invoice ${invoice.invoice_number}`,
    item_description: `Cybersecurity subscription + overage`,
    custom_str1: invoice.org_id,
  };

  const signature = generatePayfastSignature(pfData, env.PAYFAST_PASSPHRASE);
  pfData.signature = signature;

  return { url: pfUrl, formData: pfData };
}

/**
 * Verify an ITN (Instant Transaction Notification) callback from PayFast.
 * Checks signature and basic data presence.
 */
export function verifyITNCallback(
  body: Record<string, string>,
  passphrase?: string
): { valid: boolean; data?: Record<string, string>; error?: string } {
  return verifyPayfastITN(body, passphrase);
}
