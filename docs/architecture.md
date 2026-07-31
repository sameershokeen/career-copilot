# 🏛️ Career Copilot Architecture Overview

## 1. System Topology & Monorepo Structure

Career Copilot is organized as a high-performance monorepo with strict separation of concerns across frontend applications, AI/ML microservices, backend microservices, shared data packages, and background cron workers:

```
[ Frontend: apps/web (Next.js / React) ]
            │
            ├── HTTP / REST API ──> [ AI Engine: services/ai-engine (FastAPI / Python) ]
            │                                     │
            ├── HTTP / REST API ──> [ Job Engine: services/job-engine (Express / Node.js) ]
            │                                     │
            └── Database Access ──> [ Database Package: packages/database (Prisma ORM) ]
                                                  ▲
                                                  │
[ Background Worker: workers/scheduler (Node.js) ]─┘
```

---

## 2. Core Service Boundaries

### `apps/web`
- **Role**: Next.js App Router frontend dashboard.
- **Responsibilities**: User dashboard, interactive resume ATS match visualizer, job discovery interface, cover letter studio, mock interview roleplay simulator.

### `services/ai-engine`
- **Role**: Python FastAPI microservice for LLM orchestration.
- **Responsibilities**:
  - Semantic resume parsing and skill extraction.
  - ATS scoring algorithm & keyword gap detection.
  - Automated cover letter generation tailored to company job specs.
  - Interview question generation & response grading.

### `services/job-engine`
- **Role**: Node.js / Express microservice.
- **Responsibilities**: Job search API, candidate application tracker status management, location & workplace filter handling.

### `packages/shared`
- **Role**: Shared TypeScript interface library.
- **Responsibilities**: Common data structures (`UserProfile`, `JobListing`, `JobMatchAnalysis`, `MockInterviewSession`).

### `packages/database`
- **Role**: Prisma ORM database models and migrations.
- **Responsibilities**: Models for `User`, `Resume`, `Job`, `Application`, `InterviewSession`, `InterviewQuestion`.

### `workers/scheduler`
- **Role**: Node.js background cron job processor.
- **Responsibilities**: Daily automated candidate job matching routine, application deadline follow-up notifications.

---

## 3. Data Flow Diagram (Resume Match Workflow)

1. Candidate submits resume text + target job description via `apps/web`.
2. `apps/web` calls `POST /api/v1/analyze-match` on `services/ai-engine`.
3. `services/ai-engine` computes keyword overlap, calculates match score (0-100), ATS score, missing skills list, and suggested bullet points.
4. Response is returned to `apps/web` and rendered in real time.
