# Live Agent Invite Negative Smoke Report

Date: 2026-06-22T10:46:13+02:00

## Target

- Domain: `https://www.nexteraai.co.za`
- Worker version: `74da8235-74a6-49ca-9c7f-cd35932e6ca7`

## Negative Checks

### Invalid Agent Registration

- Request: `POST https://www.nexteraai.co.za/api/agent/register`
- Payload: valid-looking synthetic `org_id`, intentionally invalid test token, synthetic device fields.
- Result: PASS
- HTTP status: 401
- Interpretation: invalid org/token combinations fail closed.

### Revoked / Expired Invite

- Result: not tested.
- Reason: a real owner invite was used for the successful desktop registration; after that, the Chrome/Brave extension bridge became unavailable before a safe revoke/expired invite flow could be completed.
- Safety decision: did not repeatedly spam the live endpoint or create extra fake sessions.

### Failed Login Session Storage

- Result: partially verified by API behavior and desktop success flow.
- Invalid agent registration returned 401.
- Desktop failed-session storage was not tested directly after Chrome control failed.

## Logging / Token Handling

- No full token was printed in this report.
- The live invalid-token smoke used a synthetic token only.
- Source review found the owner invite flow stores token hashes and token prefixes; the one-time plaintext access token is returned only to the invite creation response.
- New owner invite audit details include `token_prefix`, not the full plaintext token.
- Local NexteraAI app-data log roots were not found during a token-pattern scan, so no plaintext token occurrence was found there.

## Safety Status

- production_ready: false
- auto_block_enabled: false
- auth bypass added: no
- plaintext token stored server-side: no evidence in reviewed owner invite path
- plaintext token logged in this smoke: no
