"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import { Loader2, AlertCircle, BookOpen, X, Map, Lightbulb, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CcResource, ResourceDomain, ResourceCategory } from "@career-copilot/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const DOMAINS: { id: ResourceDomain | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "AI/ML" },
  { id: "general", label: "General" },
];

const CATEGORY_ICON: Record<ResourceCategory, React.ElementType> = {
  roadmap: Map,
  tip: Lightbulb,
  guide: FileQuestion,
};

export function ResourcesClient() {
  const { getToken } = useAuth();
  const [resources, setResources] = useState<CcResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<ResourceDomain | "all">("all");
  const [selected, setSelected] = useState<CcResource | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const token = await getToken();
      try {
        const qs = domain !== "all" ? `?domain=${domain}` : "";
        const res = await fetch(`${API_URL}/api/resources${qs}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setResources(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load resources");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken, domain]);

  return (
    <div className="space-y-5">
      {/* Domain filter */}
      <div className="flex flex-wrap gap-2">
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDomain(d.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
              domain === d.id
                ? "border-brand-300 bg-brand-50 text-brand-700"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && resources.length === 0 && !error && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <BookOpen className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">No resources yet</p>
        </div>
      )}

      {!loading && resources.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => {
            const Icon = r.category ? CATEGORY_ICON[r.category] : BookOpen;
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5 text-left hover:border-brand-300 hover:shadow-sm transition-all"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 border border-brand-100">
                  <Icon className="h-[18px] w-[18px] text-brand-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
                  {r.category && (
                    <span className="mt-1 inline-block text-xs text-muted-foreground capitalize">
                      {r.category}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-8 shadow-2xl">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-foreground pr-8">{selected.title}</h2>
            <div className="prose prose-sm max-w-none mt-4 text-foreground">
              <ReactMarkdown>{selected.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
