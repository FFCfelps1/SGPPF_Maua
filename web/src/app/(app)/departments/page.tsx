import { createClient } from "@/lib/supabase/server";
import { getMyPermissions, can } from "@/lib/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { labels } from "@/lib/labels";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/lib/crud/data-table";
import { RiAddLine, RiArrowRightLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { DepartmentForm } from "./_components/department-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  const perms = await getMyPermissions();
  if (!can(perms, "departments:read")) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: departments } = await supabase
    .from("departments")
    .select("id, name, description, created_at")
    .order("name");

  const canManage = can(perms, "departments:manage");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{labels.nav.departments}</h1>
          <p className="text-muted-foreground">Gerenciamento de grupos de pesquisa e unidades acadêmicas</p>
        </div>
        {canManage && (
          <Dialog>
            <DialogTrigger render={
              <Button className="gap-2">
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
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(departments || []).map((dept) => (
          <Card key={dept.id} className="group hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">{dept.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                {dept.description || "Sem descrição disponível."}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/departments/${dept.id}`}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 group-hover:text-primary")}
                >
                  Ver detalhes
                  <RiArrowRightLine className="size-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!departments || departments.length === 0) && (
        <div className="flex h-[30vh] flex-col items-center justify-center space-y-4 rounded-xl border border-dashed">
          <p className="text-muted-foreground">Nenhum departamento cadastrado.</p>
        </div>
      )}
    </div>
  );
}
