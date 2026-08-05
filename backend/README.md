# Career Copilot — Part 2: Backend

Node.js + Express + Postgres (via `pg`) + Clerk auth. This is a fresh, standalone
`backend/` — not yet wired into a monorepo with `frontend/`/`ai/`.

## 1. What's actually built right now

| Piece | Status |
|---|---|
| Two-DB config (`ccDb`, `scraperDb`) | ✅ working |
| All 15 `cc_*` tables + migration runner | ✅ working |
| Clerk auth middleware + webhook user-provisioning | ✅ working (needs real Clerk keys to test end-to-end) |
| Plan gating (`planGate`) | ✅ working |
| Rate limiter (Map-based sliding window) | ✅ working |
| In-memory cache (`cacheStore`) | ✅ working |
| Jobs read routes (list/detail/search) | ✅ working against a real scraper DB |
| User profile/status routes | ✅ working |
| Resume CRUD | ✅ working |
| Apply queue (add/list/remove) | ✅ working |
| Bulk apply orchestration | ✅ working, but the actual auto-fill step is a **stub** — see §3 |
| Application tracker + logs + manual status update | ✅ working |
| AI routes (parse resume / match score / cover letter) | ⚠️ routes + persistence work; the AI call itself is a **stub** — see §3 |
| Community feed + posts + likes | ✅ working |
| Resources (DB-backed) | ✅ working |
| Job alerts (Pro-gated CRUD) | ✅ working; the hourly cron that actually checks new jobs against alerts is **not built yet** |
| Notifications (Resend/Twilio) | ✅ working if you supply real API keys; logs every send either way |
| Monthly count reset | ✅ working (simple in-process daily-check scheduler — swap for a real cron job in production) |
| Admin (cache clear, resource upsert) | ✅ working, gated by a shared-secret header |

`npm run build` and `npm run typecheck` both pass clean as of this scaffold.

## 2. Two-database architecture (read this first)

The original spec assumed **one** Neon database holding both the scraper's
`jobs`/`scrape_runs` tables and Career Copilot's `cc_*` tables, with real
foreign keys between them (`cc_applications.job_id -> jobs.id`, etc).

Since the scraper actually lives in a **different database instance**, we
can't use real cross-database foreign keys. So:

- **`CC_DATABASE_URL`** → Career Copilot's own DB. Owns every `cc_*` table.
  Full read/write.
- **`SCRAPER_DATABASE_URL`** → the scraper's DB. **Read-only** from this
  backend — we never `INSERT`/`UPDATE`/`DELETE` against `jobs` or
  `scrape_runs`.

What this changes in practice:

1. Every `job_id` column in `cc_*` tables (`cc_apply_queue`, `cc_applications`,
   `cc_cover_letters`, `cc_match_scores`) is a plain `BIGINT` with **no FK
   constraint** — Postgres can't enforce a constraint across two database
   instances.
2. Anywhere the UI needs "application + job details" together (the tracker,
   the queue panel), the backend does an **app-level join**: fetch the
   `cc_*` rows from `ccDb`, collect the `job_id`s, batch-fetch matching rows
   from `scraperDb`, and merge in memory. See `src/services/jobsEnrich.ts`.
3. `cc_applications` also stores a **snapshot** of `job_title` / `job_company`
   / `job_url` at the moment an application is created, so the tracker still
   shows something sane even if that job later disappears from the scraper
   DB (deleted, deduped, whatever).

If you'd rather have real cross-db joins, the alternative is `postgres_fdw`
(foreign data wrapper) so `ccDb` can query `scraperDb`'s tables directly in
SQL — happy to switch to that if you get tired of the app-level join, it's a
bigger lift (needs superuser/extension access on both DBs) but removes the
manual merging code.

## 3. What's deliberately stubbed (waiting on other parts)

- **`src/services/aiClient.ts`** — every AI call (resume parsing, match
  scoring, cover letter generation, auto-fill free-text answers) goes through
  this one module. Right now it throws a `501` unless `AI_SERVICE_URL` is
  set, so the rest of the backend runs and is testable without Part 3
  existing. Once `ai/` is built, either:
  - point `AI_SERVICE_URL` at an HTTP endpoint it exposes, or
  - import its functions directly if you end up running backend + ai in the
    same process/monorepo — no route code changes needed either way.
- **Auto-apply pipeline** (`src/routes/applications.ts` → `processApplication`)
  creates the `cc_applications` rows, logs `"Application queued"`, and
  attempts the real pipeline via `aiClient`. Today that throws 501, which is
  caught and treated as *"leave it queued, not failed"* — so nothing gets
  incorrectly marked `failed` just because the AI layer isn't deployed.
  Once Part 3 ships its Playwright/direct-API auto-fill engine, wire it in
  here.
