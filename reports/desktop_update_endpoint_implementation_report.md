# Desktop Update Endpoint Implementation Report

Date: 2026-06-24

## Implemented

- Added `src/worker/desktop-update.ts`.
- Added endpoint routes in `src/worker/index.ts`.
- Added `scripts/desktop-update-tests.ts`.
- Added `npm run test:desktop-updates`.

## Endpoint safety

- No update is served unless metadata is signed and HTTPS.
- Missing signature release is ignored.
- Pilot channel metadata does not leak to stable.
- Private signing key is never returned.
- Default state is `204 No Content`.

## Deployment

- Worker deployed: no
- Dry-run validation: pass

