# Live Heartbeat Smoke Report

Date: 2026-06-22T23:07:37+02:00

## Result

Status: `pass`

## Live Checks

- Desktop agent launched: yes
- Existing registered binding loaded: yes
- Heartbeat route deployed: yes
- Desktop Agent Online: yes
- Desktop last heartbeat: `Just now`
- Protected Overview reached: yes
- D1 device row updated: yes
- Device ID: `nxagent_96a005fe4b637253d22f342203ae0706`
- Org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`
- D1 status: `active`
- D1 last seen after heartbeat: `2026-06-22T21:06:27.768Z`
- D1 updated at after heartbeat: `2026-06-22T21:06:27.768Z`
- Dashboard data source table: `agent_access_devices`
- Dashboard visual refresh: browser focus/tab interference prevented a clean final visual capture, but D1 source used by dashboard updated.

## Negative Checks

- Missing auth on `/agent/heartbeat`: HTTP 401 PASS
- Missing auth on `/api/agent/heartbeat`: HTTP 401 PASS
- Revoked invite token heartbeat: covered by focused tests; live full revoked token was not reused or printed.

## Safety

- Full token logged/reported: no
- Plaintext device token in `device.json`: no
- Threat Protection v1 warn-only/shadow: preserved
- `production_ready=false`
- `auto_block_enabled=false`
- Quarantine/delete/suppress behavior observed: no

## 2026-06-23 Refreshed Package Heartbeat Recheck

- Refreshed desktop package launched: yes.
- Agent process responding: yes, PID `27060`.
- Existing registered binding loaded: yes.
- Device ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`.
- Rebind needed: no.
- D1 read-only check: PASS.
- D1 query changed database: no, `changed_db=false`.
- Dashboard data-source table: `agent_access_devices`.
- D1 status: `active`.
- D1 last seen after refreshed package launch: `2026-06-22T22:41:36.654Z`.
- Revoked invite prefix `nxag_live_348dcc2e`: revoked yes, uses `0/1`.
- Token exposure check: no full token reported; `device.json` has no plaintext token field.
- Current pilot status: `active_single_device_monitoring`.

## 2026-06-23 Timer/Date Build Heartbeat Recheck

- Rebuilt desktop package launched: yes.
- Agent process responding: yes, PID `17024`.
- Existing registered binding loaded: yes.
- D1 read-only device check: PASS after one transient Cloudflare auth `10000` retry.
- D1 query changed database: no, `changed_db=false`.
- Dashboard data-source table: `agent_access_devices`.
- D1 status: `active`.
- D1 last seen after timer/date build launch: `2026-06-22T23:37:42.100Z`.
- Revoked invite prefix `nxag_live_348dcc2e`: revoked yes, uses `0/1`.
- Token exposure scan: PASS, no full token pattern found in reports.
- Current pilot status: `active_single_device_monitoring`.

## 2026-06-23 Interim Heartbeat Check Before 24h Final Review

- Check timestamp: `2026-06-23T13:16:10+02:00`.
- Active heartbeat monitoring duration: about `14h 8m`.
- Final review due: not yet; 24h point is `2026-06-23T23:07:37+02:00`.
- Desktop process running/responding: yes, PID `36356`.
- Existing registered binding loaded: yes.
- Heartbeat result: PASS.
- D1 read-only device check: PASS.
- D1 query changed database: no, `changed_db=false`.
- Dashboard data-source table: `agent_access_devices`.
- D1 status: `active`.
- D1 last seen: `2026-06-23T11:13:36.862Z`.
- Revoked invite prefix `nxag_live_348dcc2e`: revoked yes, uses `0/1`.
- Netstat flicker recurrence: no visible window recurrence.
- PowerShell/cmd/pwsh/terminal flicker recurrence: no visible window recurrence.
- Token exposure scan: PASS, no full token pattern found in reports.
- Current pilot status: `active_single_device_monitoring`.

## 2026-06-23 Active Monitoring Heartbeat Checkpoint

- Check timestamp: `2026-06-23T11:13:25+02:00`.
- Desktop process running/responding: yes, PID `31408`.
- Existing registered binding loaded: yes.
- Heartbeat result: PASS.
- D1 read-only device check: PASS.
- D1 query changed database: no, `changed_db=false`.
- Dashboard data-source table: `agent_access_devices`.
- D1 status: `active`.
- D1 last seen: `2026-06-23T09:12:07.042Z`.
- Revoked invite prefix `nxag_live_348dcc2e`: revoked yes, uses `0/1`.
- Netstat flicker recurrence: no.
- PowerShell/cmd/terminal flicker recurrence: no.
- Token exposure scan: PASS, no full token pattern found in reports.
- Current pilot status: `active_single_device_monitoring`.

## 2026-06-23 Final Rebuilt Package Heartbeat Checkpoint

- Check timestamp: `2026-06-23T11:29:30+02:00`.
- Desktop process running/responding: yes, PID `36356`.
- Existing registered binding loaded: yes.
- Heartbeat result: PASS.
- D1 read-only device check: PASS.
- D1 query changed database: no, `changed_db=false`.
- Dashboard data-source table: `agent_access_devices`.
- D1 status: `active`.
- D1 last seen: `2026-06-23T09:27:29.914Z`.
- UI screenshot confirms `Agent Online` and `Last heartbeat: Just now`.
- Revoked invite prefix `nxag_live_348dcc2e`: revoked yes, uses `0/1`.
- Netstat flicker recurrence: no visible window recurrence.
- PowerShell/cmd/terminal flicker recurrence: no visible window recurrence.
- Token exposure scan: PASS, no full token pattern found in reports.
- Current pilot status: `active_single_device_monitoring`.
## 2026-06-24 Post-Bridge Live Heartbeat Smoke

- Check timestamp: `2026-06-24T18:58:30+02:00`.
- Desktop agent PID: `35356`.
- Desktop agent path: `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\nextera-agent.exe`.
- Heartbeat result: PASS.
- Heartbeat failed 404 observed: no.
- Backend latest device status: `active`.
- Backend last_seen_at: `2026-06-24T16:58:12.547Z`.
- Dashboard/device visibility inferred from backend row: active registered device row present.
- Full token visible: no.
- Safe metadata visible: agent id, device name, status, last_seen_at, session token prefix only.
- D1 read-only `changed_db`: `false`.
- Recommendation: `continue_single_device_monitoring`.

## 2026-06-24 Final Live Heartbeat Review

- Final review timestamp: `2026-06-24T19:15:25+02:00`.
- Desktop agent PID: `35356`.
- Heartbeat result: PASS.
- Heartbeat failed 404 observed: no.
- Backend latest device status: `active`.
- Backend last_seen_at: `2026-06-24T17:15:11.777Z`.
- Dashboard/device visibility stability: backend active registered device row present and recent.
- Full token visible: no.
- Safe metadata visible: agent id, device name, status, last_seen_at, session token prefix only.
- D1 read-only `changed_db`: `false`.
- Recommendation: `expand_to_second_internal_device`.
