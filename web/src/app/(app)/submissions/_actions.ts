"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { submissionCreateSchema, submissionUpdateSchema, submissionApprovalSchema, AgencyProjectStatus } from "@/lib/schemas/submission";
import { labels } from "@/lib/labels";
import type { ActionState } from "@/lib/crud/action";

export async function createSubmission(state: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData.entries());
  
  // Extract members if present (JSON string from hidden input)
  const membersJson = formData.get("_members_json") as string;
  const selectedMembers = membersJson ? JSON.parse(membersJson) : [];

  const validated = submissionCreateSchema.safeParse(rawData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { errors: { _form: [labels.errors.unauthorized] } };

  // 1. Create submission
  const { data: submission, error } = await supabase
    .from("project_submissions")
    .insert({
      ...validated.data,
      researcher_id: user.id,
      status: "draft",
    })
    .select()
    .single();

  if (error) return { ok: false, errors: { _form: [error.message] } };

  // 2. Add members if any
  if (selectedMembers.length > 0) {
    const memberInserts = selectedMembers.map((m: any) => ({
      submission_id: submission.id,
      profile_id: m.id,
      role: "Pesquisador",
      dedication_hours: m.hours || 0
    }));
    const { error: memberError } = await supabase.from("submission_members").insert(memberInserts);
    if (memberError) console.error("Error adding members during creation:", memberError);
  }

  revalidatePath("/submissions");
  return { ok: true };
}

export async function updateSubmission(state: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData.entries());
  
  const validated = submissionUpdateSchema.safeParse(rawData);
  if (!validated.success) {
    return { ok: false, errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { id, ...data } = validated.data;

  const { error } = await supabase
    .from("project_submissions")
    .update(data)
    .eq("id", id);

  if (error) return { ok: false, errors: { _form: [error.message] } };

  revalidatePath("/submissions");
  revalidatePath(`/submissions/${id}`);
  return { ok: true };
}

export async function submitForApproval(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_submissions")
    .update({ status: "submitted" })
    .eq("id", id)
    .eq("status", "draft");

  if (error) throw new Error(error.message);
  revalidatePath("/submissions");
  revalidatePath(`/submissions/${id}`);
}

export async function approveSubmission(id: number, currentRole: string, feedback?: string) {
  const supabase = await createClient();
  
  // 1. Fetch current status to know which level we are approving
  const { data: submission, error: fetchError } = await supabase
    .from("project_submissions")
    .select("status")
    .eq("id", id)
    .single();

  if (fetchError || !submission) throw new Error("Submissão não encontrada");

  let nextStatus: string;
  let approvalField: string;
  let requiredRole: string;

  // Define the workflow levels
  switch (submission.status) {
    case "submitted":
      nextStatus = "approved_dept";
      approvalField = "dept_approval_at";
      requiredRole = "dept_manager";
      break;
    case "approved_dept":
      nextStatus = "approved_cp";
      approvalField = "cp_approval_at";
      requiredRole = "cp_manager";
      break;
    case "approved_cp":
      nextStatus = "approved_maua";
      approvalField = "maua_approval_at";
      requiredRole = "maua_manager";
      break;
    default:
      throw new Error("Esta submissão não está em um estado que permita aprovação interna.");
  }

  // Check permission: Must be the specific manager OR an admin
  if (currentRole !== requiredRole && currentRole !== "admin") {
    throw new Error(labels.errors.unauthorized);
  }

  // Prepare the update object
  const updateData: any = {
    status: nextStatus,
    internal_feedback: feedback,
  };
  
  // Set the specific approval timestamp
  updateData[approvalField] = new Date().toISOString();

  const { error } = await supabase
    .from("project_submissions")
    .update(updateData)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/submissions");
  revalidatePath(`/submissions/${id}`);
}

export async function rejectSubmission(id: number, feedback: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_submissions")
    .update({ 
      status: "rejected",
      internal_feedback: feedback 
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/submissions");
  revalidatePath(`/submissions/${id}`);
}

export async function updateAgencyStatus(id: number, status: AgencyProjectStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_submissions")
    .update({ funding_agency_status: status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/submissions/${id}`);
}

export async function addMember(submissionId: number, profileId: string, role?: string, dedicationHours: number = 0) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("submission_members")
    .insert({ 
      submission_id: submissionId, 
      profile_id: profileId, 
      role,
      dedication_hours: dedicationHours
    });

  if (error) throw new Error(error.message);
  revalidatePath(`/submissions/${submissionId}`);
}

export async function removeMember(submissionId: number, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("submission_members")
    .delete()
    .eq("submission_id", submissionId)
    .eq("profile_id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath(`/submissions/${submissionId}`);
}

export async function updateSubmissionMemberHours(submissionId: number, profileId: string, dedicationHours: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("submission_members")
    .update({ dedication_hours: dedicationHours })
    .eq("submission_id", submissionId)
    .eq("profile_id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath(`/submissions/${submissionId}`);
}

export async function searchResearchers(query: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .ilike("full_name", `%${query}%`)
    .limit(5);

  if (error) throw new Error(error.message);
  return data;
}
