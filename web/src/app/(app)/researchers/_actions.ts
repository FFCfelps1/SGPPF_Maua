"use server";

import { revalidatePath } from "next/cache";
import { action } from "@/lib/crud/action";
import { researcherUpdateSchema, researcherCreateSchema } from "@/lib/schemas/researcher";
import { createClient } from "@/lib/supabase/server";

export const updateResearcher = action(
  researcherUpdateSchema,
  async ({ id, ...fields }, { supabase }) => {
    const { error } = await supabase.from("profiles").update(fields).eq("id", id);
    if (error) throw error;
  },
  { revalidate: "/researchers" },
);

export const createResearcher = action(
  researcherCreateSchema,
  async ({ email, ...fields }, { supabase }) => {
    // Check if profile already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      throw new Error(labels.errors.duplicate);
    }

    // Since we are in Auto-Edit mode and this is a staff action to "add" a researcher,
    // we use the service role client (via admin auth) to create a user without
    // requiring them to go through the signup flow themselves.
    // However, the standard supabase client in the action is authenticated as the current user.
    // To create a user, we'd typically need the service role.
    
    // Alternative: We create the profile directly. But our system expects profiles to
    // be linked to auth.users. 
    
    // For this prototype, we'll implement a "soft" creation by just inserting the profile
    // if it doesn't exist, using a generated UUID. If the user later signs up with 
    // that email, the handle_new_user trigger will need to handle the conflict.
    
    const { error } = await supabase.from("profiles").insert({
      id: crypto.randomUUID(),
      email,
      ...fields,
    });
    
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
