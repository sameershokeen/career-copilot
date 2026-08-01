# ADR-001: Monorepo Architecture

## Status: Accepted

## Context
Career Copilot consists of multiple services (frontend, backend API, AI engine, scheduler worker) that share types, database models, and configuration. We need a strategy to manage code sharing and coordination.

## Decision
Use an **npm workspaces monorepo** with the following workspace layout:
- `apps/*` — Frontend applications
- `services/*` — Backend microservices
- `packages/*` — Shared libraries (database, types, UI components)
- `workers/*` — Background job processors

## Consequences
- **Positive**: Single repo, shared dependencies, atomic commits across services
- **Positive**: Shared TypeScript types prevent drift between frontend and backend
- **Negative**: Larger repo size, CI complexity
- **Future**: Consider Turborepo (`turbo.json`) for build caching and parallel execution
