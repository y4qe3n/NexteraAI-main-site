# Live Agent Invite Revoke Smoke Report

Date: 2026-06-22T12:07:47+02:00

## Scope

Safe revoked/expired invite verification for the owner-issued desktop-agent invite/auth flow.

## Preferred Safe Test

1. Generate a second invite.
2. Record only masked org ID and token prefix.
3. Revoke the second invite before use.
4. Try registration with the revoked invite.
5. Confirm registration fails.
6. Confirm failed registration stores no session.

## Result

- Revoke smoke tested: no.
- Expired invite smoke tested: no.
- Reason: dashboard control became unavailable before a safe second-invite revoke flow could be completed.
- Existing registered pilot device was not revoked or deactivated.
- Production rows modified by this check: no.

## Existing Negative Coverage

- Invalid-token registration was already tested and rejected with HTTP 401.
- Real owner invite generation passed.
- Real desktop registration passed.

## Safety Status

- No auth bypass.
- No fake owner session.
- No full token logged or reported.
- No customer access blocked.
- No device revoked.

## Status

Revoked/expired invite verification remains pending and should be completed before expanding beyond a single controlled internal device.

## 2026-06-22 Manual Owner Confirmation

- Second invite generated: yes.
- Second invite token prefix: `nxag_live_5229a4fc`.
- Second invite masked org: `nxorg_f44c49...710402`.
- Second invite revoked: yes.
- Revoked invite registration rejected: no.
- Error/status shown: none.
- Working pilot device untouched: not confirmed; owner response was ambiguous (`yes/no`).
- No full token logged/reported: not confirmed; owner response was ambiguous (`yes/no`).

## Updated Status

Revoked invite rejection: FAIL / not proven fail-closed.

This remains blocking for final pilot readiness. Do not expand beyond the already controlled owner machine until the revoked-invite path is fixed or retested and shown to reject registration.

## 2026-06-22 Investigation Update

- Backend bug found: no.
- Backend `/api/agent/register` checks revoked, expired, max-used, `org_id`, and token hash before issuing a session.
- Focused tests now prove revoked/expired/max-used/wrong-org/invalid-token/prefix-only inputs fail without creating device rows or incrementing uses.
- Most likely cause of the manual smoke failure: the desktop app still had a stored session from the successful pilot registration.
- Required retest: clear/sign out desktop binding first, confirm the Agent access login screen is shown, then submit a freshly revoked second invite.

## Retest Status

Live revoked-invite retest after clearing desktop state: PASS.

## 2026-06-22 Corrected Live Retest

- Desktop binding cleared/sign-out equivalent performed: yes.
- Method: minimal local binding clear, not backend device revoke.
- Agent Access login screen confirmed before test: yes.
- Fresh second invite generated: yes.
- Fresh second invite token prefix: `nxag_live_348dcc2e`.
- Fresh second invite org: `nxorg_fe80aeae31017d5c69ebad308dc5c45b`.
- Fresh second invite expiry: `6/25/2026, 7:20:14 PM`.
- Fresh second invite revoked before use: yes.
- Dashboard revoked status visible: yes.
- Revoked invite submitted from clean desktop Agent Access login: yes.
- Registration rejected: yes.
- Error/status shown: `Authentication failed`.
- Protected Overview reached: no.
- New session/device binding stored locally: no.
- Working pilot device untouched: yes.
- Full token logged/reported: no.
- Clipboard cleared after submit: yes.

## Backend Read-Only Confirmation

- Command: `npx wrangler d1 execute nextera --remote --config wrangler.json --command "<safe count/status SELECT>"`
- D1 database: `nextera`
- D1 binding: `DB`
- Result: PASS.
- `agent_access_devices` count for fresh revoked org: `0`.
- Invite `revoked`: `1`.
- Invite `uses`: `0`.
- D1 changed: no (`changed_db=false`).

## Final Status

Revoked invite rejection is now proven fail-closed from a cleared desktop state.
