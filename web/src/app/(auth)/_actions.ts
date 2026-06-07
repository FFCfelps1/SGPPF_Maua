"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { labels } from "@/lib/labels";

type AuthState = { error?: string; notice?: string };

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Keep the user-facing message generic, but never lose the cause server-side.
    console.error("[auth.signIn]", error.status, error.message);
    return { error: labels.errors.invalidCredentials };
  }

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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) {
    // Surface the real cause in server logs (email-send failures, trigger
    // violations, rate limits all otherwise collapse into one opaque toast).
    console.error("[auth.signUp]", error.status, error.message);
    return {
      error: /maua\.br/i.test(error.message)
        ? labels.errors.notMauaEmail
        : labels.errors.generic,
    };
  }

  // When email confirmation is enabled (hosted projects default to it), signUp
  // succeeds without issuing a session. Redirecting to /dashboard would bounce
  // the user straight back to /login; show a "check your email" notice instead.
  if (!data.session) return { notice: labels.auth.checkEmail };

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
