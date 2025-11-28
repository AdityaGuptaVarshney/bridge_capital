export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}

