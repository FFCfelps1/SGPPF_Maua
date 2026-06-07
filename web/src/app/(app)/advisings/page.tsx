import Link from "next/link";
import { listEntities } from "@/lib/crud/query";
import { DataTable, type Column } from "@/lib/crud/data-table";
import { SearchBar } from "@/lib/crud/search-bar";
import { getMyPermissions } from "@/lib/permissions";
import { buttonVariants } from "@/components/ui/button";
import type { ListSearchParams } from "@/lib/crud/pagination";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

type Advising = Database["public"]["Tables"]["advisings"]["Row"];

export default async function AdvisingsPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const sp = await searchParams;
  const perms = await getMyPermissions();
  const canWrite = perms.has("advisings:write");

  const { rows, count, page, perPage } = await listEntities<Advising>(sp, {
    table: "advisings",
    columns: "id, student_name, level, status, start_date",
    searchColumns: ["student_name"],
    defaultSort: { column: "start_date", ascending: false },
  });

  const columns: Column<Advising>[] = [
    { key: "student_name", header: labels.advising.student, sortable: true },
    { key: "level", header: labels.advising.level, cell: (r) => labels.advisingLevel[r.level] },
    { key: "status", header: labels.advising.status, cell: (r) => labels.advisingStatus[r.status] },
    { key: "start_date", header: labels.advising.startDate, sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {labels.nav.advisings}
        </h1>
        {canWrite ? (
          <Link href="/advisings/new" className={buttonVariants({ size: "sm" })}>
            {labels.actions.create}
          </Link>
        ) : null}
      </div>
      <SearchBar defaultValue={sp.q} />
      <DataTable
        basePath="/advisings"
        searchParams={sp}
        columns={columns}
        rows={rows}
        count={count}
        page={page}
        perPage={perPage}
        getRowHref={(r) => `/advisings/${r.id}`}
        emptyTitle={labels.empty.advisings.title}
        emptyDescription={labels.empty.advisings.description}
      />
    </div>
  );
}
