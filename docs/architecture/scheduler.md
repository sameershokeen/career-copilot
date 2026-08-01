# Scheduler & Workers Architecture — `workers/scheduler`

## Collector Pipeline

```
[External Sources] → [Collectors] → [Normalizer] → [Deduplicator] → [Enrichment] → [Sync to DB]
```

## Collectors

Each collector scrapes/fetches jobs from a specific ATS or job board:

| Collector | Source | Description |
|-----------|--------|-------------|
| `greenhouse/` | Greenhouse ATS | Company career pages on Greenhouse |
| `lever/` | Lever ATS | Company career pages on Lever |
| `ashby/` | Ashby ATS | Company career pages on Ashby |
| `remoteok/` | RemoteOK | Remote-first job listings |
| `wellfound/` | Wellfound (AngelList) | Startup job listings |
| `company/` | Direct Company Pages | Custom scraper per company |

## Processing Pipeline

| Stage | Purpose |
|-------|---------|
| `normalizer/` | Standardize job data across sources |
| `deduplicator/` | Hash-based dedup via `SHA256(company + title + location + url)` |
| `enrichment/` | Add salary estimates, skill tagging, etc. |
| `sync/` | Upsert processed jobs into PostgreSQL via Prisma |
