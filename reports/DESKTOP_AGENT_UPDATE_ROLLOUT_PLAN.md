# Desktop Agent Update Rollout Plan

Date: 2026-06-24

## Recommendation

updater_scaffold_ready_pending_signing_key

## Pilot stages

1. Local mocked/no-update check.
2. Internal signed update artifact test.
3. Same-machine update smoke.
4. Second internal device update smoke.
5. Staged internal channel.
6. Stable customer channel only after owner review.

## Non-negotiable hold conditions

- Visible shell window recurrence.
- Unsigned update accepted.
- Heartbeat/auth regression.
- Token exposure.
- Threat Protection v1 leaves warn-only/shadow.
- auto_block_enabled changes to true.

