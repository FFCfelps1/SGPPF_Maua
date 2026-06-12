"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addResearcherToDepartment(profileId: string, department: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ department })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath("/groups");
}

export async function removeResearcherFromDepartment(profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ department: null })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath("/groups");
}
