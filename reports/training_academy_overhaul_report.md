# Training Academy Overhaul Report

Date: 2026-06-25

## Summary

Rebuilt the customer dashboard training area at `/dashboard/training` into a functional NexteraAI Security Academy for South African SME/SMME customers.

The new Academy is dashboard-native, role-aware, and structured around practical security readiness rather than a generic LMS. Course content is versioned in TypeScript config. Assignments, progress, and quiz attempts are stored in D1 when migration 29 is applied. If the training tables are not present, the frontend uses an isolated local/dev fallback and clearly displays that database-backed saving requires migration 29.

## Files Created/Updated

Created:

- `src/react-app/training/trainingTypes.ts`
- `src/react-app/training/trainingContent.ts`
- `src/react-app/training/trainingApi.ts`
- `src/react-app/components/training/TrainingModuleCard.tsx`
- `src/react-app/components/training/LessonPlayer.tsx`
- `src/react-app/components/training/QuizCard.tsx`
- `src/react-app/components/training/StaffTrainingProgress.tsx`
- `src/react-app/components/training/TrainingAssignmentModal.tsx`
- `src/react-app/components/training/TrainingReports.tsx`
- `migrations/29.sql`
- `scripts/training-academy-tests.ts`
- `reports/training_academy_overhaul_report.md`

Updated:

- `src/react-app/pages/Academy.tsx`
- `src/worker/index.ts`
- `package.json`

## Dashboard Route

Existing route preserved:

- `/dashboard/training`

Existing dashboard sidebar entry preserved:

- Education -> Academy

## Academy UI Implemented

Implemented views:

- Academy Overview
- Training Modules Library
- Lesson Player
- Reusable Quiz Engine
- Staff Progress
- Assignment Flow
- Training Reports

Overview includes:

- Organisation readiness score
- Completion rate
- Staff enrolled
- Overdue lessons
- Average quiz score
- Recommended next lesson
- Recent activity
- Risk topics needing attention
- Quick actions for assignment, next lesson, and CSV report export

## V1 Training Content

Published full lesson and quiz content for:

- Phishing Basics
- Password Safety
- POPIA Awareness
- Suspicious Attachments
- What To Do When You Receive an Alert

Added library cards for:

- Safe Browsing
- Social Engineering
- Device Hygiene
- Ransomware Awareness
- Remote Work Security

The additional library modules are assignable/planned modules, but their lesson content is intentionally marked as not published yet.

## Educational PDF Integration

Date: 2026-06-25 22:41 SAST

Read and extracted the existing NexteraAI Academy source PDFs from:

- `Academy_Knowlege\NexteraAI-Academy-Module-1-Introduction-to-Cybersecurity.pdf`
- `Academy_Knowlege\NexteraAI-Academy-Module-2-Phishing-Prevention.pdf`
- `Academy_Knowlege\NexteraAI-Academy-Module-3-Password-Management.pdf`
- `Academy_Knowlege\NexteraAI-Academy-Module-4-Data-Privacy-Essentials.pdf`
- `Academy_Knowlege\NexteraAI pdfs quiz and answers.txt`

Extracted text copies were written to:

- `reports\academy_pdf_extracted_text\NexteraAI-Academy-Module-1-Introduction-to-Cybersecurity.txt`
- `reports\academy_pdf_extracted_text\NexteraAI-Academy-Module-2-Phishing-Prevention.txt`
- `reports\academy_pdf_extracted_text\NexteraAI-Academy-Module-3-Password-Management.txt`
- `reports\academy_pdf_extracted_text\NexteraAI-Academy-Module-4-Data-Privacy-Essentials.txt`

Integrated PDF-derived lesson material into:

- `Phishing Basics`
  - South African phishing examples
  - SARS, bank, parcel, supplier, OTP, and invoice-change scenarios
  - phishing warning signs and safe reporting habits
  - expanded quiz coverage
- `Password Safety`
  - passphrase guidance
  - password reuse risk
  - password manager guidance
  - MFA and account-review actions
  - expanded quiz coverage
- `POPIA Awareness`
  - personal information examples
  - eight POPIA conditions
  - Information Officer, privacy notice, data mapping, and breach-escalation basics
  - expanded quiz coverage
- `Suspicious Attachments`
  - fake invoice, ZIP, macro, and double-extension examples
  - safe handling and reporting habits
  - expanded quiz coverage
- `What To Do When You Receive an Alert`
  - confidentiality, integrity, and availability foundations
  - small-business response habits
  - MFA, updates, backups, training, and escalation actions
  - expanded quiz coverage

Source-copy safety decisions:

- Did not copy unsupported product claims from the PDFs.
- Did not claim active AI/ML threat detection.
- Did not claim auto-blocking, quarantine, or destructive security actions.
- Did not claim SOC 2 or ISO 27001 certification.
- Did not claim 24/7 SOC monitoring.
- Kept POPIA wording and added clear non-legal-advice boundaries.

## API Endpoints Added

Added authenticated, organisation-scoped endpoints:

