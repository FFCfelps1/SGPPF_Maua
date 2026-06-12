"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { action } from "@/lib/crud/action";
import {
  advisingCreateSchema,
  advisingUpdateSchema,
} from "@/lib/schemas/advising";
import { createClient } from "@/lib/supabase/server";

export const createAdvising = action(
  advisingCreateSchema,
  async (input, { supabase, userId }) => {
    const { error } = await supabase
      .from("advisings")
      .insert({ ...input, advisor_id: userId });
    if (error) throw error;
  },
  { revalidate: "/advisings" },
);

export const updateAdvising = action(
  advisingUpdateSchema,
  async ({ id, ...fields }, { supabase }) => {
    const { error } = await supabase.from("advisings").update(fields).eq("id", id);
    if (error) throw error;
  },
  { revalidate: "/advisings" },
);

export async function deleteAdvising(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("advisings").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/advisings");
  redirect("/advisings");
}
