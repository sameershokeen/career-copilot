"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2, AlertCircle } from "lucide-react";
import { JobCard } from "@/components/job-board/JobCard";
import { JobDrawer } from "@/components/job-board/JobDrawer";
import { JobFilters } from "@/components/job-board/JobFilters";
import type { Job, JobFilterChip } from "@career-copilot/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const PAGE_SIZE = 20;

export function JobBoardClient() {
  const { getToken } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeChips, setActiveChips] = useState<JobFilterChip[]>([]);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchJobs = useCallback(
    async (pg: number, append = false) => {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/jobs/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            search: search || undefined,
            chips: activeChips,
            page: pg,
            limit: PAGE_SIZE,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Defensive: never let a malformed/unexpected API response corrupt
        // `jobs` into something other than an array — that's exactly what
        // crashed this page before (jobs.length on undefined).
        const incoming = Array.isArray(data?.data) ? data.data : [];
        setJobs((prev) => (append ? [...prev, ...incoming] : incoming));
        setTotal(typeof data?.total === "number" ? data.total : incoming.length);
        setPage(pg);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [getToken, search, activeChips]
  );

  // Initial load + refetch on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  function handleChipToggle(chip: JobFilterChip) {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  }

  function handleJobClick(job: Job) {
    setSelectedJob(job);
    setDrawerOpen(true);
  }

  const hasMore = jobs.length < total;

  return (
    <>
      <JobFilters
        search={search}
        onSearchChange={setSearch}
        activeChips={activeChips}
        onChipToggle={handleChipToggle}
      />

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-muted-foreground">
          {total.toLocaleString()} job{total !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
          <button
            onClick={() => fetchJobs(1)}
            className="ml-auto underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-xl" />
          ))}
        </div>
      )}

      {/* Job grid */}
      {!loading && jobs.length === 0 && !error && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <p className="text-sm font-medium text-foreground">No jobs match your filters</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search or clearing some filters.
          </p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => handleJobClick(job)}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchJobs(page + 1, true)}
            disabled={loadingMore}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60"
          >
            {loadingMore ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Loading…</>
            ) : (
              `Load more (${total - jobs.length} remaining)`
            )}
          </button>
        </div>
      )}

      {/* Job detail drawer */}
      <JobDrawer
        job={selectedJob}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
