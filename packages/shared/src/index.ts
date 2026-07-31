/**
 * Shared Type Definitions & Schemas for Career Copilot Platform
 */

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  targetRole: string;
  experienceLevel: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Lead' | 'Executive';
  skills: string[];
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeData {
  id: string;
  userId: string;
  title: string;
  summary: string;
  experience: WorkExperience[];
  education: EducationItem[];
  skills: string[];
  projects?: ProjectItem[];
  rawText?: string;
  createdAt: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-Site';
  salaryRange?: string;
  description: string;
  requirements: string[];
  tags: string[];
  postedAt: string;
  sourceUrl?: string;
}

export interface JobMatchAnalysis {
  jobId: string;
  matchScore: number; // 0 - 100
  atsScore: number;   // 0 - 100
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  keyStrengths: string[];
  suggestedBulletPoints: string[];
}

export interface CoverLetterRequest {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  userSkills: string[];
  tone: 'Professional' | 'Enthusiastic' | 'Direct' | 'Creative';
}

export interface CoverLetterResponse {
  coverLetterText: string;
  highlights: string[];
}

export interface MockInterviewSession {
  id: string;
  userId: string;
  targetRole: string;
  topic: 'Behavioral' | 'System Design' | 'Coding' | 'General';
  questions: InterviewQuestion[];
  status: 'In Progress' | 'Completed';
  overallScore?: number;
  feedback?: string;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  idealAnswerOutline: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
}

export interface ApplicationTrackerItem {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  appliedDate?: string;
  notes?: string;
  salaryOffered?: string;
}
