# Next Live Pilot Validation Prompt

You are Codex working on NexteraAI.

Confirmed repos:

- WEB_REPO: `F:\NEXTERAAI\APPS\WEB`
- DESKTOP_AGENT_REPO: `F:\NEXTERAAI\apps\desktop-agent`
- ML_LAB: `C:\Users\yaqee\OneDrive\Desktop\NexteraAI-ML\nexteraai-ml-pipeline`

Current deployed state:

- Remote D1 migration 28 applied.
- Worker deployed.
- Worker version: `74da8235-74a6-49ca-9c7f-cd35932e6ca7`
- Live unauthenticated owner endpoints correctly return 401.
- Live invalid agent registration correctly returns 401.
- `/dashboard/agents` returns HTML with HTTP 200.

Important implementation note:

- Production already had a legacy `agent_devices` table.
- Owner-issued invite registration now uses additive table `agent_access_devices`.
- Do not repurpose or delete legacy `agent_devices` unless a later migration plan explicitly covers it.

Hard safety rules:

- Do not enable auto-blocking.
- Do not quarantine/delete/suppress/block customer access.
- Do not disable allowlists.
- Do not mark `production_ready=true`.
- Do not hardcode or log plaintext tokens.
- Preserve Threat Protection v1 shadow/warn-only behavior.

Manual live pilot steps:

1. Log into the owner dashboard.
2. Open `/dashboard/agents`.
3. Generate an agent invite.
4. Confirm the plaintext token is shown once only.
5. Launch the rebuilt desktop agent:
   - `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\nextera-agent.exe`
   - or install `F:\NEXTERAAI\apps\desktop-agent\src-tauri\target\release\bundle\msi\NexteraAI Agent_1.0.0_x64_en-US.msi`
6. Register using the generated `org_id` and one-time token.
7. Confirm the device appears in `/dashboard/agents`.
8. Confirm invalid token fails.
9. Confirm no full token is logged.
10. Confirm Threat Protection v1 remains warn-only.

Update these reports:

- `F:\NEXTERAAI\APPS\WEB\reports\live_agent_invite_api_smoke_report.md`
- `F:\NEXTERAAI\apps\desktop-agent\reports\desktop_live_registration_smoke_report.md`
- `C:\Users\yaqee\OneDrive\Desktop\NexteraAI-ML\nexteraai-ml-pipeline\reports\NEXTERAAI_ML_LAB_MASTER_STATUS.md`
