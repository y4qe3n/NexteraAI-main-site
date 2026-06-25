/**
 * Annual billing price computation.
 * Pure function — safe to call from any context.
 */

import type { AnnualPriceResult } from './types';

/**
 * Compute annual price from a monthly base, applying a discount.
 * @param monthlyBase Monthly base amount in ZAR
 * @param discountPct Discount as a decimal (0.10 = 10%)
 * @returns Annual totals
 */
export function computeAnnualPrice(
  monthlyBase: number,
  discountPct = 0.10
): AnnualPriceResult {
  const annual = monthlyBase * 12 * (1 - discountPct);
  return {
    annualTotal: Math.round(annual * 100) / 100,
    effectiveMonthly: Math.round((annual / 12) * 100) / 100,
    saving: Math.round(monthlyBase * 12 * discountPct * 100) / 100,
  };
}
