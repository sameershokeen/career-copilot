"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";
import type { Job } from "@career-copilot/shared";
import { createClientApi } from "./api-client";

// A queued job paired with the cc_apply_queue row id the backend assigned it.
// The row id (not job_id) is what DELETE /api/queue/:id expects.
interface QueuedItem {
  queueId: string;
  job: Job;
}

interface QueueContextValue {
  queuedJobs: Job[];
  addToQueue: (job: Job) => void;
  removeFromQueue: (jobId: number) => void;
  clearQueue: () => void;
  isQueued: (jobId: number) => boolean;
  loading: boolean;
}

const QueueContext = createContext<QueueContextValue | null>(null);

export function QueueProvider({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const [items, setItems] = useState<QueuedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Hydrate from the server on mount so the queue survives a refresh —
  // it used to live only in React state and was never fetched at all.
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (!isSignedIn) {
        setLoading(false);
        return;
      }
      try {
        const token = await getToken();
        if (!token) return;
        const api = createClientApi(token);
        const { queue } = await api.getQueue();
        if (cancelled) return;
        setItems(
          queue
            .filter((entry) => entry.job !== null)
            .map((entry) => ({ queueId: entry.id, job: entry.job as Job }))
        );
      } catch (err) {
        console.error("Failed to load queue:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, getToken]);

  const addToQueue = useCallback(
    (job: Job) => {
      setItems((prev) => {
        if (prev.some((i) => i.job.id === job.id)) return prev;
        return prev; // don't optimistically add until we know the real queueId
      });

      (async () => {
        try {
          const token = await getToken();
          if (!token) throw new Error("Not authenticated");
          const api = createClientApi(token);
          const result = await api.addToQueue(job.id);
          const queued = result.queued;
          if ("already_queued" in queued) return; // already there server-side
          setItems((prev) =>
            prev.some((i) => i.job.id === job.id)
              ? prev
              : [...prev, { queueId: queued.id, job }]
          );
        } catch (err) {
          console.error("Failed to add to queue:", err);
        }
      })();
    },
    [getToken]
  );

  const removeFromQueue = useCallback(
    (jobId: number) => {
      const item = items.find((i) => i.job.id === jobId);
      // Optimistic remove
      setItems((prev) => prev.filter((i) => i.job.id !== jobId));
      if (!item) return;

      (async () => {
        try {
          const token = await getToken();
          if (!token) throw new Error("Not authenticated");
          const api = createClientApi(token);
          await api.removeFromQueue(item.queueId);
        } catch (err) {
          console.error("Failed to remove from queue:", err);
          // Roll back on failure
          setItems((prev) =>
            prev.some((i) => i.job.id === jobId) ? prev : [...prev, item]
          );
        }
      })();
    },
    [items, getToken]
  );

  const clearQueue = useCallback(() => {
    setItems([]);
  }, []);

  const isQueued = useCallback(
    (jobId: number) => items.some((i) => i.job.id === jobId),
    [items]
  );

  const queuedJobs = items.map((i) => i.job);

  return (
    <QueueContext.Provider
      value={{ queuedJobs, addToQueue, removeFromQueue, clearQueue, isQueued, loading }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error("useQueue must be inside QueueProvider");
  return ctx;
}
