# Single-Device Internal Pilot Final Report

Timestamp: `2026-06-24T19:15:25+02:00`

## Scope

- Pilot scope: one owner-controlled internal machine only.
- Customer rollout: not approved.
- Public production claims: not approved.
- Threat Protection v1 mode: warn-only/shadow.
- `production_ready=false`.
- `auto_block_enabled=false`.

## Monitoring Duration

- Active monitoring start: `2026-06-22T23:07:37+02:00`.
- Final review timestamp: `2026-06-24T19:15:25+02:00`.
- Total active monitoring duration: about `44.13` hours (`1d 20h 7m`).
- Review window requirement: within 24-48 hours.

## Desktop Runtime Stability

- Desktop process running: yes.
- PID: `35356`.
- Process responding: yes.
- Main window handle present: yes.
- App crash/error observed: no.
- Auth loop/session corruption observed: no.
- EXE path: `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\nextera-agent.exe`.
- MSI path: `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\bundle\msi\NexteraAI Agent_1.0.0_x64_en-US.msi`.
- EXE/MSI rebuilt during this final review: no.

## Device Health Bridge

- Device Health bridge stability: PASS.
- Cards bridge-backed: Agent process, Backend heartbeat, Last scan, CPU usage, Memory usage, Disk usage, Operating system, Signed-in user, FileShield status/reason, ThreatEngine status/reason, NetworkGuard status/reason, BackupModule status/reason.
- Module cards fake healthy: no.
- Remaining limitation: per-module heartbeat timestamps are not exported yet, so module cards remain honest `warning`/`unavailable` states with reasons.
- UI crash on unavailable/warning states: no.

## Heartbeat And Dashboard/Backend

- Heartbeat result: PASS.
- Latest backend active device: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Device name: `yaqeen`.
- Backend status: `active`.
- Backend/dashboard `last_seen_at`: `2026-06-24T17:15:11.777Z`.
- D1 read-only check `changed_db`: `false`.
- Manual dashboard opened in this final review: no.
- Dashboard/device visibility stability: backend active device row remained present and recent; manual dashboard visual confirmation should be repeated before installing on a second device.
- Full token visible: no.
- Safe metadata visible: agent id, device name, status, last_seen_at, session token prefix.

## Revoked Invite

- Revoked invite prefix checked: `nxag_live_348dcc2e`.
- Revoked: yes.
- Uses: `0/1`.
- Devices from revoked invite: `0`.

## Silent Runtime

- Final silent runtime smoke: PASS.
- Runtime monitor duration: 5-minute wall-clock monitor.
- Samples completed: `247`.
- Child shell process observations: `7`.
- Unique child shell processes: `7`.
- Child shell names observed: `NETSTAT.EXE`, `powershell.exe`.
- Child shell source: hidden-helper mediated telemetry paths.
- Visible shell window observations: `0`.
- Visible PowerShell recurrence: no.
- Visible CMD recurrence: no.
- Visible pwsh recurrence: no.
- Visible netstat recurrence: no.
- Visible Windows Terminal/OpenConsole/conhost recurrence: no.
- No flashing panels observed by process/window-handle monitor.

## Updater Scaffold Safety

- Updater plugin initializes without real signing pubkey: no.
- Runtime panic from missing updater pubkey: no recurrence after plugin initialization was withheld.
- Fake signing key present: no.
- Update UI remains blocked/pending signing setup: yes.
- Update endpoint/artifact treated as production-ready: no.
- Private updater signing key material found: no.

## Token And Key Scan

- Bearer token exposure: none found.
- Private key block exposure: none found.
- Full live agent access token exposure: none found.
- Plaintext device token leakage: none found.
- Findings: safe revoked invite prefix/status references and signing-workflow environment variable names only.

## Threat Protection Safety

- Threat Protection v1 warn-only/shadow: preserved.
- Auto-blocking: disabled.
- Quarantine/delete/suppress/block behavior enabled: no.
- Rollback readiness: present in desktop Threat Protection policy/config and Worker rollback reports.
- Raw malware used: no.
- Retraining performed: no.
- Web redeploy performed: no.

## Observations

- False positives observed: none recorded.
- False negatives observed: none recorded.
- Crashes/errors observed: none recorded.
- Performance notes: agent remained alive and responding; CPU seconds increased from normal monitoring work during the 5-minute sample, with no crash or visible shell regression.

## Recommendation

`expand_to_second_internal_device`

Rationale: the single owner-controlled device completed the final 24-48 hour review window with stable heartbeat, stable backend status, clean silent-runtime checks, clean token/private-key scan, no crashes/auth instability, no unsafe Threat Protection behavior, rollback support present, and no customer-facing production claims.

## Boundaries For Next Step

- Expand to one second internal owner-approved device only.
- Keep warn-only/shadow mode.
- Keep `production_ready=false`.
- Keep `auto_block_enabled=false`.
- No customer rollout.
- Repeat dashboard visual confirmation manually before and after second-device install.
- Any visible shell recurrence, token exposure, auth instability, crash loop, or unsafe Threat Protection behavior sets recommendation to `hold_for_fixes`.

