import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmissionForm } from "../_components/submission-form";
import { createSubmission } from "../_actions";
import { labels } from "@/lib/labels";
import { buttonVariants } from "@/components/ui/button";
import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewSubmissionPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/submissions" 
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          title="Voltar"
        >
          <RiArrowLeftLine className="size-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{labels.submission.new}</h1>
          <p className="text-muted-foreground">
            Preencha os dados da proposta seguindo as diretrizes da agência de fomento.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Proposta</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionForm action={createSubmission} afterSuccess="/submissions" />
        </CardContent>
      </Card>
    </div>
  );
}
