import { Sparkles, Target, FileText } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "AI Tools — Career Copilot" };

export default function AIToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Tools</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Let the AI do the heavy lifting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Match Scorer */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-100">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Match Scorer</h3>
              <p className="text-xs text-muted-foreground">
                See how well your profile fits a job
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Open any job from the Job Board and click{" "}
            <strong className="text-foreground">Compute Match</strong> in the
            detail drawer to get a full breakdown: skills match, experience
            match, domain match, and what you&apos;re missing.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Browse jobs to score
          </Link>
        </div>

        {/* Cover Letter */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 border border-brand-100">
              <FileText className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Cover Letter Generator</h3>
              <p className="text-xs text-muted-foreground">
                Tailored letters in 3 tones
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Open any job from the Job Board and click{" "}
            <strong className="text-foreground">Generate Cover Letter</strong>{" "}
            to get a 3-paragraph, 250-word letter customised to the role. Choose
            between Formal, Casual, or Enthusiastic tone.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Browse jobs to generate
          </Link>
        </div>
      </div>

      {/* Auto-apply info */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          Auto-Apply Pipeline
        </h3>
        <p className="mt-2 text-sm text-emerald-800">
          Add jobs to the queue from the Job Board, then hit{" "}
          <strong>Bulk Approve &amp; Auto-Apply</strong>. The AI will fill and
          submit each application using your resume and generated cover letter.
          CAPTCHA-blocked sites get flagged as &ldquo;Manual Required&rdquo;
          with a pre-filled form you can paste in.
        </p>
      </div>
    </div>
  );
}
