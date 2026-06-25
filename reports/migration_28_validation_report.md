# Migration 28 Validation Report

Date: 2026-06-22

## Migration

`F:\NEXTERAAI\APPS\WEB\migrations\28.sql`

## Contents Summary

- Creates `agent_invites`.
- Creates `agent_access_devices`.
- Adds indexes for org lookup, organization lookup, token hash lookup, invite status lookup, and device status lookup.
- Stores token prefixes and hashes only.
- Does not store plaintext agent access tokens.

## Destructive Operations

No destructive operations in `28.sql`.

No `DROP`, `DELETE`, `TRUNCATE`, or table-altering operation against existing tables was found in migration 28.

## Expected New Tables

- `agent_invites`
- `agent_access_devices`

## Expected Indexes

- `idx_agent_invites_org_id`
- `idx_agent_invites_organization_id`
- `idx_agent_invites_token_hash`
- `idx_agent_invites_status`
- `idx_agent_access_devices_org_id`
- `idx_agent_access_devices_organization_id`
- `idx_agent_access_devices_status`

## Local Validation Result

- In-memory SQLite execution of updated `28.sql`: PASS
- Table existence check: PASS
- Seven expected index check: PASS
- `npx wrangler d1 migrations list nextera --local --config wrangler.json`: PASS; listed `28.sql` as pending in local state.
- `npx wrangler d1 migrations apply nextera --local --config wrangler.json`: FAIL before reaching migration 28 due earlier local migration replay drift:
  - migration 20 adds `users.role`
  - migration 23 also adds `users.role`
  - SQLite error: `duplicate column name: role`

## Remote Status

Remote migration 28 was applied successfully on 2026-06-22 after the additive `agent_access_devices` compatibility update.

## 2026-06-22 Remote Schema Compatibility Update

- First remote apply failed because production already had legacy `agent_devices`.
- Migration 28 was updated to create `agent_access_devices` instead.
- This avoids rewriting, deleting, or altering the legacy table.
- Updated migration 28 applied successfully on remote D1.
- Post-apply migration list: no pending migrations.

## Exact Remote Command Needed

Review remote migrations:

```powershell
npx wrangler d1 migrations list nextera --remote --config wrangler.json
```

Apply remote migrations:

```powershell
npx wrangler d1 migrations apply nextera --remote --config wrangler.json
```

## Safety Status

- production_ready: false
- auto_block_enabled: false
- destructive migration 28 operations: no
- remote D1 changed: yes, additive migration applied on 2026-06-22
