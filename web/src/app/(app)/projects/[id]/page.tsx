import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyPermissions } from "@/lib/permissions";
import { ProjectForm } from "../_components/project-form";
import { FundingTab } from "../_components/funding-tab";
import { deleteProject, updateProject } from "../_actions";
import { ConfirmDialog } from "@/lib/crud/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

type Funding = Database["public"]["Tables"]["funding"]["Row"];

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, funding(*)")
    .eq("id", Number(id))
    .single();
  if (!project) notFound();

  const { data: claims } = await supabase.auth.getClaims();
  const viewerId = claims?.claims?.sub;
  const perms = await getMyPermissions();
  const canManage = project.lead_id === viewerId || perms.has("users:manage");
  const canEdit = perms.has("projects:write") && canManage;
  const canDelete = perms.has("projects:delete") && canManage;
  const funding = (project.funding ?? []) as Funding[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {project.title}
          </h1>
          <Badge variant="secondary">
            {labels.projectStatus[project.status]}
          </Badge>
        </div>
        {canDelete ? (
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm">
                {labels.actions.delete}
              </Button>
            }
            onConfirm={deleteProject.bind(null, project.id)}
          />
        ) : null}
      </div>

      {project.code ? (
        <p className="text-sm text-muted-foreground">
          {labels.project.code}: {project.code}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {project.department ? (
          <p>
            <span className="font-medium text-foreground">{labels.researcher.department}:</span> {project.department}
          </p>
        ) : null}
        {project.unit ? (
          <p>
            <span className="font-medium text-foreground">{labels.researcher.unit}:</span> {project.unit}
          </p>
        ) : null}
      </div>

      {project.description ? (
        <p className="text-sm text-muted-foreground">
          {project.description}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{labels.project.funding}</CardTitle>
        </CardHeader>
        <CardContent>
          <FundingTab
            projectId={project.id}
            funding={funding}
            canManage={perms.has("funding:write") && canManage}
          />
        </CardContent>
      </Card>

      {canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle>{labels.actions.edit}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm
              action={updateProject}
              defaults={project}
              afterSuccess="refresh"
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
