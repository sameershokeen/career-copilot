// Client-safe API helpers. Deliberately has NO import from
// "@clerk/nextjs/server" (that's a server-only module) — client components
// (queue-context, QueuePanel, JobDrawer, CommunityClient, ApplicationsClient)
// import from this file instead of lib/api.ts, which does import the
// server-only Clerk helper for its serverFetch(). Mixing the two in one
// module makes Next's "server-only" guard reject the whole bundle wherever
// a client component pulls it in transitively.
import type {
  Job,
  CcCoverLetter,
  CcMatchScore,
  CoverLetterTone,
} from "@career-copilot/shared";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...rest } = options ?? {};

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...rest.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  return res.json();
}

export interface QueueEntry {
  id: string; // cc_apply_queue row id — used for DELETE /api/queue/:id
  job_id: number;
  added_at: string;
  job: Job | null;
}

export function createClientApi(token: string) {
  return {
    addToQueue: (jobId: number) =>
      apiFetch<{ queued: QueueEntry | { already_queued: true } }>(`/api/queue`, {
        method: "POST",
        body: JSON.stringify({ job_id: jobId }),
        token,
      }),
    // id is the cc_apply_queue row id (returned by addToQueue), not job_id.
    removeFromQueue: (queueEntryId: string) =>
      apiFetch(`/api/queue/${queueEntryId}`, { method: "DELETE", token }),
    getQueue: () => apiFetch<{ queue: QueueEntry[]; count: number }>("/api/queue", { token }),
    bulkApply: () =>
      apiFetch<{ queued: number }>("/api/apply/bulk", {
        method: "POST",
        token,
      }),
    getMatchScore: (jobId: number) =>
      apiFetch<CcMatchScore>(`/api/ai/match/${jobId}`, {
        method: "POST",
        token,
      }),
    generateCoverLetter: (jobId: number, tone: CoverLetterTone) =>
      apiFetch<CcCoverLetter>("/api/ai/cover-letter", {
        method: "POST",
        body: JSON.stringify({ job_id: jobId, tone }),
        token,
      }),
    updateApplicationStatus: (applicationId: string, status: string) =>
      apiFetch(`/api/applications/${applicationId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
        token,
      }),
    likePost: (postId: string) =>
      apiFetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
        token,
      }),
    createPost: (data: { content: string; post_type: string }) =>
      apiFetch("/api/community/posts", {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }),
  };
}
