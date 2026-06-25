# Heartbeat Route Alignment Investigation

Date: 2026-06-22T23:07:37+02:00

## Finding

Root cause: desktop runtime posted heartbeat to `/agent/heartbeat`, but the deployed Worker did not expose a matching heartbeat route. The registered device was valid, but heartbeat returned `404 Not Found`.

## Contract Confirmed

- Desktop production base URL: `https://www.nexteraai.co.za`
- Desktop heartbeat URL before fix: `{agent_base_url}/agent/heartbeat`
- Desktop heartbeat auth: `X-Device-Token` header with the returned agent session token
- Registration route: `POST /api/agent/register`
- Registration table: `agent_access_devices`
- Session storage server-side: `session_token_hash`, not plaintext
- Dashboard device listing source: `agent_access_devices`

## Required Table

Heartbeat must update `agent_access_devices`, not legacy `agent_devices`.

## Safe Fix Chosen

Added backend heartbeat support for:

- `POST /agent/heartbeat`
- `POST /api/agent/heartbeat`

Both routes share one handler and validate the hashed registered session token.

## Safety

- No D1 migration needed.
- No destructive SQL.
- No invite-token security change.
- No plaintext token storage.
- No token logging.
- No Threat Protection v1 behavior change.
- `production_ready=false`
- `auto_block_enabled=false`
