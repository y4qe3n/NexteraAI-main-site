## My new app

This app was created using https://getmocha.com.
Need help or want to join the community? Join our [Discord](https://discord.gg/shDEGBSe2d).

To run the dev server:
```
npm install
npm run dev
```

### Local dashboard preview mode

Use this only for local dashboard design and QA when you need demo data without logging in.

Create `.env.local`:

```txt
VITE_DASHBOARD_PREVIEW_MODE=true
```

Then run:

```txt
npm run dev
```

Open:

- `http://localhost:5173/dashboard`
- `http://localhost:5173/dashboard/training`
- `http://localhost:5173/dashboard/training/modules`
- `http://localhost:5173/dashboard/training/reports`
- `http://localhost:5173/dashboard/devices`
- `http://localhost:5173/dashboard/alerts`
- `http://localhost:5173/dashboard/compliance`
- `http://localhost:5173/dashboard/billing`

Disable preview mode by removing `VITE_DASHBOARD_PREVIEW_MODE=true` from `.env.local` or setting it to `false`.

Safety: preview mode only activates in Vite development builds and is ignored on `www.nexteraai.co.za`, `nexteraai.co.za`, and `auth.nexteraai.co.za`. Production authentication is unchanged.

**Google sign-in (local):** Copy `.dev.vars.example` to `.dev.vars` and add your Mocha Users Service URL and API key from your [Mocha project](https://getmocha.com). Without these, login will show "OAuth not configured".

**Email sign-in:** Run `npx wrangler d1 migrations apply DB --local` to create the auth tables. Passwords use Argon2id. Email login uses OTP 2FA (7-digit code sent to your email, valid 5 min). Set `RESEND_API_KEY` in `.dev.vars` for real emails (see `.dev.vars.example`). View users at `/dashboard/users`.
