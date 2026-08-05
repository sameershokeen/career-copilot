# Career Copilot — Part 1: Frontend & Dashboard

> Status: ✅ Complete — Next.js dashboard, fully wired to the backend API contract.
> This part **will not run standalone**. It needs `backend/` (Part 2) running on
> `http://localhost:4000` for any real data — job board, applications, resumes, AI
> tools, and community will all show loading/error states until then.

---

## 1. What's in this package

```
career-copilot/
├── frontend/         ← THIS PART — Next.js 14 (App Router)
├── shared/            ← TypeScript types used by frontend AND backend/ai (Part 2/3)
├── package.json       ← root workspaces config (npm workspaces)
├── .env.example        ← every env var the full monorepo needs
└── .gitignore
```

`shared/` is included because the frontend imports types from
`@career-copilot/shared` (e.g. `Job`, `CcApplication`, `PLAN_LIMITS`). When you
add Part 2 (backend) and Part 3 (ai), drop them into the same root folder next
to `frontend/` and `shared/` — the workspace config already expects them there.

---

## 2. Prerequisites

- Node.js ≥ 18.18
- npm ≥ 9 (workspaces support)
- A Clerk account (free tier is fine) → https://clerk.com
- The backend from Part 2 running locally on port 4000 (or a deployed URL)

---

## 3. Setup

```bash
# 1. From the monorepo root
cp .env.example .env

# 2. Fill in .env — for THIS part you only strictly need:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:4000

# 3. Install all workspace deps from the root
npm install

# 4. Build the shared types package first (frontend imports its dist/ output)
npm run build --workspace=shared

# 5. Run the frontend dev server
npm run dev --workspace=frontend
# → http://localhost:3000
```

Once Part 2 (backend) is added, `npm run dev` from the root runs all three
services concurrently (frontend + backend + ai) via `concurrently`.

