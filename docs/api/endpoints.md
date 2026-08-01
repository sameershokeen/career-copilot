# API Endpoints Reference

## Base URLs

| Service | URL |
|---------|-----|
| API Backend | `http://localhost:4000/api/v1` |
| AI Engine | `http://localhost:8000/api/v1` |

## API Backend Endpoints (`services/api`)

| Method | Endpoint | Module | Description |
|--------|----------|--------|-------------|
| `GET` | `/health` | health | Service health check |
| `POST` | `/auth/login` | auth | User login |
| `POST` | `/auth/register` | auth | User registration |
| `GET` | `/users/me` | users | Get current user profile |
| `PUT` | `/users/me` | users | Update user profile |
| `GET` | `/companies` | companies | List companies |
| `GET` | `/companies/:id` | companies | Get company details |
| `GET` | `/jobs` | jobs | Search & list jobs |
| `GET` | `/jobs/:id` | jobs | Get job details |
| `GET` | `/applications` | applications | List user applications |
| `POST` | `/applications` | applications | Create application |
| `PATCH` | `/applications/:id` | applications | Update application status |
| `GET` | `/resumes` | resumes | List user resumes |
| `POST` | `/resumes` | resumes | Create/upload resume |
| `POST` | `/cover-letters/generate` | cover-letters | Generate cover letter |
| `GET` | `/recruiters` | recruiters | List recruiters |
| `GET` | `/dashboard` | dashboard | Dashboard aggregated data |
| `GET` | `/analytics` | analytics | Usage metrics |

## AI Engine Endpoints (`services/ai-engine`)

| Method | Endpoint | Agent | Description |
|--------|----------|-------|-------------|
| `POST` | `/match` | matcher | Resume ↔ Job match scoring |
| `POST` | `/resume/parse` | resume | Parse & extract resume data |
| `POST` | `/cover-letter/generate` | cover-letter | AI cover letter generation |
| `POST` | `/interview/simulate` | interview | Mock interview simulation |
| `POST` | `/embeddings/generate` | embeddings | Generate vector embeddings |
