# Limited Internal Pilot Readiness Report

Date: 2026-06-22T12:07:47+02:00

## Deployment Under Test

- Worker version: `74da8235-74a6-49ca-9c7f-cd35932e6ca7`
- Web repo: `F:\NEXTERAAI\APPS\WEB`
- Desktop agent repo: `F:\NEXTERAAI\apps\desktop-agent`
- Desktop EXE: `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\nextera-agent.exe`
- Desktop MSI: `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\bundle\msi\NexteraAI Agent_1.0.0_x64_en-US.msi`

## Passed Checks

- Owner/admin session confirmed: yes, during the prior live smoke.
- Invite generation result: PASS.
- Desktop registration result: PASS.
- Desktop post-registration state: protected Overview screen, Agent Online.
- Invalid-token result: PASS, HTTP 401.
- Logo status: PASS.
- Threat Protection v1 mode: `shadow_or_warn_only`.
- `production_ready=false`.
- `auto_block_enabled=false`.
- Full token reported/logged: no.

## Pending Checks

- Dashboard device visibility result: PASS by manual owner confirmation.
- Backend read-only result: not verified; Wrangler D1 read-only queries timed out.
- Revoke/expired result: FAIL / not proven fail-closed. Owner reported the revoked invite registration was not rejected and no error/status was shown.

## Safety Guardrails

- No rebuild.
- No redeploy.
- No retraining.
- No auth bypass.
- No fake owner session.
- No plaintext token written to reports.
- No quarantine/delete/suppress behavior enabled.
- Threat Protection v1 remains warn-only/shadow.

## 2026-06-24 Final Single-Device Pilot Readiness Update

- Total active monitoring duration: about `44.13` hours.
- Final single-device result: PASS.
- Recommendation: `expand_to_second_internal_device`.
- Scope of expansion: one second internal owner-approved device only.
- Customer rollout: not approved.
- Device Health bridge: PASS.
- Desktop runtime: PASS.
- Heartbeat/backend last_seen_at: PASS, `2026-06-24T17:15:11.777Z`.
- Silent runtime: PASS, `0` visible shell windows.
- Token/private-key scan: PASS.
- Revoked invite safety: PASS.
- Updater scaffold safety: PASS pending real signing key.
- Rollback readiness: present.
- False positives recorded: none.
- Crashes/auth loops recorded: none.
- `production_ready=false`.
- `auto_block_enabled=false`.
- Threat Protection v1 remains warn-only/shadow.

## Final Recommendation

Superseded by corrected retest below.

Historical state before corrected retest: real invite generation, desktop registration, and dashboard device visibility passed, but live revoked-invite registration still needed a corrected retest after clearing the desktop session.

The backend path appeared fail-closed from code review and tests. The corrected retest result is recorded below.

## Pilot Scope If Manually Approved After Device Visibility Confirmation

- One owner-controlled machine only.
- Warn-only/shadow mode only.
- No customer rollout.
- No public production claims.
- Monitor logs for auth failures, token exposure, false positives, crashes, and dashboard device status.
- Review after 24-48 hours before expanding.

## 2026-06-22 Corrected Final Evidence

- Dashboard device visibility: PASS.
- Registered device status: active.
- Registered device last seen: `6/22/2026, 11:25:27 AM`.
- Corrected revoked-invite desktop retest: PASS.
- Fresh revoked token prefix: `nxag_live_348dcc2e`.
- Revoked invite registration rejected: yes.
- Protected Overview reached by revoked invite: no.
- New session stored after revoked invite: no.
- Backend read-only confirmation: PASS, `device_count=0`, `revoked=1`, `uses=0`, `changed_db=false`.
- Full token logged/reported: no.
- Working pilot device untouched: yes.

## Final Recommendation After Corrected Retest

`ready_for_single_device_internal_pilot`

Scope remains one owner-controlled machine only, warn-only/shadow mode only, no customer rollout, no public production claims, and review after 24-48 hours before expanding.

## 2026-06-22 Rebind Evidence Update

