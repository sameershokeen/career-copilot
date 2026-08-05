import { Sidebar } from "@/components/layout/Sidebar";
import { QueueProvider } from "@/lib/queue-context";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueueProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <DashboardShell>{children}</DashboardShell>
      </div>
    </QueueProvider>
  );
}
