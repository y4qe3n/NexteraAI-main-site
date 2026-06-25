# Backend Device Visibility Read-Only Check

Date: 2026-06-22T12:07:47+02:00

## Scope

Read-only production D1 confirmation for the desktop agent registered through the owner-issued invite/auth flow.

## Commands Attempted

```powershell
npx wrangler d1 execute nextera --remote --config wrangler.json --command "SELECT COUNT(*) AS device_count FROM agent_access_devices;"
```

```powershell
npx wrangler d1 execute nextera --remote --config wrangler.json --command "SELECT agent_id, substr(org_id,1,12) || '...' || substr(org_id,-6) AS org_masked, device_name, status, agent_version, app_version, first_seen_at, last_seen_at FROM agent_access_devices ORDER BY created_at DESC LIMIT 1;"
```

## Result

- Backend read-only confirmation: not available.
- Reason: both narrow read-only Wrangler D1 queries timed out.
- Rows modified: no.
- Full token hashes dumped: no.
- Plaintext tokens printed: no.

## Interpretation

The backend check did not fail semantically; it was unavailable due to command timeout. I did not keep retrying against production.

## Status

Backend device visibility confirmation remains pending.
