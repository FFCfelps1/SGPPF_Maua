import { createClient } from "@/lib/supabase/server";
import { getMyPermissions, can } from "@/lib/permissions";
import { redirect, notFound } from "next/navigation";
import { getDashboardKpis } from "@/lib/data/kpis";
import { DashboardCharts } from "../dashboard/_components/dashboard-charts";
import { GroupManagement } from "./_components/group-management";
import { joinDepartment } from "./_actions";
import { labels } from "@/lib/labels";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DepartmentForm } from "../departments/_components/department-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RiAddLine, RiGroupLine } from "@remixicon/react";

export const dynamic = "force-dynamic";

export default async function GroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const perms = await getMyPermissions();
  // Restriction: only cp_manager, maua_manager, and admin.
  // Managers typically have 'submissions:approve'. Admins have 'users:manage'.
  // dept_manager also has 'departments:read' but we exclude it as requested.
  const isAuthorized = perms.has("users:manage") || perms.has("submissions:approve");
  
  if (!can(perms, "groups:read") || !isAuthorized) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get current user's profile to find their department
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, department_id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold">Perfil não encontrado</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Não foi possível encontrar os dados do seu perfil no sistema. 
          Certifique-se de que sua conta foi configurada corretamente.
        </p>
      </div>
    );
  }

  const { id: queryId } = await searchParams;
  const targetId = (profile.role === "admin" || profile.role === "maua_manager" || profile.role === "cp_manager") 
    ? (queryId ? parseInt(queryId) : profile.department_id) 
    : profile.department_id;

  if (!targetId) {
    const { data: allDepts } = await supabase
      .from("departments")
      .select("id, name")
      .order("name");

    const canCreate = can(perms, "departments:manage");

    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
          <RiGroupLine className="size-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Nenhum Grupo Vinculado</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Você ainda não está vinculado a um grupo de pesquisa. Selecione seu grupo abaixo para ver os indicadores e membros.
          </p>
        </div>
        
        <div className="grid gap-3 w-full max-w-sm">
          {allDepts?.map((dept) => (
            <form key={dept.id} action={joinDepartment.bind(null, dept.id)}>
              <Button type="submit" variant="outline" className="w-full justify-between h-12 px-4 hover:border-primary hover:bg-primary/5 transition-all">
                {dept.name}
                <Badge variant="secondary" className="ml-2 font-normal">Entrar</Badge>
              </Button>
            </form>
          ))}
          {(!allDepts || allDepts.length === 0) && (
            <p className="text-sm text-center text-muted-foreground italic">
              Nenhum grupo cadastrado.
            </p>
          )}

          {canCreate && (
            <div className="pt-4 border-t mt-2">
              <Dialog>
                <DialogTrigger render={
                  <Button className="w-full gap-2">
                    <RiAddLine className="size-4" />
                    {labels.department.add}
                  </Button>
                } />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{labels.department.add}</DialogTitle>
                  </DialogHeader>
                  <DepartmentForm />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fetch department details
  const { data: department } = await supabase
    .from("departments")
    .select("*")
    .eq("id", targetId)
    .single();

  if (!department) redirect("/groups");

  // Fetch department members
  const { data: members } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("department_id", targetId)
    .eq("is_active", true)
    .order("full_name");

  // Fetch stats for this department
  const k = await getDashboardKpis(department.name);

  const canManage = can(perms, "groups:manage");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{department.name}</h1>
          <p className="text-muted-foreground">{department.description || "Gestão e indicadores do grupo"}</p>
        </div>
        <Badge variant="outline" className="w-fit text-sm py-1 px-3">
          {members?.length || 0} Pesquisadores
        </Badge>
      </div>

      {canManage && (
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
      )}

      <section className="space-y-4">
        <SectionHeading 
          title="Estatísticas do Grupo" 
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
