# 🚀 Career Copilot Monorepo

**Career Copilot** is an end-to-end, AI-powered career development platform that automates resume optimization, job search aggregation, match scoring, cover letter generation, and interactive mock interviews.

---

## 📊 Development Status

| Component | Status | Description |
|-----------|--------|-------------|
| Monorepo Setup | ✅ Done | npm workspaces, CI/CD workflows, shared configs |
| Database Schema | ✅ Done | 18 Prisma models, 11 enums, full ERD, seed script |
| Shared Types | ✅ Done | TypeScript interfaces & Zod validation models |
| Database ORM Layer | ✅ Done | Prisma Client export & typed access layer |
| Architecture Docs | ✅ Done | System topology, service boundaries, data flow |
| Web Dashboard | 🔧 In Progress | Next.js App Router frontend |
| AI Engine Service | 📋 Planned | FastAPI LLM orchestration microservice |
| Job Engine Service | 📋 Planned | Express.js job search & tracking API |
| Scheduler Worker | 📋 Planned | Background cron job processor |

---

## 📁 Repository Structure

```
career-copilot/
│
├── apps/
│   └── web/                          # Next.js App Router
│       ├── app/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── providers/
│       ├── services/                 # API client
│       ├── styles/
│       ├── types/
│       └── middleware.ts
│
├── services/
│   │
│   ├── api/                          # Main Backend (Express + TS)
│   │   ├── src/
│   │   │
│   │   ├── config/
│   │   │
│   │   ├── middleware/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── modules/
│   │   │   │
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── companies/
│   │   │   ├── jobs/
│   │   │   ├── applications/
│   │   │   ├── resumes/
│   │   │   ├── cover-letters/
│   │   │   ├── recruiters/
│   │   │   ├── dashboard/
│   │   │   ├── analytics/
│   │   │   └── health/
│   │   │
│   │   ├── shared/
│   │   │   ├── errors/
│   │   │   ├── logger/
│   │   │   ├── response/
│   │   │   ├── validators/
│   │   │   └── utils/
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   └── ai-engine/                    # Python FastAPI
│       ├── app/
│       │
│       ├── agents/
│       │   ├── matcher/
│       │   ├── resume/
│       │   ├── cover-letter/
│       │   ├── interview/
│       │   └── embeddings/
│       │
│       ├── prompts/
│       ├── models/
│       ├── services/
│       ├── schemas/
│       ├── utils/
│       └── main.py
│
├── workers/
│   │
│   ├── scheduler/
│   │   ├── collectors/
│   │   │
│   │   ├── greenhouse/
│   │   ├── lever/
│   │   ├── ashby/
│   │   ├── remoteok/
│   │   ├── wellfound/
│   │   ├── company/
│   │   │
│   │   ├── normalizer/
│   │   ├── deduplicator/
│   │   ├── enrichment/
│   │   ├── sync/
│   │   └── scheduler.ts
│
├── packages/
│   │
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   │
│   │   └── src/
│   │       ├── client.ts
│   │       └── index.ts
│   │
│   ├── shared/
│   │   ├── src/
│   │   │
│   │   ├── constants/
│   │   ├── enums/
│   │   ├── types/
│   │   ├── zod/
│   │   ├── helpers/
│   │   └── index.ts
│   │
│   └── ui/                           # Shared React components (future)
│
├── docs/
│   │
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── backend.md
│   │   ├── frontend.md
│   │   ├── ai.md
│   │   ├── scheduler.md
│   │   └── deployment.md
│   │
│   ├── database/
│   │   ├── erd.md
│   │   └── schema.md
│   │
│   ├── api/
│   │   ├── openapi.yaml
│   │   └── endpoints.md
│   │
│   └── decisions/
│       ├── adr-001-monorepo.md
│       ├── adr-002-ai.md
│       └── adr-003-database.md
│
├── scripts/
│   ├── setup.ts
│   ├── reset-db.ts
│   └── generate-types.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── lint.yml
│       ├── test.yml
│       └── deploy.yml
│
├── .env.example
├── package.json
├── turbo.json                        # (Future)
├── tsconfig.base.json
├── README.md
├── LICENSE
└── .gitignore
```

---

## 🗄️ Database Schema (Prisma)

The database layer is fully designed and lives in `packages/database/prisma/schema.prisma`. It targets **PostgreSQL** and includes:

### Models (18 total)

