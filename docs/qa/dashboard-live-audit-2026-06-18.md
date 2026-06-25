# NexteraAI Dashboard Live Audit

Date: 2026-06-18  
Environment: Production, `https://www.nexteraai.co.za`  
Account type tested: owner test account  
Viewport baseline: 1366 x 768, with prior responsive spot checks at 1920, 2560, 900, and 390 widths

## Summary

The owner test login works and the authenticated dashboard shell loads successfully. The main `/dashboard` page now follows the intended modern purple Arena-style direction: compact sidebar, secondary filter rail, ranking table, dense metadata header, and right-side posture card.

All dashboard routes tested returned a browser-level `200` and none showed a React error boundary or horizontal page overflow. The main remaining issue is consistency: most sub-pages inherit the new purple sidebar/topbar, but their page content still uses older dashboard cards, older button treatment, and non-Arena layouts.

## Implementation Update - 2026-06-18

Deployed version: `db20ddd4-aada-40c9-8d98-5396808ced1a`

Fixes implemented and verified live:

- `/api/billing/summary` now returns `200` for the owner test account.
- `/api/billing/invoices?limit=10` now returns `200` for the owner test account.
- `/api/admin/users?limit=100` now returns `200` for the owner test account.
- `/api/organization/logo` now returns `204` when no logo exists instead of `500`.
- Endpoint `Deployment Guide` now opens an in-app deployment guide dialog instead of a broken external DNS target.
- Main dashboard filters now update selected state, hide/show the filter rail, switch ranking/Pareto display, and filter table rows.
- Topbar notification bell now opens a clear empty-state notification menu.
- Missed Calls is labelled as a V2 area in the sidebar and uses the purple dashboard treatment.
- Billing page now distinguishes API load errors from a true empty invoice state.
- Login email/password fields now include autocomplete metadata.
- Live route sweep across dashboard sub-pages returned `200` with no browser console/page errors.
- Mobile smoke at `390px` viewport had `scrollWidth: 390`, confirming no page-level horizontal overflow.

## Routes Tested

| Route | Result | Notes |
| --- | --- | --- |
| `/dashboard` | Loads | Strongest match to the target Arena-style design. |
| `/dashboard/threats` | Loads | Functional table layout, but content styling is still older than the new dashboard. |
| `/dashboard/endpoints` | Loads | Device table loads. Some buttons need fixes, see findings. |
| `/dashboard/email` | Loads | Quarantine table loads. Allow/block manager opens. |
| `/dashboard/missed-calls` | Loads | Displays V2 migration placeholder, not a full feature page. |
| `/dashboard/operations` | Loads | Page loads, but content still needs visual alignment with the new theme. |
| `/dashboard/backups` | Loads | Page loads. Backup/restore actions were not clicked because they can mutate data. |
| `/dashboard/access` | Loads | Login activity visible. No true error state found. |
| `/dashboard/users` | Loads with fallback | User list API returns `403`, then UI falls back to current user. |
| `/dashboard/training` | Loads | Academy page uses older module-card style and still has green/blue accents. |
| `/dashboard/compliance` | Loads | POPIA checklist loads but is not Arena-styled; many action buttons can mutate data. |
| `/dashboard/settings` | Loads | Tabs respond. Save/password actions were not submitted. |
| `/dashboard/billing` | Loads empty state | Billing APIs return `401`, so page shows "No billing records available yet." |
| `/dashboard/support` | Loads | Onboarding checklist loads; first `Go` navigates to POPIA compliance. |
| `/dashboard/onboarding` | Loads | Same onboarding checklist as support route. |

Alias routes checked:

| Route | Result |
| --- | --- |
| `/dashboard/devices` | `200` |
| `/dashboard/datavault` | `200` |
| `/dashboard/popia` | `200` |
| `/dashboard/subscription` | `200` |

## Confirmed Working

- Login succeeds with the owner test account and redirects to `/dashboard`.
- Dashboard shell is present on authenticated pages: sidebar, topbar, account card, and route navigation.
- Direct dashboard deep links return `200`.
- No horizontal overflow was detected during the authenticated crawl.
- Main dashboard links work:
  - `Review incidents` navigates to `/dashboard/threats`.
  - `Check devices` navigates to `/dashboard/endpoints`.
  - `All events` navigates to `/dashboard/threats`.
  - `Manage billing` navigates to `/dashboard/billing`.
- Endpoint `Add New Device` opens a dialog.
- Email `Manage Allow/Block Lists` opens the management panel.
- Settings tabs respond.
- Onboarding `Go` button navigates to the relevant checklist target.

## Findings

### P1 - Billing APIs return unauthorized for the owner test account

Pages affected:

- `/dashboard`
- `/dashboard/billing`

Observed network responses:

- `GET /api/billing/summary` returns `401`.
- `GET /api/billing/invoices?limit=10` returns `401`.

Impact:

The dashboard and Billing page cannot show billing data for this logged-in owner account. The Billing page silently falls back to "No billing records available yet," which makes an authorization/config problem look like an empty account.

Recommended fix:

Ensure billing endpoints accept the same authenticated owner session used by the rest of the dashboard, or display a clear inline error when billing authorization fails.

### P1 - Organization logo endpoint returns server error

