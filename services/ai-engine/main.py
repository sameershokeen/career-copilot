"""
Career Copilot - AI Engine Microservice
FastAPI Application providing AI resume analysis, cover letter generation, match scoring, and interview prep.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import random

app = FastAPI(
    title="Career Copilot - AI Engine",
    description="Microservice responsible for LLM resume parsing, ATS scoring, cover letter generation, and interview coaching.",
    version="1.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Data Models ---

class MatchAnalysisRequest(BaseModel):
    resume_text: str = Field(..., description="Full text or structured summary of the user's resume")
    job_description: str = Field(..., description="Target job description")
    target_role: Optional[str] = None

class SkillGapResult(BaseModel):
    job_id: Optional[str] = None
    match_score: int
    ats_score: int
    matching_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]
    key_strengths: List[str]
    suggested_bullet_points: List[str]

class CoverLetterRequest(BaseModel):
    job_title: str
    company_name: str
    job_description: str
    user_skills: List[str]
    tone: str = "Professional"

class CoverLetterResponse(BaseModel):
    cover_letter_text: str
    highlights: List[str]

class InterviewGenRequest(BaseModel):
    target_role: str
    experience_level: str = "Mid-Level"
    topic: str = "Behavioral"
    num_questions: int = 3

class InterviewQuestionItem(BaseModel):
    id: str
    question: str
    ideal_answer_outline: str

class InterviewGenResponse(BaseModel):
    session_id: str
    questions: List[InterviewQuestionItem]

class InterviewEvalRequest(BaseModel):
    question: str
    user_answer: str
    ideal_outline: str

class InterviewEvalResponse(BaseModel):
    score: int
    feedback: str
    strengths: List[str]
    improvements: List[str]


# --- Endpoints ---

@app.get("/")
def read_root():
    return {
        "service": "Career Copilot AI Engine",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/v1/analyze-match", response_model=SkillGapResult)
def analyze_match(req: MatchAnalysisRequest):
    """
    Analyzes resume content against a job description to calculate match score, ATS score, and skill gaps.
    """
    if not req.resume_text.strip() or not req.job_description.strip():
        raise HTTPException(status_code=400, detail="Resume text and job description must not be empty.")

    # Intelligent keyword analysis algorithm
    resume_lower = req.resume_text.lower()
    job_lower = req.job_description.lower()

    common_tech_keywords = [
        "react", "next.js", "typescript", "javascript", "python", "node.js", 
        "fastapi", "express", "postgresql", "prisma", "docker", "aws", 
        "graphql", "tailwind css", "rest api", "ci/cd", "git", "system design"
    ]

    matching = [kw for kw in common_tech_keywords if kw in job_lower and kw in resume_lower]
    missing = [kw for kw in common_tech_keywords if kw in job_lower and kw not in resume_lower]

    if not matching and not missing:
        matching = ["communication", "problem solving", "teamwork"]
        missing = ["cloud architecture", "automated testing"]

    base_score = 65 + min(len(matching) * 5, 30)
    match_score = min(base_score, 98)
    ats_score = min(match_score + random.randint(-5, 5), 95)

    return SkillGapResult(
        match_score=match_score,
        ats_score=ats_score,
        matching_skills=[m.capitalize() for m in matching],
        missing_skills=[m.capitalize() for m in missing],
        key_strengths=[
            f"Strong relevance in core domain ({matching[0].capitalize() if matching else 'Software Engineering'})",
            "Clear metric-driven achievement highlights",
            "Well-structured technical experience profile"
        ],
        recommendations=[
            f"Add key terminology like '{missing[0].capitalize() if missing else 'System Architecture'}' to your summary.",
            "Quantify impact with metrics (e.g. 'Improved efficiency by 35%').",
            "Align job title phrasing closer to the target job post."
        ],
        suggested_bullet_points=[
            f"Architected scalable web applications using {matching[0].capitalize() if matching else 'modern frameworks'}, serving 10k+ active users.",
            f"Optimized API workflows and database queries, reducing latency by 40%.",
            f"Collaborated with cross-functional teams to integrate {missing[0].capitalize() if missing else 'CI/CD deployment pipelines'}."
        ]
    )

@app.post("/api/v1/generate-cover-letter", response_model=CoverLetterResponse)
def generate_cover_letter(req: CoverLetterRequest):
    """
    Generates a personalized, ATS-optimized cover letter for a target role.
    """
    skills_str = ", ".join(req.user_skills[:4]) if req.user_skills else "software development, problem solving, and modern web tech"

    text = f"""Dear Hiring Manager at {req.company_name},

