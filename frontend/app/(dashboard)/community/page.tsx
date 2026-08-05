import { CommunityClient } from "./CommunityClient";

export const metadata = { title: "Community — Career Copilot" };

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Updates, questions, and founder connect.
        </p>
      </div>
      <CommunityClient />
    </div>
  );
}
