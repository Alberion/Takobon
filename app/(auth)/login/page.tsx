import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accedi — Takobon" };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Bentornato
        </h1>
        <p className="text-sm text-text-secondary">
          Accedi al tuo archivio Takobon.
        </p>
      </div>
      {/* TODO: LoginForm component */}
    </div>
  );
}
