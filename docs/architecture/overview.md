# 🏛️ Career Copilot — Architecture Overview

## System Topology

Career Copilot is organized as a high-performance monorepo with strict separation of concerns.

```
[ Frontend: apps/web (Next.js App Router) ]
            │
            ├── HTTP / REST API ──> [ API Service: services/api (Express + TS) ]
            │                                     │
            ├── HTTP / REST API ──> [ AI Engine: services/ai-engine (FastAPI) ]
            │                                     │
            └── Database Access ──> [ Database Package: packages/database (Prisma) ]
                                                  ▲
                                                  │
[ Background Worker: workers/scheduler ]──────────┘
```

## Service Boundaries

| Service | Stack | Port | Role |
|---------|-------|------|------|
| `apps/web` | Next.js, React, Tailwind | 3000 | Frontend dashboard |
| `services/api` | Express, TypeScript | 4000 | Main REST API backend |
| `services/ai-engine` | FastAPI, Python | 8000 | LLM orchestration |
| `workers/scheduler` | Node.js | — | Background cron worker |
