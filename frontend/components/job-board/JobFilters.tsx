"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobFilterChip } from "@career-copilot/shared";

interface JobFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  activeChips: JobFilterChip[];
  onChipToggle: (chip: JobFilterChip) => void;
}

const CHIPS: { id: JobFilterChip; label: string; emoji: string }[] = [
  { id: "india", label: "India", emoji: "🇮🇳" },
  { id: "remote", label: "Remote", emoji: "🌐" },
  { id: "abroad", label: "Abroad", emoji: "✈️" },
  { id: "24h", label: "Last 24h", emoji: "📅" },
  { id: "3days", label: "Last 3 days", emoji: "📅" },
  { id: "week", label: "Last week", emoji: "📅" },
];

export function JobFilters({
  search,
  onSearchChange,
  activeChips,
  onChipToggle,
}: JobFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search roles, companies…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => {
          const active = activeChips.includes(chip.id);
          return (
            <button
              key={chip.id}
              onClick={() => onChipToggle(chip.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                active
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-border bg-background text-muted-foreground hover:border-brand-200 hover:text-foreground"
              )}
            >
              <span>{chip.emoji}</span>
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
