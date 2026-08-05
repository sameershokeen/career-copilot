"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo, formatDateTime, statusLabel } from "@/lib/format";
import { createClientApi } from "@/lib/api-client";
import type { CcApplication, CcApplicationLog, ApplicationStatus } from "@career-copilot/shared";

const COLUMNS: { status: ApplicationStatus; label: string; color: string }[] =
  [
    { status: "queued", label: "Queued", color: "bg-muted" },
    { status: "applied", label: "Applied", color: "bg-blue-50" },
    { status: "viewed", label: "Viewed", color: "bg-purple-50" },
    { status: "interview", label: "Interview", color: "bg-amber-50" },
    { status: "offer", label: "Offer 🎉", color: "bg-emerald-50" },
    { status: "rejected", label: "Rejected", color: "bg-rose-50" },
  ];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function ApplicationsClient() {
  const { getToken } = useAuth();
  const [applications, setApplications] = useState<CcApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  async function handleStatusChange(id: string, newStatus: ApplicationStatus) {
    const token = await getToken();
    if (!token) return;
    const api = createClientApi(token);
    await api.updateApplicationStatus(id, newStatus);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
        <p className="text-sm font-medium text-foreground">No applications yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add jobs to the queue and hit &ldquo;Bulk Approve &amp; Auto-Apply&rdquo; to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-4">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.status);
          return (
            <div key={col.status} className="w-72 flex-shrink-0">
              {/* Column header */}
              <div className={cn("rounded-t-xl border border-b-0 border-border px-4 py-3", col.color)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    {col.label}
                  </h3>
                  <span className="rounded-full bg-background border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {colApps.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="rounded-b-xl border border-border bg-background p-2 space-y-2 min-h-32">
                {colApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApplicationCard({
  application,
  onStatusChange,
}: {
  application: CcApplication;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}) {
  const { getToken } = useAuth();
  const [logsOpen, setLogsOpen] = useState(false);
  const [logs, setLogs] = useState<CcApplicationLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  async function toggleLogs() {
    if (!logsOpen && logs.length === 0) {
      setLoadingLogs(true);
      const token = await getToken();
      if (token) {
        const res = await fetch(
          `${API_URL}/api/applications/${application.id}/logs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) setLogs(await res.json());
      }
      setLoadingLogs(false);
    }
    setLogsOpen(!logsOpen);
  }

  const STATUS_OPTIONS: ApplicationStatus[] = [
    "queued",
    "applied",
    "viewed",
    "interview",
    "offer",
    "rejected",
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2 text-sm">
      {/* Title + company */}
      <div>
        <p className="font-medium text-foreground line-clamp-1">
          {application.job?.title ?? "Job"}
        </p>
        <p className="text-xs text-muted-foreground">
          {application.job?.company ?? ""}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {application.applied_at
          ? timeAgo(application.applied_at)
          : timeAgo(application.created_at)}
        {application.job?.job_url && (
          <a
            href={application.job.job_url}
            target="_blank"
            rel="noopener"
            className="ml-auto"
          >
            <ExternalLink className="h-3 w-3 hover:text-brand-500 transition-colors" />
          </a>
        )}
      </div>

      {/* Status badges for failed/manual */}
      {(application.status === "manual_required" ||
        application.status === "failed") && (
        <div
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium",
            application.status === "manual_required"
              ? "bg-orange-50 text-orange-700 border border-orange-200"
              : "bg-red-50 text-red-700 border border-red-200"
          )}
        >
          {statusLabel(application.status)}
        </div>
      )}

      {/* Manual status update */}
      <select
        value={application.status}
        onChange={(e) =>
          onStatusChange(application.id, e.target.value as ApplicationStatus)
        }
        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {statusLabel(s)}
          </option>
        ))}
      </select>

      {/* Logs toggle */}
      <button
        onClick={toggleLogs}
        className="flex w-full items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>View log</span>
        {loadingLogs ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : logsOpen ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {logsOpen && logs.length > 0 && (
        <div className="border-t border-border pt-2 space-y-1.5">
          {logs.map((log) => (
            <div key={log.id} className="text-xs">
              <span className="font-mono text-muted-foreground">
                [{formatDateTime(log.created_at)}]
              </span>{" "}
              <span className="text-foreground">{log.event}</span>
              {log.detail && (
                <p className="text-muted-foreground pl-2">{log.detail}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
