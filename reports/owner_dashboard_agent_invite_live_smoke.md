# Owner Dashboard Agent Invite Live Smoke

Date: 2026-06-22T11:31:10+02:00

## Target

- URL: `https://www.nexteraai.co.za/dashboard/agents`
- Worker version: `74da8235-74a6-49ca-9c7f-cd35932e6ca7`
- D1 database: `nextera`
- D1 binding: `DB`

## Result

Owner-authenticated dashboard invite creation succeeded using the real owner/admin browser session.

## Browser Findings

- Chrome/Brave owner session: `/dashboard/agents` loaded authenticated dashboard navigation and Agent Devices controls.
- Owner/admin visible account: Yaqeen / `y4qe3n@gmail.com`.
- I did not bypass authentication.
- I did not create a fake owner session.
- I did not hardcode or retrieve any owner credentials.

## Invite UI Checks

- Agent Devices page loaded while authenticated: yes.
- New invite generated: yes.
- `org_id` shown: yes, recorded only as `nxorg_954ffb...8ab673`.
- `invite_id` shown: not clearly visible in the UI snapshot.
- `token_prefix` shown: yes, `nxag_live_ddf99ca7`.
- one-time `agent_access_token` shown: yes, not recorded in this report.
- `expires_at` shown: yes, `6/25/2026, 11:22:16 AM`.
- one-time-token warning visible: yes, "Copy this token now. It will not be shown again."
- full token written to report: no.
- old prior invite status: revoked.

## Safe Checks Completed

- Public dashboard route reached the login surface rather than exposing owner data.
- Previous unauthenticated owner invite create check returned HTTP 401.
- Previous unauthenticated owner device list check returned HTTP 401.
- Real owner invite generation succeeded after the user-provided logged-in browser session became available.
- Desktop registration succeeded using this invite.

## Remaining Verification Gap

After desktop registration, the Chrome/Brave extension bridge became unavailable during dashboard refresh. Device visibility in the dashboard UI could not be verified in this run.

## Safety Status

- production_ready: false
- auto_block_enabled: false
- auth bypass added: no
- plaintext token logged or reported: no
