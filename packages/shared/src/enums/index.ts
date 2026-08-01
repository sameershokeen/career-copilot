/**
 * Shared Enums (mirrors Prisma enums for frontend use)
 */

export enum ApplicationStatus {
  SAVED = 'SAVED',
  APPLIED = 'APPLIED',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  TEMPORARY = 'TEMPORARY',
  FREELANCE = 'FREELANCE',
}

export enum ExperienceLevel {
  ENTRY_LEVEL = 'ENTRY_LEVEL',
  JUNIOR = 'JUNIOR',
  MID_LEVEL = 'MID_LEVEL',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  EXECUTIVE = 'EXECUTIVE',
}

export enum ResumeType {
  BLOCKCHAIN = 'BLOCKCHAIN',
  BACKEND = 'BACKEND',
  FRONTEND = 'FRONTEND',
  FULLSTACK = 'FULLSTACK',
  AI_ML = 'AI_ML',
  DEVOPS = 'DEVOPS',
  CUSTOM = 'CUSTOM',
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum JobSource {
  GREENHOUSE = 'GREENHOUSE',
  LEVER = 'LEVER',
  ASHBY = 'ASHBY',
  REMOTE_OK = 'REMOTE_OK',
  WELLFOUND = 'WELLFOUND',
  YC = 'YC',
  COMPANY = 'COMPANY',
  MANUAL = 'MANUAL',
  LINKEDIN = 'LINKEDIN',
  INDEED = 'INDEED',
}
