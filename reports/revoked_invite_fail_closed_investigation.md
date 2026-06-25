# Revoked Invite Fail-Closed Investigation

Date: 2026-06-22

## Scope

Investigated the final evidence-gate issue where the manual second-invite revoke smoke did not prove fail-closed behavior.

## Files Inspected

- `src\worker\agent-auth.ts`
- `src\worker\index.ts`
- `migrations\28.sql`
- `src\react-app\pages\AgentDevices.tsx`
- `F:\NEXTERAAI\apps\desktop-agent\src-tauri\src\core\auth.rs`
- `F:\NEXTERAAI\apps\desktop-agent\src-tauri\src\main.rs`
- `F:\NEXTERAAI\apps\desktop-agent\src\App.tsx`

## Backend Findings

- Invite creation stores `token_hash` and `token_prefix`, not plaintext token.
- Owner invite list sanitizes `token_hash`.
- Revoke handler sets `revoked = 1` and `revoked_at` for the matching `invite_id` and `organization_id`.
- Agent registration looks up invites by both `org_id` and `token_hash`.
- Agent registration rejects revoked, expired, and max-used invites before issuing a session or creating a device row.
- `uses` increments only after device creation succeeds.
- Token prefix alone is never accepted by the registration path.

## Desktop Findings

- On startup, the desktop agent calls `load_bound_device()` and starts the protected runtime when stored credentials exist.
- `App.tsx` calls `get_agent_config` and routes directly to `ProtectionCenter` if a stored device config exists.
- A manual revoked-invite smoke can therefore be masked by a previous successful registration unless the tester first clears/signs out the stored device binding.
- A Tauri command exists for clearing binding: `clear_device_binding`.

## Root Cause Classification

Backend bug found: no.

Most likely root cause: flawed manual smoke procedure. The already registered desktop session was not clearly cleared before testing the revoked second invite, so the app could remain on or return to the protected Overview screen without exercising revoked-invite registration.

## Required Corrected Retest

1. Generate a fresh second invite.
2. Record only masked org ID, token prefix, and expiry.
3. Revoke that second invite.
4. Clear/sign out desktop agent binding before testing.
5. Confirm the desktop app is back on the Agent access login screen.
6. Submit the revoked invite org ID and token.
7. Expected result: registration fails, no protected Overview screen, no new device row, no session stored.

## Safety Status

- production_ready: false
- auto_block_enabled: false
- Threat Protection v1 warn-only/shadow unchanged
- Full token logged/reported: no
