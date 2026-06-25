# Owner Agent Invite Live Smoke Final Report

Date: 2026-06-22T11:31:10+02:00

## Deployment Under Test

- Web repo: `F:\NEXTERAAI\APPS\WEB`
- Desktop agent repo: `F:\NEXTERAAI\apps\desktop-agent`
- Worker version: `74da8235-74a6-49ca-9c7f-cd35932e6ca7`
- Production dashboard: `https://www.nexteraai.co.za/dashboard/agents`
- D1 database: `nextera`
- D1 binding: `DB`
- Production schema note: legacy `agent_devices` remains untouched; owner-issued invite flow uses additive table `agent_access_devices`.

## Results

- Owner/admin session confirmed: yes.
- Dashboard invite creation result: PASS.
- Invite details recorded safely: masked org `nxorg_954ffb...8ab673`, token prefix `nxag_live_ddf99ca7`, expiry `6/25/2026, 11:22:16 AM`.
- Desktop registration result: PASS; desktop app routed to protected Overview screen and showed Agent Online.
- Device visible in dashboard: not verified; Chrome/Brave extension bridge became unavailable during post-registration dashboard refresh.
- Invalid token result: PASS, live `POST /api/agent/register` returned HTTP 401 for an intentionally invalid org/token pair.
- Revoked/expired token result: not tested; Chrome/Brave extension bridge failed before a safe revoke/expired invite flow could be completed.
- Logo status: PASS; desktop login screen showed NexteraAI logo/text correctly on the dark background.

## Artifacts

- EXE: `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\nextera-agent.exe`
- MSI: `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\bundle\msi\NexteraAI Agent_1.0.0_x64_en-US.msi`

## Browser Session Evidence

- Chrome/Brave opened `/dashboard/agents` with an authenticated owner/admin session.
- Agent Devices page and invite controls were visible.
- In-app browser remained unauthenticated earlier and was not used for the owner session.
- Chrome/Brave extension bridge became unavailable after successful desktop registration, blocking final dashboard UI device-list verification.

## Token / Auth Safety

- No auth bypass was added or used.
- No fake owner session was created.
- No full agent access token was logged or written to reports.
- No plaintext agent access token was stored server-side in the reviewed owner invite path.

## Threat Protection v1 Safety

- Threat Protection v1 warn-only/shadow mode: confirmed from source/config.
- `production_ready`: false
- `auto_block_enabled`: false
- quarantine/delete/suppress behavior for Threat Protection v1 URL/email decisions: not enabled.
- rollback support: present in Threat Protection v1 config/policy.
- allowlist requirement: present in Threat Protection v1 config/policy.

## Remaining Blockers

- Device visibility confirmation in dashboard UI remains pending because browser control failed after registration.
- Revoked/expired invite negative smoke remains pending.
- Read-only remote D1 query for backend device confirmation timed out and was not retried repeatedly.
- Final pre-pilot retry on 2026-06-22T12:07:47+02:00 still could not complete device visibility: Chrome/Brave extension bridge was unavailable, Windows app input timed out, and two narrow read-only D1 queries timed out.

## 2026-06-22 Manual Final Evidence Update

- Dashboard device visibility: PASS by manual owner confirmation.
- Device status: active.
- Last seen: `6/22/2026, 11:25:27 AM`.
- Full token visible in dashboard: no.
- Only safe token prefix / metadata visible: yes.
- Second invite generated: yes.
- Second invite token prefix: `nxag_live_5229a4fc`.
- Second invite revoked: yes.
- Revoked invite registration rejected: no.
- Revoked invite error/status shown: none.
- Working pilot device untouched: not confirmed; owner response was ambiguous.
- No full token logged/reported during revoke test: not confirmed; owner response was ambiguous.

## 2026-06-22 Revoked Invite Investigation

- Backend fix needed: no.
- Focused fail-closed tests added: yes.
- Tests/build/check: PASS.
- Deploy performed: no.
- Root cause classification: manual smoke flaw likely caused by existing desktop session masking the revoked invite test.
- Corrected live retest remains pending: clear/sign out desktop binding, then submit a freshly revoked second invite.

## Recommendation

Not ready to mark final pre-pilot verification complete. Owner invite generation, desktop registration, and dashboard device-list visibility passed; backend tests prove fail-closed behavior, but the live revoked-invite retest must be repeated from a cleared desktop state.

## Final Status

Historical state before corrected final evidence: invite generation and desktop registration passed, with remaining evidence gates still open. The corrected final evidence below supersedes this earlier blocked state.

## 2026-06-22 Corrected Revoked Invite Final Evidence

- Dashboard device visibility: PASS by owner-confirmed dashboard evidence.
- Desktop session cleared/sign-out equivalent: yes.
- Agent Access login screen confirmed: yes.
- Fresh second invite generated: yes.
- Fresh second invite token prefix: `nxag_live_348dcc2e`.
- Fresh second invite revoked: yes.
- Dashboard revoked status visible: yes.
- Revoked invite registration rejected: yes.
- Error/status shown: `Authentication failed`.
- Protected Overview reached: no.
- New local session/device binding stored: no.
- Backend read-only confirmation: PASS, `device_count=0`, `revoked=1`, `uses=0`, `changed_db=false`.
- Working pilot device untouched: yes.
- No full token logged/reported: yes.

