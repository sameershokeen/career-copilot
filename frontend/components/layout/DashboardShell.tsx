"use client";

import { useQueue } from "@/lib/queue-context";
import { QueuePanel } from "./QueuePanel";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { queuedJobs, removeFromQueue, clearQueue } = useQueue();
  const { toast } = useToast();

  function handleApplyComplete(result: { queued: number }) {
    clearQueue();
    toast({
      title: "Applications submitted!",
      description: `${result.queued} application${result.queued !== 1 ? "s" : ""} queued for auto-apply. Check the tracker for progress.`,
    });
  }

  return (
    <>
      <main className="ml-56 flex-1 min-h-screen">
        <div className="p-6 pb-20">{children}</div>
      </main>

      <QueuePanel
        jobs={queuedJobs}
        onRemove={removeFromQueue}
        onApplyComplete={handleApplyComplete}
      />

      <Toaster />
    </>
  );
}
