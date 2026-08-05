import { ApplicationsClient } from "./ApplicationsClient";

export const metadata = { title: "My Applications — Career Copilot" };

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track every application — auto-applied and manual.
        </p>
      </div>
      <ApplicationsClient />
    </div>
  );
}
