# Desktop Update Release Workflow

Date: 2026-06-24

## Required release workflow

1. Build desktop agent from reviewed source.
2. Sign updater artifact with Tauri updater private key held outside git.
3. Upload artifact to R2/CDN over owner-controlled release path.
4. Add public release metadata to `DESKTOP_UPDATE_RELEASES_JSON`.
5. Verify endpoint returns `204` for current version and `200` for older internal pilot version.
6. Run same-machine update smoke.
7. Run second internal device smoke.
8. Keep stable customer channel empty until owner approval.

## Current blocker

No real signing key or signed updater artifact is configured yet.

