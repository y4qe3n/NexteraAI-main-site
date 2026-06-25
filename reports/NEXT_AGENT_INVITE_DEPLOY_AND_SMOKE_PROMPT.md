# Next Agent Invite Deploy And Smoke Prompt

You are Codex working on NexteraAI.

Confirmed repos:

- WEB_REPO: `F:\NEXTERAAI\APPS\WEB`
- DESKTOP_AGENT_REPO: `F:\NEXTERAAI\apps\desktop-agent`

Current status:

- Owner-issued desktop-agent invite/auth flow is locally implemented.
- Web invite tests pass.
- Web build passes.
- `npm run check` passes, including Wrangler deploy dry run.
- Desktop `cargo check` passes.
- Desktop `cargo test` passes.
- Desktop EXE and MSI rebuilt successfully.
- Remote D1 migration 28 has not been applied.
- Worker has not been deployed.
- Live API/desktop smoke test is pending.

Hard safety rules:

- Do not enable auto-blocking.
- Do not quarantine/delete/suppress/block customer access.
- Do not disable allowlists.
- Do not mark `production_ready=true`.
- Do not hardcode or log plaintext tokens.
- Preserve Threat Protection v1 shadow/warn-only behavior.

Before deployment:

```powershell
cd F:\NEXTERAAI\APPS\WEB
npm run test:agent-invites
npm run build
npm run check
npx wrangler d1 migrations list nextera --remote --config wrangler.json
```

If owner approves the remote migration:

```powershell
npx wrangler d1 migrations apply nextera --remote --config wrangler.json
```

If migration succeeds and owner approves deploy:

```powershell
npm run deploy
```

After deploy:

1. Log into dashboard as owner/admin.
2. Open `/dashboard/agents`.
3. Create an agent invite.
4. Confirm plaintext token is shown once only.
5. Register rebuilt desktop agent with `org_id` and `agent_access_token`.
6. Confirm device appears in dashboard.
7. Confirm invalid token fails.
8. Confirm no plaintext token is logged/stored.
9. Confirm Threat Protection v1 remains warn-only.

Report results in:

- `F:\NEXTERAAI\APPS\WEB\reports\agent_invite_api_smoke_test_report.md`
- `F:\NEXTERAAI\APPS\WEB\reports\deployment_readiness_agent_invites.md`
- `F:\NEXTERAAI\apps\desktop-agent\reports\desktop_agent_auth_logo_owner_invite_final_report.md`
