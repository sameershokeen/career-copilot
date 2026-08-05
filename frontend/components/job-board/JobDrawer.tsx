"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import {
  MapPin,
  Globe,
  Clock,
  ExternalLink,
  Plus,
  Check,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo, scoreColor, scoreBg } from "@/lib/format";
import { createClientApi } from "@/lib/api-client";
import { useQueue } from "@/lib/queue-context";
import type { Job, CcMatchScore, CcCoverLetter } from "@career-copilot/shared";

interface JobDrawerProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

type CoverLetterTone = "formal" | "casual" | "enthusiastic";

export function JobDrawer({ job, open, onClose }: JobDrawerProps) {
  const { getToken } = useAuth();
  const { addToQueue, removeFromQueue, isQueued } = useQueue();

  const [matchScore, setMatchScore] = useState<CcMatchScore | null>(null);
  const [scoringMatch, setScoringMatch] = useState(false);

  const [coverLetter, setCoverLetter] = useState<CcCoverLetter | null>(null);
  const [generatingCL, setGeneratingCL] = useState(false);
  const [clTone, setClTone] = useState<CoverLetterTone>("formal");

  if (!job) return null;

  const queued = isQueued(job.id);
  const description =
    job.description ??
    (job.raw?.description as string | null) ??
    null;

  async function handleComputeMatch() {
    setScoringMatch(true);
    try {
      const token = await getToken();
      if (!token) return;
      const api = createClientApi(token);
      const score = await api.getMatchScore(job!.id);
      setMatchScore(score);
    } catch (err) {
      console.error(err);
    } finally {
      setScoringMatch(false);
    }
  }

  async function handleGenerateCL() {
    setGeneratingCL(true);
    try {
      const token = await getToken();
      if (!token) return;
      const api = createClientApi(token);
      const cl = await api.generateCoverLetter(job!.id, clTone);
      setCoverLetter(cl);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingCL(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-background shadow-2xl transition-transform duration-300 overflow-y-auto",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 pt-16 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground leading-tight pr-8">
              {job.title}
            </h2>
            {job.company && (
              <p className="text-lg text-muted-foreground">{job.company}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground pt-1">
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
              )}
              {job.is_remote && (
                <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                  <Globe className="h-4 w-4" />
                  Remote
                </span>
              )}
              {job.job_type && (
                <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs">
                  {job.job_type}
                </span>
              )}
              {job.date_posted && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {timeAgo(job.date_posted)}
                </span>
              )}
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-3 pb-2 border-b border-border">
            {job.job_url && (
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Apply Directly
              </a>
            )}
            <button
              onClick={() => queued ? removeFromQueue(job.id) : addToQueue(job)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
                queued
                  ? "border border-brand-200 bg-brand-50 text-brand-700"
                  : "bg-brand-500 text-white hover:bg-brand-600"
              )}
            >
              {queued ? (
                <><Check className="h-4 w-4" />In Queue</>
              ) : (
                <><Plus className="h-4 w-4" />Add to Queue</>
              )}
            </button>
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-border bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Match Score */}
          <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-500" />
                <h3 className="text-sm font-semibold text-foreground">
                  AI Match Score
                </h3>
              </div>
              {!matchScore && (
                <button
                  onClick={handleComputeMatch}
                  disabled={scoringMatch}
                  className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-60 transition-colors"
                >
                  {scoringMatch ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" />Computing…</>
                  ) : (
                    "Compute Match"
                  )}
                </button>
              )}
            </div>

            {matchScore && (
              <div className="space-y-3 animate-slide-up">
                {/* Overall score */}
                <div className={cn("rounded-lg border px-4 py-3 text-center", scoreBg(matchScore.overall_score))}>
                  <span className={cn("text-3xl font-bold", scoreColor(matchScore.overall_score))}>
                    {matchScore.overall_score}%
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">Overall Match</p>
                </div>

                {/* Sub scores */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Skills", value: matchScore.skills_match },
                    { label: "Experience", value: matchScore.experience_match },
                    { label: "Domain", value: matchScore.domain_match },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg border border-border bg-background p-3 text-center">
                      <span className={cn("text-lg font-bold", scoreColor(value))}>
                        {value}%
                      </span>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Missing skills */}
                {matchScore.missing_skills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Missing skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {matchScore.missing_skills.map((s) => (
                        <span key={s} className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-xs text-rose-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {matchScore.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Strengths</p>
                    <ul className="space-y-1">
                      {matchScore.strengths.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-xs text-foreground">
                          <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-muted-foreground border-t border-border pt-3">
                  {matchScore.summary}
                </p>
              </div>
            )}
          </div>

          {/* Cover Letter Generator */}
          <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-500" />
                <h3 className="text-sm font-semibold text-foreground">
                  Cover Letter
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={clTone}
                  onChange={(e) => setClTone(e.target.value as CoverLetterTone)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
                <button
                  onClick={handleGenerateCL}
                  disabled={generatingCL}
                  className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-60 transition-colors"
                >
                  {generatingCL ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" />Generating…</>
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
            </div>

            {coverLetter && (
              <div className="rounded-lg border border-border bg-background p-4 animate-slide-up">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {coverLetter.content}
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(coverLetter.content)}
                  className="mt-3 text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  Copy to clipboard
                </button>
              </div>
            )}
          </div>

          {/* Job Description */}
          {description && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                Job Description
              </h3>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
