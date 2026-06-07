import { ProjectForm } from "../_components/project-form";
import { createProject } from "../_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { labels } from "@/lib/labels";

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {labels.nav.projects}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{labels.actions.create}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm action={createProject} afterSuccess="/projects" />
        </CardContent>
      </Card>
    </div>
  );
}