- Fresh owner-issued rebind invite generated: yes.
- Fresh rebind token prefix: `nxag_live_ae8c3281`.
- Fresh rebind org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`.
- Desktop rebind result: PASS.
- New registered device ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Dashboard device visible: PASS.
- Dashboard status: active.
- Dashboard last seen: `6/22/2026, 10:02:21 PM`.
- Fresh invite consumed: yes, `1/1`.
- Local desktop binding restored: yes.
- Protected Overview reached: yes.
- Agent Online / healthy heartbeat: BLOCKED, desktop shows `Heartbeat failed: 404 Not Found {"error":"Not found"}` and `Last heartbeat: Never`.
- Remote D1 read-only metadata query: blocked by Cloudflare API authentication error `10000`.
- No rebuild/redeploy/retraining: yes.
- Full token written to reports: no.

## Recommendation After Rebind

`blocked_pending_heartbeat_endpoint_fix`

The one-machine pilot remains limited to the owner-controlled device only, but the 24-48 hour active monitoring clock should not start until the desktop heartbeat is healthy.

## 2026-06-23 Refreshed Package Resume Update

- Refreshed EXE confirmed: yes.
- Refreshed MSI confirmed: yes.
- Desktop launch result: PASS.
- Netstat flicker result: PASS, `0` visible window handles over `95` seconds.
- Existing registered binding loaded: yes.
- Rebind needed: no.
- Current device ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Backend/dashboard data-source last seen: `2026-06-22T22:41:36.654Z`.
- Backend read-only check changed DB: no, `changed_db=false`.
- Revoked invite `nxag_live_348dcc2e`: still revoked, `uses=0/1`.
- Full token logged/reported: no.
- Threat Protection v1 warn-only/shadow: preserved.
- `production_ready=false`.
- `auto_block_enabled=false`.

## Current Recommendation

`active_single_device_monitoring`

Continue the 24-48 hour monitoring window for the same one owner-controlled machine only. Do not expand to another device or customer rollout before review.

## 2026-06-23 Active Monitoring Checkpoint

- Active heartbeat monitoring duration: about `12h 6m`.
- Desktop runtime: PASS, PID `31408` running/responding.
- Heartbeat/backend last seen: PASS, `2026-06-23T09:12:07.042Z`.
- Dashboard/backend status: `active`.
- Revoked invite `nxag_live_348dcc2e`: still revoked, `uses=0/1`.
- Netstat flicker recurrence: no.
- PowerShell/cmd/terminal flicker recurrence: no.
- Timer/date display status: fixed package remains in use.
- Token scan: PASS, no full token pattern found in reports.
- Threat Protection v1: warn-only/shadow preserved.
- `production_ready=false`.
- `auto_block_enabled=false`.
- Blockers: none current.

Current recommendation remains `continue_single_device_monitoring`.

## 2026-06-23 Final Rebuilt Package Checkpoint

- Active heartbeat monitoring duration: about `12h 22m`.
- Desktop runtime: PASS, PID `36356` running/responding.
- Heartbeat/backend last seen: PASS, `2026-06-23T09:27:29.914Z`.
- Dashboard/backend status: `active`.
- Revoked invite `nxag_live_348dcc2e`: still revoked, `uses=0/1`.
- Netstat flicker recurrence: no, `0` visible window handles.
- PowerShell/cmd/terminal flicker recurrence: no, `0` visible shell window handles.
- PowerShell flicker source: identified as NexteraAI USB watcher telemetry query; no visible recurrence after no-window fix.
- Timer/date display status: fixed and visually confirmed.
- Token scan: PASS, no full token pattern found in reports.
- Threat Protection v1: warn-only/shadow preserved.
- `production_ready=false`.
- `auto_block_enabled=false`.
- Blockers: none current.

Current recommendation remains `continue_single_device_monitoring`.
## 2026-06-24 Post-Device Health Bridge Readiness Update

- Recommendation: `continue_single_device_monitoring`.
- Single-device pilot scope remains unchanged.
- Device Health bridge checkpoint: PASS.
- Backend/dashboard heartbeat evidence: PASS, `last_seen_at=2026-06-24T16:58:12.547Z`.
- Silent runtime gate: PASS, `0` visible shell windows over 5-minute monitor.
- Token/private-key scan: PASS.
- Revoked invite safety: PASS, `nxag_live_348dcc2e` remains revoked with `uses=0/1`.
- Updater scaffold: safe but not live-signed; no customer update rollout.
- Expansion beyond one owner-controlled machine: not approved.
- `production_ready=false`.
- `auto_block_enabled=false`.
- Threat Protection v1 remains warn-only/shadow.
