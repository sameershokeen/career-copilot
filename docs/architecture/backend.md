# Backend Architecture — `services/api`

## Module Structure

Each domain module follows a consistent pattern:

```
modules/<domain>/
├── <domain>.controller.ts   # Route handlers
├── <domain>.service.ts      # Business logic
├── <domain>.validator.ts    # Zod request validation
├── <domain>.routes.ts       # Express router
└── <domain>.types.ts        # Module-specific types
```

## Modules

| Module | Route Prefix | Description |
|--------|-------------|-------------|
| `auth` | `/api/v1/auth` | Authentication & session management |
| `users` | `/api/v1/users` | User profile CRUD |
| `companies` | `/api/v1/companies` | Company profiles & verification |
| `jobs` | `/api/v1/jobs` | Job listing CRUD & search |
| `applications` | `/api/v1/applications` | Application tracking & status |
| `resumes` | `/api/v1/resumes` | Resume CRUD & versioning |
| `cover-letters` | `/api/v1/cover-letters` | Cover letter generation |
| `recruiters` | `/api/v1/recruiters` | Recruiter contact management |
| `dashboard` | `/api/v1/dashboard` | Aggregated dashboard data |
| `analytics` | `/api/v1/analytics` | Usage analytics & metrics |
| `health` | `/api/v1/health` | Service health checks |

## Shared Utilities

| Directory | Purpose |
|-----------|---------|
| `shared/errors/` | Custom error classes & error handler middleware |
| `shared/logger/` | Structured logging (winston/pino) |
| `shared/response/` | Standardized API response helpers |
| `shared/validators/` | Common Zod schemas (pagination, IDs, etc.) |
| `shared/utils/` | General-purpose utility functions |