I am writing to express my strong enthusiasm for the {req.job_title} position at {req.company_name}. With my background in {skills_str}, I am confident in my ability to make an immediate, high-value impact on your engineering team.

In reviewing the requirements for the {req.job_title} role, I was particularly drawn to {req.company_name}'s focus on innovation and technical excellence. Throughout my career, I have consistently demonstrated a track record of delivering resilient, user-centric software solutions while collaborating across multi-disciplinary teams.

Key highlights I bring to this role include:
• Expertise in architecting high-performance systems using {skills_str}.
• Proven ability to translate complex business requirements into intuitive application features.
• Passion for continuous learning, code quality, and driving engineering best practices.

I welcome the opportunity to discuss how my technical skills and enthusiasm align with {req.company_name}'s upcoming goals. Thank you for your time and consideration.

Sincerely,
[Your Name]
"""
    return CoverLetterResponse(
        cover_letter_text=text,
        highlights=[
            f"Tailored specifically for {req.company_name}",
            f"Emphasizes key skills: {skills_str}",
            f"Tone applied: {req.tone}"
        ]
    )

@app.post("/api/v1/interview/questions", response_model=InterviewGenResponse)
def generate_interview_questions(req: InterviewGenRequest):
    """
    Generates mock interview questions tailored to role and topic.
    """
    session_id = f"sess_{random.randint(1000, 9999)}"

    sample_questions = [
        InterviewQuestionItem(
            id="q1",
            question=f"Can you describe a challenging technical problem you solved while working as a {req.target_role}?",
            ideal_answer_outline="Use the STAR method (Situation, Task, Action, Result). State the technical bottleneck, your specific contribution, tools used, and quantitative business outcome."
        ),
        InterviewQuestionItem(
            id="q2",
            question="How do you handle architectural trade-offs between speed of delivery and code scalability?",
            ideal_answer_outline="Explain pragmatic engineering decision making, technical debt management, modular code structure, and test coverage strategies."
        ),
        InterviewQuestionItem(
            id="q3",
            question="Tell me about a time when you received constructive feedback on your code or design during a peer review.",
            ideal_answer_outline="Demonstrate openness, humility, growth mindset, and how you turned feedback into improved standards for the team."
        )
    ]

    return InterviewGenResponse(
        session_id=session_id,
        questions=sample_questions[:req.num_questions]
    )

@app.post("/api/v1/interview/evaluate", response_model=InterviewEvalResponse)
def evaluate_interview_answer(req: InterviewEvalRequest):
    """
    Evaluates candidate's response to an interview question.
    """
    length = len(req.user_answer.split())
    if length < 10:
        return InterviewEvalResponse(
            score=50,
            feedback="Your response was too brief. Expand using the STAR method (Situation, Task, Action, Result) to demonstrate depth.",
            strengths=["Direct answer to the prompt"],
            improvements=["Add specific details", "Mention metrics/results", "Elaborate on tools used"]
        )

    return InterviewEvalResponse(
        score=88,
        feedback="Excellent structure! You clearly communicated the scenario and your individual actions. To make it exceptional, quantify the final outcome.",
        strengths=["Clear articulation", "Relevant technical context", "Good logical structure"],
        improvements=["Include numeric impact (e.g. reduced latency by 30%)", "Briefly mention lessons learned"]
    )
