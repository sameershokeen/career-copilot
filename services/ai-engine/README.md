# ⚙️ AI Engine Service

The **AI Engine** is a FastAPI-powered Python microservice responsible for heavy lifting AI capabilities across Career Copilot:
- Resume & job description match scoring
- ATS keyword gap analysis
- Automated cover letter generation
- Interactive mock interview question generation and response grading

---

## 🛠️ Setup & Running

```bash
# 1. Create Python virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start development server
uvicorn main:app --reload --port 8000
```

---

## 🔌 API Endpoints

- `GET /health` - Service health check
- `POST /api/v1/analyze-match` - Match score & skill gap analysis
- `POST /api/v1/generate-cover-letter` - Custom cover letter builder
- `POST /api/v1/interview/questions` - Generate role-specific interview questions
- `POST /api/v1/interview/evaluate` - AI evaluation of interview responses

Open interactive Swagger UI docs at `http://localhost:8000/docs`.
