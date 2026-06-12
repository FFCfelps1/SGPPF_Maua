import { listEntities } from "@/lib/crud/query";
import { DataTable, type Column } from "@/lib/crud/data-table";
import { SearchBar } from "@/lib/crud/search-bar";
import { ExportButton } from "../_components/export-button";
import { exportEntityCsv } from "../_actions/export";
import type { ListSearchParams } from "@/lib/crud/pagination";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";
import { getMyPermissions, can } from "@/lib/permissions";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { RiUserAddLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function ResearchersPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const sp = await searchParams;
  const perms = await getMyPermissions();
  const canCreate = can(perms, "researchers:create");

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
      <div className="flex items-center justify-between gap-4">
        <SearchBar defaultValue={sp.q} />
        <div className="flex items-center gap-2">
          {canCreate && (
            <Link
              href="/researchers/new"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              <RiUserAddLine className="mr-2 size-4" />
              {labels.actions.create}
            </Link>
          )}
          <ExportButton
            action={exportEntityCsv.bind(null, "researchers", sp)}
            filename="pesquisadores.csv"
          />
        </div>
      </div>
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
