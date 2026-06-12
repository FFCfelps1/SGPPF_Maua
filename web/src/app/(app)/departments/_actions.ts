"use server";

import { revalidatePath } from "next/cache";
import { action } from "@/lib/crud/action";
import { departmentSchema } from "@/lib/schemas/department";
import { createClient } from "@/lib/supabase/server";

export const createDepartment = action(
  departmentSchema,
  async (input, { supabase }) => {
    const { error } = await supabase.from("departments").insert(input);
    if (error) throw error;
  },
  { revalidate: "/departments" },
);

export const updateDepartment = action(
  departmentSchema,
  async ({ id, ...fields }, { supabase }) => {
    const { error } = await supabase
      .from("departments")
      .update(fields)
      .eq("id", id);
    if (error) throw error;
  },
  { revalidate: "/departments" },
);

export async function deleteDepartment(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("departments").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/departments");
}

export async function addResearcherToDepartment(profileId: string, departmentId: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ department_id: departmentId })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath(`/departments/${departmentId}`);
}

export async function removeResearcherFromDepartment(profileId: string) {
  const supabase = await createClient();
  
  // Need to find the current department to revalidate its page
  const { data: profile } = await supabase
    .from("profiles")
    .select("department_id")
    .eq("id", profileId)
    .single();

  const { error } = await supabase
    .from("profiles")
    .update({ department_id: null })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
  if (profile?.department_id) {
    revalidatePath(`/departments/${profile.department_id}`);
  }
}
