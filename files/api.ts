// SERVER-ONLY module: imports "@clerk/nextjs/server". Do not import this
// file from a client component ("use client") — Next's server-only guard
// will fail the build. Client components should import from ./api-client
// instead (see its header comment for why this is split in two).
import { auth } from "@clerk/nextjs/server";
import type {
  Job,
  CcApplication,
  CcApplicationLog,
  CcResume,
  CcCoverLetter,
  CcMatchScore,
  CcCommunityPost,
  CcResource,
  UserStatus,
  PaginatedResponse,
  JobFilters,
  CoverLetterTone,
} from "@career-copilot/shared";
import { apiFetch, type QueueEntry } from "./api-client";

export type { QueueEntry };

// ── Server-side helper (gets token from Clerk) ──────────────────
async function serverFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const { getToken } = auth();
  const token = await getToken();
  return apiFetch<T>(path, { ...options, token: token ?? undefined });
}

// ── Jobs ────────────────────────────────────────────────────────
export async function getJobs(
  filters: JobFilters
): Promise<PaginatedResponse<Job>> {
  return serverFetch<PaginatedResponse<Job>>("/api/jobs/search", {
    method: "POST",
    body: JSON.stringify(filters),
  });
}

export async function getJob(id: number): Promise<Job> {
  return serverFetch<Job>(`/api/jobs/${id}`);
}

// ── User ────────────────────────────────────────────────────────
export async function getUserStatus(): Promise<UserStatus> {
  return serverFetch<UserStatus>("/api/user/status");
}

// ── Queue ───────────────────────────────────────────────────────
export async function addToQueue(jobId: number): Promise<void> {
  return serverFetch(`/api/queue`, {
    method: "POST",
    body: JSON.stringify({ job_id: jobId }),
  });
}

export async function removeFromQueue(jobId: number): Promise<void> {
  return serverFetch(`/api/queue/${jobId}`, { method: "DELETE" });
}

export async function getQueue(): Promise<{ queue: QueueEntry[]; count: number }> {
  return serverFetch<{ queue: QueueEntry[]; count: number }>("/api/queue");
}

export async function bulkApply(): Promise<{ queued: number }> {
  return serverFetch<{ queued: number }>("/api/apply/bulk", {
    method: "POST",
  });
}

// ── Applications ────────────────────────────────────────────────
export async function getApplications(): Promise<CcApplication[]> {
  return serverFetch<CcApplication[]>("/api/applications");
}

export async function getApplicationLogs(
  applicationId: string
): Promise<CcApplicationLog[]> {
  return serverFetch<CcApplicationLog[]>(
    `/api/applications/${applicationId}/logs`
  );
}

export async function updateApplicationStatus(
  applicationId: string,
  status: CcApplication["status"]
): Promise<void> {
  return serverFetch(`/api/applications/${applicationId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ── Resumes ─────────────────────────────────────────────────────
export async function getResumes(): Promise<CcResume[]> {
  return serverFetch<CcResume[]>("/api/resumes");
}

export async function createResume(
  data: Partial<CcResume>
): Promise<CcResume> {
  return serverFetch<CcResume>("/api/resumes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateResume(
  id: string,
  data: Partial<CcResume>
): Promise<CcResume> {
  return serverFetch<CcResume>(`/api/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteResume(id: string): Promise<void> {
  return serverFetch(`/api/resumes/${id}`, { method: "DELETE" });
}

export async function parseResume(
  resumeId: string
): Promise<{ parsed: true }> {
  return serverFetch(`/api/resumes/${resumeId}/parse`, { method: "POST" });
}

// ── AI Tools ────────────────────────────────────────────────────
export async function getMatchScore(jobId: number): Promise<CcMatchScore> {
  return serverFetch<CcMatchScore>(`/api/ai/match/${jobId}`, {
    method: "POST",
  });
}

export async function generateCoverLetter(
  jobId: number,
  tone: CoverLetterTone
): Promise<CcCoverLetter> {
  return serverFetch<CcCoverLetter>(`/api/ai/cover-letter`, {
    method: "POST",
    body: JSON.stringify({ job_id: jobId, tone }),
  });
}

// ── Community ───────────────────────────────────────────────────
export async function getCommunityPosts(
  page = 1
): Promise<PaginatedResponse<CcCommunityPost>> {
  return serverFetch<PaginatedResponse<CcCommunityPost>>(
    `/api/community/posts?page=${page}`
  );
}

export async function createPost(data: {
  content: string;
  post_type: string;
}): Promise<CcCommunityPost> {
  return serverFetch<CcCommunityPost>("/api/community/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function likePost(postId: string): Promise<void> {
  return serverFetch(`/api/community/posts/${postId}/like`, {
    method: "POST",
  });
}

// ── Resources ───────────────────────────────────────────────────
export async function getResources(params?: {
  domain?: string;
  category?: string;
}): Promise<CcResource[]> {
  const qs = params
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : "";
  return serverFetch<CcResource[]>(`/api/resources${qs}`);
}


