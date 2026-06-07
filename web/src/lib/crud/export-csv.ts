import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";
import type { ListSearchParams } from "./pagination";

export type ExportEntity =
  | "researchers"
  | "publications"
  | "projects"
  | "advisings";

export type ExportColumn = { key: string; header: string };

export type ExportConfig = {
  table: keyof Database["public"]["Tables"];
  select: string;
  searchColumns?: string[];
  defaultSort?: { column: string; ascending?: boolean };
  activeOnly?: boolean;
  columns: ExportColumn[];
};

function toCsv(headers: string[], rows: string[][]): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\r\n");
}

/** Builds a CSV from the same filters/sort as the on-screen list (RLS-gated). */
export async function runExport(
  sp: ListSearchParams,
  config: ExportConfig,
): Promise<string> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from(config.table).select(config.select);

  if (config.activeOnly) query = query.eq("is_active", true);
  if (sp.q && config.searchColumns?.length) {
    const term = `%${sp.q}%`;
    query = query.or(
      config.searchColumns.map((c) => `${c}.ilike.${term}`).join(","),
    );
  }
  const sortColumn = sp.sort ?? config.defaultSort?.column;
  if (sortColumn) {
    const ascending = sp.dir
      ? sp.dir === "asc"
      : (config.defaultSort?.ascending ?? true);
    query = query.order(sortColumn, { ascending });
  }

  const { data } = await query.limit(10000);
  const rows = ((data ?? []) as Record<string, unknown>[]).map((row) =>
    config.columns.map((c) => (row[c.key] == null ? "" : String(row[c.key]))),
  );
  return toCsv(
    config.columns.map((c) => c.header),
    rows,
  );
}
