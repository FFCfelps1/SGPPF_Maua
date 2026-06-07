import { PublicationForm } from "../_components/publication-form";
import { createPublication } from "../_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { labels } from "@/lib/labels";

export default function NewPublicationPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {labels.nav.publications}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{labels.actions.create}</CardTitle>
        </CardHeader>
        <CardContent>
          <PublicationForm action={createPublication} afterSuccess="/publications" />
        </CardContent>
      </Card>
    </div>
  );
}
