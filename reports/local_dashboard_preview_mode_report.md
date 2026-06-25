# Local Dashboard Preview Mode Report

Date: 2026-06-25

## Summary

Added a local-only dashboard preview mode for reviewing customer dashboard pages without real authentication, email OTP, account creation, payment setup, or production session cookies.

Preview mode is controlled by:

```txt
VITE_DASHBOARD_PREVIEW_MODE=true
```

It only activates in Vite development mode and is blocked in production builds and on production NexteraAI hostnames.

## Files Changed

- `src/react-app/lib/preview/previewMode.ts`
- `src/react-app/lib/preview/demoSession.ts`
- `src/react-app/lib/preview/demoOrg.ts`
- `src/react-app/lib/preview/demoDashboardData.ts`
- `src/react-app/lib/preview/demoTrainingData.ts`
- `src/react-app/lib/preview/installPreviewFetch.ts`
- `src/react-app/components/dev/PreviewModeBanner.tsx`
- `src/react-app/lib/AuthContext.tsx`
- `src/react-app/App.tsx`
- `src/react-app/pages/Academy.tsx`
- `README.md`
- `.env.local`
- `reports/local_dashboard_preview_mode_report.md`

## How To Enable

Create:

```txt
.env.local
```

with:

```txt
VITE_DASHBOARD_PREVIEW_MODE=true
```

Then run:

```txt
npm run dev
```

## How To Disable

Remove the variable from `.env.local` or set:

```txt
VITE_DASHBOARD_PREVIEW_MODE=false
```

Then restart the dev server.

## Demo Session

Preview mode seeds:

- User: `Demo Admin`
- Email: `demo.admin@nexteraai.local`
- Role: `org_admin` normalized to dashboard admin access
- Organisation: `Demo Organisation`
- Plan: `Pro`
- Country: `South Africa`
- Status: `active`

## Demo Data

Preview mode includes:

- 8 demo devices
- 3 demo alerts
- 5 published Training Academy modules
- 4 staff members
- realistic training progress, assignments, due dates, and quiz scores
- POPIA compliance status cards/checklist data
- billing plan and invoice data

Training modules covered:

- Phishing Basics
- Password Safety
- POPIA Awareness
- Suspicious Attachments
- What To Do When You Receive an Alert

## Safety Guard

Preview mode requires all of the following:

- `import.meta.env.DEV === true`
- `VITE_DASHBOARD_PREVIEW_MODE === "true"`
- current hostname is not `www.nexteraai.co.za`
- current hostname is not `nexteraai.co.za`
- current hostname is not `auth.nexteraai.co.za`
- production build is not active

If a production hostname tries to enable preview mode, the request is ignored. A warning is logged only in development.

Production Worker authentication and `combinedAuthMiddleware` were not changed.

## Routes Added / Tested

Routes wired for local preview:

- `/dashboard`
- `/dashboard/training`
- `/dashboard/training/modules`
- `/dashboard/training/reports`
- `/dashboard/devices`
- `/dashboard/alerts`
- `/dashboard/compliance`
- `/dashboard/billing`

Preview banner:

```txt
Local Preview Mode - demo data only
```

## Training Academy Persistence Status

Training Academy Status: CONTENT + UI DEPLOYED, PERSISTENCE PENDING

The Training Academy redesign and PDF-enriched lesson content are deployed and viewable at `/dashboard/training`. Build, checks, training tests, Wrangler dry-run, and unsupported-claims scan all pass. Unauthenticated API access correctly returns `401`.

Production readiness remains false because migration 29 has not yet been applied remotely. Assignment, progress, quiz attempt, and report persistence must be verified after the migration is applied.

## Tests Run

- `npm run test:training-academy`: PASS
- `npm run build`: PASS
- `npm run check`: PASS
  - TypeScript: PASS
  - Vite build: PASS
  - Wrangler dry-run deploy: PASS

Local preview server:

- Command: `npm run dev -- --host 127.0.0.1 --port 5173`
- Env: `VITE_DASHBOARD_PREVIEW_MODE=true`
- Result: PASS
- Listening: `127.0.0.1:5173`
- Listening PID at validation time: `10440`

HTTP route smoke:

- `http://127.0.0.1:5173/dashboard`: PASS, HTTP 200
- `http://127.0.0.1:5173/dashboard/training`: PASS, HTTP 200
- `http://127.0.0.1:5173/dashboard/training/modules`: PASS, HTTP 200
- `http://127.0.0.1:5173/dashboard/training/reports`: PASS, HTTP 200
- `http://127.0.0.1:5173/dashboard/devices`: PASS, HTTP 200
- `http://127.0.0.1:5173/dashboard/alerts`: PASS, HTTP 200
- `http://127.0.0.1:5173/dashboard/compliance`: PASS, HTTP 200
- `http://127.0.0.1:5173/dashboard/billing`: PASS, HTTP 200

Browser-rendered preview smoke:

- `/dashboard/training`: PASS
  - preview banner visible: yes
  - Security Academy visible: yes
  - Demo Admin visible: yes
  - login screen visible: no
- `/dashboard`: PASS
  - preview banner visible: yes
  - Demo Admin visible: yes
  - login screen visible: no
- `/dashboard/training/modules`: PASS
  - preview banner visible: yes
  - Demo Admin visible: yes
  - login screen visible: no
- `/dashboard/training/reports`: PASS
  - preview banner visible: yes
  - Demo Admin visible: yes
  - login screen visible: no
- `/dashboard/devices`: PASS
  - preview banner visible: yes
  - Demo Admin visible: yes
  - login screen visible: no
- `/dashboard/alerts`: PASS
  - preview banner visible: yes
  - Demo Admin visible: yes
  - login screen visible: no
- `/dashboard/compliance`: PASS
  - preview banner visible: yes
  - Demo Admin visible: yes
  - login screen visible: no
- `/dashboard/billing`: PASS
  - preview banner visible: yes
  - Demo Admin visible: yes
  - login screen visible: no

## Production Readiness

- `production_ready=false`
- Production auth weakened: no
- Production preview mode possible: no
- Demo data stored server-side: no
- Demo data persisted to production D1: no
