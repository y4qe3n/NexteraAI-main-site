# Remote Migration 28 Apply Report

Date: 2026-06-22

## Command Run

```powershell
npx wrangler d1 migrations apply nextera --remote --config wrangler.json
```

## D1 Target

- Binding: `DB`
- Database name: `nextera`
- Database id: `8d698c9c-f838-4fa3-b972-2ec5bcee71c0`
- Resource location: remote

## Pre-Apply Backup

- Command: `npx wrangler d1 export nextera --remote --config wrangler.json --output backups\d1\nextera-20260622-102842-before-agent-invite-28.sql`
- Result: PASS
- Backup path: `F:\NEXTERAAI\APPS\WEB\backups\d1\nextera-20260622-102842-before-agent-invite-28.sql`

## Initial Apply Result

- Result: FAIL
- Error: `no such column: organization_id`
- Cause: production already had a legacy `agent_devices` table with a different schema. Migration 28 originally used `CREATE TABLE IF NOT EXISTS agent_devices`, so SQLite skipped creation and failed when creating the new `organization_id` index.
- Action taken: updated the pending migration and Worker code to use additive table `agent_access_devices` for the owner-issued invite flow, leaving the legacy `agent_devices` table untouched.

## Final Apply Result

- Result: PASS
- Wrangler output: `28.sql` applied successfully
- Post-apply migration list: `No migrations to apply`

## Remote Schema Verification

- `agent_invites`: present
- `agent_access_devices`: present
- Expected new indexes present:
  - `idx_agent_invites_org_id`
  - `idx_agent_invites_organization_id`
  - `idx_agent_invites_token_hash`
  - `idx_agent_invites_status`
  - `idx_agent_access_devices_org_id`
  - `idx_agent_access_devices_organization_id`
  - `idx_agent_access_devices_status`

## Rollback Notes

- No destructive SQL was executed.
- A pre-apply export exists at the backup path above.
- If runtime rollback is required, roll back the Worker version first; database changes are additive and can remain dormant.

## Safety Status

- production_ready: false
- auto_block_enabled: false
- destructive migration: no
- plaintext agent token storage: no
