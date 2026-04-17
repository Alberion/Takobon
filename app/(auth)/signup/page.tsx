import type { Metadata } from "next";

export const metadata: Metadata = { title: "Registrati — Takobon" };

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Crea il tuo archivio
        </h1>
        <p className="text-sm text-text-secondary">
          Inizia a tracciare la tua collezione.
        </p>
      </div>
      {/* TODO: SignupForm component */}
    </div>
  );
}
