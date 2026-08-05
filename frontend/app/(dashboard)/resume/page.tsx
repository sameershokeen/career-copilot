import { ResumeClient } from "./ResumeClient";

export const metadata = { title: "Resume Builder — Career Copilot" };

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Build and manage multiple tailored resumes.
        </p>
      </div>
      <ResumeClient />
    </div>
  );
}
