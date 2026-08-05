# Where each file goes

Every file below keeps its real path from the repo root (`career-copilot/`).
Drop each one into your project at that same path, overwriting what's there.

```
frontend/package.json
frontend/next.config.mjs          ← new file; also DELETE frontend/next.config.ts
backend/package.json
ai/package.json
ai/src/config.ts
ai/src/openrouter/client.ts
ai/src/services/autoFillEngine.service.ts
backend/src/index.ts
backend/src/services/aiClient.ts
backend/src/routes/community.ts
backend/src/routes/ai.ts
backend/src/routes/resumes.ts
backend/src/routes/applications.ts
backend/src/routes/queue.ts
backend/src/routes/jobs.ts
frontend/lib/api.ts
frontend/lib/api-client.ts        ← new file
frontend/lib/queue-context.tsx
frontend/app/(dashboard)/jobs/JobBoardClient.tsx
frontend/components/layout/QueuePanel.tsx
frontend/components/job-board/JobDrawer.tsx
frontend/app/(dashboard)/community/CommunityClient.tsx
frontend/app/(dashboard)/applications/ApplicationsClient.tsx
```

The last four (`QueuePanel.tsx`, `JobDrawer.tsx`, `CommunityClient.tsx`,
`ApplicationsClient.tsx`) only differ from your current versions by one import
line — `@/lib/api` → `@/lib/api-client` — nothing else in them changed.

After copying everything in: stop `npm run dev` completely and restart it
(don't rely on hot-reload for the config/package.json changes), and run
`npm install` again since `backend/package.json` and `frontend/package.json`
both changed.
