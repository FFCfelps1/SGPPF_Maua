"use server";

import { revalidatePath } from "next/cache";
import { action } from "@/lib/crud/action";
import { researcherUpdateSchema } from "@/lib/schemas/researcher";
import { createClient } from "@/lib/supabase/server";

export const updateResearcher = action(
  researcherUpdateSchema,
  async ({ id, ...fields }, { supabase }) => {
    const { error } = await supabase.from("profiles").update(fields).eq("id", id);
    if (error) throw error;
  },
  { revalidate: "/researchers" },
);

/** Soft delete (KTD13): flip is_active. RLS limits this to admins (users:manage). */
export async function softDeleteResearcher(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: false })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/researchers");
}
