import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/lib/crud/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { labels } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import type { ListSearchParams } from "@/lib/crud/pagination";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page || 1));
  const perPage = 10;
  
  const supabase = await createClient();
  const { data: submissions, count } = await supabase
    .from("project_submissions")
    .select("*, profiles!researcher_id(full_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{labels.submission.title}</h1>
          <p className="text-muted-foreground">
            Gerencie suas propostas de projetos e acompanhe o fluxo de aprovação.
          </p>
        </div>
        <Link 
          href="/submissions/new" 
          className={cn(buttonVariants({ variant: "default" }))}
        >
          {labels.actions.create}
        </Link>
      </div>

      <DataTable
        basePath="/submissions"
        searchParams={sp}
        rows={submissions || []}
        count={count || 0}
        page={page}
        perPage={perPage}
        emptyTitle="Nenhuma submissão encontrada"
        emptyDescription="Crie uma nova submissão de projeto para começar."
        columns={[
          {
            header: labels.submission.projectTitle,
            key: "title",
            cell: (row) => (
              <Link
                href={`/submissions/${row.id}`}
                className="font-medium hover:underline"
              >
                {row.title}
              </Link>
            ),
          },
          {
            header: labels.submission.status,
            key: "status",
            cell: (row) => (
              <Badge variant={row.status === "rejected" ? "destructive" : "secondary"}>
                {labels.submissionStatus[row.status as keyof typeof labels.submissionStatus]}
              </Badge>
            ),
          },
          {
            header: labels.project.lead,
            key: "profiles.full_name",
            cell: (row: any) => row.profiles?.full_name || "—",
          },
          {
            header: "Criado em",
            key: "created_at",
            cell: (row) => new Date(row.created_at).toLocaleDateString("pt-BR"),
          },
        ]}
      />
    </div>
  );
}
