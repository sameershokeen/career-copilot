import { Suspense } from "react";
import { JobBoardClient } from "./JobBoardClient";

export const metadata = {
  title: "Job Board — Career Copilot",
};

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Board</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live postings from across the web — updated continuously.
        </p>
      </div>
      <Suspense fallback={<JobBoardSkeleton />}>
        <JobBoardClient />
      </Suspense>
    </div>
  );
}

function JobBoardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton h-36 rounded-xl" />
      ))}
    </div>
  );
}
