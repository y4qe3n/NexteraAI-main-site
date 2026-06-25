# Desktop Update Endpoint Validation Report

Date: 2026-06-24

## Tests

- `npm run test:desktop-updates`: PASS
- `npm run build`: PASS
- `npm run check`: PASS, including Wrangler dry-run deploy

## Covered behavior

- Older current version receives signed pilot metadata.
- Same current version returns no update.
- Invalid target/arch rejected.
- Missing signature is not served.
- Pilot channel does not leak to stable channel.
- No private key is exposed.

## Safety status

- production_ready=false
- auto_block_enabled=false
- No customer rollout recommended.

