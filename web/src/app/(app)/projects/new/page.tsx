import { ProjectForm } from "../_components/project-form";
import { createProject } from "../_actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { labels } from "@/lib/labels";
import { buttonVariants } from "@/components/ui/button";
import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data: departments } = await supabase
    .from("departments")
    .select("id, name")
    .order("name");

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/projects" 
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          title="Voltar"
        >
          <RiArrowLeftLine className="size-4" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {labels.nav.projects}
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{labels.actions.create}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm 
            action={createProject} 
            afterSuccess="/projects" 
            departments={departments || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