## Corrected Recommendation

`ready_for_single_device_internal_pilot`

Pilot scope remains one owner-controlled machine only, warn-only/shadow mode only, no customer rollout, no public production claims, and review after 24-48 hours before any expansion.

## 2026-06-24 Final Pilot Review Addendum

- Single-device pilot final review: PASS.
- Active monitoring duration: about `44.13` hours.
- Owner-issued invite/auth flow remained stable.
- Latest device: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Backend status: `active`.
- Backend last_seen_at: `2026-06-24T17:15:11.777Z`.
- Revoked invite `nxag_live_348dcc2e`: revoked, `uses=0/1`, devices from revoked invite `0`.
- Token/private-key scan: PASS.
- Recommendation: `expand_to_second_internal_device`.
- Customer rollout remains not approved.
- `production_ready=false`.
- `auto_block_enabled=false`.
- Threat Protection v1 remains warn-only/shadow.

## 2026-06-22 Same-Machine Rebind Update

- Fresh rebind invite generated from owner dashboard: yes.
- Rebind invite token prefix: `nxag_live_ae8c3281`.
- Rebind org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`.
- Desktop registration using fresh invite: PASS.
- Registered device ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Dashboard device visibility: PASS.
- Dashboard last seen updated: yes, `6/22/2026, 10:02:21 PM`.
- Rebind invite consumed: yes, `1/1`.
- Local `device.json`: present.
- Credential Manager device token: present.
- `device.json` plaintext token field: absent.
- Protected Overview reached: yes.
- Agent Online / healthy heartbeat: no, heartbeat returns `404 Not Found`.
- Full token logged/reported in reports: no.

## Current Live Smoke Status

`rebind_passed_runtime_heartbeat_blocked`

Do not begin the 24-48 hour monitoring clock until heartbeat health is fixed or explicitly confirmed expected by the owner.

## 2026-06-23 Refreshed Package Live Smoke Resume

- Refreshed package launched: PASS.
- Agent process responding: yes, PID `27060`.
- Existing registered binding loaded: yes.
- Rebind needed: no.
- Device ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`.
- Netstat flicker result: PASS, `0` visible window handles over `95` seconds.
- Heartbeat/backend last seen result: PASS, `agent_access_devices.last_seen_at=2026-06-22T22:41:36.654Z`.
- Backend read-only check changed DB: no, `changed_db=false`.
- Revoked invite `nxag_live_348dcc2e`: still revoked, `uses=0/1`.
- Plaintext token field in `device.json`: no.
- Full token logged/reported: no.
- Threat Protection v1 warn-only/shadow: preserved.
- `production_ready=false`.
- `auto_block_enabled=false`.

## Current Live Smoke Status

`active_single_device_monitoring`

The heartbeat blocker is superseded by the refreshed-package launch and backend last-seen evidence. Continue the one-machine monitoring window only.

## 2026-06-23 Active Monitoring Checkpoint

- Active heartbeat monitoring duration: about `12h 6m`.
- Desktop runtime: PASS, PID `31408` running/responding.
- Existing registered binding loaded: yes.
- Rebind needed: no.
- Heartbeat/backend last seen: PASS, `agent_access_devices.last_seen_at=2026-06-23T09:12:07.042Z`.
- Backend read-only check changed DB: no, `changed_db=false`.
- Revoked invite `nxag_live_348dcc2e`: still revoked, `uses=0/1`.
- Netstat flicker recurrence: no.
- PowerShell/cmd/terminal flicker recurrence: no.
- Timer/date display status: fixed package remains in use.
- Full token logged/reported: no.
- Threat Protection v1 warn-only/shadow: preserved.
- `production_ready=false`.
- `auto_block_enabled=false`.

Current live smoke status remains `active_single_device_monitoring`.

## 2026-06-23 Final Rebuilt Package Live Smoke Checkpoint

- Active heartbeat monitoring duration: about `12h 22m`.
- Desktop runtime: PASS, PID `36356` running/responding.
- Existing registered binding loaded: yes.
- Rebind needed: no.
- Heartbeat/backend last seen: PASS, `agent_access_devices.last_seen_at=2026-06-23T09:27:29.914Z`.
- Backend read-only check changed DB: no, `changed_db=false`.
- Revoked invite `nxag_live_348dcc2e`: still revoked, `uses=0/1`.
- Netstat flicker recurrence: no visible recurrence.
- PowerShell/cmd/terminal flicker recurrence: no visible recurrence.
- Timer/date display: fixed; `Last heartbeat` and `Last Scan` show `Just now` in final screenshot.
- Full token logged/reported: no.
- Threat Protection v1 warn-only/shadow: preserved.
- `production_ready=false`.
- `auto_block_enabled=false`.

Current live smoke status remains `active_single_device_monitoring`.
