"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ChevronUp, ChevronDown, X, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClientApi } from "@/lib/api-client";
import type { Job } from "@career-copilot/shared";

interface QueuePanelProps {
  jobs: Job[];
  onRemove: (jobId: number) => void;
  onApplyComplete: (result: { queued: number }) => void;
}

export function QueuePanel({ jobs, onRemove, onApplyComplete }: QueuePanelProps) {
  const { getToken } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);

  if (jobs.length === 0) return null;

  async function handleBulkApply() {
    setApplying(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const api = createClientApi(token);
      const result = await api.bulkApply();
      onApplyComplete(result);
    } catch (err) {
      console.error("Bulk apply error:", err);
    } finally {
      setApplying(false);
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-56 right-0 z-50 border-t border-border bg-white shadow-xl transition-all duration-300",
        expanded ? "max-h-96" : "h-14"
      )}
    >
      {/* Header bar */}
      <div className="flex h-14 items-center gap-3 px-6">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
          {jobs.length}
        </div>
        <span className="text-sm font-semibold text-foreground">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} in queue
        </span>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                Collapse
              </>
            ) : (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                Review queue
              </>
            )}
          </button>

          <button
            onClick={handleBulkApply}
            disabled={applying}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all",
              applying
                ? "bg-brand-400 cursor-not-allowed"
                : "bg-brand-500 hover:bg-brand-600 active:scale-95"
            )}
          >
            {applying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Applying…
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Bulk Approve & Auto-Apply
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded job list */}
      {expanded && (
        <div className="overflow-y-auto border-t border-border px-6 py-3 max-h-80">
          <ul className="space-y-2">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {job.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {job.company}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(job.id)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
