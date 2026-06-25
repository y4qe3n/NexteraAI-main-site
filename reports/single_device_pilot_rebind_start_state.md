# Single Device Pilot Rebind Start State

Date: 2026-06-22T21:45:00+02:00

## Scope

Pre-rebind confirmation for the one-machine internal pilot.

## Confirmed State

- Backend pilot device row exists: yes.
- Backend pilot device status: `active`.
- Pilot agent ID: `nxagent_63fe237eda8f568cf8436142eb7d7ef3`.
- Pilot org ID: `nxorg_954ffb8944215d1e8b3efc862c8ab673`.
- Last seen before rebind: `2026-06-22T09:25:27.284Z`.
- Revoked invites remain revoked: yes.
- Corrected revoked invite prefix: `nxag_live_348dcc2e`.
- Corrected revoked invite uses: `0/1`.
- Earlier revoked invite prefix: `nxag_live_5229a4fc`.
- Earlier revoked invite uses: `0/1`.
- Local desktop binding absent: yes.
- Desktop expected state before rebind: Agent Access login screen.

## Safety State

- production_ready: false
- auto_block_enabled: false
- Threat Protection v1: warn-only/shadow
- Customer rollout: no
- Second device pilot: no
- Full token logged/reported: no

## Required Next Step

Generate a fresh owner-issued invite from the authenticated dashboard and bind only this owner-controlled machine.
