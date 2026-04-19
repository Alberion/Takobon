"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; field?: "email" | "password" | "general" } | undefined;

function mapError(message: string): AuthState {
  const msg = message.toLowerCase();
  if (msg.includes("invalid login") || msg.includes("invalid credentials") || msg.includes("wrong password")) {
    return { error: "Email o password non corretti.", field: "general" };
  }
  if (msg.includes("email not confirmed")) {
    return { error: "Conferma la tua email prima di accedere.", field: "email" };
  }
  if (msg.includes("user already registered")) {
    return { error: "Esiste già un account con questa email.", field: "email" };
  }
  if (msg.includes("password should be")) {
    return { error: "La password deve essere di almeno 8 caratteri.", field: "password" };
  }
  if (msg.includes("unable to validate email")) {
    return { error: "Indirizzo email non valido.", field: "email" };
  }
  return { error: "Qualcosa è andato storto. Riprova.", field: "general" };
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) return mapError(error.message);

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) return mapError(error.message);

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function loginWithGoogle(): Promise<{ url: string } | AuthState> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });
  if (error) return mapError(error.message);
  return { url: data.url };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