### Clerk setup specifics
1. Create an application in the Clerk dashboard.
2. Enable **Email** and **Google** as sign-in methods (matches spec §5).
3. Copy the publishable + secret keys into `.env`.
4. Add a webhook endpoint pointing at `{your-backend-url}/api/webhooks/clerk`
   for the `user.created` event — that's what creates the `cc_users` row on
   first sign-in (handled in Part 2, but the webhook must be registered in
   Clerk's dashboard).

---

## 4. Architecture decisions & how things fit together

### App Router structure
```
app/
├── (auth)/                    ← unauthenticated routes, own layout (centered card)
│   ├── sign-in/[[...sign-in]]
│   └── sign-up/[[...sign-up]]
├── (dashboard)/               ← everything behind Clerk auth
│   ├── layout.tsx             ← Sidebar + QueueProvider + DashboardShell
│   ├── page.tsx                ← Dashboard overview (stat cards, quick links)
│   ├── jobs/                  ← Job Board (server page + client component)
│   ├── applications/          ← Kanban tracker
│   ├── resume/                 ← Resume builder (grid of resumes)
│   ├── ai-tools/                ← AI tools hub (links into job drawer flows)
│   ├── community/              ← Feed + composer
│   ├── resources/               ← Roadmaps/guides browser
│   └── settings/                ← Profile, plan usage, alerts
├── layout.tsx                  ← root layout, wraps everything in <ClerkProvider>
└── page.tsx                     ← redirects `/` → `/jobs`
```

Route groups `(auth)` and `(dashboard)` don't affect the URL — they just let
each half of the app have its own layout (centered auth card vs sidebar shell).

### Why server + client split on most pages
Pages like `jobs/page.tsx` are server components (fast first paint, can read
Clerk session server-side) that render a client component
(`JobBoardClient.tsx`) which owns all the interactive state — search, filter
chips, pagination, drawer open/close. This keeps data-fetching logic close to
where it's used without making the whole page a client bundle.

### Auth token flow
- **Server-side** (`lib/api.ts` → `serverFetch`): uses Clerk's `auth().getToken()`
  to attach a bearer token when the fetch happens on the server (e.g. inside a
  Server Component before the page even reaches the browser).
- **Client-side** (`lib/api.ts` → `createClientApi(token)`): client components
  call `useAuth().getToken()` themselves and pass the token in, since
  `auth()` from `@clerk/nextjs/server` isn't available in the browser.

Every backend route in Part 2 is expected to verify this bearer token via
Clerk's JWT verification middleware.

### The Queue system (`lib/queue-context.tsx`)
The "Add to Queue" flow spans multiple components (`JobCard`, `JobDrawer`,
the floating `QueuePanel`), so it's a React Context rather than prop-drilled
state or a fetch-per-click. Queue membership lives in memory client-side
until "Bulk Approve & Auto-Apply" is hit, which is when it actually posts to
the backend (`POST /api/apply/bulk`). This matches the spec's "one human
decision point" design — nothing hits the AI pipeline until that single
approval click.

### Null-safe job rendering (spec §4)
`JobCard.tsx` and `JobDrawer.tsx` follow the table in the spec exactly:
`description`, `skills`, `job_type` are hidden entirely (no "Not specified"
placeholders) when null. `JobDrawer` also implements the raw-JSONB fallback
for `description` (`job.raw?.description`) since that's how the AI match
scorer is documented to behave too.

### Design system
- Dark sidebar (`hsl(222, 47%, 9%)`) against a light dashboard body — deliberate
  contrast so the nav always reads as "control panel" vs. the content area.
- `brand` color scale (blue, 50–950) is the only accent color; status colors
  (emerald/amber/rose) are reserved *only* for application status and match
  scores, never used decoratively, so they stay meaningful.
- All shadcn/ui primitives (`button`, `badge`, `card`, `dialog`, `toast`) are
  copied into `components/ui/` as source — not installed via the shadcn CLI —
  so you can freely edit them without a "diff from upstream" problem.

---

## 5. Component reference

| Component | Purpose |
|---|---|
| `components/layout/Sidebar.tsx` | Fixed left nav, active-route highlighting, Clerk `UserButton` |
| `components/layout/DashboardShell.tsx` | Wraps page content + renders `QueuePanel` + `Toaster` |
| `components/layout/QueuePanel.tsx` | Floating bottom bar, expand/collapse, fires bulk-apply |
| `components/job-board/JobCard.tsx` | Single job in the list — null-safe fields per spec table |
| `components/job-board/JobDrawer.tsx` | Full job detail side panel — match score + cover letter + description |
| `components/job-board/JobFilters.tsx` | Search input + filter chips (India/Remote/Abroad/date) |
| `components/ui/*` | shadcn/ui primitives (button, card, badge, dialog, toast) |
| `lib/api.ts` | Typed fetch wrappers for every backend route, server + client variants |
| `lib/queue-context.tsx` | React Context for in-memory queue state |
| `lib/format.ts` | Date formatting, score-to-color mapping, status labels |

---

## 6. What still needs Part 2 (backend) to actually work

Every one of these currently renders its loading/empty/error state correctly,
but has no real data until the backend exists:

- Job Board search & pagination (`POST /api/jobs/search`)
- Add/remove queue, bulk apply (`/api/queue`, `/api/apply/bulk`)
- Applications Kanban + logs (`/api/applications`, `/api/applications/:id/logs`)
- Resume CRUD (`/api/resumes`)
- AI match score + cover letter (`/api/ai/match/:jobId`, `/api/ai/cover-letter`)
- Community feed, posting, likes (`/api/community/posts`)
- Resources browser (`/api/resources`)
- Settings usage bars (`/api/user/status`)

The exact request/response shapes for all of these are already defined in
`lib/api.ts` and `shared/src/index.ts` — Part 2 just needs to implement
matching Express routes.

---

## 7. Known simplifications (intentional, for this pass)

- Resume Builder currently has a card grid (create/rename/delete) but the
  full multi-section *editor* (experience/projects/education forms) isn't
  built yet — flagged here so it's not mistaken for a bug.
- Settings page's Pro/Free gating (`isPro` in `CommunityClient.tsx`) is
  hardcoded to `false` pending `/api/user/status` wiring — swap in the real
  value once Part 2 is live.
- No optimistic UI rollback on failed mutations yet (e.g. if `likePost`
  fails, the like count doesn't revert) — fine for MVP, worth hardening later.

---

## 8. Next up

**Part 2 — Backend & Infrastructure**: Express API, Clerk JWT middleware,
plan-gating, in-memory cache, rate limiter, all `cc_*` table queries against
Neon. Say the word and I'll build it against this exact frontend contract.
