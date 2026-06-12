import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyPermissions } from "@/lib/permissions";
import { ProjectForm } from "../_components/project-form";
import { FundingTab } from "../_components/funding-tab";
import { ProjectMembersEditor } from "../_components/project-members-editor";
import { deleteProject, updateProject } from "../_actions";
import { ConfirmDialog } from "@/lib/crud/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";
import { RiArrowLeftLine, RiFilePdfLine } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    .select("*, funding(*), project_members(*, profiles(full_name, email)), departments(name)")
    .eq("id", Number(id))
    .single();
  if (!project) notFound();

  const { data: departments } = await supabase
    .from("departments")
    .select("id, name")
    .order("name");

  const { data: claims } = await supabase.auth.getClaims();
  const viewerId = claims?.claims?.sub;
  const perms = await getMyPermissions();
  const canManage = project.lead_id === viewerId || perms.has("users:manage");
  const canEdit = perms.has("projects:write") && canManage;
  const canDelete = perms.has("projects:delete") && canManage;
  const funding = (project.funding ?? []) as Funding[];
  const members = (project.project_members ?? []) as any[];
  const deptName = (project as any).departments?.name || project.department;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/projects" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
            title="Voltar"
          >
            <RiArrowLeftLine className="size-4" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {project.title}
          </h1>
          <Badge variant="secondary">
            {labels.projectStatus[project.status]}
          </Badge>
          {project.document_url && (
            <a
              href={project.document_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
            >
              <RiFilePdfLine className="size-4 text-primary" />
              {labels.project.document.split("(")[0].trim()}
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
        {deptName ? (
          <p>
            <span className="font-medium text-foreground">{labels.researcher.department}:</span> {deptName}
          </p>
        ) : null}
        {project.unit ? (
          <p>
            <span className="font-medium text-foreground">{labels.researcher.unit}:</span> {project.unit}
          </p>
        ) : null}
        <p>
          <span className="font-medium text-foreground">{labels.project.startDate}:</span> {project.start_date || "—"}
        </p>
        <p>
          <span className="font-medium text-foreground">{labels.project.endDate}:</span> {project.end_date || "—"}
        </p>
      </div>

      {canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle>{labels.actions.edit}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm
              action={updateProject}
              defaults={project}
              afterSuccess="/projects"
              departments={departments || []}
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <FundingTab projectId={project.id} funding={funding} canManage={canEdit} />
        <ProjectMembersEditor projectId={project.id} members={members} canWrite={canEdit} />
      </div>
    </div>
  );
}
