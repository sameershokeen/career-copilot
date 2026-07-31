# 🔌 API Reference - Career Copilot Services

## AI Engine Microservice (`http://localhost:8000`)

### `POST /api/v1/analyze-match`
Analyzes resume content against a job description.

**Request Body:**
```json
{
  "resume_text": "Senior Software Engineer with experience in React, Next.js...",
  "job_description": "We are seeking a Full Stack Engineer skilled in TypeScript..."
}
```

**Response Body:**
```json
{
  "match_score": 88,
  "ats_score": 92,
  "matching_skills": ["React", "Next.js", "TypeScript"],
  "missing_skills": ["PostgreSQL", "Docker"],
  "recommendations": ["Add metric-driven achievements for AWS deployment"],
  "key_strengths": ["Strong core framework alignment"],
  "suggested_bullet_points": ["Architected scalable applications using Next.js"]
}
```

---

### `POST /api/v1/generate-cover-letter`
Generates an ATS-optimized cover letter.

**Request Body:**
```json
{
  "job_title": "Senior Full Stack Engineer",
  "company_name": "TechFlow Systems",
  "job_description": "Building cloud web applications...",
  "user_skills": ["Next.js", "TypeScript", "Node.js"],
  "tone": "Professional"
}
```

---

## Job Engine Microservice (`http://localhost:4000`)

### `GET /api/v1/jobs`
Query and filter job postings.

**Query Parameters:**
- `query` (optional): Search string for title, company, or technology
- `location` (optional): Location filter
- `workplaceType` (optional): `Remote` | `Hybrid` | `On-Site`

**Response:**
```json
{
  "total": 4,
  "jobs": [
    {
      "id": "job-101",
      "title": "Senior Full Stack Engineer",
      "company": "TechFlow Systems",
      "location": "San Francisco, CA",
      "workplaceType": "Hybrid",
      "salaryRange": "$150,000 - $185,000",
      "tags": ["Next.js", "TypeScript", "Node.js", "PostgreSQL"]
    }
  ]
}
```
