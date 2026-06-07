"use server";

import { revalidatePath } from "next/cache";
import { action } from "@/lib/crud/action";
import {
  publicationCreateSchema,
  publicationUpdateSchema,
} from "@/lib/schemas/publication";
import { createClient } from "@/lib/supabase/server";

export const createPublication = action(
  publicationCreateSchema,
  async (input, { supabase, userId }) => {
    const { data, error } = await supabase
      .from("publications")
      .insert(input)
      .select("id")
      .single();
    if (error) throw error;
    // Link the creator as the first author (self-link is allowed by RLS).
    const { error: linkError } = await supabase
      .from("publication_authors")
      .insert({ publication_id: data.id, profile_id: userId, author_position: 1 });
    if (linkError) throw linkError;
  },
  { revalidate: "/publications" },
);

export const updatePublication = action(
  publicationUpdateSchema,
  async ({ id, ...fields }, { supabase }) => {
    const { error } = await supabase
      .from("publications")
      .update(fields)
      .eq("id", id);
    if (error) throw error;
  },
  { revalidate: "/publications" },
);

export async function deletePublication(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("publications").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/publications");
}

export async function addSelfAsAuthor(publicationId: number): Promise<void> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) throw new Error("unauthorized");

  const { count } = await supabase
    .from("publication_authors")
    .select("*", { count: "exact", head: true })
    .eq("publication_id", publicationId);

  const { error } = await supabase.from("publication_authors").insert({
    publication_id: publicationId,
    profile_id: userId,
    author_position: (count ?? 0) + 1,
  });
  if (error) throw error;
  revalidatePath(`/publications/${publicationId}`);
}

export async function removeAuthor(
  publicationId: number,
  profileId: string,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("publication_authors")
    .delete()
    .eq("publication_id", publicationId)
    .eq("profile_id", profileId);
  if (error) throw error;
  revalidatePath(`/publications/${publicationId}`);
}
