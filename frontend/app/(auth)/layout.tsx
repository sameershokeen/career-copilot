export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500">
            <span className="text-xl">🚀</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">Career Copilot</h1>
          <p className="mt-1 text-sm text-slate-400">
            Apply smarter, not harder.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
