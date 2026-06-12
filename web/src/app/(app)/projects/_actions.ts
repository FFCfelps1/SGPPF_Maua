"use server";

import { revalidatePath } from "next/cache";
import { action } from "@/lib/crud/action";
import { projectCreateSchema, projectUpdateSchema } from "@/lib/schemas/project";
import { fundingCreateSchema } from "@/lib/schemas/funding";
import { createClient } from "@/lib/supabase/server";

export const createProject = action(
  projectCreateSchema,
  async (input, { supabase, userId, formData }) => {
    // 1. Extract members if present (JSON string from hidden input)
    const membersJson = formData.get("_members_json") as string;
    const selectedMembers = membersJson ? JSON.parse(membersJson) : [];

    // 2. Create project. The creator is the lead.
    const { data: project, error } = await supabase
      .from("projects")
      .insert({ ...input, lead_id: userId })
      .select()
      .single();
    
    if (error) throw error;

    // 3. Add members if any
    if (selectedMembers.length > 0) {
      const memberInserts = selectedMembers.map((m: any) => ({
        project_id: project.id,
        profile_id: m.id,
        role: "Pesquisador",
        dedication_hours: m.hours || 0
      }));
      const { error: memberError } = await supabase.from("project_members").insert(memberInserts);
      if (memberError) console.error("Error adding members during creation:", memberError);
    }
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

export async function addProjectMember(projectId: number, profileId: string, role?: string, dedicationHours: number = 0) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_members")
    .insert({ 
      project_id: projectId, 
      profile_id: profileId, 
      role,
      dedication_hours: dedicationHours
    });

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`);
}

export async function removeProjectMember(projectId: number, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_members")
    .delete()
    .eq("project_id", projectId)
    .eq("profile_id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`);
}

export async function updateProjectMemberHours(projectId: number, profileId: string, dedicationHours: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_members")
    .update({ dedication_hours: dedicationHours })
    .eq("project_id", projectId)
    .eq("profile_id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`);
}
