# Agent Owner Invite Auth Final Report

Date: 2026-06-22

## Scope

Implemented the owner-issued desktop-agent invite flow in the confirmed web/dashboard repo:

`F:\NEXTERAAI\APPS\WEB`

## Backend Changes

- Added `src/worker/agent-auth.ts` for random org IDs, invite IDs, agent IDs, access tokens, session tokens, token prefixes, SHA-256 token hashes, owner/admin authorization checks, and owner-safe invite serialization.
- Added `migrations/28.sql` for `agent_invites` and `agent_access_devices`.
- Added owner routes in `src/worker/index.ts`:
  - `POST /api/owner/agent-invites`
  - `GET /api/owner/agent-invites`
  - `POST /api/owner/agent-invites/:id/revoke`
  - `GET /api/owner/agent-devices`
- Added desktop registration route:
  - `POST /api/agent/register`
- The backend stores hashed access tokens and hashed session tokens only.
- The plaintext agent access token is returned only once on invite creation.
- Failed agent registration returns a generic auth failure for invalid token/org combinations.

## Dashboard Changes

- Added `src/react-app/pages/AgentDevices.tsx`.
- Added dashboard route `dashboard/agents`.

## Tests

- `npm run test:agent-invites`: PASS
- `npm run build`: PASS
- `npm run check`: PASS, including Wrangler deploy dry run
- In-memory SQLite execution of `migrations\28.sql`: PASS
- Local D1 full migration replay: blocked before migration 28 by earlier duplicate `users.role` migration drift

## Deployment Status

- Migration `28.sql` has been applied to remote D1.
- Worker has been deployed.
- Prepared remote migration command: `npx wrangler d1 migrations apply nextera --remote --config wrangler.json`
- Prepared deploy command: `npm run deploy`
- Live unauthenticated/invalid-token smoke checks passed.
- Authenticated owner invite and desktop registration smoke remains pending owner/admin session.

## Safety Status

- production_ready: false
- auto_block_enabled: false
- desktop agent touched: yes, in the desktop-agent repo only
- plaintext token storage server-side: no
- auth bypass added: no
- customer-facing production claim added: no

## Next Action

Create a real owner invite from the deployed dashboard and register the desktop agent against `/api/agent/register`.

## 2026-06-21 Validation Pass

- D1 binding/name confirmed from `wrangler.json`: `DB` / `nextera`.
- Wrangler available through project dependency: `npx wrangler --version` returned `4.99.0`.
- Migration 28 is additive and creates only `agent_invites`, `agent_access_devices`, and related indexes.
- Remote migration/deploy was deferred during this earlier validation pass.
- Next prompt: `reports\NEXT_AGENT_INVITE_DEPLOY_AND_SMOKE_PROMPT.md`.

## 2026-06-22 Remote Deploy / Live Smoke

- Production had a legacy `agent_devices` table with a different schema.
- To preserve it, the owner-issued invite flow now writes to additive table `agent_access_devices`.
- Pre-apply D1 backup: `F:\NEXTERAAI\APPS\WEB\backups\d1\nextera-20260622-102842-before-agent-invite-28.sql`
- Remote migration 28: PASS
- Worker deploy: PASS
- Worker version: `74da8235-74a6-49ca-9c7f-cd35932e6ca7`
- Live smoke checks:
  - unauthenticated owner invite create: 401
  - unauthenticated owner device list: 401
  - invalid agent registration: 401
  - `/dashboard/agents`: 200
- Authenticated owner invite and desktop registration smoke remains pending owner/admin session.

## 2026-06-22 Owner Dashboard Smoke Attempt

- Chrome/Brave `/dashboard/agents`: authenticated owner/admin session confirmed.
- Owner/admin session available to Codex: yes.
- Dashboard invite creation: PASS.
- Token prefix: `nxag_live_ddf99ca7`.
- Masked org: `nxorg_954ffb...8ab673`.
- Expiry: `6/25/2026, 11:22:16 AM`.
- Desktop registration with real invite: PASS.
- Desktop post-registration screen: protected Overview, Agent Online.
- Dashboard device-list UI verification: blocked after Chrome/Brave extension bridge became unavailable during refresh.
- Invalid-token live registration check: PASS, HTTP 401.
- Auth bypass used: no.
- Fake owner session created: no.
- Full token written to reports: no.

## 2026-06-23 Active Pilot Monitoring Addendum

- Dashboard device visibility: PASS by owner/manual and backend evidence.
- Corrected revoked-invite retest: PASS; `nxag_live_348dcc2e` remains revoked with `uses=0/1`.
- Current device ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Dashboard/backend device status: `active`.
- Heartbeat/backend last seen: `2026-06-23T09:27:29.914Z`.
- Final rebuilt desktop PID: `36356`, responding.
- Netstat flicker result: no visible recurrence.
- PowerShell panel/window flicker result: source identified and no visible recurrence.
- Timer/date display result: fixed and visually confirmed.
- Full token written to reports: no.
- Threat Protection v1 warn-only/shadow mode preserved.
- `production_ready=false`.
- `auto_block_enabled=false`.
- Recommendation: `continue_single_device_monitoring`.
