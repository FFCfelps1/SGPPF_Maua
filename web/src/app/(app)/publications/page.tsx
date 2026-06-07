import Link from "next/link";
import { listEntities } from "@/lib/crud/query";
import { DataTable, type Column } from "@/lib/crud/data-table";
import { SearchBar } from "@/lib/crud/search-bar";
import { ExportButton } from "../_components/export-button";
import { exportEntityCsv } from "../_actions/export";
import { getMyPermissions } from "@/lib/permissions";
import { buttonVariants } from "@/components/ui/button";
import type { ListSearchParams } from "@/lib/crud/pagination";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

type Publication = Database["public"]["Tables"]["publications"]["Row"];

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const sp = await searchParams;
  const perms = await getMyPermissions();
  const canWrite = perms.has("publications:write");

  const { rows, count, page, perPage } = await listEntities<Publication>(sp, {
    table: "publications",
    columns: "id, title, type, year, venue",
    searchColumns: ["title", "doi"],
    defaultSort: { column: "year", ascending: false },
  });

  const columns: Column<Publication>[] = [
    { key: "title", header: labels.publication.title, sortable: true },
    {
      key: "type",
      header: labels.publication.type,
      cell: (r) => (r.type ? labels.publicationTypes[r.type] : "—"),
    },
    { key: "year", header: labels.publication.year, sortable: true },
    { key: "venue", header: labels.publication.venue },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {labels.nav.publications}
        </h1>
        {canWrite ? (
          <Link href="/publications/new" className={buttonVariants({ size: "sm" })}>
            {labels.actions.create}
          </Link>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4">
        <SearchBar defaultValue={sp.q} />
        <ExportButton
          action={exportEntityCsv.bind(null, "publications", sp)}
          filename="publicacoes.csv"
        />
      </div>
      <DataTable
        basePath="/publications"
        searchParams={sp}
        columns={columns}
        rows={rows}
        count={count}
        page={page}
        perPage={perPage}
        getRowHref={(r) => `/publications/${r.id}`}
        emptyTitle={labels.empty.publications.title}
        emptyDescription={labels.empty.publications.description}
      />
    </div>
  );
}
