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

type Project = Database["public"]["Tables"]["projects"]["Row"];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const sp = await searchParams;
  const perms = await getMyPermissions();
  const canWrite = perms.has("projects:write");

  const { rows, count, page, perPage } = await listEntities<Project>(sp, {
    table: "projects",
    columns: "id, title, code, modality, status",
    searchColumns: ["title", "code"],
    defaultSort: { column: "title", ascending: true },
  });

  const columns: Column<Project>[] = [
    { key: "title", header: labels.project.title, sortable: true },
    { key: "code", header: labels.project.code },
    { key: "modality", header: labels.project.modality },
    {
      key: "status",
      header: labels.project.status,
      cell: (r) => labels.projectStatus[r.status],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {labels.nav.projects}
        </h1>
        {canWrite ? (
          <Link href="/projects/new" className={buttonVariants({ size: "sm" })}>
            {labels.actions.create}
          </Link>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4">
        <SearchBar defaultValue={sp.q} />
        <ExportButton
          action={exportEntityCsv.bind(null, "projects", sp)}
          filename="projetos.csv"
        />
      </div>
      <DataTable
        basePath="/projects"
        searchParams={sp}
        columns={columns}
        rows={rows}
        count={count}
        page={page}
        perPage={perPage}
        getRowHref={(r) => `/projects/${r.id}`}
        emptyTitle={labels.empty.projects.title}
        emptyDescription={labels.empty.projects.description}
      />
    </div>
  );
}
