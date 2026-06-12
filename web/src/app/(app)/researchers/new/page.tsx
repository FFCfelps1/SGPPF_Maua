import { ResearcherForm } from "../_components/researcher-form";
import { createResearcher } from "../_actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { labels } from "@/lib/labels";
import { getMyPermissions, can } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function NewResearcherPage() {
  const perms = await getMyPermissions();
  if (!can(perms, "researchers:create")) {
    redirect("/researchers");
  }

  const supabase = await createClient();
  const { data: departments } = await supabase
    .from("departments")
    .select("id, name")
    .order("name");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {labels.nav.researchers}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{labels.actions.create}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResearcherForm 
            action={createResearcher} 
            afterSuccess="/researchers" 
            departments={departments || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
