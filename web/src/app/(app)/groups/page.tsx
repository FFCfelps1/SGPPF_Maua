import { createClient } from "@/lib/supabase/server";
import { getMyPermissions, can } from "@/lib/permissions";
import { redirect, notFound } from "next/navigation";
import { getDashboardKpis } from "@/lib/data/kpis";
import { DashboardCharts } from "../dashboard/_components/dashboard-charts";
import { GroupManagement } from "./_components/group-management";
import { labels } from "@/lib/labels";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function GroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>;
}) {
  const perms = await getMyPermissions();
  if (!can(perms, "groups:read")) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get current user's profile to find their department
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, department")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Use the department from the profile, or from searchParams if admin
  const { department: queryDept } = await searchParams;
  const targetDepartment = (profile.role === "admin" || profile.role === "maua_manager" || profile.role === "cp_manager") 
    ? (queryDept || profile.department) 
    : profile.department;

  if (!targetDepartment) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold">Nenhum Departamento Vinculado</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Seu perfil não está vinculado a um departamento específico. 
          Entre em contato com um administrador para configurar seu acesso.
        </p>
      </div>
    );
  }

  // Fetch department members
  const { data: members } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("department", targetDepartment)
    .eq("is_active", true)
    .order("full_name");

  // Fetch stats for this department
  const k = await getDashboardKpis({ department: targetDepartment });

  const canManage = can(perms, "groups:manage");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{targetDepartment}</h1>
          <p className="text-muted-foreground">Gestão e indicadores do grupo</p>
        </div>
        <Badge variant="outline" className="w-fit text-sm py-1 px-3">
          {members?.length || 0} Pesquisadores
        </Badge>
      </div>

      {canManage && (
        <section className="space-y-4">
          <SectionHeading 
            title="Gestão de Membros" 
            description="Adicione ou remova pesquisadores deste departamento." 
          />
          <GroupManagement 
            department={targetDepartment} 
            members={members || []} 
          />
        </section>
      )}

      <section className="space-y-4">
        <SectionHeading 
          title="Estatísticas do Departamento" 
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
