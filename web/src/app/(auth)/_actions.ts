"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { labels } from "@/lib/labels";

type AuthState = { error?: string };

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: labels.errors.invalidCredentials };

  redirect("/dashboard");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "");

  // UX pre-check; the handle_new_user trigger is the authoritative server-side boundary.
  if (!/@maua\.br$/i.test(email)) return { error: labels.errors.notMauaEmail };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) {
    return {
      error: /maua\.br/i.test(error.message)
        ? labels.errors.notMauaEmail
        : labels.errors.generic,
    };
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
