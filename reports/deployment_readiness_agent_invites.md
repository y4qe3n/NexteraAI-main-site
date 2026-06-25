# Deployment Readiness - Agent Invites

Date: 2026-06-22

## Wrangler Config

- Config file: `wrangler.json`
- Worker name: `nexteraai-main-site`
- D1 binding: `DB`
- D1 database name: `nextera`
- D1 database id: `8d698c9c-f838-4fa3-b972-2ec5bcee71c0`
- Migrations dir: `migrations`
- Routes:
  - `www.nexteraai.co.za/*`
  - `nexteraai.co.za/*`

## Local Readiness Checks

- `npm run test:agent-invites`: PASS
- `npm run build`: PASS
- `npm run check`: PASS
  - includes `tsc`
  - includes Vite build
  - includes `wrangler deploy --dry-run`
- `npx wrangler --version`: PASS, version `4.99.0`

## Migration Command

Review remote pending migrations:

```powershell
npx wrangler d1 migrations list nextera --remote --config wrangler.json
```

Apply remote migrations:

```powershell
npx wrangler d1 migrations apply nextera --remote --config wrangler.json
```

## Deploy Command

Use the repo script:

```powershell
npm run deploy
```

Equivalent direct command:

```powershell
npx wrangler deploy --config wrangler.json
```

## Executed This Run

- Remote migration executed: yes
- Worker deploy executed: yes
- Dry-run deploy executed: yes, via `npm run check`

## Rollback Notes

- Pre-apply remote D1 backup created at `F:\NEXTERAAI\APPS\WEB\backups\d1\nextera-20260622-102842-before-agent-invite-28.sql`.
- Worker rollback should use Cloudflare Worker version rollback if deployment introduces a runtime issue.
- Migration 28 was applied after the live schema conflict was fixed by using additive table `agent_access_devices`.

## 2026-06-22 Remote Deployment Result

- Pre-apply backup: `F:\NEXTERAAI\APPS\WEB\backups\d1\nextera-20260622-102842-before-agent-invite-28.sql`
- Remote migration executed: yes
- Migration result: PASS
- Worker deploy executed: yes
- Worker deploy result: PASS
- Worker version: `74da8235-74a6-49ca-9c7f-cd35932e6ca7`
- Live smoke:
  - unauthenticated owner invite create: 401 PASS
  - unauthenticated owner device list: 401 PASS
  - invalid agent registration: 401 PASS
  - `/dashboard/agents`: 200 PASS
- Authenticated owner invite/desktop registration smoke: pending owner session.

## Safety Status

- production_ready: false
- auto_block_enabled: false
- remote production changed: yes, additive migration and Worker deploy

## 2026-06-23 Active Pilot Monitoring Addendum

- Owner-issued registration is live and active on one owner-controlled device.
- Dashboard/backend device status: `active`.
- Heartbeat/backend last seen: `2026-06-23T09:27:29.914Z`.
- Corrected revoked-invite retest: PASS; revoked invite remains revoked with `uses=0/1`.
- Netstat flicker result: no visible recurrence.
- PowerShell panel/window flicker result: source identified and no visible recurrence.
- Timer/date display result: fixed and visually confirmed.
- Full token written to reports: no.
- Current recommendation: `continue_single_device_monitoring`.
- `production_ready=false`.
- `auto_block_enabled=false`.
