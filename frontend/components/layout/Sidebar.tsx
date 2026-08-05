"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CheckSquare,
  Sparkles,
  Users,
  BookOpen,
  Settings,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Job Board",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    label: "My Applications",
    href: "/applications",
    icon: CheckSquare,
  },
  {
    label: "Resume Builder",
    href: "/resume",
    icon: FileText,
  },
  {
    label: "AI Tools",
    href: "/ai-tools",
    icon: Sparkles,
  },
  {
    label: "Community",
    href: "/community",
    icon: Users,
  },
  {
    label: "Resources",
    href: "/resources",
    icon: BookOpen,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col"
      style={{ backgroundColor: "hsl(222, 47%, 9%)" }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center gap-2.5 px-5 border-b"
        style={{ borderColor: "hsl(222, 47%, 14%)" }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
          <Rocket className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">
            Career
          </p>
          <p className="text-xs font-medium text-brand-400 leading-tight">
            Copilot
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-brand-500/20 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      active ? "text-brand-400" : "text-slate-500"
                    )}
                  />
                  {item.label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div
        className="border-t px-4 py-3"
        style={{ borderColor: "hsl(222, 47%, 14%)" }}
      >
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">
              My Account
            </p>
            <p className="text-xs text-slate-500">Settings & billing</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
