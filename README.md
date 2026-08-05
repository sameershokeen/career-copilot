# Career Copilot 🚀

**Autonomous Job Application Platform** — Frontend, Backend & AI, in one monorepo.

> Pulls live job postings from a centralized Neon database (fed by an already-running
> scraper), matches them to your profile, generates tailored cover letters, and
> bulk-applies on your behalf — with you staying in control only at the approval step.

This README is the single-file map of the whole repo: how it's laid out, how the three
parts talk to each other, every environment variable, the full API contract, the DB
schema, and a changelog of what was fixed to make it actually run end-to-end.

---

## Table of Contents

1. [Architecture at a Glance](#1-architecture-at-a-glance)
2. [Quick Start](#2-quick-start)
3. [Environment Variables](#3-environment-variables)
4. [Repo / Folder Structure](#4-repo--folder-structure)
5. [Part 1 — Frontend (`frontend/`)](#5-part-1--frontend-frontend)
6. [Part 2 — Backend (`backend/`)](#6-part-2--backend-backend)
7. [Part 3 — AI Layer (`ai/`)](#7-part-3--ai-layer-ai)
8. [Shared Types (`shared/`)](#8-shared-types-shared)
9. [The Two-Database Architecture](#9-the-two-database-architecture)
10. [Full API Reference](#10-full-api-reference)
11. [Database Schema](#11-database-schema)
12. [Auto-Apply Pipeline — How It Actually Runs](#12-auto-apply-pipeline--how-it-actually-runs)
13. [Freemium Limits & Rate Limiting](#13-freemium-limits--rate-limiting)
14. [What Was Fixed (Changelog)](#14-what-was-fixed-changelog)
15. [What's Verified vs. What You Still Need to Test](#15-whats-verified-vs-what-you-still-need-to-test)
16. [Known Follow-ups](#16-known-follow-ups)

---

## 1. Architecture at a Glance

```
┌──────────────────────────────────────────────────────────────┐
│ PART 1 — FRONTEND (frontend/)                                 │
│ Next.js 14 App Router · Job Board · Resume Builder ·          │
│ Application Tracker · Community Feed · Resources · AI Tools   │
└──────────────────────┬───────────────────────────────────────┘
                        │ REST API (Bearer JWT from Clerk)
┌──────────────────────▼───────────────────────────────────────┐
│ PART 2 — BACKEND (backend/)                                   │
│ Node.js + Express · Clerk auth · Plan gating · Rate limiter · │
│ In-memory cache · Apply queue · Notifications · Neon Postgres │
└──────────────────────┬───────────────────────────────────────┘
                        │ direct in-process function calls
┌──────────────────────▼───────────────────────────────────────┐
│ PART 3 — AI LAYER (ai/)                                       │
│ Resume Parser · Cover Letter Generator · Match Scorer ·       │
│ Auto-Fill Engine (Playwright) · OpenRouter client             │
└─────────────────────────────────────────────────────────────┘
```

- **One repo, four npm workspaces**: `frontend/`, `backend/`, `ai/`, `shared/`.
- **`shared/`** holds TypeScript types used by both frontend and backend — one source
  of truth, no type drift.
- **The AI layer is never exposed to the internet.** The backend imports its exported
  functions directly (same process) — see [§7](#7-part-3--ai-layer-ai) and
  [§14](#14-what-was-fixed-changelog) for why this matters.
- **Two separate Postgres databases** — see [§9](#9-the-two-database-architecture).

---

## 2. Quick Start

```bash
# from the repo root (the folder containing this README and the root package.json)
npm install

# copy and fill in env vars (see §3) — either one root .env or per-workspace .env files
cp .env.example .env

# run the cc_* table migrations (targets CC_DATABASE_URL only)
npm run db:migrate

# start frontend + backend + ai in parallel
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000` (health check: `GET /health`)
- AI layer: not a server — it's a library imported by the backend process, nothing to
  visit in a browser.

### Building for production

```bash
npm run build   # builds shared → frontend → backend → ai, in that order
```

---

## 3. Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Notes |
|---|---|---|
| `PORT` | no (default `4000`) | |
| `NODE_ENV` | no | `development` \| `production` |
| `FRONTEND_ORIGIN` | yes | used for CORS, e.g. `http://localhost:3000` |
| `CC_DATABASE_URL` | **yes** | Career Copilot's own Postgres — owns every `cc_*` table |
| `SCRAPER_DATABASE_URL` | **yes** | the scraper's Postgres — **read-only**, never written to |
| `CLERK_SECRET_KEY` | **yes** | server-side Clerk key, used to verify session JWTs |
| `CLERK_PUBLISHABLE_KEY` | no | not actually used server-side, kept for parity |
| `CLERK_WEBHOOK_SECRET` | **yes** | verifies the `user.created` webhook signature (svix) |
| `RESEND_API_KEY` | no | email notifications; app runs fine without it, emails just no-op |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER` | no | Pro-tier SMS alerts |
| `ADMIN_API_KEY` | no (default `change_me`) | protects `/api/admin/*` |

### AI Layer (`ai/.env`, or same root `.env` since it's imported in-process by the backend)

| Variable | Required | Notes |
|---|---|---|
| `OPENROUTER_API_KEY` | **yes, for AI features** | app boots fine without it now — see [§14](#14-what-was-fixed-changelog) — but resume parsing, match scoring, cover letters, and auto-fill free-text answers will throw a clear error when actually called until it's set |
| `OPENROUTER_MODEL` | no | default `mistralai/mistral-7b-instruct` (free tier) |
| `OPENROUTER_FALLBACK_MODEL` | no | default `meta-llama/llama-3-8b-instruct` (free tier) |
| `AUTOFILL_HEADLESS` | no (default `true`) | Playwright headless mode |
| `AUTOFILL_TIMEOUT_MS` | no (default `30000`) | per-field fill timeout |

### Frontend (`frontend/.env` / `.env.local`)

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes | e.g. `http://localhost:4000` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | **yes** | Clerk client key |
| `CLERK_SECRET_KEY` | **yes** | used server-side by `@clerk/nextjs` for SSR auth |

---

## 4. Repo / Folder Structure

```
career-copilot/
├── frontend/                  # Part 1 — Next.js (deploy target: Vercel)
│   ├── app/
│   │   ├── (dashboard)/       # sidebar shell: jobs, applications, resume,
│   │   │                      # ai-tools, community, resources, settings
│   │   └── (auth)/            # Clerk sign-in / sign-up
│   ├── components/
│   │   ├── job-board/         # JobCard, JobFilters, JobDrawer
│   │   ├── layout/             # DashboardShell, Sidebar, QueuePanel
│   │   └── ui/                 # shadcn/ui primitives
│   ├── lib/
│   │   ├── api.ts              # SERVER-ONLY (imports @clerk/nextjs/server)
│   │   ├── api-client.ts       # CLIENT-SAFE (no server-only imports) — see §14
│   │   └── queue-context.tsx   # React context, now backed by real API calls
│   └── middleware.ts           # Clerk route protection
│
├── backend/                    # Part 2 — Node.js + Express (deploy target: Railway/Render)
│   └── src/
│       ├── config/              # env.ts, db.ts (the two Pool instances)
│       ├── middleware/          # auth.ts, planGate.ts, rateLimiter.ts, errorHandler.ts
│       ├── routes/              # one file per resource — see §10
│       ├── services/            # cacheStore, jobsEnrich, notify, aiClient, monthlyReset
│       └── db/migrations/       # 001_init_cc_tables.sql + migrate.ts runner
│
├── ai/                          # Part 3 — AI layer (imported in-process, never a server)
│   └── src/
│       ├── services/            # resumeParser, matchScorer, coverLetterGenerator,
│       │                        # autoFillEngine (Playwright), autoFillBulk
│       ├── prompts/              # versioned prompt template strings
│       ├── openrouter/client.ts  # single entry point to the model, primary+fallback
│       └── index.ts              # the ONLY file backend/ is allowed to import from
│
├── shared/                      # TypeScript types shared by frontend + backend
│   └── src/index.ts
│
└── package.json                 # root workspaces config: frontend, backend, ai, shared
```

---

## 5. Part 1 — Frontend (`frontend/`)

**Stack:** Next.js 14 (App Router) · Tailwind CSS · shadcn/ui · Clerk · TypeScript

### Pages (sidebar navigation)
- **Dashboard** — stats overview (jobs browsed, applications sent, queue count, avg match score)
- **Job Board** — all live postings from the scraper DB, with null-safe rendering (a
  field with no data is simply not shown — no "Not specified" placeholders)
- **My Applications** — Kanban tracker (`Queued → Applied → Viewed → Interview → Offer
  → Rejected`) with a collapsible, timestamped log per card
- **Resume Builder** — multi-resume in-app editor, PDF-ready live preview
- **AI Tools** — cover letter generator, match scorer
- **Resources** — roadmaps, tips, guides (DB-backed, no redeploy needed to update)
- **Community** — feed, founder connect (Pro only to post)
- **Settings** — profile, notifications, plan

### The client/server API split (important if you touch `lib/`)
- `lib/api.ts` is **server-only** — it imports `@clerk/nextjs/server`. Only import it
  from Server Components / server actions.
- `lib/api-client.ts` is **client-safe** — no server-only imports, exports
  `createClientApi(token)` for use in `"use client"` components.
- **Never re-export `createClientApi` from `lib/api.ts`.** Even a pure re-export pulls
  the whole module graph (including the server-only Clerk import) into any client
  bundle that touches it, and Next's `server-only` guard will fail the build. Import
  directly from `lib/api-client.ts` in client components.

### The queue
`lib/queue-context.tsx` is a React context that:
1. Hydrates from `GET /api/queue` on mount (so the queue survives a page refresh).
2. Calls `POST /api/queue` on **Add to Queue** and tracks the real `cc_apply_queue` row
   id the backend returns (needed because `DELETE /api/queue/:id` deletes by that row's
   primary key, not by `job_id`).
3. Calls `DELETE /api/queue/:id` on remove, with an optimistic UI update and rollback
   on failure.

---

## 6. Part 2 — Backend (`backend/`)

**Stack:** Node.js + Express + `pg` (raw SQL, no ORM) + Clerk + Zod

### Auth
- Email + Google OAuth via Clerk on the frontend.
- Backend verifies the Clerk session JWT on every protected route via
  `middleware/auth.ts` → `requireAuth`.
- On first sign-in, a Clerk webhook (`POST /api/webhooks/clerk`) creates the matching
  `cc_users` row. There's a brief window where a freshly-signed-up user's token is
  valid but their `cc_users` row doesn't exist yet — `requireAuth` returns a 401 with
  `"User not provisioned yet"` in that case; the frontend should retry shortly.

### Plan gating
`middleware/planGate.ts` wraps feature routes and checks the relevant count on
`cc_users` (`apply_count`, `cover_letter_count`, `resume_count`) against
`FREE_LIMITS` / `PRO_LIMITS`. Returns `402 Payment Required` with an upgrade-prompt
JSON body if the limit is hit. Counts reset on the 1st of each month via
`services/monthlyReset.ts` (in-process scheduler, started at boot).

### Cache
`services/cacheStore.ts` — a singleton `Map`-based cache with per-key TTL, no Redis.
Read-through (check cache → DB miss → populate cache) and write-invalidating (any
mutation deletes the relevant keys). See the TTL table in the original spec doc for
exact key patterns.

### Notifications
`services/notify.ts` — email via Resend, SMS via Twilio (Pro only). Every send is
logged to `cc_notification_logs`, success or failure. The app runs fine without these
API keys configured — notification calls just no-op / log a warning instead of
throwing.

### Two Postgres connections
`config/db.ts` exports two separate `pg.Pool` instances — see [§9](#9-the-two-database-architecture)
for the full explanation. Never mix them: `ccDb` for anything in `cc_*` tables,
`scraperDb` for read-only access to `jobs` / `scrape_runs`.

---

## 7. Part 3 — AI Layer (`ai/`)

**Stack:** Node.js + OpenRouter (free-tier models) + Playwright + `pdf-parse`

The AI layer is **never exposed to the internet** and **never speaks to the frontend**.
`backend/` imports directly from `ai/src/index.ts` — the only file it's allowed to
import from — as an in-process, same-runtime function call (not HTTP). This keeps the
AI layer swappable: changing models, providers, or internal prompt structure never
touches frontend or backend route code.

### Exported functions (`ai/src/index.ts`)
| Function | Used by |
|---|---|
| `parseResume(input)` | `POST /api/ai/parse-resume`, `POST /api/resumes/:id/parse` |
| `computeMatchScore(input)` | `POST /api/ai/match/:jobId` |
| `generateCoverLetter(input)` | `POST /api/ai/cover-letter` |
| `autoFillAndSubmit(input)` | single-application path inside the bulk pipeline |
| `runBulkAutoFill(inputs, options)` | `POST /api/apply/bulk` |

### Model config
- Primary: `mistralai/mistral-7b-instruct` (free on OpenRouter)
- Fallback: `meta-llama/llama-3-8b-instruct` (free on OpenRouter)
- Both swappable via env, zero code changes. `openrouter/client.ts` tries primary,
  falls back once on any failure (timeout, 429, 5xx, empty response), and only
  validates `OPENROUTER_API_KEY` at the moment a model call actually happens — not at
  process startup (see [§14](#14-what-was-fixed-changelog)).

### Auto-Fill Engine
For each approved job: loads the parsed resume + generated cover letter, maps fields to
standard form inputs (name, email, phone, LinkedIn, GitHub, resume URL, cover letter
text), asks the model for free-text answers where needed, then submits via a direct API
if the target ATS exposes one, or a headless Playwright browser otherwise. Every event
is logged; CAPTCHA/bot-detection results in `manual_required` with the pre-filled form
JSON saved for the user to paste by hand.

---

## 8. Shared Types (`shared/`)

Plain TypeScript interfaces, no runtime code. Covers:
- Scraper types (`Job`, `ScrapeRun`) — read-only mirrors of the scraper DB's shape.
- Career Copilot types (`CcUser`, `CcResume`, `CcApplication`, `CcApplicationLog`,
  `CcCoverLetter`, `CcMatchScore`, `CcCommunityPost`, `CcResource`, `UserStatus`,
  `PaginatedResponse<T>`, `JobFilters`, `CoverLetterTone`, etc.)

Both `frontend/` and `backend/` depend on this workspace so the two never drift apart
on wire-format shape.

---

## 9. The Two-Database Architecture

The scraper runs independently and owns its own Postgres database (`jobs`,
`scrape_runs` tables). Career Copilot's `cc_*` tables live in a **separate** Postgres
database. This is intentional and already fully implemented:

- `backend/src/config/db.ts` exports `ccDb` and `scraperDb` as two independent
  `pg.Pool` instances, pointed at `CC_DATABASE_URL` and `SCRAPER_DATABASE_URL`
  respectively.
- Postgres cannot enforce a foreign key across two separate database instances, so
  every `job_id` column on the `cc_*` side (`cc_apply_queue.job_id`,
  `cc_applications.job_id`, `cc_cover_letters.job_id`, `cc_match_scores.job_id`) is a
  plain `BIGINT` with **no FK constraint**.
- Anywhere the UI needs "application + live job details" (the tracker, the queue
  panel), the backend does an **app-level join**: fetch rows from `ccDb`, collect their
  `job_id`s, fetch the matching rows from `scraperDb`, merge in memory. See
  `services/jobsEnrich.ts`.
- If a job later disappears from the scraper DB, historical applications don't break —
  `cc_applications` stores a `job_title_snapshot` / `job_company_snapshot` /
  `job_url_snapshot` taken at apply time, used as a fallback when the live join misses.
- The backend **never writes** to `jobs` or `scrape_runs` — every scraper-side query in
  the codebase is a `SELECT`.

---

## 10. Full API Reference

All routes except `/health` and `/api/webhooks/clerk` require `Authorization: Bearer
<clerk-session-jwt>`. Base URL: `http://localhost:4000` in dev.

| Method | Path | Purpose | Notes |
|---|---|---|---|
| GET | `/health` | liveness check | no auth |
| POST | `/api/webhooks/clerk` | Clerk `user.created` webhook | svix-signed, no bearer auth |
| GET | `/api/jobs` | paginated job list | query: `page, pageSize, region, remote, postedWithin, search`; cached 15 min |
| GET | `/api/jobs/:id` | single job detail | cached 30 min |
| POST | `/api/jobs/search` | same filters, body-based | for complex filter UIs |
| GET | `/api/user/profile` | profile + resume list | |
| PUT | `/api/user/profile` | update profile | invalidates cache |
| GET | `/api/user/status` | plan, counts, limits | |
| GET | `/api/resumes` | list resumes | |
| GET | `/api/resumes/:id` | single resume | |
| POST | `/api/resumes` | create resume | gated: `resume_create` |
| PUT | `/api/resumes/:id` | update resume | every builder save |
| DELETE | `/api/resumes/:id` | delete resume | |
| POST | `/api/resumes/:id/parse` | run builder content through the AI parser | writes `cc_parsed_resumes` |
| GET | `/api/queue` | current pending queue, enriched with live job data | returns `{ queue: [...], count }` |
| POST | `/api/queue` | "Add to Queue" | body: `{ job_id }` |
| DELETE | `/api/queue/:id` | remove entry | `:id` is the **queue row id**, not `job_id` |
| POST | `/api/apply/bulk` | "Bulk Approve & Auto-Apply" | acts on every currently-pending queue entry, no body needed; gated: `auto_apply` |
| GET | `/api/applications` | Kanban tracker list | enriched with live/snapshot job data |
| GET | `/api/applications/:id/logs` | per-application event log | |
| PUT | `/api/applications/:id/status` | manual status override | |
| POST | `/api/ai/parse-resume` | parse raw text/PDF into structured JSON | writes `cc_parsed_resumes` |
| POST | `/api/ai/match/:jobId` | compute match score | requires a parsed resume on file; cached per (user, job) |
| POST | `/api/ai/cover-letter` | generate a cover letter | gated: `cover_letter` |
| PUT | `/api/ai/cover-letter/:id` | edit a generated letter | |
| GET | `/api/community/posts` | feed, paginated | `?page=1`; cached 5 min |
| POST | `/api/community/posts` | create a post | Pro only |
| POST | `/api/community/posts/:id/like` | toggle like | |
| GET | `/api/resources` | roadmaps/tips/guides | `?domain=&category=`; cached 24h |
| GET | `/api/resources/:slug` | single resource | |
| GET/POST | `/api/alerts` | job alert configs | Pro: email + SMS; Free: none |
| `/api/admin/*` | cache-clear, resource seeding | protected by `ADMIN_API_KEY` |

---

## 11. Database Schema

**Scraper DB (read-only from this app):** `jobs`, `scrape_runs` — see the scraper's own
docs for full column definitions.

**Career Copilot DB — every table prefixed `cc_`:**

| Table | Purpose |
|---|---|
| `cc_users` | account, plan, monthly counts |
| `cc_user_profiles` | phone, location, social links, bio, skills |
| `cc_resumes` | every builder-saved resume version (JSONB `content`) |
| `cc_parsed_resumes` | AI-parsed canonical resume JSON, feeds match scoring + cover letters |
| `cc_apply_queue` | pending/approved/removed queue entries |
| `cc_applications` | one row per application attempt, with status + job snapshot |
| `cc_application_logs` | timestamped event log per application |
| `cc_cover_letters` | generated letters, editable before use |
| `cc_match_scores` | per (user, job) computed scores, unique constraint |
| `cc_resources` | roadmaps/tips/guides, DB-backed content |
| `cc_community_posts` / `cc_post_likes` | community feed |
| `cc_alerts` | job alert configs |
| `cc_notification_logs` | every email/SMS sent, success or failure |
| `cc_rate_limit_logs` | every rate-limit hit |
| `cc_schema_migrations` | tracks which `.sql` files have run |

Run `npm run db:migrate` (from root) or `npm run migrate --workspace=backend` to apply
`backend/src/db/migrations/001_init_cc_tables.sql`. The runner is idempotent — already-
applied files are skipped.

---

## 12. Auto-Apply Pipeline — How It Actually Runs

```
User browses Job Board
   │
   ▼
"Add to Queue" → POST /api/queue → row created in cc_apply_queue, frontend
   context updated with the real queue row id
   │
   ▼
Review Queue Panel → optionally DELETE /api/queue/:id to remove entries
   │
   ▼
"Bulk Approve & Auto-Apply" → POST /api/apply/bulk (no body — acts on every
   currently-pending queue entry for this user)
   │
   ▼
Backend: check plan limit → create cc_applications rows (status: queued) →
   mark queue entries 'approved' → build AutoFillJobInput per application
   (parsed resume + latest cover letter for that job, if any)
   │
   ▼
ai/runBulkAutoFill() — processes in parallel batches of 5:
   - CAPTCHA / bot detection → status: manual_required, pre-filled form JSON saved
   - Success → status: applied
   - Network failure → status: failed, retryable from the tracker
   │
   ▼
Every event logged to cc_application_logs · apply_count incremented ·
   summary email sent · response returned as { queued, summary, results }
```

---

## 13. Freemium Limits & Rate Limiting

| Feature | Free | Pro |
|---|---|---|
| Auto-apply / month | 10 | Unlimited |
| AI cover letters / month | 5 | Unlimited |
| AI match score | all jobs | all jobs |
| Resume builder | up to 5 | up to 30 |
| Community posting | ❌ read-only | ✅ |
| Job alerts (email) | ❌ | ✅ |
| Job alerts (SMS) | ❌ | ✅ |

Rate limits (sliding window, `backend/src/middleware/rateLimiter.ts`, no external
dependency, Map-based): `POST /api/ai/*` 20/hr/user · `POST /api/apply/bulk` 5/hr/user ·
`GET /api/jobs` 120/min/user · `POST /api/community/posts` 10/hr/user · auth routes
10/15min/IP · global unauthenticated 60/min/IP. `429` responses include a `Retry-After`
header.

---

## 14. What Was Fixed (Changelog)

This codebase started as three independently-written zips (frontend, backend, ai) that
each looked reasonable in isolation but didn't actually run together. Everything below
was found by real integration testing — installing the workspace, typechecking every
package, running a production `next build`, and booting the backend against a real,
locally-installed Postgres with two separate databases seeded with sample data.

**Install blockers**
- `@radix-ui/react-badge` — doesn't exist on npm (the badge component is a plain
  `<div>`, never actually imports Radix). Removed; it was 404ing `npm install` for the
  entire workspace.
- `next.config.ts` — not supported by the pinned `next@14.2.5` (TS config files are a
  Next 15+ feature). Converted to `next.config.mjs`.

**Frontend ↔ backend contract mismatches** (frontend called routes/methods/shapes the
backend didn't actually have):
- `/api/community/{feed,post,post/:id/like}` → renamed to `/api/community/posts` (+
  `/posts/:id/like`) to match what the frontend was already calling.
- `/api/ai/match-score` (job id in body) → `/api/ai/match/:jobId` (job id in the URL).
- `/api/applications/:id/status` — method was `PATCH`, frontend called `PUT`. Backend
  changed to `PUT`.
- `POST /api/resumes/:id/parse` — didn't exist at all. Added.

**The AI layer was never actually wired up**
- `aiClient.ts` used to be an HTTP client pointed at an `AI_SERVICE_URL` env var that
  was empty by default, so every AI call threw a 501 and bulk-apply silently left every
  application `queued` forever, with no visible error. It now imports `parseResume`,
  `computeMatchScore`, and `generateCoverLetter` directly from `@career-copilot/ai` as
  same-process function calls, matching the architecture the AI layer's own header
  comment always described. `backend/package.json` now actually declares
  `"@career-copilot/ai": "*"` as a workspace dependency.
- The bulk-apply route now genuinely calls `runBulkAutoFill` and persists real
  per-application results instead of a placeholder stub call.

**The queue was never persisted**
- "Add to Queue" only updated local React state — it never called `POST /api/queue`, so
  `cc_apply_queue` stayed empty in the database and bulk-apply had nothing real to act
  on regardless of the route fixes above. `queue-context.tsx` now actually calls the
  backend on add/remove, tracks the real queue-row id (needed for correct deletion),
  and hydrates from the server on mount so the queue survives a page refresh.
- This required splitting `lib/api.ts` (server-only — imports `@clerk/nextjs/server`)
  from a new `lib/api-client.ts` (client-safe), because mixing the two in one module
  broke the Next.js build for any client component that imported anything from it.

**Found via live testing against a real database**
- The backend used to **crash on boot** if `OPENROUTER_API_KEY` wasn't set — because
  the direct AI-layer import (the fix above) meant `ai/src/config.ts`'s eager,
  import-time validation of that env var now ran during the backend's own startup,
  taking down routes that have nothing to do with AI. Fixed: validation is now lazy,
  checked only at the moment an AI feature is actually invoked.
- Unmatched `/api/*` paths returned a misleading `401 "Missing bearer token"` instead
  of a `404`, because `applicationsRouter` was mounted at the bare `/api` prefix, so
  its `requireAuth` middleware intercepted every unrecognized path before Express could
  reach the real 404 handler. Split into `applyRouter` (mounted at `/api/apply`) and
  `applicationsRouter` (mounted at `/api/applications`), each at its actual prefix.

**Minor**
- Fixed a Playwright/TypeScript type error in `autoFillEngine.service.ts` (the AI
  layer's `tsconfig.json` has no `dom` lib, so a DOM-typed callback parameter didn't
  resolve; removed the now-unnecessary tag-name branch entirely — `fill()` works the
  same for inputs and textareas).

---

## 15. What's Verified vs. What You Still Need to Test

**Actually verified, live, against real infrastructure:**
- Clean `npm install` from a fresh unzip of the repo.
- `tsc --noEmit` passes on all four workspaces.
- A real `next build` production build completes and generates all 11 routes.
- `npm run db:migrate` runs successfully against a real, freshly-created Postgres
  database, creating all 15 `cc_*` tables plus the migrations-tracking table.
- The backend boots and stays up without `OPENROUTER_API_KEY` set.
- `GET /api/jobs` correctly reads across two separate Postgres databases and correctly
  hides null fields (tested with a seeded `jobs` table simulating the scraper).
- Protected routes correctly return `401` without a token; unmatched routes correctly
  return `404`; the Clerk webhook correctly returns `400` (not a crash) on an invalid
  signature.
- Direct DB writes/reads against `cc_users` and `cc_resources` round-trip correctly.

**Not testable without your real credentials — verify these yourself before shipping:**
- A fully authenticated request end-to-end (needs a real Clerk-signed JWT, which
  requires your actual Clerk instance — the `requireAuth` code itself was reviewed and
  looks correct, but wasn't exercised with a real token).
- Actual OpenRouter model calls (needs a real `OPENROUTER_API_KEY`).
- Actual Playwright auto-fill against a real job application form.
- Resend / Twilio notification delivery (needs real API keys; the app degrades
  gracefully without them, but delivery itself wasn't tested).

---

## 16. Known Follow-ups

- `next@14.2.5` has a published security advisory (npm flags this on install). Not
  fixed here since it's a version-bump decision that may have its own migration work —
  worth scheduling before production deploy.
- Several other `devDependencies` are past end-of-support (`eslint@8`, old `glob`
  versions) — npm surfaces these as deprecation warnings on install; none block
  functionality but are worth a cleanup pass.
- `AI_SERVICE_URL`-based HTTP invocation was removed from `aiClient.ts` in favor of the
  direct in-process import. If you later want to scale the AI layer (particularly
  Playwright-based auto-fill) as its own separately-deployed service, you'll want to
  reintroduce an env-gated switch between direct import and HTTP call — flag this if
  you want it built.
