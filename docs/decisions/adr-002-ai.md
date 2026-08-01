# ADR-002: AI Engine Architecture

## Status: Accepted

## Context
The platform requires multiple AI capabilities: resume matching, cover letter generation, interview simulation, and semantic search. These need to be organized in a maintainable way.

## Decision
Use an **agent-based architecture** within a Python FastAPI service:
- Each AI capability is a self-contained agent module (`agents/<name>/`)
- Each agent owns its prompts, schemas, and logic
- Shared prompt templates live in `prompts/`
- Vector embeddings are handled by a dedicated `embeddings/` agent

## Consequences
- **Positive**: Each agent can be developed, tested, and iterated independently
- **Positive**: Prompt versioning is explicit per agent
- **Negative**: Cross-agent orchestration needs careful design
