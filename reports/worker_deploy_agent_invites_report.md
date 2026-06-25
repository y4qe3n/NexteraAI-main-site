# Worker Deploy - Agent Invites Report

Date: 2026-06-22

## Command Run

```powershell
npm run deploy
```

Repo script:

```powershell
wrangler deploy --config wrangler.json
```

## Result

PASS

## Deployment Output

- Worker: `nexteraai-main-site`
- Worker URL: `https://nexteraai-main-site.y4qe3n.workers.dev`
- Routes:
  - `www.nexteraai.co.za/*`
  - `nexteraai.co.za/*`
- Version ID: `74da8235-74a6-49ca-9c7f-cd35932e6ca7`
- Startup time: 15 ms

## Bindings Confirmed

- `env.BILLING_DO`
- `env.DB (nextera)`
- `env.R2`
- `env.ASSETS`

## Rollback Notes

- Use Cloudflare Worker version rollback if the deployed Worker has a runtime issue.
- The D1 migration is additive and does not remove legacy tables.

## Safety Status

- production_ready: false
- auto_block_enabled: false
- Threat Protection v1 touched: no
