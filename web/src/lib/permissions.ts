import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

export type AppPermission = Database["public"]["Enums"]["app_permission"];
export type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * The current user's permission set, derived from the DB role->permission map via a
 * SECURITY DEFINER RPC. The JWT carries only the role (not the full set), and the app
 * never hardcodes a mirror of the seed — so nav/UI and RLS can't drift.
 */
export async function getMyPermissions(): Promise<Set<AppPermission>> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("my_permissions");
  return new Set((data ?? []) as AppPermission[]);
}

/** UI-only capability check (never a security boundary — RLS is). */
export function can(
  permissions: Set<AppPermission>,
  permission: AppPermission,
): boolean {
  return permissions.has(permission);
}
