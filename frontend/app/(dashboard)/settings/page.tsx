import { SettingsClient } from "./SettingsClient";

export const metadata = { title: "Settings — Career Copilot" };

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, plan, and notifications.
        </p>
      </div>
      <SettingsClient />
    </div>
  );
}
