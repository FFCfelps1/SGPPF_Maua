import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyPermissions } from "@/lib/permissions";
import { loadAdvisingOptions } from "../_data";
import { AdvisingForm } from "../_components/advising-form";
import { deleteAdvising, updateAdvising } from "../_actions";
import { ConfirmDialog } from "@/lib/crud/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";
import { RiArrowLeftLine, RiFilePdfLine } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Advising = Database["public"]["Tables"]["advisings"]["Row"];

export default async function AdvisingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: advising } = await supabase
    .from("advisings")
    .select("*")
    .eq("id", Number(id))
    .single();
  if (!advising) notFound();

  const { data: claims } = await supabase.auth.getClaims();
  const viewerId = claims?.claims?.sub;
  const perms = await getMyPermissions();
  const canManage = advising.advisor_id === viewerId || perms.has("users:manage");
  const canEdit = perms.has("advisings:write") && canManage;
  const canDelete = perms.has("advisings:delete") && canManage;

  const { researchers, projects } = await loadAdvisingOptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/advisings" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
            title="Voltar"
          >
            <RiArrowLeftLine className="size-4" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {advising.student_name}
          </h1>
          <Badge variant="secondary">
            {labels.advisingLevel[advising.level]}
          </Badge>
          <Badge variant="outline">
            {labels.advisingStatus[advising.status]}
          </Badge>
          {advising.document_url && (
            <a
              href={advising.document_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
            >
              <RiFilePdfLine className="size-4 text-primary" />
              {labels.advising.document.split("(")[0].trim()}
            </a>
          )}
        </div>
        {canDelete ? (
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm">
                {labels.actions.delete}
              </Button>
            }
            onConfirm={deleteAdvising.bind(null, advising.id)}
          />
        ) : null}
      </div>

      {canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle>{labels.actions.edit}</CardTitle>
          </CardHeader>
          <CardContent>
            <AdvisingForm
              action={updateAdvising}
              defaults={advising}
              afterSuccess="/advisings"
              researchers={researchers}
              projects={projects}
            />
          </CardContent>
        </Card>
      ) : (
        <ReadOnlyAdvising advising={advising} />
      )}
    </div>
  );
}

function ReadOnlyAdvising({ advising }: { advising: Advising }) {
  const rows: [string, string | null][] = [
    [labels.advising.workTitle, advising.work_title],
    [labels.advising.scholarshipAgency, advising.scholarship_agency],
    [labels.advising.startDate, advising.start_date],
    [labels.advising.endDate, advising.end_date],
  ];
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd>{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