Page affected:

- `/dashboard`

Observed network response:

- `GET /api/organization/logo` returns `500`.

Impact:

The dashboard handles the missing logo visually, but the console shows a server error on every dashboard load.

Recommended fix:

Return `404` or `204` when no logo exists. Reserve `500` for true server failures.

### P1 - Deployment Guide target does not resolve

Page affected:

- `/dashboard/endpoints`

Observed:

- The `Deployment Guide` button targets `https://docs.nexteraai.co.za/endpoint-deployment`.
- The hostname `docs.nexteraai.co.za` does not resolve.

Impact:

Users clicking the deployment guide cannot access onboarding instructions.

Recommended fix:

Either configure DNS and deploy docs at `docs.nexteraai.co.za`, or point the button to an existing route/document.

### P2 - Users API returns forbidden for owner account

Page affected:

- `/dashboard/users`

Observed network response:

- `GET /api/admin/users?limit=100` returns `403`.

Impact:

The UI falls back to showing only the current user, but an owner test account should likely be allowed to view organisation users.

Recommended fix:

Align backend authorization with the product role model. If owner should be treated as admin, map owner role through `ensureAdmin` or equivalent middleware.

### P2 - Main dashboard filter controls are visual-only

Page affected:

- `/dashboard`

Controls affected:

- `Hide filters`
- `Ranking`
- `Pareto`
- `Overall`
- `Security`
- `Devices`
- `Email`
- `Compliance`

Observed:

Clicking these controls does not change URL, content, selected state, table data, or visible layout.

Impact:

The UI looks interactive but behaves like a static mockup.

Recommended fix:

Either wire the controls to real state/filtering or render them as non-interactive labels until the filtering is implemented.

### P2 - Topbar notification button is visual-only

Pages affected:

- All dashboard pages

Observed:

Clicking the notification bell does not open a menu, navigate, clear state, or show feedback.

Impact:

The button looks functional but does nothing.

Recommended fix:

Add a notification menu/empty state, or disable/hide the button until notifications exist.

### P2 - Sub-pages do not yet match the new purple Arena visual system

Pages most affected:

- `/dashboard/threats`
- `/dashboard/endpoints`
- `/dashboard/email`
- `/dashboard/operations`
- `/dashboard/backups`
- `/dashboard/access`
- `/dashboard/training`
- `/dashboard/compliance`
- `/dashboard/support`
- `/dashboard/onboarding`

Observed:

The shell is purple and compact, but most page bodies still use older page patterns: large cards, old table/card spacing, old button hierarchy, and mixed accent colors. The main dashboard has many purple class hits and table-first layout, while most sub-pages only have purple from the shell.

Impact:

The product feels inconsistent after navigating away from `/dashboard`.

Recommended fix:

Create shared Arena-style page primitives and migrate sub-pages:

- Compact page header with route title, metadata, and primary actions.
- Dense table/list panels with `rounded-lg`, purple borders, and muted row hover.
- Secondary side/filter rail only where useful.
- Purple/violet primary action color across all modules.
- Remove leftover green/blue/amber accent defaults except for semantic risk/status states.

### P3 - Missed Calls is a placeholder

Page affected:

- `/dashboard/missed-calls`

Observed:

The page says the feature moved to V2 and the UI will return later.

Impact:

The nav exposes a feature that does not currently function as a full page.

Recommended fix:

Either keep it but mark the nav item as `V2 soon`, or hide it until the new workflow is available.

### P3 - Billing empty state masks API errors

Page affected:

- `/dashboard/billing`

Observed:

The page displays "No billing records available yet" even when API calls return `401`.

Impact:

Support/debugging is harder because an auth failure appears as normal empty state.

Recommended fix:

Track non-OK billing responses and render a small error state such as "Billing data could not be loaded."

### P3 - Login page has missing autocomplete metadata

Page affected:

- `/login`

Observed browser warning:

- Password input should include an autocomplete attribute, suggested `current-password`.

Impact:

Minor UX/accessibility issue for password managers.

Recommended fix:

Set `autocomplete="email"` on the email field and `autocomplete="current-password"` on the password field.

## Controls Not Clicked Because They Can Mutate Data

The following controls were identified but not clicked during the live audit to avoid changing production/test-account data:

- Endpoint `Scan`
- Endpoint isolate/protect actions
- Data Vault `New Backup`
- Data Vault `Restore`
- POPIA checklist `Done`
- POPIA checklist `In Progress`
- Settings `Save Changes`
- Settings password/security mutation buttons
- Academy test submission buttons
- User invite submission with a real email

## Recommended Implementation Order

1. Fix `/api/billing/*` authorization and error display.
2. Fix `/api/organization/logo` to return `404` or `204` when no logo exists.
3. Fix `Deployment Guide` target.
4. Wire or disable static dashboard controls and notification bell.
5. Apply the purple Arena design system to all dashboard sub-pages.
6. Decide whether V2 placeholder nav items should stay visible.
7. Add login field autocomplete attributes.

## Evidence Snapshot

Live checks were performed after authenticating into the production dashboard. All checked pages returned `200` at the document level and had no horizontal overflow. Network-level failures were limited to billing authorization, organization logo lookup, and the external deployment docs hostname.
