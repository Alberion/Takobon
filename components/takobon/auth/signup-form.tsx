"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, loginWithGoogle, type AuthState } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [googlePending, startGoogle] = useTransition();
  const router = useRouter();

  function handleGoogle() {
    startGoogle(async () => {
      const result = await loginWithGoogle();
      if (result && "url" in result) router.push(result.url);
    });
  }

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

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-text-tertiary">oppure</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <Button
        type="button"
        onClick={handleGoogle}
        disabled={googlePending}
        variant="outline"
        className="w-full h-12 border-border-default bg-bg-elevated text-text-secondary hover:text-text-primary rounded-xl cursor-pointer"
      >
        {googlePending ? <Loader2 className="size-4 animate-spin" /> : (
          <svg className="size-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Continua con Google
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
