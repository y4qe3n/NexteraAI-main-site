# Revoked Invite Backend Read-Only Confirmation

Date: 2026-06-22T19:24:00+02:00

## Scope

Read-only remote D1 confirmation after the corrected desktop revoked-invite retest.

## Command

```powershell
npx wrangler d1 execute nextera --remote --config wrangler.json --command "<safe count/status SELECT>"
```

The executed SELECT returned only counts and safe invite status fields. It did not select or dump `token_hash`, session token hashes, plaintext tokens, or secrets.

## Result

- D1 database: `nextera`
- D1 binding: `DB`
- Fresh revoked invite org: `nxorg_fe80aeae31017d5c69ebad308dc5c45b`
- Fresh revoked invite token prefix: `nxag_live_348dcc2e`
- Device rows created for revoked invite: `0`
- Invite revoked flag: `1`
- Invite uses after rejected registration: `0`
- Query success: yes
- Database changed: no (`changed_db=false`)

## Interpretation

The live backend did not create a device row and did not consume the revoked invite during the corrected desktop retest.

## Safety Status

- No auth bypass.
- No token hash dumped.
- No plaintext token logged/reported.
- No production data changed by the confirmation query.
