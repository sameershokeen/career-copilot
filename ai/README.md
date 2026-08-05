# Career Copilot — AI Layer (Part 3)

Node.js service. **Not exposed to the internet.** `backend/` imports directly
from `ai/src/index.ts` — never call this over HTTP, never import from anywhere
inside `ai/src/` except the barrel file.

```ts
import {
  parseResume,
  computeMatchScore,
  generateCoverLetter,
  autoFillAndSubmit,
  runBulkAutoFill,
} from "../ai/src/index.js";
```

## Setup

```bash
cd ai
npm install
npx playwright install chromium   # one-time, for the auto-fill engine
cp .env.example .env               # fill in OPENROUTER_API_KEY
```

## Models

Primary and fallback models are both free-tier on OpenRouter and are
env-injected (`OPENROUTER_MODEL`, `OPENROUTER_FALLBACK_MODEL`). Every call
through `openrouter/client.ts` tries the primary model first and transparently
retries once on the fallback if the primary errors, times out, or returns an
empty response. Swapping providers/models later is a `.env` change only.

## Feature map

| Function | Backend calls when… | Persists to |
|---|---|---|
| `parseResume(input)` | User uploads/saves a resume | `cc_parsed_resumes` |
| `computeMatchScore(input)` | User clicks "Compute Match" | `cc_match_scores` (unique per user_id, job_id — cache/recompute only on resume update) |
| `generateCoverLetter(input)` | User clicks "Generate Cover Letter" | `cc_cover_letters` |
| `autoFillAndSubmit(input)` | Single job in the apply pipeline | `cc_applications` + `cc_application_logs` |
| `runBulkAutoFill(jobs, opts)` | "Bulk Approve & Auto-Apply" | Same, batched 5-at-a-time |

## Null-description handling

`computeMatchScore` and `generateCoverLetter` both resolve job description
text as: `job.description` → `job.raw["description"]` (JSONB fallback) →
absent. `computeMatchScore` returns `low_confidence: true` with a zeroed
score and an explanatory `summary` when no text is available at all, per
the spec. Pass the job's raw JSONB blob as `job.raw` so the fallback works.

## Auto-fill engine behavior

- **CAPTCHA / bot detection** → status `manual_required`, `prefilledData`
  contains everything the engine managed to fill before bailing, for the
  user to paste in manually.
- **Network failure** (`net::`, `ECONNRESET`, timeout, etc.) → status
  `failed`, immediately eligible for one-click retry from the tracker.
- **Other page/API errors** → one retry after a 30s backoff, then `failed`
  if it recurs.
- **Plan limit hit mid-batch** → pass `canProceed` to `runBulkAutoFill`;
  returning `false` pauses the rest of the queue without running (and
  without incrementing `apply_count` for) the remaining jobs.

`resumePdfUrl` file-upload wiring is stubbed as a marker in
`autoFillEngine.service.ts` — Playwright's `setInputFiles` needs a local
path, so the backend should download the resume PDF to a temp path before
calling `autoFillAndSubmit` and pass that path through. Left this as an
explicit TODO rather than guessing at your temp-file convention.

Field-selector matching in `autoFillFieldMap.ts` covers common
Greenhouse/Lever/generic-HTML patterns. Portals with unusual markup will
fall through more fields to `manual_required` — that's expected; extend the
selector lists per-portal as you encounter them rather than over-fitting
upfront.

## Prompts

All prompt text lives in `src/prompts/*.prompt.ts` as versioned template
strings/functions (`_PROMPT_VERSION` exports), matching section 9 of the
spec exactly. Bump the version constant whenever you change wording so
logged outputs can be traced back to the prompt that produced them.
