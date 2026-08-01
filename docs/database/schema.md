# Database Schema Reference

Full schema documentation is maintained in [`database-schema.md`](../database-schema.md).

## Quick Reference

- **18 Models** — User, Company, Job, Skill, Resume, Match, CoverLetter, Application, Recruiter, FollowUp, Interview, Note, CollectorRun, AiGeneration, JobEmbedding, ResumeEmbedding, JobSkill, UserSkill
- **11 Enums** — ApplicationStatus, EmploymentType, ExperienceLevel, FollowUpStatus, InterviewType, ResumeType, JobStatus, JobSource, Currency, SalaryPeriod, CollectorStatus
- **Database**: PostgreSQL via Prisma ORM
- **Schema File**: `packages/database/prisma/schema.prisma`
