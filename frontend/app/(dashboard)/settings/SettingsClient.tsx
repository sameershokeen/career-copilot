"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Loader2, Zap, Check, Bell, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@career-copilot/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function SettingsClient() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/user/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setStatus(await res.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  return (
    <div className="space-y-6">
      {/* Plan card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Your Plan</h3>
            {status?.plan === "pro" && (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-700">
                <Crown className="h-3 w-3" />
                Pro
              </span>
            )}
          </div>
          {status?.plan !== "pro" && (
            <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition-colors">
              <Zap className="h-3.5 w-3.5" />
              Upgrade to Pro
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading usage…
          </div>
        ) : status ? (
          <div className="grid grid-cols-3 gap-3">
            <UsageBar
              label="Auto-apply"
              used={status.apply_count}
              limit={status.apply_limit}
            />
            <UsageBar
              label="Cover letters"
              used={status.cover_letter_count}
              limit={status.cover_letter_limit}
            />
            <UsageBar
              label="Resumes"
              used={status.resume_count}
              limit={status.resume_limit}
            />
          </div>
        ) : null}
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Profile</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" defaultValue={user?.fullName ?? ""} />
          <Field label="Email" defaultValue={user?.primaryEmailAddress?.emailAddress ?? ""} disabled />
          <Field label="Phone" placeholder="+91 98765 43210" />
          <Field label="Location" placeholder="Bangalore, India" />
          <Field label="LinkedIn" placeholder="linkedin.com/in/username" />
          <Field label="GitHub" placeholder="github.com/username" />
          <Field label="Portfolio" placeholder="yourdomain.dev" />
          <Field label="Twitter / X" placeholder="@username" />
        </div>
        <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors">
          Save changes
        </button>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Job Alerts</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Keywords" placeholder="React, Frontend, Remote" />
          <Field label="Location" placeholder="India, Remote" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">SMS alerts</p>
            <p className="text-xs text-muted-foreground">
              Pro feature — get texted for 80%+ matches
            </p>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {status?.plan === "pro" ? "Available" : "Pro only"}
          </span>
        </div>
        <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors">
          Save alert preferences
        </button>
      </div>
    </div>
  );
}

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const isUnlimited = !isFinite(limit);
  const pct = isUnlimited ? 0 : Math.min(100, (used / limit) * 100);

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {used} {isUnlimited ? "" : `/ ${limit}`}
        {isUnlimited && (
          <span className="ml-1 text-xs font-normal text-emerald-600">
            Unlimited
          </span>
        )}
      </p>
      {!isUnlimited && (
        <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              pct >= 90 ? "bg-rose-500" : pct >= 60 ? "bg-amber-500" : "bg-brand-500"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  defaultValue,
  placeholder,
  disabled,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500",
          disabled && "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      />
    </div>
  );
}
