# Single Device Internal Pilot Start

Date: 2026-06-22T21:39:48+02:00

## Pilot Status

Pilot status: `active_single_device_monitoring`

NexteraAI has passed the rebind, heartbeat, and dashboard data-source update gates for a one-machine internal pilot. The 24-48 hour runtime monitoring clock can begin for the same owner-controlled machine only.

## Scope

- One owner-controlled internal machine only.
- No customer rollout.
- No public production claims.
- Warn-only/shadow mode only.
- No auto-blocking.
- No quarantine/delete/suppress behavior.
- Review after 24-48 hours of actual registered runtime observation before considering any expansion.

## Device Baseline

- Pilot device identifier: `nxagent_96a005fe4b637253d22f342203ae0706`
- Pilot org: `nxorg_4814f052017e70d81c8e68ad0bed695d`
- Device name: `yaqeen`
- Dashboard/backend status: `active`
- Last seen: `2026-06-22T21:06:27.768Z`
- Last seen currently updating: yes, heartbeat updates `agent_access_devices.last_seen_at`.
- Prior pilot device still visible: `nxagent_63fe237eda8f568cf8436142eb7d7ef3`, last seen `6/22/2026, 11:25:27 AM`.

## Desktop Artifacts

- EXE: `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\nextera-agent.exe`
- MSI: `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\bundle\msi\NexteraAI Agent_1.0.0_x64_en-US.msi`

## Safety State

- Threat Protection v1 mode: `shadow_or_warn_only`
- `production_ready=false`
- `auto_block_enabled=false`
- Rollback support: present
- Allowlist support: present
- Full token logged/reported: no

## Current Monitoring State

The local desktop session/device binding has been restored:

- `C:\Users\yaqee\AppData\Roaming\NexteraAI\Agent\device.json`: present
- `C:\Users\yaqee\AppData\Local\NexteraAI\Agent\device.json`: absent
- Credential Manager device token entry: present
- `device.json` plaintext token field: absent

Heartbeat is healthy after the Worker route fix. The desktop app reaches protected Overview, shows `Agent Online`, and reports `Last heartbeat: Just now`.

## Monitoring Scope

- One owner-controlled machine only.
- Warn-only/shadow mode only.
- No customer rollout.
- No public production claims.
- Review after 24-48 hours before expanding.

## 2026-06-23 Refreshed Package Resume

- Refreshed package in use: yes.
- EXE LastWriteTime: `2026-06-22 23:29:37`.
- MSI LastWriteTime: `2026-06-22 23:29:21`.
- Desktop app launch: PASS.
- Agent process responding: yes, PID `27060`.
- Existing registered binding loaded: yes.
- Rebind needed: no.
- Netstat flicker result: PASS, `0` visible window handles over `95` seconds.
- Dashboard/backend last seen after launch: `2026-06-22T22:41:36.654Z`.
- Backend read-only check changed DB: no, `changed_db=false`.
- Revoked invite `nxag_live_348dcc2e`: still revoked, `uses=0/1`.
- Full token logged/reported: no.
- Threat Protection v1: warn-only/shadow preserved.
- `production_ready=false`.
- `auto_block_enabled=false`.

Pilot status remains `active_single_device_monitoring`.
