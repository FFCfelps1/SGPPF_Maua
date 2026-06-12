"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/lib/crud/entity-form";
import { Field } from "@/lib/crud/field";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { labels } from "@/lib/labels";
import { PUBLICATION_TYPES } from "@/lib/schemas/publication";
import type { ActionState } from "@/lib/crud/action";
import type { Database } from "@/lib/database.types";

type Publication = Database["public"]["Tables"]["publications"]["Row"];
type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2";

export function PublicationForm({
  action,
  defaults,
  afterSuccess = "refresh",
}: {
  action: Action;
  defaults?: Partial<Publication>;
  afterSuccess?: "refresh" | string;
}) {
  const router = useRouter();
  const d = defaults ?? {};

  const [documentUrl, setDocumentUrl] = useState(d.document_url ?? "");

  const onSuccess = () =>
    afterSuccess === "refresh" ? router.refresh() : router.push(afterSuccess);

  return (
    <EntityForm action={action} onSuccess={onSuccess}>
      {(state) => (
        <>
          {d.id ? <input type="hidden" name="id" value={d.id} /> : null}
          <input type="hidden" name="document_url" value={documentUrl} />

          <Field name="title" label={labels.publication.title} required error={state.errors?.title}>
            <Input id="title" name="title" defaultValue={d.title ?? ""} required />
          </Field>

          <div className="pt-2">
            <FileUpload
              label={labels.publication.document}
              value={documentUrl}
              onUpload={setDocumentUrl}
              onRemove={() => setDocumentUrl("")}
              folder="publications"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="type" label={labels.publication.type} error={state.errors?.type}>
              <select id="type" name="type" defaultValue={d.type ?? ""} className={selectClass}>
                <option value="">—</option>
                {PUBLICATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {labels.publicationTypes[t]}
                  </option>
                ))}
              </select>
            </Field>
            <Field name="year" label={labels.publication.year} error={state.errors?.year}>
              <Input id="year" name="year" type="number" defaultValue={d.year ?? ""} />
            </Field>
          </div>
          <Field name="doi" label={labels.publication.doi} error={state.errors?.doi}>
            <Input id="doi" name="doi" defaultValue={d.doi ?? ""} />
          </Field>
          <Field name="venue" label={labels.publication.venue} error={state.errors?.venue}>
            <Input id="venue" name="venue" defaultValue={d.venue ?? ""} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="issn" label={labels.publication.issn} error={state.errors?.issn}>
              <Input id="issn" name="issn" defaultValue={d.issn ?? ""} />
            </Field>
            <Field name="qualis" label={labels.publication.qualis} error={state.errors?.qualis}>
              <Input id="qualis" name="qualis" defaultValue={d.qualis ?? ""} />
            </Field>
            <Field name="impact_factor" label={labels.publication.impactFactor} error={state.errors?.impact_factor}>
              <Input id="impact_factor" name="impact_factor" type="number" step="0.001" defaultValue={d.impact_factor ?? ""} />
            </Field>
            <Field name="citation_count" label={labels.publication.citationCount} error={state.errors?.citation_count}>
              <Input id="citation_count" name="citation_count" type="number" defaultValue={d.citation_count ?? ""} />
            </Field>
          </div>
          <Field name="url" label={labels.publication.url} error={state.errors?.url}>
            <Input id="url" name="url" type="url" defaultValue={d.url ?? ""} />
          </Field>
          <Field name="knowledge_area" label={labels.publication.area} error={state.errors?.knowledge_area}>
            <Input id="knowledge_area" name="knowledge_area" defaultValue={d.knowledge_area ?? ""} />
          </Field>
        </>
      )}
    </EntityForm>
  );
}
