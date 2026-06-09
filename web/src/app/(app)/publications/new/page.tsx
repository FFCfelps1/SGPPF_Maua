import { DoiImport } from "../_components/doi-import";
import { PublicationForm } from "../_components/publication-form";
import { createPublication } from "../_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { labels } from "@/lib/labels";
import { buttonVariants } from "@/components/ui/button";
import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewPublicationPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/publications" 
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          title="Voltar"
        >
          <RiArrowLeftLine className="size-4" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {labels.nav.publications}
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{labels.publication.importByDoiTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <DoiImport />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{labels.publication.manualEntry}</CardTitle>
        </CardHeader>
        <CardContent>
          <PublicationForm
            action={createPublication}
            afterSuccess="/publications"
          />
        </CardContent>
      </Card>
    </div>
  );
}
