import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { labels } from "@/lib/labels";
import { SubmissionForm } from "../_components/submission-form";
import { updateSubmission } from "../_actions";
import { ApprovalControls } from "../_components/approval-controls";
import { SubmissionMembersEditor } from "../_components/members-editor";
import { Separator } from "@/components/ui/separator";
import { RiEditLine, RiCloseLine, RiArrowLeftLine } from "@remixicon/react";

export default async function SubmissionDetailsPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ edit?: string }>
}) {
  const { id } = await params;
  const { edit } = await searchParams;
  const isEditing = edit === "true";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();

  const [{ data: submission }, { data: profile }] = await Promise.all([
    supabase
      .from("project_submissions")
      .select("*, profiles!researcher_id(full_name), submission_members(*, profiles(full_name, email))")
      .eq("id", Number(id))
      .single(),
    supabase.from("profiles").select("role").eq("id", user.id).single(),
  ]);

  if (!submission) return notFound();

  const isOwner = submission.researcher_id === user.id;
  const isDraftOrRejected = submission.status === "draft" || submission.status === "rejected";
  const isApprover = ["admin", "maua_manager", "cp_manager", "dept_manager"].includes(profile?.role || "");
  const canEdit = (isOwner && isDraftOrRejected) || isApprover;

  const members = (submission.submission_members ?? []) as any[];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Link 
              href="/submissions" 
              className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "mt-1")}
              title="Voltar"
            >
              <RiArrowLeftLine className="size-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={submission.status === "rejected" ? "destructive" : "secondary"}>
                  {labels.submissionStatus[submission.status as keyof typeof labels.submissionStatus]}
                </Badge>
                {submission.funding_agency_status && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Agência: {labels.agencyProjectStatus[submission.funding_agency_status as keyof typeof labels.agencyProjectStatus]}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{submission.title}</h1>
              <p className="text-muted-foreground">
                Submetido por {submission.profiles?.full_name} em {new Date(submission.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          
          {canEdit && (
            <Link
              href={isEditing ? `/submissions/${id}` : `/submissions/${id}?edit=true`}
              className={cn(buttonVariants({ variant: isEditing ? "outline" : "default", size: "sm" }), "shrink-0")}
            >
              {isEditing ? (
                <><RiCloseLine className="mr-1 size-4" /> {labels.actions.cancel}</>
              ) : (
                <><RiEditLine className="mr-1 size-4" /> {labels.actions.edit}</>
              )}
            </Link>
          )}
        </div>

        {isEditing && canEdit ? (
          <Card>
            <CardHeader>
              <CardTitle>Editar Proposta</CardTitle>
            </CardHeader>
            <CardContent>
              <SubmissionForm 
                action={updateSubmission} 
                defaults={submission} 
                afterSuccess={`/submissions/${id}`}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">{labels.submission.abstract}</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">{submission.abstract || "—"}</p>
            </section>
            <Separator />
            <section>
              <h2 className="text-xl font-semibold mb-2">{labels.submission.objectives}</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">{submission.objectives || "—"}</p>
            </section>
            <Separator />
            <section>
              <h2 className="text-xl font-semibold mb-2">{labels.submission.methodology}</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">{submission.methodology || "—"}</p>
            </section>

            <Card>
              <CardContent className="pt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{labels.submission.budget}</p>
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(submission.estimated_budget ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{labels.submission.agency}</p>
                  <p className="text-lg">{submission.funding_agency || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{labels.submission.modality}</p>
                  <p className="text-lg">{submission.modality || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{labels.submission.knowledgeArea}</p>
                  <p className="text-lg">{submission.knowledge_area || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{labels.submission.researchDuration}</p>
                  <p className="text-lg">{submission.research_duration || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{labels.submission.department}</p>
                  <p className="text-lg">{submission.department || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{labels.submission.unit}</p>
                  <p className="text-lg">{submission.unit || "—"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">{labels.submission.partners}</p>
                  <p className="text-lg">{submission.partners || "—"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <aside className="space-y-6">
        <ApprovalControls 
          submission={submission} 
          userRole={profile?.role || "researcher"} 
          userId={user.id} 
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{labels.submission.members}</CardTitle>
          </CardHeader>
          <CardContent>
            <SubmissionMembersEditor 
              submissionId={submission.id} 
              members={members} 
              canWrite={canEdit} 
            />
          </CardContent>
        </Card>
        
        {submission.internal_feedback && (
          <Card className="bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="text-sm">{labels.submission.feedback}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">"{submission.internal_feedback}"</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Histórico Interno</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div className="flex justify-between">
              <span>{labels.submission.deptApproval}</span>
              <span className="font-mono">{submission.dept_approval_at ? new Date(submission.dept_approval_at).toLocaleDateString() : "Pendente"}</span>
            </div>
            <div className="flex justify-between">
              <span>{labels.submission.cpApproval}</span>
              <span className="font-mono">{submission.cp_approval_at ? new Date(submission.cp_approval_at).toLocaleDateString() : "Pendente"}</span>
            </div>
            <div className="flex justify-between">
              <span>{labels.submission.mauaApproval}</span>
              <span className="font-mono">{submission.maua_approval_at ? new Date(submission.maua_approval_at).toLocaleDateString() : "Pendente"}</span>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
