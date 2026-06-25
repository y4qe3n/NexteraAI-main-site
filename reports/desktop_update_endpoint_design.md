# Desktop Update Endpoint Design

Date: 2026-06-24

## Endpoint

- `GET /api/agent/update/windows/x86_64/:currentVersion?channel=pilot`
- `GET /api/agent/update?target=windows&arch=x86_64&current_version=1.0.0&channel=pilot`

## Behavior

- Returns `204 No Content` when no signed update is configured or available.
- Returns `200 OK` with Tauri updater metadata only for a newer signed release.
- Rejects unsupported target/arch/channel/version requests.
- Requires HTTPS artifact URLs.
- Requires a non-empty signature.
- Does not return private signing keys or secrets.
- Supports channels: `pilot`, `internal`, `stable`.
- Defaults to `pilot`.

## Configuration

Release metadata is read from `DESKTOP_UPDATE_RELEASES_JSON`. This must contain only public release metadata: version, notes, date, channel, target, arch, artifact URL, and signature.

No private signing keys belong in Worker config, reports, logs, or JSON status files.

