import { createClient } from "@/lib/supabase/server";
import { getMyPermissions, can } from "@/lib/permissions";
import { redirect, notFound } from "next/navigation";
import { getDashboardKpis } from "@/lib/data/kpis";
import { DashboardCharts } from "../../dashboard/_components/dashboard-charts";
import { GroupManagement } from "../../groups/_components/group-management";
import { labels } from "@/lib/labels";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/lib/crud/confirm-dialog";
import { deleteDepartment } from "../_actions";
import { RiArrowLeftLine, RiEditLine, RiDeleteBinLine } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DepartmentForm } from "../_components/department-form";

export const dynamic = "force-dynamic";

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const perms = await getMyPermissions();
  if (!can(perms, "departments:read")) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  
  // Fetch department details
  const { data: department } = await supabase
    .from("departments")
    .select("*")
    .eq("id", id)
    .single();

  if (!department) notFound();

  // Fetch department members
  const { data: members } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("department_id", id)
    .eq("is_active", true)
    .order("full_name");

  // Fetch stats for this department
  const k = await getDashboardKpis(department.name);

  const canManage = can(perms, "departments:manage");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/departments" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
            title="Voltar"
          >
            <RiArrowLeftLine className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{department.name}</h1>
              {canManage && (
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger render={
                      <Button variant="ghost" size="icon-sm">
                        <RiEditLine className="size-4" />
                      </Button>
                    } />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{labels.actions.edit}</DialogTitle>
                      </DialogHeader>
                      <DepartmentForm department={department} />
                    </DialogContent>
                  </Dialog>
                  
                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10">
                        <RiDeleteBinLine className="size-4" />
                      </Button>
                    }
                    onConfirm={async () => {
                      "use server";
                      await deleteDepartment(department.id);
                      redirect("/departments");
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-muted-foreground">{department.description || "Gestão e indicadores do grupo"}</p>
          </div>
        </div>
        <Badge variant="outline" className="w-fit text-sm py-1 px-3">
          {members?.length || 0} {labels.department.members}
        </Badge>
      </div>

      {canManage ? (
        <section className="space-y-4">
          <SectionHeading 
            title="Gestão de Membros" 
            description="Adicione ou remova pesquisadores deste grupo." 
          />
          <GroupManagement 
            departmentId={department.id} 
            departmentName={department.name}
            members={members || []} 
          />
        </section>
      ) : (
        <section className="space-y-4">
          <SectionHeading 
            title="Pesquisadores Vinculados" 
            description="Corpo docente associado a este grupo." 
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(members || []).map((member) => (
              <Card key={member.id} className="hover:border-primary/30 transition-colors">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-semibold">{member.full_name}</CardTitle>
                  <CardDescription className="text-xs">{member.email}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <Link 
                    href={`/researchers/${member.id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Ver perfil completo
                  </Link>
                </CardContent>
              </Card>
            ))}
            {(members || []).length === 0 && (
              <p className="text-sm text-muted-foreground italic col-span-full">Nenhum pesquisador vinculado a este grupo.</p>
            )}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <SectionHeading 
          title={labels.department.stats} 
          description="Indicadores consolidados de produção e fomento do grupo." 
        />
        <DashboardCharts k={k} />
      </section>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
