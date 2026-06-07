import { AdvisingForm } from "../_components/advising-form";
import { createAdvising } from "../_actions";
import { loadAdvisingOptions } from "../_data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { labels } from "@/lib/labels";

export default async function NewAdvisingPage() {
  const { researchers, projects } = await loadAdvisingOptions();
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {labels.nav.advisings}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{labels.actions.create}</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvisingForm
            action={createAdvising}
            afterSuccess="/advisings"
            researchers={researchers}
            projects={projects}
          />
        </CardContent>
      </Card>
    </div>
  );
}
