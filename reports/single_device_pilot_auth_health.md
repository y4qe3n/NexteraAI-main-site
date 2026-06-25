# Single Device Pilot Auth Health

Date: 2026-06-22T21:39:48+02:00

## Read-Only Backend Check

Command:

```powershell
npx wrangler d1 execute nextera --remote --config wrangler.json --command "<safe device/invite status SELECT>"
```

Result: PASS.

The query selected only safe metadata fields. It did not select or dump plaintext tokens, `token_hash`, session token hashes, or secrets.

## Device State

- Device row exists: yes
- Agent ID: `nxagent_63fe237eda8f568cf8436142eb7d7ef3`
- Org ID: `nxorg_954ffb8944215d1e8b3efc862c8ab673`
- Device name: `yaqeen`
- Status: `active`
- Last seen: `2026-06-22T09:25:27.284Z`
- Last seen updating during this check: no
- Rows written by check: `0`
- Database changed: no (`changed_db=false`)

## Invite State

- Working pilot invite prefix: `nxag_live_ddf99ca7`
- Working pilot invite uses: `1/1`
- Working pilot invite revoked: no
- Corrected revoked invite prefix: `nxag_live_348dcc2e`
- Corrected revoked invite revoked: yes
- Corrected revoked invite uses: `0/1`
- Earlier revoked invite prefix: `nxag_live_5229a4fc`
- Earlier revoked invite revoked: yes
- Earlier revoked invite uses: `0/1`

## Dashboard Check

- Dashboard UI opened in this run: not rechecked.
- Backend row confirms the device remains listed as active.
- Earlier manual dashboard confirmation remains recorded: device visible, active, last seen `6/22/2026, 11:25:27 AM`.

## Auth Health Interpretation

Backend auth state is safe and consistent, but active pilot runtime monitoring is not yet running because the local desktop session/device binding is absent after the revoked-invite retest.

Next required action: owner-authorized rebind of this same machine, then verify `last_seen_at` updates.

## 2026-06-23 Refreshed Package Auth Health Recheck

Result: PASS.

- Refreshed EXE launched: yes.
- Local registered binding present: yes.
- Device row exists: yes.
- Agent ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`.
- Device name: `yaqeen`.
- Status: `active`.
- Last seen after refreshed package launch: `2026-06-22T22:41:36.654Z`.
- Rows written by check: `0`.
- Database changed by check: no (`changed_db=false`).
- Corrected revoked invite prefix: `nxag_live_348dcc2e`.
- Corrected revoked invite revoked: yes.
- Corrected revoked invite uses: `0/1`.
- Plaintext token field in `device.json`: no.
- Full token logged/reported in refreshed-package reports: no.

Auth health interpretation: the current owner-controlled pilot device is registered, heartbeating, and safe for continued single-device internal monitoring.

## 2026-06-23 Timer/Date Build Auth Health Recheck

Result: PASS.

- Rebuilt desktop package launched: yes.
- Device row exists: yes.
- Agent ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`.
- Device name: `yaqeen`.
- Status: `active`.
- Last seen after rebuilt package launch: `2026-06-22T23:37:42.100Z`.
- Rows written by check: `0`.
- Database changed by check: no (`changed_db=false`).
- Note: one initial device-row read returned Cloudflare authentication error `10000`; the immediate narrow retry succeeded.
- Corrected revoked invite prefix: `nxag_live_348dcc2e`.
- Corrected revoked invite revoked: yes.
- Corrected revoked invite uses: `0/1`.
- Full token pattern scan in reports: PASS, no matches.

Auth health interpretation: the current owner-controlled pilot device remains registered, active, and heartbeating after the timer/date rebuild.

## 2026-06-23 Active Monitoring Auth Health Checkpoint

Result: PASS.

