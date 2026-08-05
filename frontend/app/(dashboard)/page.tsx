import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  Briefcase,
  CheckSquare,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard — Career Copilot" };

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Good morning{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your job search at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Briefcase}
          label="Jobs browsed"
          value="—"
          color="blue"
        />
        <StatCard
          icon={CheckSquare}
          label="Applications sent"
          value="—"
          color="green"
        />
        <StatCard
          icon={Clock}
          label="In queue"
          value="—"
          color="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg match score"
          value="—"
          color="purple"
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink
          href="/jobs"
          title="Browse Live Jobs"
          description="Explore fresh postings from across the web."
          emoji="🔍"
        />
        <QuickLink
          href="/resume"
          title="Build Your Resume"
          description="Create a tailored resume for every application."
          emoji="📄"
        />
        <QuickLink
          href="/ai-tools"
          title="AI Tools"
          description="Match scores, cover letters, auto-fill."
          emoji="✨"
        />
      </div>

      {/* Getting started banner (show until profile is complete) */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-brand-900">
              Complete your profile to unlock Auto-Apply
            </h3>
            <p className="mt-1 text-sm text-brand-700">
              Upload your resume so the AI can tailor cover letters and fill
              applications on your behalf.
            </p>
          </div>
          <Link
            href="/resume"
            className="flex-shrink-0 flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: "blue" | "green" | "amber" | "purple";
}) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
  emoji,
}: {
  href: string;
  title: string;
  description: string;
  emoji: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-brand-300 hover:shadow-sm"
    >
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-brand-600 transition-colors">
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-500 transition-colors mt-0.5" />
    </Link>
  );
}
