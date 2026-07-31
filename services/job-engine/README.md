# ⚙️ Job Engine Service

The **Job Engine** service handles job fetching, search filtering, ingestion, and application tracking APIs.

---

## 🛠️ Setup & Running

```bash
# Install dependencies
npm install

# Start development server (Port 4000)
npm run dev
```

---

## 🔌 API Endpoints

- `GET /health` - Service health status
- `GET /api/v1/jobs` - Query & search job listings (supports `query`, `location`, `workplaceType`)
- `GET /api/v1/jobs/:id` - Fetch single job detail
- `POST /api/v1/jobs` - Ingest new job posting
