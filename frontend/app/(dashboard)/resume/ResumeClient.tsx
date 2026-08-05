"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Plus, FileText, Star, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/format";
import type { CcResume } from "@career-copilot/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function ResumeClient() {
  const { getToken } = useAuth();
  const [resumes, setResumes] = useState<CcResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/resumes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setResumes(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load resumes");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  async function handleCreate() {
    setCreating(true);
    const token = await getToken();
    if (!token) { setCreating(false); return; }
    try {
      const res = await fetch(`${API_URL}/api/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `Resume ${resumes.length + 1}`,
          content: {
            personal: { name: "", email: "", phone: "", location: "" },
            social_links: { linkedin: "", github: "", portfolio: "", twitter: "", other: [] },
            summary: "",
            experience: [],
            projects: [],
            education: [],
            skills: { languages: [], frameworks: [], tools: [], soft: [] },
            certifications: [],
            publications: [],
          },
          is_default: resumes.length === 0,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const newResume = await res.json();
      setResumes((prev) => [...prev, newResume]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create resume");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    const token = await getToken();
    if (!token) return;
    await fetch(`${API_URL}/api/resumes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setResumes((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Resume grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Create new card */}
        <button
          onClick={handleCreate}
          disabled={creating}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8",
            "hover:border-brand-300 hover:bg-brand-50/30 transition-colors",
            "disabled:opacity-60"
          )}
        >
          {creating ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <Plus className="h-6 w-6 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-muted-foreground">
            New Resume
          </span>
        </button>

        {/* Existing resumes */}
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 hover:border-brand-300 hover:shadow-sm transition-all"
          >
            {resume.is_default && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                Default
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 border border-brand-100">
                <FileText className="h-5 w-5 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {resume.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Updated {timeAgo(resume.updated_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                Edit
              </button>
              <button className="flex-1 rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition-colors">
                Export PDF
              </button>
              <button
                onClick={() => handleDelete(resume.id)}
                className="rounded-lg border border-border p-2 text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Free plan: up to 5 resumes · Pro: up to 30 resumes
      </p>
    </div>
  );
}
