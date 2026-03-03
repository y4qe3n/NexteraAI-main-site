## My new app

This app was created using https://getmocha.com.
Need help or want to join the community? Join our [Discord](https://discord.gg/shDEGBSe2d).

To run the dev server:
```
npm install
npm run dev
```

**Google sign-in (local):** Copy `.dev.vars.example` to `.dev.vars` and add your Mocha Users Service URL and API key from your [Mocha project](https://getmocha.com). Without these, login will show "OAuth not configured".

**Email sign-in:** Run `npx wrangler d1 migrations apply DB --local` to create the auth tables. Passwords use Argon2id. Email login uses OTP 2FA (7-digit code sent to your email, valid 5 min). Set `RESEND_API_KEY` in `.dev.vars` for real emails (see `.dev.vars.example`). View users at `/dashboard/users`.
