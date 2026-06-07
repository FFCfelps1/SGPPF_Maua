"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { PublicationForm } from "./publication-form";
import { createPublication, fetchDoi } from "../_actions";
import { labels } from "@/lib/labels";
import type { DoiResult } from "@/lib/crossref";

export function DoiImport() {
  const [doi, setDoi] = useState("");
  const [result, setResult] = useState<DoiResult | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () =>
    startTransition(async () => setResult(await fetchDoi(doi)));

  // Confirmation: prefilled form -> createPublication on save.
  if (result?.status === "preview") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {labels.publication.doiPreviewHint}
        </p>
        <PublicationForm
          action={createPublication}
          defaults={result.data}
          afterSuccess="/publications"
        />
        <Button variant="ghost" size="sm" onClick={() => setResult(null)}>
          {labels.actions.cancel}
        </Button>
      </div>
    );
  }

  // Existing DOI: no clobber, no duplicate — link to the existing record.
  if (result?.status === "exists") {
    return (
      <div className="space-y-3 text-sm">
        <p>{labels.publication.doiExists}</p>
        <Link
          href={`/publications/${result.id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          {labels.publication.viewExisting}
        </Link>
        <Button variant="ghost" size="sm" onClick={() => setResult(null)}>
          {labels.actions.cancel}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={doi}
          onChange={(e) => setDoi(e.target.value)}
          placeholder="10.1000/exemplo"
          disabled={pending}
        />
        <Button onClick={submit} disabled={pending || doi.trim() === ""}>
          {labels.actions.importDoi}
        </Button>
      </div>
      {result?.status === "error" ? (
        <p className="text-sm text-destructive">{result.message}</p>
      ) : null}
    </div>
  );
}