- `GET /api/training/modules`
- `GET /api/training/modules/:slug`
- `GET /api/training/progress/me`
- `POST /api/training/progress`
- `GET /api/training/org/progress`
- `POST /api/training/assignments`
- `GET /api/training/reports/summary`
- `GET /api/training/reports/export.csv`

Access control:

- Auth required through `combinedAuthMiddleware`.
- Organisation scope resolved from session/server-side user context.
- Admin-only:
  - organisation progress
  - assignments
  - CSV export
- Normal users can view and save their own progress.

Security implementation notes:

- Uses parameterised D1 queries.
- Uses `crypto.randomUUID()` for new row IDs.
- Does not trust `orgId` from the client.
- Does not expose another organisation's staff/progress.

## Database Migration

Created forward-only additive migration:

- `migrations/29.sql`

Tables:

- `training_assignments`
- `training_progress`
- `training_quiz_attempts`

Migration safety:

- No destructive SQL.
- No changes to auth, payments, agent registration, billing, or Threat Protection.
- Course content remains in versioned app config.

## Mock / Dev Fallback

Frontend fallback exists in:

- `src/react-app/training/trainingApi.ts`

Fallback behavior:

- Activates only when the new training API/schema is unavailable.
- Displays a visible warning in the Academy.
- Saves progress locally in React state for the current session only.
- Does not claim production persistence when D1 tables are missing.
- Assignment modal remains visible, but database-backed assignments require migration 29.

## Compliance / Claims Review

Avoided unsupported claims:

- No active AI/ML threat detection claim.
- No SOC 2 certification claim.
- No ISO 27001 certification claim.
- No 24/7 SOC monitoring claim.
- No claim that training alone is legally sufficient for POPIA compliance.
- Uses POPIA wording, not GDPR wording.
- Uses South African customer context and ZAR/dashboard terminology where relevant.

Added notice:

```txt
Training supports awareness and internal readiness. It does not replace legal advice, formal POPIA compliance review, or incident response obligations.
```

## Tests Run

- `npm run test:training-academy`: PASS
- `npm run test:agent-invites`: PASS
- `npm run build`: PASS
- `npm run check`: PASS
  - includes TypeScript
  - includes Vite build
  - includes Wrangler dry-run deploy

Focused Training Academy tests cover:

- required module rendering/content presence
- quiz scoring
- pass threshold behavior
- unsupported-claims scan
- migration additive/no destructive SQL check

Post-PDF-integration validation on 2026-06-25:

- `npm run test:training-academy`: PASS
- unsupported-claims source scan across Training Academy content/components: PASS, no hits
- `npm run build`: PASS
- `npm run check`: PASS, including Wrangler dry-run deploy

## Local Preview

Attempted to start:

```txt
npm run dev -- --host 127.0.0.1 --port 5174
```

Result:

- Node/Vite process started.
- No listening port was exposed during the probe window.
- Process was stopped to avoid leaving a stray non-listening dev process.

Local preview URL is therefore not confirmed in this checkpoint.

## Deployment For View

Latest deployment date: 2026-06-25 22:42 SAST

Command:

```txt
npm run deploy
```

Result:

- Deploy: PASS
- Worker: `nexteraai-main-site`
- Current Version ID: `58f2aedb-f583-4e90-a274-dcfb3aa56ea2`
- Workers.dev URL: `https://nexteraai-main-site.y4qe3n.workers.dev`
- Routes:
  - `www.nexteraai.co.za/*`
  - `nexteraai.co.za/*`

Latest uploaded assets:

- `/index.html`
- `/assets/index-D_66wNfF.js`
- `/assets/globe-demo-CtvQbLYj.js`
- `/assets/globe-world-stage-5UsKYZVd.js`

Live smoke:

- `https://www.nexteraai.co.za/dashboard/training`: PASS, HTTP 200, `text/html`
- `https://nexteraai.co.za/dashboard/training`: PASS, HTTP 200, `text/html`
- `https://nexteraai-main-site.y4qe3n.workers.dev/dashboard/training`: PASS, HTTP 200, `text/html`
- `https://www.nexteraai.co.za/api/training/modules` unauthenticated: PASS, HTTP 401

Migration note:

- Migration 29 was not applied in this deploy-for-view checkpoint.
- The Academy can be viewed after login.
- Database-backed assignments/progress require migration 29 before production persistence.

## Known Limitations

- Migration 29 has not been applied remotely.
- Live deployment for view was performed successfully.
- PDF report generation is not implemented; the UI exposes CSV export only.
- Reminder emails are not sent by this Worker; reminder requests are recorded only.
- Five v1 modules have full content/quiz; remaining library modules are visible but not fully published.
- Visual QA in a logged-in browser session remains pending because the local dev server did not expose a listening port during the probe window.

## Production Readiness Status

- `production_ready=false`
- View deployment completed on the existing production dashboard route.
- Remote migration 29 has not been applied, so persistent assignment/progress storage remains pending.
- Ready for owner visual review and migration 29 planning, not wider rollout.

## Final Status

NexteraAI Customer Dashboard Security Academy overhaul is deployed for owner view with PDF-enriched lessons, API, migration, UI, quiz engine, assignment flow, staff progress, reports, and passing build/check validation. Migration 29 application remains pending for database-backed assignment/progress persistence.
