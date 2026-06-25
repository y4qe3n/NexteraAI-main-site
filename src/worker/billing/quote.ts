/**
 * Enterprise Custom tier quote calculator.
 * Pure function — safe to call from any context.
 */

import type { EnterpriseQuoteResult, EnterpriseEstimatorInput, EnterpriseEstimate, EstimateLineItem } from './types';

const ENTERPRISE_BANDS = [
  { max: 100, base: 4500, overage: 60 },
  { max: 250, base: 8000, overage: 50 },
  { max: 500, base: 14000, overage: 45 },
  { max: Infinity, base: 20000, overage: 40 },
];

/**
 * Generate an Enterprise Custom quote.
 * @param devices Total device count
 * @param months Contract term (12 | 24 | 36)
 * @returns Quote breakdown
 */
export function enterpriseQuote(
  devices: number,
  months: 12 | 24 | 36
): EnterpriseQuoteResult {
  const band = ENTERPRISE_BANDS.find((b) => devices <= b.max)!;
  const termDiscount = months === 36 ? 0.15 : months === 24 ? 0.10 : 0;
  const monthlyBase = band.base * (1 - termDiscount);
  const annualTotal = monthlyBase * 12;

  return {
    monthlyBase: Math.round(monthlyBase * 100) / 100,
    annualTotal: Math.round(annualTotal * 100) / 100,
    overageRate: band.overage,
    totalContractValue: Math.round(annualTotal * (months / 12) * 100) / 100,
  };
}

// ─── Enterprise Estimator Constants ─────────────────────────────────────────

const BASE_RATE_PER_DEVICE = 120;          // ZAR/device/month baseline for 50+ devices
const ACCOUNT_MANAGER_FEE  = 2_000;        // ZAR/month
const SUPPORT_247_UPLIFT   = 1_500;        // ZAR/month
const BACKUP_RATES: Record<number, number> = {
  0:    0,
  100:  300,
  500:  900,
  1000: 1_500,
  5000: 4_000,
};
const COMPLIANCE_UPLIFT: Record<string, number> = {
  popia:    500,
  fica:     500,
  pci_dss:  1_500,
  iso27001: 2_000,
  none:     0,
};

// Volume discount on per-device rate
const deviceDiscount = (n: number): number => {
  if (n >= 500)  return 0.55;  // 45% off
  if (n >= 250)  return 0.65;
  if (n >= 100)  return 0.75;
  return 0.85;                  // 15% off for 50–99 devices
};

/**
 * Calculate an enterprise estimate based on prospect inputs.
 * Pure function — no DB calls, can be called from client or server.
 * @param input EnterpriseEstimatorInput
 * @returns EnterpriseEstimate with price range and line items
 */
export function calculateEnterpriseEstimate(
  input: EnterpriseEstimatorInput
): EnterpriseEstimate {
  const lineItems: EstimateLineItem[] = [];

  // 1. Base device cost
  const rateMultiplier = deviceDiscount(input.deviceCount);
  const deviceBase = Math.round(
    input.deviceCount * BASE_RATE_PER_DEVICE * rateMultiplier
  );
  lineItems.push({ label: `${input.deviceCount} devices`, monthlyZar: deviceBase });

  // 2. Support uplift
  const supportCost =
    input.supportTier === 'twentyfour_seven' ? SUPPORT_247_UPLIFT : 0;
  if (supportCost) {
    lineItems.push({ label: '24×7 support', monthlyZar: supportCost });
  }

  // 3. Backup vault
  const backupCost = BACKUP_RATES[input.backupVaultGb] ?? 0;
  if (backupCost) {
    lineItems.push({
      label: `Backup vault (${input.backupVaultGb} GB)`,
      monthlyZar: backupCost,
    });
  }

  // 4. Compliance needs
  const complianceFiltered = input.complianceNeeds.filter(c => c !== 'none');
  const complianceCost = complianceFiltered.reduce(
    (sum, c) => sum + (COMPLIANCE_UPLIFT[c] ?? 0), 0
  );
  if (complianceCost) {
    lineItems.push({
      label: `Compliance toolkit (${complianceFiltered.join(', ').toUpperCase()})`,
      monthlyZar: complianceCost,
    });
  }

  // 5. Named account manager
  if (input.namedAccountManager) {
    lineItems.push({ label: 'Named account manager', monthlyZar: ACCOUNT_MANAGER_FEE });
  }

  // 6. Sector risk uplift (healthcare, financial: +10%; others: 0)
  const sectorUplift =
    ['healthcare', 'financial_services'].includes(input.sector) ? 0.10 : 0;

  const base = lineItems.reduce((s, l) => s + l.monthlyZar, 0);
  const withSector = Math.round(base * (1 + sectorUplift));

  // Range: ±8%
  const low  = Math.round(withSector * 0.92 / 100) * 100;   // round to nearest R100
  const high = Math.round(withSector * 1.08 / 100) * 100;

  const annualDiscount = 0.10;
  const annualLow  = Math.round(low  * 12 * (1 - annualDiscount));
  const annualHigh = Math.round(high * 12 * (1 - annualDiscount));

  const recommendedTier =
    input.deviceCount > 150 ? 'enterprise_custom' : 'enterprise';

  const complianceLabel = complianceFiltered.length
    ? complianceFiltered.map(c => c.toUpperCase()).join(', ')
    : 'Standard';

  return {
    monthlyLow:  low,
    monthlyHigh: high,
    annualLow,
    annualHigh,
    lineItems,
    recommendedTier,
    contactFormPrefill: {
      deviceCount:       input.deviceCount,
      employeeCount:     input.employeeCount,
      sector:            input.sector,
      estimatedMonthly:  `R${low.toLocaleString('en-ZA')} – R${high.toLocaleString('en-ZA')}/mo`,
      complianceNeeds:   complianceLabel,
    },
  };
}
