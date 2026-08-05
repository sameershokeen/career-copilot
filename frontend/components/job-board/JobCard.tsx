"use client";

import { MapPin, Globe, Clock, Plus, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/format";
import { useQueue } from "@/lib/queue-context";
import type { Job } from "@career-copilot/shared";

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  const { addToQueue, removeFromQueue, isQueued } = useQueue();
  const queued = isQueued(job.id);

  function handleQueue(e: React.MouseEvent) {
    e.stopPropagation();
    if (queued) {
      removeFromQueue(job.id);
    } else {
      addToQueue(job);
    }
  }

  function handleApply(e: React.MouseEvent) {
    e.stopPropagation();
    if (job.job_url) {
      window.open(job.job_url, "_blank", "noopener");
    }
  }

  // First source platform
  const sourcePlatform = job.sources?.[0] ?? job.source_site;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-3 rounded-xl border bg-card p-5 transition-all duration-150",
        "hover:border-brand-300 hover:shadow-sm",
        queued && "border-brand-300 bg-brand-50/30"
      )}
    >
      {/* Top row: company + source */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
            {job.title}
          </h3>
          {job.company && (
            <p className="mt-0.5 text-sm text-muted-foreground truncate">
              {job.company}
            </p>
          )}
        </div>
        {sourcePlatform && (
          <span className="flex-shrink-0 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
            {sourcePlatform}
          </span>
        )}
      </div>

      {/* Meta row: location + remote + type */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
        )}
        {job.is_remote && (
          <span className="flex items-center gap-1 font-medium text-emerald-600">
            <Globe className="h-3 w-3" />
            Remote
          </span>
        )}
        {job.job_type && (
          <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5">
            {job.job_type}
          </span>
        )}
      </div>

      {/* Skills — hidden if null */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="text-xs text-muted-foreground">
              +{job.skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Footer: dates + actions */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {job.date_posted && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(job.date_posted)}
            </span>
          )}
          {job.first_seen_at && (
            <span>Added {timeAgo(job.first_seen_at)}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {job.job_url && (
            <button
              onClick={handleApply}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <ExternalLink className="inline h-3 w-3 mr-1" />
              Apply
            </button>
          )}
          <button
            onClick={handleQueue}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              queued
                ? "bg-brand-100 text-brand-700 border border-brand-200"
                : "bg-brand-500 text-white hover:bg-brand-600"
            )}
          >
            {queued ? (
              <>
                <Check className="h-3 w-3" />
                Queued
              </>
            ) : (
              <>
                <Plus className="h-3 w-3" />
                Add to Queue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
