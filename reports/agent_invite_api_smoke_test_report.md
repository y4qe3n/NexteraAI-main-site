# Agent Invite API Smoke Test Report

Date: 2026-06-21

## Goal

Smoke-test the owner invite and desktop registration API path locally before remote deployment.

## Automated Coverage Completed

- `npm run test:agent-invites`: PASS
  - token format checks
  - token hashing checks
  - owner/admin permission checks
  - expired/revoked/max-use invite checks
  - owner-safe serialization checks
- `npm run build`: PASS
- `npm run check`: PASS, including Wrangler dry run

## Local HTTP Smoke Status

Blocked.

The local HTTP smoke needs:

- a fully migrated local D1 database with migration 28 applied
- a valid owner/admin session cookie for `POST /api/owner/agent-invites`

`npx wrangler d1 migrations apply nextera --local --config wrangler.json` failed before migration 28 because earlier local migration replay drifts:

- `migrations\20.sql` adds `users.role`
- `migrations\23.sql` also adds `users.role`
- SQLite error: `duplicate column name: role`

Because local schema setup failed before migration 28, I did not start a local Worker and did not fake an owner session or hardcode credentials.

## Manual Live Smoke Steps After Deploy

1. Log into the dashboard as an owner/admin.
2. Open `/dashboard/agents`.
3. Create an agent invite.
4. Confirm response/display includes `org_id`, `invite_id`, `token_prefix`, one-time plaintext `agent_access_token`, and `expires_at`.
5. Confirm D1 stores `token_hash` and `token_prefix`, not plaintext access token.
6. Use the desktop agent login form with `org_id` and the one-time access token.
7. Confirm `/api/agent/register` returns a session/device token and agent id.
8. Confirm dashboard device list shows the registered device.
9. Confirm invalid/revoked/expired token attempts fail.
10. Confirm no plaintext token is logged.

## Safety Status

- production_ready: false
- auto_block_enabled: false
- auth bypass added for smoke: no
- plaintext token logged/stored: no