| # | Model | Purpose |
|---|-------|---------|
| 1 | `User` | Candidate profiles with social links (GitHub, LinkedIn, portfolio) |
| 2 | `Company` | Employer profiles with slug, verification status & recruiter links |
| 3 | `Job` | Job listings with structured salary, multi-format descriptions & hash dedup |
| 4 | `Skill` | Categorized skill taxonomy |
| 5 | `JobSkill` | Many-to-many: Job ↔ Skill |
| 6 | `UserSkill` | Many-to-many: User ↔ Skill with proficiency level |
| 7 | `Resume` | Versioned resumes with JSON master, PDF & DOCX export URLs |
| 8 | `Match` | AI match scores with structured strengths & missing skills analysis |
| 9 | `CoverLetter` | AI-generated cover letters linked to Job + Resume |
| 10 | `Application` | Application tracker with ATS integration fields |
| 11 | `Recruiter` | Recruiter contacts linked to companies |
| 12 | `FollowUp` | Scheduled follow-up reminders for applications |
| 13 | `Interview` | Interview tracking with type, round & notes |
| 14 | `Note` | Freeform notes on applications |
| 15 | `CollectorRun` | Job scraper telemetry & run monitoring |
| 16 | `AiGeneration` | LLM usage tracking — tokens, latency, cost |
| 17 | `JobEmbedding` | 1536-dim vector embeddings for semantic job search |
| 18 | `ResumeEmbedding` | 1536-dim vector embeddings for semantic resume matching |

### Enums (11 total)

`ApplicationStatus` · `EmploymentType` · `ExperienceLevel` · `FollowUpStatus` · `InterviewType` · `ResumeType` · `JobStatus` · `JobSource` · `Currency` · `SalaryPeriod` · `CollectorStatus`

### Key Design Decisions

- **Hash Deduplication** — `SHA256(company + title + location + url)` prevents duplicate jobs across scrapers
- **Structured Salary** — `salaryMin`/`salaryMax` with `Currency` and `SalaryPeriod` enums for numeric range queries
- **Global Soft Delete** — `deletedAt DateTime?` on all domain entities
- **40+ Composite Indexes** — Optimized for high-frequency query patterns
- **Vector Embeddings** — Dedicated `JobEmbedding` / `ResumeEmbedding` tables for AI semantic similarity

> 📖 Full schema documentation: [`docs/database-schema.md`](file:///c:/Users/samee/Desktop/career-copilot/docs/database-schema.md)

---

## 🛠️ Stack & Technologies

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js App Router, React, Tailwind CSS, Lucide Icons, Framer Motion |
| **AI Engine** | Python 3.11+, FastAPI, Pydantic, OpenAI / LLM integration |
| **Job Engine** | Node.js, Express.js, TypeScript |
| **Database** | Prisma ORM 5.x, PostgreSQL |
| **Shared Package** | TypeScript interfaces, Zod validation models |
| **Scheduler** | Node.js cron worker / queue processor |
| **Monorepo** | npm workspaces |

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: `v18.x` or later
- **npm**: `v9.x` or later
- **PostgreSQL**: `v14` or later
- **Python**: `3.10` or later (for `services/ai-engine`)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/career-copilot.git
   cd career-copilot
   ```

2. **Install all workspace dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   # Create a .env file in packages/database (or project root)
   # with your PostgreSQL connection string:
   DATABASE_URL="postgresql://user:password@localhost:5432/career_copilot?schema=public"
   ```

4. **Set up the database**:
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to your database
   npm run db:push

   # Seed with sample data
   npm run db:seed

   # Open Prisma Studio (visual DB browser)
   npm run db:studio
   ```

5. **Set up AI Engine (Python virtual environment)**:
   ```bash
   cd services/ai-engine
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cd ../..
   ```

6. **Run services locally**:
   ```bash
   # Web App (http://localhost:3000)
   cd apps/web && npm run dev

   # Job Engine (http://localhost:4000)
   cd services/job-engine && npm run dev

   # AI Engine (http://localhost:8000)
   cd services/ai-engine && uvicorn main:app --reload
   ```

---

## 📜 Available Scripts

All database commands are available from the **monorepo root** via npm workspaces:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all workspace dev servers |
| `npm run build` | Build all workspaces |
| `npm run test` | Run tests across all workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run db:generate` | Generate Prisma Client from schema |
| `npm run db:push` | Push schema changes to the database |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:studio` | Open Prisma Studio visual browser |

---

## 📖 Feature Roadmap

- [x] **Monorepo Architecture** — npm workspaces with shared packages & CI/CD
- [x] **Enterprise Database Schema** — 18 normalized models with enums, indexes & vector embeddings
- [x] **Seed Script** — Sample data for Users, Companies, Jobs, Skills & more
- [x] **Architecture Documentation** — System topology, service boundaries & data flow docs
- [ ] **AI Resume Matcher** — Skill gap analysis & ATS compatibility scoring
- [ ] **Smart Job Board** — Automated web scraping & AI relevance filtering
- [ ] **Cover Letter Generator** — One-click custom cover letters tailored to job specs
- [ ] **Interview Simulator** — Roleplay technical & behavioral interviews with AI feedback
- [ ] **Automated Scheduler** — Daily background job matching & application tracking alerts

---

## 📜 License

Distributed under the [MIT License](file:///c:/Users/samee/Desktop/career-copilot/LICENSE).
