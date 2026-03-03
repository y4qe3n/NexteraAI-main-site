# Todo

## PayFast Integration ✅ COMPLETE

1. ✅ PayFast create-payment endpoint (POST /api/payfast/create-payment → MD5 signature, form data, redirect URL)
2. ✅ PayFast IPN webhook (POST /api/payfast/webhook → verify signature, handle COMPLETE, update subscription/token)
3. ✅ Payment success page (/payment/success → verify transaction → show confirmation)
4. ✅ Payment cancel page (/payment/cancel → show error/retry)
5. ✅ Subscription management endpoints (GET /api/subscription, POST /api/subscription/cancel, GET /api/payments)
6. ✅ DB migration: migrations/13.sql (subscriptions, payments, payfast_tokens, rate_limits tables)
7. 🔧 **MANUAL**: Test full payment flow in PayFast sandbox
8. 🔧 **MANUAL**: Switch PayFast to live mode (set PAYFAST_SANDBOX=false, use production credentials)

**ENV VARS NEEDED**: PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE, PAYFAST_SANDBOX=true, APP_URL

## Ozow Integration ✅ COMPLETE

1. ✅ Ozow create-payment endpoint (POST /api/ozow/create-payment → SHA512 hash, redirect)
2. ✅ Ozow webhook (POST /api/ozow/webhook → update payment + subscription)
3. 🔧 **MANUAL**: Register at ozow.com, get credentials, test in sandbox

**ENV VARS NEEDED**: OZOW_SITE_CODE, OZOW_API_KEY, OZOW_PRIVATE_KEY, OZOW_IS_TEST=true

## Dashboard ✅ ALL COMPLETE

1. ✅ **Dashboard** - Complete (UI + API)
2. ✅ **Threat Radar** - Complete (UI + API)
3. ✅ **Compliance Hub** - Complete (UI + API)
4. ✅ **Endpoint Shield** - Complete (UI + API for device management)
5. ✅ **Email Guard** - Complete (UI + API for email quarantine)
6. ✅ **Access Control** - Complete (UI + API for login activity)
7. ✅ **Data Vault** - Complete (UI + API for backups)
8. ✅ **Academy** - Complete (UI + API for training modules)
9. ✅ **Settings** - Complete (UI + API for user settings persistence)
10. ✅ **Missed Call Follow-up** - Complete (UI + API + Africa's Talking)
11. ✅ **Onboarding Checklist** - Complete (/dashboard/onboarding — dynamic checklist)

## Missed Call Follow-up ✅ COMPLETE

- ✅ Settings page: /dashboard/missed-call-settings (toggle, SMS template, virtual number, test SMS)
- ✅ Logs page: /dashboard/missed-calls (table, stats, CSV export)
- ✅ Webhook POST /api/missed-call-webhook (Africa's Talking call events)
- ✅ SMS reply webhook POST /api/missed-call-sms-callback (opt-out handling)
- ✅ CRUD for settings, logs, opt-outs
- ✅ DB migration: migrations/12.sql (missed_call_settings, missed_call_logs, sms_opt_outs)
- ✅ Landing page updated: features + pricing tiers

**ENV VARS NEEDED**: AT_API_KEY, AT_USERNAME (use "sandbox" for testing), AT_SENDER_ID (optional)
**Africa's Talking Voice Callback URL**: https://yourapp/api/missed-call-webhook
**SMS Callback URL**: https://yourapp/api/missed-call-sms-callback

## Backend ✅ ALL COMPLETE

1. ✅ Backend structure (Cloudflare Worker + Hono framework + D1 database)
2. ✅ User auth: registration, login, Argon2id password hashing, session management, protected routes
3. ✅ 7-digit email OTP 2FA (generate, hash, verify, resend, rate limiting, lockout)
4. ✅ PayFast integration (create-payment, webhook, signature verification, subscription upsert)
5. ✅ Ozow integration (create-payment, webhook, SHA512 hash verification)
6. ✅ Database schema (users, organizations, payments, subscriptions, devices, threats, compliance, etc.)
7. ✅ CRM Missed Call Follow-up (webhook, SMS via Africa's Talking, rate limiting, opt-out)
8. ✅ Security headers (X-Content-Type-Options, X-Frame-Options, XSS-Protection, Referrer-Policy, Permissions-Policy)
9. ✅ Rate limiting utility (D1-backed checkRateLimit function)
10. ✅ Input validation on all auth endpoints (email regex, password length, lockout after 5 failed attempts)
11. ✅ Onboarding checklist API (GET /api/onboarding)

## Manual / External Tasks (Cannot be automated)

- 🔧 Design & finalize logo (purple-black scheme, cybersecurity/AI theme)
- ✅ Landing page complete (features, pricing, contact form, scroll animations)
- 🔧 Record short training videos for Academy section
- 🔧 Beta test with 3-5 Johannesburg small businesses
- 🔧 Monitor early metrics (MRR, churn, CAC)
- 🔧 Set env vars in Cloudflare dashboard for production
- 🔧 Plan v2 features (TOTP 2FA, Sage integration, advanced AI alerts, white-label)
