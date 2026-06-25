/**
 * Device registration hard-cap enforcement.
 * Called during device enrollment to enforce tier limits.
 */

import type { Tier } from './types';

export async function canRegisterDevice(
  db: D1Database,
  orgId: string
): Promise<{ allowed: boolean; reason?: string; current: number; limit: number | null }> {
  const org = await db
    .prepare('SELECT tier, device_limit FROM organizations WHERE id = ?')
    .bind(orgId)
    .first<{ tier: Tier; device_limit: number | null }>();

  if (!org) return { allowed: false, reason: 'Organization not found', current: 0, limit: null };

  // Enterprise tiers have no hard cap (billed per device)
  if (org.tier === 'enterprise' || org.tier === 'enterprise_custom') {
    return { allowed: true, current: 0, limit: null };
  }

  const countRow = await db
    .prepare(
      `SELECT COUNT(*) as cnt FROM device_credentials
       WHERE organization_id = ? AND status = 'active'`
    )
    .bind(orgId)
    .first<{ cnt: number }>();

  const current = countRow?.cnt ?? 0;
  const limit = org.device_limit;

  if (limit !== null && current >= limit) {
    return {
      allowed: false,
      reason: `Device limit reached (${current}/${limit}). Upgrade tier to add more devices.`,
      current,
      limit,
    };
  }

  return { allowed: true, current, limit };
}
