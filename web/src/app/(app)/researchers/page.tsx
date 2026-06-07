import { listEntities } from "@/lib/crud/query";
import { DataTable, type Column } from "@/lib/crud/data-table";
import { SearchBar } from "@/lib/crud/search-bar";
import type { ListSearchParams } from "@/lib/crud/pagination";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function ResearchersPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const sp = await searchParams;
  const { rows, count, page, perPage } = await listEntities<Profile>(
    sp,
    {
      table: "profiles",
      columns:
        "id, full_name, email, position, area_of_expertise, role, is_active",
      searchColumns: ["full_name"],
      defaultSort: { column: "full_name", ascending: true },
    },
    (q) => q.eq("is_active", true),
  );

  const columns: Column<Profile>[] = [
    { key: "full_name", header: labels.researcher.name, sortable: true },
    { key: "position", header: labels.researcher.position },
    { key: "area_of_expertise", header: labels.researcher.area },
    { key: "role", header: labels.researcher.role, cell: (r) => labels.roles[r.role] },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {labels.nav.researchers}
      </h1>
      <SearchBar defaultValue={sp.q} />
      <DataTable
        basePath="/researchers"
        searchParams={sp}
        columns={columns}
        rows={rows}
        count={count}
        page={page}
        perPage={perPage}
        getRowHref={(r) => `/researchers/${r.id}`}
        emptyTitle={labels.empty.researchers.title}
        emptyDescription={labels.empty.researchers.description}
      />
    </div>
  );
}
