import { createClient } from "@/lib/supabase/server";
import type { DashboardFilters } from "./dashboard-filters";

export type DepartmentMetric = {
  label: string;
  value: number;
};

export type DashboardKpis = {
  total_publications: number;
  recent_publications: number;
  total_advisings: number;
  completed_advisings: number;
  active_funded_projects: number;
  funds_received: number;
  projects_by_dept: DepartmentMetric[];
  researchers_by_dept: DepartmentMetric[];
  publications_by_dept: DepartmentMetric[];
  advisings_by_dept: DepartmentMetric[];
  submissions_by_status: { label: string; value: number }[];
};

export type ResearcherOption = {
  id: string;
  full_name: string;
};

function metrics(value: unknown): DepartmentMetric[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (
      typeof entry !== "object" ||
      entry === null ||
      !("label" in entry) ||
      !("value" in entry)
    ) {
      return [];
    }

    const label = String(entry.label ?? "");
    const metricValue = Number(entry.value);
    return Number.isFinite(metricValue) ? [{ label, value: metricValue }] : [];
  });
}

/** Reads the RLS-respecting dashboard stats via RPC. Zero-safe (honest empty state). */
export async function getDashboardKpis(
  filters: DashboardFilters = {},
): Promise<DashboardKpis> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_dashboard_stats_filtered", {
    p_department: filters.department ?? null,
    p_researcher: filters.researcher ?? null,
    p_start_year: filters.startYear ?? null,
    p_end_year: filters.endYear ?? null,
    p_min_money: filters.minMoney ?? null,
    p_max_money: filters.maxMoney ?? null,
  });
  
  if (error) {
    console.error("Error fetching dashboard stats:", JSON.stringify(error, null, 2));
    return {
      total_publications: 0,
      recent_publications: 0,
      total_advisings: 0,
      completed_advisings: 0,
      active_funded_projects: 0,
      funds_received: 0,
      projects_by_dept: [],
      researchers_by_dept: [],
      publications_by_dept: [],
      advisings_by_dept: [],
      submissions_by_status: [],
    };
  }

  const stats = data[0] ?? {};
  return {
    total_publications: Number(stats.total_publications ?? 0),
    recent_publications: Number(stats.recent_publications ?? 0),
    total_advisings: Number(stats.total_advisings ?? 0),
    completed_advisings: Number(stats.completed_advisings ?? 0),
    active_funded_projects: Number(stats.active_funded_projects ?? 0),
    funds_received: Number(stats.funds_received ?? 0),
    projects_by_dept: metrics(stats.projects_by_dept),
    researchers_by_dept: metrics(stats.researchers_by_dept),
    publications_by_dept: metrics(stats.publications_by_dept),
    advisings_by_dept: metrics(stats.advisings_by_dept),
    submissions_by_status: metrics(stats.submissions_by_status),
  };
}

export async function getDepartments(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("name")
    .order("name");
  
  return (data ?? []).map((d) => d.name);
}

export async function getResearchers(): Promise<ResearcherOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("is_active", true)
    .order("full_name");

  return data ?? [];
}
