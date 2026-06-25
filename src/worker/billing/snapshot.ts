/**
 * Daily device-count snapshot.
 * Called by a cron trigger (or Billing DO alarm) once per day.
 * Writes the peak active-device count for each org into
 * device_daily_snapshots for later overage billing.
 */

/**
 * Record the current active device count per organization.
 * Typically invoked at 00:05 UTC to capture the previous day's peak.
 */
export async function recordDailyDeviceSnapshots(db: D1Database): Promise<number> {
  const snapshotDate = new Date();
  snapshotDate.setUTCDate(snapshotDate.getUTCDate() - 1);
  const dateStr = snapshotDate.toISOString().split('T')[0]; // YYYY-MM-DD

  // Count active devices per org from device_credentials (auth service table)
  const rows = await db
    .prepare(
      `SELECT organization_id, COUNT(*) as cnt
       FROM device_credentials
       WHERE status = 'active'
       GROUP BY organization_id`
    )
    .all<{ organization_id: string; cnt: number }>();

  let written = 0;
  for (const row of rows.results ?? []) {
    await db
      .prepare(
        `INSERT INTO device_daily_snapshots (org_id, snapshot_date, device_count)
         VALUES (?, ?, ?)
         ON CONFLICT(org_id, snapshot_date) DO UPDATE SET device_count = excluded.device_count`
      )
      .bind(row.organization_id, dateStr, row.cnt)
      .run();
    written++;
  }
  return written;
}
