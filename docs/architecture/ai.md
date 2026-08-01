# AI Engine Architecture — `services/ai-engine`

## Agent Structure

Each AI agent is a self-contained module:

```
agents/<agent>/
├── __init__.py
├── agent.py          # Core agent logic
├── prompts.py        # Prompt templates
└── schemas.py        # Input/output Pydantic models
```

## Agents

| Agent | Endpoint | Description |
|-------|----------|-------------|
| `matcher/` | `POST /api/v1/match` | Resume ↔ Job ATS match scoring & gap analysis |
| `resume/` | `POST /api/v1/resume/parse` | Resume parsing & skill extraction |
| `cover-letter/` | `POST /api/v1/cover-letter/generate` | Tailored cover letter generation |
| `interview/` | `POST /api/v1/interview/simulate` | Mock interview Q&A with grading |
| `embeddings/` | `POST /api/v1/embeddings/generate` | Vector embedding generation for semantic search |

## Supporting Directories

| Directory | Purpose |
|-----------|---------|
| `prompts/` | Shared prompt templates & versioned prompts |
| `models/` | Pydantic data models |
| `services/` | External API integrations (OpenAI, etc.) |
| `schemas/` | Request/response validation schemas |
| `utils/` | Helper functions & text processing |
