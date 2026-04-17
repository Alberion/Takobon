"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, type AuthState } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);

  const emailError = state?.field === "email" || state?.field === "general";
  const passwordError = state?.field === "password" || state?.field === "general";

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-text-secondary text-xs uppercase tracking-widest">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="la@tua.email"
          aria-invalid={emailError}
          className={cn(
            "h-12 bg-bg-elevated border text-text-primary placeholder:text-text-tertiary rounded-xl transition-colors",
            emailError
              ? "border-red-500 focus-visible:ring-red-500/30 focus-visible:border-red-500"
              : "border-border-default focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500"
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-text-secondary text-xs uppercase tracking-widest">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Minimo 8 caratteri"
            aria-invalid={passwordError}
            className={cn(
              "h-12 bg-bg-elevated border text-text-primary placeholder:text-text-tertiary rounded-xl transition-colors pr-12",
              passwordError
                ? "border-red-500 focus-visible:ring-red-500/30 focus-visible:border-red-500"
                : "border-border-default focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Nascondi password" : "Mostra password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors p-1"
          >
            {showPassword ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {state?.error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle className="size-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-300 leading-snug">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-medium rounded-xl transition-all duration-150 cursor-pointer"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Crea il tuo archivio"}
      </Button>

      <p className="text-center text-sm text-text-tertiary">
        Hai già un account?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          Accedi
        </Link>
      </p>
    </form>
  );
}
