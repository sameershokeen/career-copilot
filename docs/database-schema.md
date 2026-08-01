# Career Copilot - Enterprise PostgreSQL Database Schema

This document details the production-ready PostgreSQL database architecture built with **Prisma ORM**.

## Schema Architecture & Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ Resume : "owns"}
    User ||--o{ UserSkill : "has"}
    User ||--o{ AiGeneration : "triggers"}
    Skill ||--o{ UserSkill : "assigned to"}
    Skill ||--o{ JobSkill : "required by"}
    Job ||--o{ JobSkill : "requires"}
    Company ||--o{ Job : "posts"}
    Company ||--o{ Recruiter : "employs"}
    Job ||--o{ Match : "evaluated in"
    Resume ||--o{ Match : "scored with"
    Job ||--o{ CoverLetter : "generated for"
    Resume ||--o{ CoverLetter : "derived from"
    Job ||--o{ Application : "applied to"
    Resume ||--o{ Application : "submitted with"
    Application ||--o{ FollowUp : "schedules"
    Application ||--o{ Interview : "tracks"
    Application ||--o{ Note : "contains"
    Job ||--|| JobEmbedding : "vectorized in"
    Resume ||--|| ResumeEmbedding : "vectorized in"

    User {
        uuid id PK
        string name
        string email UK
        string headline
        text bio
        string github
        string linkedin
        string portfolio
        datetime deletedAt
        datetime createdAt
        datetime updatedAt
    }

    Company {
        uuid id PK
        string name
        string slug UK
        string website
        string careersUrl
        string linkedinUrl
        string githubUrl
        string industry
        string size
        string location
        string logo
        boolean verified
        datetime deletedAt
        datetime createdAt
        datetime updatedAt
    }

    Job {
        uuid id PK
        string hash UK
        uuid companyId FK
        string title
        text description
        text descriptionHtml
        text descriptionText
        int salaryMin
        int salaryMax
        Currency currency
        SalaryPeriod salaryPeriod
        string location
        boolean remote
        EmploymentType employmentType
        ExperienceLevel experienceLevel
        datetime postedAt
        string jobUrl
        JobSource source
        JobStatus status
        datetime deletedAt
        datetime createdAt
        datetime updatedAt
    }

    Skill {
        uuid id PK
        string name UK
        string category
        datetime deletedAt
        datetime createdAt
        datetime updatedAt
    }

    Resume {
        uuid id PK
        uuid userId FK
        ResumeType type
        int version
        string title
        json json
        string pdfUrl
        string docxUrl
        datetime deletedAt
        datetime createdAt
        datetime updatedAt
    }

    Match {
        uuid id PK
        uuid jobId FK
        uuid resumeId FK
        float score
        json strengths
        json missingSkills
        text summary
        datetime deletedAt
        datetime createdAt
        datetime updatedAt
    }

    Application {
        uuid id PK
        uuid jobId FK
        uuid resumeId FK
        ApplicationStatus status
        datetime appliedAt
        text notes
        string externalApplicationId
        string appliedVia
        datetime lastSyncedAt
        datetime deletedAt
        datetime createdAt
        datetime updatedAt
    }

    CollectorRun {
        uuid id PK
        JobSource source
        CollectorStatus status
        datetime startedAt
        datetime finishedAt
        int jobsFound
        int jobsInserted
        int jobsUpdated
        json errors
        datetime createdAt
        datetime updatedAt
    }

    AiGeneration {
        uuid id PK
        uuid userId FK
        string promptVersion
        string model
        int promptTokens
        int completionTokens
        int totalTokens
        int latency
        float cost
        text prompt
        text output
        datetime createdAt
        datetime updatedAt
    }

    JobEmbedding {
        uuid id PK
        uuid jobId FK,UK
        string model
        json vector
        int dimensions
        datetime createdAt
        datetime updatedAt
    }

    ResumeEmbedding {
        uuid id PK
        uuid resumeId FK,UK
        string model
        json vector
        int dimensions
        datetime createdAt
        datetime updatedAt
    }
```

---

## Complete Summary of 15 Enriched Schema Upgrades

### 1. Enums for Type Safety
Replaced plain strings with compile-time checked Enums:
- `ApplicationStatus`: `SAVED`, `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`
- `EmploymentType`: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `TEMPORARY`, `FREELANCE`
- `ExperienceLevel`: `ENTRY_LEVEL`, `JUNIOR`, `MID_LEVEL`, `SENIOR`, `LEAD`, `EXECUTIVE`
- `FollowUpStatus`: `PENDING`, `SENT`, `CANCELLED`, `RESPONDED`
- `InterviewType`: `PHONE_SCREEN`, `TECHNICAL`, `BEHAVIORAL`, `ONSITE`, `SYSTEM_DESIGN`, `FINAL_ROUND`
- `ResumeType`: `BLOCKCHAIN`, `BACKEND`, `FRONTEND`, `FULLSTACK`, `AI_ML`, `DEVOPS`, `CUSTOM`
- `JobStatus`: `ACTIVE`, `EXPIRED`, `CLOSED`, `ARCHIVED`
- `Currency`: `USD`, `EUR`, `GBP`, `CAD`, `AUD`, `INR`, `SGD`
- `SalaryPeriod`: `YEARLY`, `MONTHLY`, `HOURLY`

### 2. Standardized Job Sources (`JobSource`)
Added `JobSource` enum: `GREENHOUSE`, `LEVER`, `ASHBY`, `REMOTE_OK`, `WELLFOUND`, `YC`, `COMPANY`, `MANUAL`, `LINKEDIN`, `INDEED`.

### 3. Structured Salary Range Queries
Replaced string salary with `salaryMin` (Int), `salaryMax` (Int), `currency` (Currency), and `salaryPeriod` (SalaryPeriod), enabling fast numeric range queries (`WHERE salaryMin >= 120000`).

### 4. Rich Job Description Formats
Added `descriptionHtml` (raw source HTML) and `descriptionText` (sanitized clean text for AI prompts), alongside standard `description`.

### 5. Hash Deduplication (`hash`)
Added `hash String @unique` generated via `SHA256(company + title + location + url)` to prevent duplicate jobs across scrapers and job boards.

### 6. Company Slugs & Recruiter Profiles
Added `slug String @unique`, `verified Boolean`, `linkedinUrl`, and `githubUrl` on `Company`.

### 7. Master JSON Resume & Multi-Format Exports
Added `json Json` (master AI-editable structured resume), `pdfUrl`, and `docxUrl` on `Resume`.

### 8. Structured Match Analysis
Replaced string skill lists with native `Json` arrays for `strengths` and `missingSkills` on `Match`.

### 9. ATS Application Integration Metadata
Added `externalApplicationId`, `appliedVia`, and `lastSyncedAt` on `Application` for Greenhouse/Lever ATS sync.

### 10. Social User Profiles for AI Outreach
Added `headline`, `bio`, `github`, `linkedin`, and `portfolio` on `User`.

### 11. Global Soft Delete (`deletedAt`)
Added `deletedAt DateTime?` on all domain entities for non-destructive data handling.

### 12. Consistent Audit Timestamps
Ensured all models consistently contain `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`.

### 13. High-Performance Database Indexes
Added composite and single-column indexes on high-frequency query columns (`postedAt`, `companyId`, `status`, `source`, `hash`, `salaryMin/Max`, `deletedAt`).

### 14. Scraper & Collector Monitoring (`CollectorRun`)
Created `CollectorRun` model to log scraper runs (`jobsFound`, `jobsInserted`, `jobsUpdated`, `errors`, `status`).

### 15. AI Observability & Cost Tracking (`AiGeneration`)
Created `AiGeneration` model tracking LLM prompts, outputs, token usage, latency (ms), model versions, and cost ($USD).

### 16. Semantic Vector Embeddings (`JobEmbedding` & `ResumeEmbedding`)
Added `JobEmbedding` and `ResumeEmbedding` models storing 1536-dimensional float vector embeddings for AI semantic similarity matching and vector search.
