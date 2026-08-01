# ADR-003: Database Design

## Status: Accepted

## Context
The platform needs a normalized, production-ready database schema supporting users, companies, jobs, applications, resumes, AI tracking, and vector embeddings.

## Decision
Use **PostgreSQL** with **Prisma ORM** and the following design principles:
- 18 normalized models with explicit foreign key relationships
- 11 type-safe enums for all categorical data
- Hash-based job deduplication (`SHA256`)
- Structured salary fields for numeric range queries
- Global soft delete (`deletedAt`) on all domain entities
- 40+ composite indexes for query performance
- Dedicated vector embedding tables for semantic search

## Consequences
- **Positive**: Type-safe queries via Prisma Client
- **Positive**: Schema-as-code with version-controlled migrations
- **Positive**: Soft delete allows data recovery
- **Negative**: Prisma migrations require careful management in production
