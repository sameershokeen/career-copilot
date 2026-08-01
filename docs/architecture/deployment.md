# Deployment Guide

## Environments

| Environment | Description |
|-------------|-------------|
| Development | Local Docker Compose or direct `npm run dev` |
| Staging | Preview deployments for PR review |
| Production | Full deployment with monitoring |

## Service Deployment Targets

| Service | Platform | Notes |
|---------|----------|-------|
| `apps/web` | Vercel / AWS Amplify | Static + SSR |
| `services/api` | Railway / AWS ECS | Containerized |
| `services/ai-engine` | Railway / AWS Lambda | Containerized Python |
| `workers/scheduler` | Railway / AWS ECS | Long-running worker |
| PostgreSQL | Supabase / AWS RDS | Managed database |

## Environment Variables

See `.env.example` for a complete list of required environment variables.
