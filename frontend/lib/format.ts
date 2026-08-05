import { formatDistanceToNow, parseISO } from "date-fns";

export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return "";
  }
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(parseISO(dateStr));
  } catch {
    return "";
  }
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parseISO(dateStr));
  } catch {
    return "";
  }
}

export function scoreColor(score: number): string {
  if (score >= 75) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
}

export function scoreBg(score: number): string {
  if (score >= 75) return "bg-emerald-50 border-emerald-200";
  if (score >= 50) return "bg-amber-50 border-amber-200";
  return "bg-rose-50 border-rose-200";
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    queued: "Queued",
    applied: "Applied",
    viewed: "Viewed",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
    manual_required: "Manual Required",
    failed: "Failed",
  };
  return labels[status] ?? status;
}
