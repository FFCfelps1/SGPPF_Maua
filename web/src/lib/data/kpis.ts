import { createClient } from "@/lib/supabase/server";

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

function departmentMetrics(value: unknown): DepartmentMetric[] {
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
export async function getDashboardKpis(department?: string): Promise<DashboardKpis> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_dashboard_stats", {
    p_department: department || undefined,
  });
  
  if (error) {
    console.error("Error fetching dashboard stats:", error);
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

  // Fetch submissions stats separately as it's not yet in the main RPC
  const { data: subData } = await supabase
    .from("project_submissions")
    .select("status");
  
  const subStats = (subData ?? []).reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const submissions_by_status = Object.entries(subStats).map(([label, value]) => ({
    label,
    value
  }));

  const stats = data[0] || {};
  return {
    total_publications: Number(stats.total_publications ?? 0),
    recent_publications: Number(stats.recent_publications ?? 0),
    total_advisings: Number(stats.total_advisings ?? 0),
    completed_advisings: Number(stats.completed_advisings ?? 0),
    active_funded_projects: Number(stats.active_funded_projects ?? 0),
    funds_received: Number(stats.funds_received ?? 0),
    projects_by_dept: departmentMetrics(stats.projects_by_dept),
    researchers_by_dept: departmentMetrics(stats.researchers_by_dept),
    publications_by_dept: departmentMetrics(stats.publications_by_dept),
    advisings_by_dept: departmentMetrics(stats.advisings_by_dept),
    submissions_by_status,
  };
}

export async function getDepartments(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("department")
    .not("department", "is", null);
  
  const depts = new Set((data ?? []).map((d) => d.department!));
  
  const { data: projData } = await supabase
    .from("projects")
    .select("department")
    .not("department", "is", null);
  
  (projData ?? []).forEach((d) => depts.add(d.department!));
  
  return Array.from(depts).sort();
}
