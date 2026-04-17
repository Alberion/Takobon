import type { Metadata } from "next";
import { SignupForm } from "@/components/takobon/auth/signup-form";

export const metadata: Metadata = { title: "Registrati — Takobon" };

export default function SignupPage() {
  return (
    <>
      {/* Atmospheric background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-700/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative space-y-8">
        {/* Wordmark */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Takobon
          </h1>
          <p className="text-sm text-text-tertiary tracking-widest uppercase">
            Il tuo archivio
          </p>
        </div>

        {/* Form card */}
        <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-xl shadow-black/40">
          <div className="space-y-1 mb-6">
            <h2 className="text-lg font-medium text-text-primary">
              Costruiamo il tuo archivio
            </h2>
            <p className="text-sm text-text-secondary">
              Comincia a tracciare la tua collezione.
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </>
  );
}
