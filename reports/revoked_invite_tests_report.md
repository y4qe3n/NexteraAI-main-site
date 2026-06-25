# Revoked Invite Tests Report

Date: 2026-06-22

## Test Changes

Updated `scripts\agent-invite-tests.ts` with focused fail-closed coverage for owner-issued agent invites.

## Coverage Added

- Revoked invite cannot register.
- Expired invite cannot register.
- Max-used invite cannot register.
- Wrong `org_id` cannot register.
- Invalid token cannot register.
- Token prefix alone cannot register.
- Failed registration does not create an `agent_access_devices` row.
- Failed registration does not increment `uses`.
- Successful registration increments `uses` only after device creation.
- Manual revoked-invite smoke must clear existing desktop session so an already authenticated state cannot mask a failed registration.

## Result

Command:

```powershell
npm run test:agent-invites
```

Result: PASS.

Output summary:

```txt
agent invite tests passed
```

## Interpretation

The focused tests support that the backend invite registration path is already fail-closed for revoked, expired, max-used, wrong-org, invalid-token, and prefix-only inputs.

## Desktop Test Status

No desktop test was added because no desktop behavior change was made. The investigation found an existing `clear_device_binding` command and a likely manual test flaw: existing stored credentials must be cleared before revoked-invite registration is tested.
