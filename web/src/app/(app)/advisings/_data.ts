import { createClient } from "@/lib/supabase/server";

/** Option lists for the advising form's co-advisor and project selects. */
export async function loadAdvisingOptions() {
  const supabase = await createClient();
  const [{ data: researchers }, { data: projects }] = await Promise.all([
    supabase.from("profiles").select("id, full_name").eq("is_active", true).order("full_name"),
    supabase.from("projects").select("id, title").order("title"),
  ]);
  return { researchers: researchers ?? [], projects: projects ?? [] };
}
