"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; success?: string; field?: string } | undefined;

export async function updateUsername(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const username = (formData.get("username") as string)?.trim();
  if (!username || username.length < 2) return { error: "Il nome utente deve avere almeno 2 caratteri.", field: "username" };
  if (username.length > 30) return { error: "Il nome utente non può superare i 30 caratteri.", field: "username" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non autenticato.", field: "general" };

  const { error } = await supabase.from("users").upsert({ id: user.id, username }).eq("id", user.id);
  if (error) return { error: "Impossibile aggiornare il nome utente.", field: "username" };

  revalidatePath("/profile");
  return { success: "Nome utente aggiornato." };
}

export async function updateEmail(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const email = (formData.get("email") as string)?.trim();
  if (!email || !email.includes("@")) return { error: "Email non valida.", field: "email" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email });
  if (error) return { error: "Impossibile aggiornare l'email.", field: "email" };

  return { success: "Controlla la tua nuova email per confermare la modifica." };
}

export async function updatePassword(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!password || password.length < 8) return { error: "La password deve avere almeno 8 caratteri.", field: "password" };
  if (password !== confirm) return { error: "Le password non coincidono.", field: "confirm" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Impossibile aggiornare la password.", field: "password" };

  return { success: "Password aggiornata." };
}
