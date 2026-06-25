# Pre-Remote Deploy - Agent Invites

Date: 2026-06-22

## Repository

`F:\NEXTERAAI\APPS\WEB`

## Git Status

- Branch: `owner-agent-invite-auth-flow`
- Working tree: dirty with the owner invite/auth implementation plus other existing web changes.
- No files were deleted or reverted in this phase.

## Commands Run

- `git status`: PASS
- `npm run test:agent-invites`: PASS
- `npm run build`: PASS
- `npm run check`: PASS
  - includes `tsc`
  - includes Vite production build
  - includes Wrangler dry-run deploy

## Wrangler / D1 Confirmation

- Config file: `wrangler.json`
- Worker name: `nexteraai-main-site`
- D1 binding: `DB`
- D1 database name: `nextera`
- D1 database id: `8d698c9c-f838-4fa3-b972-2ec5bcee71c0`
- Migrations directory: `migrations`

## Migration 28 Review

- File: `migrations\28.sql`
- Creates `agent_invites`.
- Creates `agent_access_devices`.
- Creates seven indexes for org, organization, token hash, status, and device lookup.
- Destructive SQL: no
- Existing table alteration: no
- Plaintext token column: no
- Stored token material:
  - `token_prefix`
  - `token_hash`
  - `session_token_prefix`
  - `session_token_hash`

## Token Logging / Storage Review

- Owner invite creation returns `agent_access_token` once in the API response.
- Owner invite list serialization removes `token_hash`.
- Audit logging records `invite_id`, `token_prefix`, expiry, and max uses; it does not log the plaintext token.
- Registration hashes `agent_access_token` before lookup.
- Registration returns `session_token` once and stores `session_token_hash`.

## Safety Status

- production_ready: false
- auto_block_enabled: false
- Threat Protection v1 touched: no
- allowlists touched: no
- rollback support removed: no

## 2026-06-22 Compatibility Note

Production already had a legacy `agent_devices` table. The owner-issued invite flow now uses additive table `agent_access_devices` to avoid altering legacy runtime data.
