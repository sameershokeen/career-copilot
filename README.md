# 🚀 Career Copilot Monorepo

**Career Copilot** is an end-to-end, AI-powered career development platform that automates resume optimization, job search aggregation, match scoring, cover letter generation, and interactive mock interviews.

---

## 📁 Repository Structure

```
career-copilot/
│
├── 📱 apps/
│   └── web/                   # Next.js / React Web Dashboard & UI
│
├── ⚙️ services/
│   ├── ai-engine/             # Python / FastAPI service for AI processing & LLM orchestration
│   └── job-engine/            # Node.js / Express service for job search API & tracking
│
├── 📦 packages/
│   ├── database/              # Prisma database schema, ORM layer & migrations
│   └── shared/                # Shared TypeScript types, schemas, interfaces & helpers
│
├── ⏱️ workers/
│   └── scheduler/             # Background cron worker for job alerts & automated matching
│
├── 📚 docs/                   # Architecture specs, system flow & API documentation
├── ⚙️ .github/                # CI/CD Workflows & GitHub Actions
│
├── README.md
├── LICENSE
└── .gitignore
```

---

## 🛠️ Stack & Technologies

- **Frontend**: Next.js App Router, React, Tailwind CSS, Lucide Icons, Framer Motion
- **AI Engine Service**: Python 3.11+, FastAPI, Pydantic, OpenAI / LLM integration
- **Job Engine Service**: Node.js, Express.js, TypeScript
- **Database Package**: Prisma ORM, PostgreSQL / SQLite
- **Shared Package**: TypeScript interfaces, Zod validation models
- **Scheduler Worker**: Node.js cron worker / queue processor

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or later
- **npm**: `v9.x` or later
- **Python**: `3.10` or later (for `services/ai-engine`)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/career-copilot.git
   cd career-copilot
   ```

2. **Install Node Workspaces dependencies**:
   ```bash
   npm install
   ```

3. **Set up AI Engine service (Python virtual environment)**:
   ```bash
   cd services/ai-engine
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cd ../..
   ```

4. **Run Services & Frontend locally**:
   - **Web App**: `cd apps/web && npm run dev` (starts on `http://localhost:3000`)
   - **Job Engine**: `cd services/job-engine && npm run dev` (starts on `http://localhost:4000`)
   - **AI Engine**: `cd services/ai-engine && uvicorn main:app --reload` (starts on `http://localhost:8000`)

---

## 📖 Feature Roadmap

- [x] **AI Resume Matcher**: Detailed breakdown of skill gaps and ATS compatibility score.
- [x] **Smart Job Board**: Automated web scraping and AI relevance filtering.
- [x] **Cover Letter Generator**: One-click custom cover letter generator tailored to job specs.
- [x] **Interactive Interview Simulator**: Roleplay technical and behavioral interview questions with real-time AI feedback.
- [x] **Automated Scheduler**: Daily background job matching & application tracking alerts.

---

## 📜 License

Distributed under the [MIT License](file:///c:/Users/samee/Desktop/career-copilot/LICENSE).
