"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type AuthState } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, undefined);

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
          className="h-12 bg-bg-elevated border-border-default text-text-primary placeholder:text-text-tertiary focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-text-secondary text-xs uppercase tracking-widest">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="h-12 bg-bg-elevated border-border-default text-text-primary placeholder:text-text-tertiary focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-semantic-error bg-semantic-error/10 border border-semantic-error/20 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all duration-150 cursor-pointer"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Accedi"
        )}
      </Button>

      <p className="text-center text-sm text-text-tertiary">
        Non hai un account?{" "}
        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          Registrati
        </Link>
      </p>
    </form>
  );
}
