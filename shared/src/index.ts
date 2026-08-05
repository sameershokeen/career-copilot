// ─────────────────────────────────────────────
// SCRAPER TABLES (read-only for Career Copilot)
// ─────────────────────────────────────────────

export interface Job {
  id: number; // BIGSERIAL
  dedupe_key: string; // sha256(company|title|location)
  title: string;
  company: string | null;
  location: string | null;
  region: "india" | "international";
  country: string | null;
  is_remote: boolean;
  source_site: string;
  sources: string[];
  job_url: string | null;
  apply_url: string | null;
  description: string | null;
  skills: string[] | null;
  job_type: string | null;
  date_posted: string | null; // ISO timestamp
  first_seen_at: string; // ISO timestamp
  raw: Record<string, unknown> | null; // raw JSONB from scraper
}

export interface ScrapeRun {
  id: number;
  started_at: string;
  finished_at: string | null;
  region: string | null;
  source_site: string | null;
  status: "success" | "failed" | "partial";
  jobs_found: number;
  jobs_new: number;
  jobs_duplicate: number;
  attempts: number;
  error_message: string | null;
}

// ─────────────────────────────────────────────
// CAREER COPILOT USER TYPES
// ─────────────────────────────────────────────

export type Plan = "free" | "pro";

export interface CcUser {
  id: string; // UUID
  clerk_id: string;
  email: string;
  name: string | null;
  plan: Plan;
  apply_count: number;
  cover_letter_count: number;
  resume_count: number;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface CcUserProfile {
  id: string;
  user_id: string;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  twitter: string | null;
  bio: string | null;
  skills: string[] | null;
  updated_at: string;
}

// ─────────────────────────────────────────────
// RESUME TYPES
// ─────────────────────────────────────────────

export interface ResumeExperience {
  title: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface ResumeProject {
  title: string;
  description: string;
  tech_stack: string[];
  link: string;
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

export interface ResumeContent {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  social_links: {
    linkedin: string;
    github: string;
    portfolio: string;
    twitter: string;
    other: string[];
  };
  summary: string;
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    soft: string[];
  };
  certifications: string[];
  publications: string[];
}

export interface CcResume {
  id: string;
  user_id: string;
  name: string; // user-given label e.g. "Frontend Resume"
  content: ResumeContent;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// PARSED RESUME (AI OUTPUT)
// ─────────────────────────────────────────────

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  social_links: {
    linkedin: string;
    github: string;
    portfolio: string;
    twitter: string;
    other: string[];
  };
  skills: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
}

export interface CcParsedResume {
  id: string;
  user_id: string;
  resume_id: string | null;
  parsed_data: ParsedResume;
  created_at: string;
}

// ─────────────────────────────────────────────
// APPLICATION TYPES
// ─────────────────────────────────────────────

export type ApplicationStatus =
  | "queued"
  | "applied"
  | "viewed"
  | "interview"
  | "offer"
  | "rejected"
  | "manual_required"
  | "failed";

export interface CcApplyQueue {
  id: string;
  user_id: string;
  job_id: number;
  added_at: string;
  status: "pending" | "approved" | "removed";
}

export interface CcApplication {
  id: string;
  user_id: string;
  job_id: number;
  resume_id: string | null;
  cover_letter_id: string | null;
  status: ApplicationStatus;
  prefilled_data: Record<string, unknown> | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
  // joined
  job?: Job;
}

export interface CcApplicationLog {
  id: string;
  application_id: string;
  event: string;
  detail: string | null;
  created_at: string;
}

// ─────────────────────────────────────────────
// AI OUTPUT TYPES
// ─────────────────────────────────────────────

export type CoverLetterTone = "formal" | "casual" | "enthusiastic";

export interface CcCoverLetter {
  id: string;
  user_id: string;
  job_id: number;
  content: string;
  tone: CoverLetterTone | null;
  created_at: string;
  updated_at: string;
}

export interface MatchScore {
  overall_score: number;
  skills_match: number;
  experience_match: number;
  domain_match: number;
  missing_skills: string[];
  strengths: string[];
  summary: string;
}

export interface CcMatchScore extends MatchScore {
  id: string;
  user_id: string;
  job_id: number;
  computed_at: string;
}

// ─────────────────────────────────────────────
// COMMUNITY TYPES
// ─────────────────────────────────────────────

export type PostType = "update" | "question" | "resource" | "founder-connect";

export interface CcCommunityPost {
  id: string;
  user_id: string;
  content: string;
  post_type: PostType;
  likes_count: number;
  created_at: string;
  // joined
  author?: { name: string | null; email: string };
  liked_by_me?: boolean;
}

export interface CcPostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// ─────────────────────────────────────────────
// RESOURCES
// ─────────────────────────────────────────────

export type ResourceCategory = "roadmap" | "tip" | "guide";
export type ResourceDomain = "frontend" | "backend" | "ai" | "general";

export interface CcResource {
  id: string;
  slug: string;
  title: string;
  category: ResourceCategory | null;
  domain: ResourceDomain | null;
  content: string; // markdown
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// ALERTS & NOTIFICATIONS
// ─────────────────────────────────────────────

export interface CcAlert {
  id: string;
  user_id: string;
  keywords: string[] | null;
  location: string | null;
  role_type: string | null;
  frequency: "instant" | "daily" | "weekly";
  channel: "email" | "sms" | "both";
  active: boolean;
  created_at: string;
}

export interface CcNotificationLog {
  id: string;
  user_id: string;
  type: "apply_complete" | "alert" | "status_change" | "digest";
  channel: "email" | "sms";
  recipient: string;
  subject: string | null;
  sent_at: string;
  success: boolean;
  error: string | null;
}

// ─────────────────────────────────────────────
// API RESPONSE SHAPES
// ─────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  error: string;
  code?: string;
  upgrade_required?: boolean;
}

export interface UserStatus {
  plan: Plan;
  apply_count: number;
  apply_limit: number;
  cover_letter_count: number;
  cover_letter_limit: number;
  resume_count: number;
  resume_limit: number;
}

// ─────────────────────────────────────────────
// JOB FILTER TYPES
// ─────────────────────────────────────────────

export type JobFilterChip = "india" | "remote" | "abroad" | "24h" | "3days" | "week";

export interface JobFilters {
  search?: string;
  chips: JobFilterChip[];
  page: number;
  limit: number;
}

// ─────────────────────────────────────────────
// PLAN LIMITS (single source of truth)
// ─────────────────────────────────────────────

export const PLAN_LIMITS = {
  free: {
    apply_count: 10,
    cover_letter_count: 5,
    resume_count: 5,
  },
  pro: {
    apply_count: Infinity,
    cover_letter_count: Infinity,
    resume_count: 30,
  },
} as const;
