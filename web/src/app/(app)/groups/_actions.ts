"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addResearcherToDepartment(profileId: string, departmentId: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ department_id: departmentId })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath("/groups");
  revalidatePath(`/departments/${departmentId}`);
}

export async function removeResearcherFromDepartment(profileId: string) {
  const supabase = await createClient();
  
  // Get current department before removing to revalidate
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
  revalidatePath("/groups");
  if (profile?.department_id) {
    revalidatePath(`/departments/${profile.department_id}`);
  }
}

export async function joinDepartment(departmentId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from("profiles")
    .update({ department_id: departmentId })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/groups");
  revalidatePath(`/departments/${departmentId}`);
}
