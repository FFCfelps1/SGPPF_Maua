"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type AppRole = Database["public"]["Enums"]["app_role"];

/** Admin-only role assignment. RLS (profiles_update + the role guard) requires
 *  users:manage, so a non-admin caller is rejected at the database. */
export async function updateRole(userId: string, role: AppRole): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) throw error;
  revalidatePath("/admin");
}
