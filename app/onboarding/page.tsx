import type { Metadata } from "next";

export const metadata: Metadata = { title: "Benvenuto — Takobon" };

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Benvenuto su Takobon
          </h1>
          <p className="text-sm text-text-secondary">
            Costruiamo il tuo archivio.
          </p>
        </div>
        {/* TODO: OnboardingFlow (step 1: interests, step 2: first series, step 3: done) */}
      </div>
    </main>
  );
}
