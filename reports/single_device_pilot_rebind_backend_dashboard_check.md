# Single Device Pilot Rebind Backend Dashboard Check

Date: 2026-06-22T22:12:04+02:00

## Result

Status: `dashboard_rebind_visible_with_runtime_heartbeat_blocker`

## Dashboard Evidence

- Dashboard manually open: yes, `/dashboard/agents`
- Owner/admin session visible: yes
- Fresh rebind invite token prefix: `nxag_live_ae8c3281`
- Fresh rebind org ID: `nxorg_4814f052017e70d81c8e68ad0bed695d`
- Fresh rebind invite consumed: yes, `1/1`
- Fresh rebind invite status: `active`
- New registered device visible: yes
- New registered device ID: `nxagent_96a005fe4b637253d22f342203ae0706`
- New registered device name: `yaqeen`
- New registered device status: `active`
- New registered device last seen: `6/22/2026, 10:02:21 PM`
- Prior pilot device still visible: yes
- Prior pilot device ID: `nxagent_63fe237eda8f568cf8436142eb7d7ef3`
- Prior pilot device last seen: `6/22/2026, 11:25:27 AM`

## D1 Read-Only Check

- Command attempted: `npx wrangler d1 execute nextera --remote --config wrangler.json --command "<safe metadata SELECTs>"`
- Target database: `nextera`
- Target binding: `DB`
- Result: blocked by Cloudflare API authentication error.
- Exact error class: `Authentication error [code: 10000]`
- Destructive operation: no
- Token hash selected: no
- Plaintext token selected: no

## Security Notes

- No full agent access token was written to this report.
- Dashboard safe metadata shows invite consumption and registered device visibility.
- The working pilot device was not revoked.
- No production behavior was modified.
