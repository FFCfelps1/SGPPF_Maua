import { createClient } from "@/lib/supabase/server";

export type DashboardKpis = {
  total_publications: number;
  recent_publications: number;
  total_advisings: number;
  completed_advisings: number;
  active_funded_projects: number;
  funds_received: number;
};

/** Reads the RLS-respecting dashboard_kpis view. Zero-safe (honest empty state). */
export async function getDashboardKpis(): Promise<DashboardKpis> {
  const supabase = await createClient();
  const { data } = await supabase.from("dashboard_kpis").select("*").single();
  return {
    total_publications: data?.total_publications ?? 0,
    recent_publications: data?.recent_publications ?? 0,
    total_advisings: data?.total_advisings ?? 0,
    completed_advisings: data?.completed_advisings ?? 0,
    active_funded_projects: data?.active_funded_projects ?? 0,
    funds_received: data?.funds_received ?? 0,
  };
}
