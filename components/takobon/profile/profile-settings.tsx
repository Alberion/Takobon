"use client";

import { useActionState, useState } from "react";
import { ChevronDown, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { updateUsername, updateEmail, updatePassword, type ProfileState } from "@/app/actions/profile";
import { cn } from "@/lib/utils";

function FieldFeedback({ state, field }: { state: ProfileState; field: string }) {
  if (!state) return null;
  if (state.success) return (
    <p className="flex items-center gap-1.5 text-xs text-state-owned mt-1.5">
      <Check className="size-3" strokeWidth={2} /> {state.success}
    </p>
  );
  if (state.error && (!state.field || state.field === field)) return (
    <p className="flex items-center gap-1.5 text-xs text-semantic-error mt-1.5">
      <AlertCircle className="size-3" strokeWidth={2} /> {state.error}
    </p>
  );
  return null;
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="takobon-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-text-primary hover:bg-bg-elevated/50 transition-colors"
      >
        {title}
        <ChevronDown className={cn("size-4 text-text-tertiary transition-transform duration-200", open && "rotate-180")} strokeWidth={1.5} />
      </button>
      {open && <div className="px-4 pb-4 border-t border-border-subtle pt-4">{children}</div>}
    </div>
  );
}

const inputClass = "w-full h-11 px-3 rounded-xl bg-bg-elevated border border-border-default text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors";

export function ProfileSettings({ currentEmail }: { currentEmail: string }) {
  const [usernameState, usernameAction, usernamePending] = useActionState<ProfileState, FormData>(updateUsername, undefined);
  const [emailState, emailAction, emailPending] = useActionState<ProfileState, FormData>(updateEmail, undefined);
  const [passwordState, passwordAction, passwordPending] = useActionState<ProfileState, FormData>(updatePassword, undefined);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-text-tertiary font-medium px-1">Impostazioni</p>

      {/* Username */}
      <Section title="Cambia nome utente">
        <form action={usernameAction} className="space-y-3">
          <input name="username" placeholder="Nuovo nome utente" className={inputClass} autoComplete="username" />
          <FieldFeedback state={usernameState} field="username" />
          <button type="submit" disabled={usernamePending} className="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
            {usernamePending ? "Salvataggio…" : "Salva"}
          </button>
        </form>
      </Section>

      {/* Email */}
      <Section title="Cambia email">
        <form action={emailAction} className="space-y-3">
          <input name="email" type="email" defaultValue={currentEmail} className={inputClass} autoComplete="email" />
          <FieldFeedback state={emailState} field="email" />
          <button type="submit" disabled={emailPending} className="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
            {emailPending ? "Salvataggio…" : "Salva"}
          </button>
        </form>
      </Section>

      {/* Password */}
      <Section title="Cambia password">
        <form action={passwordAction} className="space-y-3">
          <div className="relative">
            <input name="password" type={showPw ? "text" : "password"} placeholder="Nuova password" className={cn(inputClass, "pr-11")} autoComplete="new-password" />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {showPw ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
            </button>
          </div>
          <div className="relative">
            <input name="confirm" type={showConfirm ? "text" : "password"} placeholder="Conferma password" className={cn(inputClass, "pr-11")} autoComplete="new-password" />
            <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {showConfirm ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
            </button>
          </div>
          <FieldFeedback state={passwordState} field="password" />
          <button type="submit" disabled={passwordPending} className="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
            {passwordPending ? "Salvataggio…" : "Salva"}
          </button>
        </form>
      </Section>
    </div>
  );
}