- Check timestamp: `2026-06-23T11:13:25+02:00`.
- Device row exists: yes.
- Agent ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`.
- Device name: `yaqeen`.
- Status: `active`.
- Last seen: `2026-06-23T09:12:07.042Z`.
- Rows written by check: `0`.
- Database changed by check: no (`changed_db=false`).
- Corrected revoked invite prefix: `nxag_live_348dcc2e`.
- Corrected revoked invite revoked: yes.
- Corrected revoked invite uses: `0/1`.
- Token exposure scan in reports: PASS, no full token pattern found.

Auth health interpretation: heartbeat and revoked-invite state remain safe during active single-device monitoring.

## 2026-06-23 Final Rebuilt Package Auth Health Checkpoint

Result: PASS.

- Check timestamp: `2026-06-23T11:29:30+02:00`.
- Device row exists: yes.
- Agent ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`.
- Device name: `yaqeen`.
- Status: `active`.
- Last seen: `2026-06-23T09:27:29.914Z`.
- Rows written by check: `0`.
- Database changed by check: no (`changed_db=false`).
- Corrected revoked invite prefix: `nxag_live_348dcc2e`.
- Corrected revoked invite revoked: yes.
- Corrected revoked invite uses: `0/1`.
- Token exposure scan in reports: PASS, no full token pattern found.
- Desktop process responding: yes, PID `36356`.

Auth health interpretation: the final rebuilt desktop package remains registered, active, and heartbeating safely during the same one-device pilot.

## 2026-06-23 Interim Auth Health Check Before 24h Final Review

Result: PASS.

- Check timestamp: `2026-06-23T13:16:10+02:00`.
- Active heartbeat monitoring duration: about `14h 8m`.
- Final review due: not yet; 24h point is `2026-06-23T23:07:37+02:00`.
- Device row exists: yes.
- Agent ID: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`.
- Device name: `yaqeen`.
- Status: `active`.
- Last seen: `2026-06-23T11:13:36.862Z`.
- Rows written by check: `0`.
- Database changed by check: no (`changed_db=false`).
- Corrected revoked invite prefix: `nxag_live_348dcc2e`.
- Corrected revoked invite revoked: yes.
- Corrected revoked invite uses: `0/1`.
- Token exposure scan in reports: PASS, no full token pattern found.

Auth health interpretation: the same owner-controlled pilot device remains registered, active, and heartbeating; continue monitoring until the 24h review point.
## 2026-06-24 Post-Device Health Bridge Auth/Heartbeat Check

- Check timestamp: `2026-06-24T18:58:30+02:00`.
- Check type: narrow read-only remote D1 verification.
- Command family: `npx wrangler d1 execute nextera --remote --config wrangler.json --command "<read-only SELECT>"`.
- D1 database: `nextera`.
- D1 database id: `8d698c9c-f838-4fa3-b972-2ec5bcee71c0`.
- Read-only `changed_db`: `false`.
- Latest active device row exists: yes.
- Agent id: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Device name: `yaqeen`.
- Device status: `active`.
- Backend/dashboard last_seen_at: `2026-06-24T16:58:12.547Z`.
- Safe session token prefix visible: `nxas_552ec7789c7c7`.
- Full token visible: no.
- Revoked invite checked: `nxag_live_348dcc2e`.
- Revoked invite status: revoked.
- Revoked invite uses: `0/1`.
- Devices from revoked invite: `0`.
- Plaintext token columns queried: no.
- Recommendation: `continue_single_device_monitoring`.

## 2026-06-24 Final Auth/Heartbeat Review

- Final review timestamp: `2026-06-24T19:15:25+02:00`.
- Check type: narrow read-only remote D1 verification.
- D1 read-only `changed_db`: `false`.
- Latest active device row exists: yes.
- Agent id: `nxagent_96a005fe4b637253d22f342203ae0706`.
- Device name: `yaqeen`.
- Device status: `active`.
- Backend/dashboard last_seen_at: `2026-06-24T17:15:11.777Z`.
- Safe session token prefix visible: `nxas_552ec7789c7c7`.
- Full token visible: no.
- Revoked invite checked: `nxag_live_348dcc2e`.
- Revoked invite status: revoked.
- Revoked invite uses: `0/1`.
- Devices from revoked invite: `0`.
- Recommendation: `expand_to_second_internal_device`.
