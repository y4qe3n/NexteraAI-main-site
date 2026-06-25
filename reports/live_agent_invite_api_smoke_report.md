# Live Agent Invite API Smoke Report

Date: 2026-06-22

## Deployment Under Test

- Worker: `nexteraai-main-site`
- Version ID: `74da8235-74a6-49ca-9c7f-cd35932e6ca7`
- Domain: `https://www.nexteraai.co.za`

## Safe Live Checks

### Unauthenticated Owner Invite Create

- Request: `POST https://www.nexteraai.co.za/api/owner/agent-invites`
- Auth: none
- Result: PASS
- HTTP status: 401
- Interpretation: owner invite creation requires authentication.

### Unauthenticated Owner Device List

- Request: `GET https://www.nexteraai.co.za/api/owner/agent-devices`
- Auth: none
- Result: PASS
- HTTP status: 401
- Interpretation: owner device list requires authentication.

### Invalid Agent Registration

- Request: `POST https://www.nexteraai.co.za/api/agent/register`
- Payload: intentionally invalid `org_id` and token
- Result: PASS
- HTTP status: 401
- Interpretation: invalid org/token pair is rejected.

### Dashboard Route

- Request: `GET https://www.nexteraai.co.za/dashboard/agents`
- Result: PASS
- HTTP status: 200
- HTML returned: yes

## Authenticated Owner Invite Smoke

Blocked from CLI because no owner/admin session cookie or test helper was available in this environment.

I did not bypass authentication, seed credentials, or hardcode tokens.

## Remaining Manual Smoke Steps

1. Log into the dashboard as owner/admin.
2. Open `/dashboard/agents`.
3. Create an agent invite.
4. Confirm `org_id`, `invite_id`, `token_prefix`, one-time plaintext `agent_access_token`, and `expires_at` are shown.
5. Confirm only token hash and prefix are stored server-side.
6. Register the desktop agent with the generated `org_id` and one-time access token.
7. Confirm the device appears in the owner device list.
8. Confirm invalid/revoked/expired token attempts fail.
9. Confirm full plaintext token is not logged.

## Safety Status

- production_ready: false
- auto_block_enabled: false
- auth bypass added: no
- plaintext token printed in this report: no
