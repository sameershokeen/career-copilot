import { ResourcesClient } from "./ResourcesClient";

export const metadata = { title: "Resources — Career Copilot" };

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resources</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Roadmaps, tips, and guides to help you land the role.
        </p>
      </div>
      <ResourcesClient />
    </div>
  );
}