- **Hourly alert-matching cron** — `cc_alerts` CRUD is done, but the job that
  checks new jobs against active alerts every hour and fires notifications
  isn't written yet (needs the AI layer's match scorer to compute the ≥80%
  threshold for Pro SMS alerts, so it made sense to build after §3's AI
  client is real).
- **Frontend contract** — since Part 1 isn't shared yet, routes were built
  to match the spec doc's field names/shapes as closely as possible. Once
  you share the frontend code (or it stabilizes), I'll reconcile response
  shapes against whatever the actual fetch calls expect — some naming
  (snake_case here vs whatever the frontend uses) will likely need
  adjusting.

## 4. Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in real values
npm run migrate        # creates all cc_* tables in CC_DATABASE_URL
npm run dev             # tsx watch, http://localhost:4000
```

`npm run build && npm start` for a production-style run. `npm run typecheck`
for a quick compile check without emitting.

### Required env vars (see `.env.example` for the full list + comments)

- `CC_DATABASE_URL` — Career Copilot's own Postgres.
- `SCRAPER_DATABASE_URL` — the scraper's Postgres (read-only).
- `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` — from your Clerk dashboard.
- `ADMIN_API_KEY` — shared secret for `/api/admin/*`.
- Everything else (`AI_SERVICE_URL`, Resend, Twilio) is optional; features
  degrade gracefully (501 for AI, logged-as-failed for notifications) if
  left blank, so you can boot the server without every third party wired up.

## 5. API reference

All routes except `/health` and `/api/webhooks/clerk` require
`Authorization: Bearer <clerk_session_jwt>`.

```
POST   /api/webhooks/clerk              Clerk → creates cc_users row on user.created

GET    /api/jobs                        Paginated list (cached 15 min). Query: page, pageSize, region, remote, postedWithin, search
GET    /api/jobs/:id                    Single job (cached 30 min)
POST   /api/jobs/search                 Same filters, body-based

GET    /api/user/profile                Profile + resume list (cached 10 min)
PUT    /api/user/profile                Update profile (invalidates cache)
GET    /api/user/status                 Plan, counts, limits

GET    /api/resumes                     List
GET    /api/resumes/:id                 Detail
POST   /api/resumes                     Create (gated: resume_create)
PUT    /api/resumes/:id                 Update (every builder save)
DELETE /api/resumes/:id                 Delete

GET    /api/queue                       Pending queue, enriched with live job data
POST   /api/queue                       { job_id } — "Add to Queue"
DELETE /api/queue/:id                   Remove from queue

POST   /api/apply/bulk                  { queue_ids: [...] } — "Bulk Approve & Auto-Apply" (gated: auto_apply, rate limited 5/hr)
GET    /api/applications                Kanban tracker, enriched with live/snapshot job data
GET    /api/applications/:id/logs       Timestamped log entries for one application
PATCH  /api/applications/:id/status     Manual status override

POST   /api/ai/parse-resume             { pdf_base64 | raw_text } → stores cc_parsed_resumes
POST   /api/ai/match-score              { job_id } → cached per (user, job)
POST   /api/ai/cover-letter             { job_id, tone } (gated: cover_letter)
PUT    /api/ai/cover-letter/:id         Edit before use

GET    /api/community/feed              Paginated, cached 5 min
POST   /api/community/post              Pro only, rate limited 10/hr
POST   /api/community/post/:id/like     Toggle like

GET    /api/resources                   Cached 24h. Query: domain, category
GET    /api/resources/:slug             Single resource

GET    /api/alerts                      List (Pro only to create, anyone can list their own — empty for free)
POST   /api/alerts                      Pro only
DELETE /api/alerts/:id

POST   /api/admin/cache/clear           Header: x-admin-key. Query: ?prefix=jobs: (optional)
POST   /api/admin/resources             Upsert a resource by slug
```

## 6. Things worth flagging back to you

- **Plan-limit increment semantics for bulk apply**: the spec says "pause
  remaining queue... do not increment count for unprocessed jobs." I
  implemented that as incrementing `apply_count` per batch of 5 as each
  batch finishes processing (not per successful `applied` status) — so a job
  that lands in `manual_required` or gets deferred (AI layer not deployed)
  still counts against the monthly quota, same as a real "attempt." If you'd
  rather only count genuinely `applied` ones, that's a one-line change in
  `applications.ts`.
- **`cc_apply_queue` unique constraint** uses a partial unique index
  (`WHERE status = 'pending'`) so a user can re-queue a job after removing it
  once, but not double-queue the same pending job. Flag if you wanted
  different re-queue behavior.
- I have not touched anything under `frontend/` or `ai/` — this PR is
  backend-only, as requested.
