"use server";

import { revalidatePath } from "next/cache";
import { action } from "@/lib/crud/action";
import { projectCreateSchema, projectUpdateSchema } from "@/lib/schemas/project";
import { fundingCreateSchema } from "@/lib/schemas/funding";
import { createClient } from "@/lib/supabase/server";

export const createProject = action(
  projectCreateSchema,
  async (input, { supabase, userId }) => {
    // The creator is the lead (RLS requires lead_id = auth.uid() on insert).
    const { error } = await supabase
      .from("projects")
      .insert({ ...input, lead_id: userId });
    if (error) throw error;
  },
  { revalidate: "/projects" },
);

export const updateProject = action(
  projectUpdateSchema,
  async ({ id, ...fields }, { supabase }) => {
    const { error } = await supabase.from("projects").update(fields).eq("id", id);
    if (error) throw error;
  },
  { revalidate: "/projects" },
);

export async function deleteProject(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/projects");
}

export const createFunding = action(
  fundingCreateSchema,
  async (input, { supabase }) => {
    const { error } = await supabase.from("funding").insert(input);
    if (error) throw error;
    revalidatePath(`/projects/${input.project_id}`);
  },
);

export async function deleteFunding(
  id: number,
  projectId: number,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("funding").delete().eq("id", id);
  if (error) throw error;
  revalidatePath(`/projects/${projectId}`);
}
