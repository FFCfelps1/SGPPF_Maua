import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";
import { parsePagination, type ListSearchParams } from "./pagination";

export type ListConfig = {
  table: keyof Database["public"]["Tables"];
  columns?: string;
  searchColumns?: string[];
  defaultSort?: { column: string; ascending?: boolean };
};

// PostgREST's query builder isn't generically typeable across dynamic table/column
// selection; `refine` receives and returns it, and the caller asserts the row type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseQuery = any;

/**
 * Server-side list query: search (ilike across searchColumns), sort, and paginate
 * from the URL params. `refine` adds entity-specific filters (is_active, parent scope).
 * The same builder backs CSV export (U13), so exports match the on-screen list.
 */
export async function listEntities<Row>(
  sp: ListSearchParams,
  config: ListConfig,
  refine?: (query: SupabaseQuery) => SupabaseQuery,
): Promise<{ rows: Row[]; count: number; page: number; perPage: number }> {
  const supabase = await createClient();
  const { page, perPage, from, to } = parsePagination(sp);

  let query: SupabaseQuery = supabase
    .from(config.table)
    .select(config.columns ?? "*", { count: "exact" });

  if (refine) query = refine(query);

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

  const { data, count } = await query.range(from, to);
  return { rows: (data ?? []) as Row[], count: count ?? 0, page, perPage };
}
