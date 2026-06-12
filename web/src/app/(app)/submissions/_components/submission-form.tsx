"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/lib/crud/entity-form";
import { Field } from "@/lib/crud/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { labels } from "@/lib/labels";
import { searchResearchers } from "../_actions";
import { RiUserAddLine, RiDeleteBinLine, RiSearchLine } from "@remixicon/react";
import type { ActionState } from "@/lib/crud/action";
import type { Database } from "@/lib/database.types";
import { MemberHoursChart } from "./member-hours-chart";

type Submission = Database["public"]["Tables"]["project_submissions"]["Row"];
type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function SubmissionForm({
  action,
  defaults,
  afterSuccess = "refresh",
}: {
  action: Action;
  defaults?: Partial<Submission>;
  afterSuccess?: "refresh" | string;
}) {
  const router = useRouter();
  const d = defaults ?? {};
  
  // Local state for members during creation (only for 'new' mode)
  const [selectedMembers, setSelectedMembers] = useState<{id: string, name: string, hours: number}[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [documentUrl, setDocumentUrl] = useState(d.document_url ?? "");
  const isNew = !d.id;

  async function handleSearch() {
    if (query.length < 2) return;
    const data = await searchResearchers(query);
    setResults(data || []);
  }

  const onSuccess = () =>
    afterSuccess === "refresh" ? router.refresh() : router.push(afterSuccess);

  return (
    <EntityForm action={action} onSuccess={onSuccess}>
      {(state) => (
        <>
          {d.id ? <input type="hidden" name="id" value={d.id} /> : null}
          <input type="hidden" name="document_url" value={documentUrl} />
          
          {/* Hidden input to pass member data (ID + Hours) to the action */}
          {isNew && (
            <input 
              type="hidden" 
              name="_members_json" 
              value={JSON.stringify(selectedMembers)} 
            />
          )}

          <Field name="title" label={labels.submission.projectTitle} required error={state.errors?.title}>
            <Input id="title" name="title" defaultValue={d.title ?? ""} required />
          </Field>

          <div className="pt-2">
            <FileUpload
              label={labels.submission.document}
              value={documentUrl}
              onUpload={setDocumentUrl}
              onRemove={() => setDocumentUrl("")}
              folder="submissions"
            />
          </div>
          
          <Field name="abstract" label={labels.submission.abstract} error={state.errors?.abstract}>
            <textarea
              id="abstract"
              name="abstract"
              defaultValue={d.abstract ?? ""}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2"
            />
          </Field>

          <Field name="objectives" label={labels.submission.objectives} error={state.errors?.objectives}>
            <textarea
              id="objectives"
              name="objectives"
              defaultValue={d.objectives ?? ""}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2"
            />
          </Field>

          <Field name="methodology" label={labels.submission.methodology} error={state.errors?.methodology}>
            <textarea
              id="methodology"
              name="methodology"
              defaultValue={d.methodology ?? ""}
              className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="estimated_budget" label={labels.submission.budget} error={state.errors?.estimated_budget}>
              <Input
                id="estimated_budget"
                name="estimated_budget"
                type="number"
                step="0.01"
                defaultValue={d.estimated_budget?.toString() ?? "0"}
              />
            </Field>
            <Field name="funding_agency" label={labels.submission.agency} error={state.errors?.funding_agency}>
              <Input id="funding_agency" name="funding_agency" defaultValue={d.funding_agency ?? ""} />
            </Field>
            <Field name="modality" label={labels.submission.modality} error={state.errors?.modality}>
              <Input id="modality" name="modality" defaultValue={d.modality ?? ""} />
            </Field>
            <Field name="knowledge_area" label={labels.submission.knowledgeArea} error={state.errors?.knowledge_area}>
              <Input id="knowledge_area" name="knowledge_area" defaultValue={d.knowledge_area ?? ""} />
            </Field>
            <Field name="research_duration" label={labels.submission.researchDuration} error={state.errors?.research_duration}>
              <Input id="research_duration" name="research_duration" defaultValue={d.research_duration ?? ""} />
            </Field>
            <Field name="department" label={labels.submission.department} error={state.errors?.department}>
              <Input id="department" name="department" defaultValue={d.department ?? ""} />
            </Field>
            <Field name="unit" label={labels.submission.unit} error={state.errors?.unit}>
              <Input id="unit" name="unit" defaultValue={d.unit ?? ""} />
            </Field>
          </div>
          <Field name="partners" label={labels.submission.partners} error={state.errors?.partners}>
            <Input id="partners" name="partners" defaultValue={d.partners ?? ""} />
          </Field>

          {isNew && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">{labels.submission.members}</h3>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar pesquisadores..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                />
                <Button type="button" variant="outline" onClick={handleSearch}>
                  <RiSearchLine className="size-4" />
                </Button>
              </div>

              {results.length > 0 && (
                <ul className="rounded-md border bg-muted/30 overflow-hidden">
                  {results.map((r) => {
                    const isSelected = selectedMembers.some((m) => m.id === r.id);
                    return (
                      <li key={r.id} className="flex items-center justify-between p-2 text-sm hover:bg-muted">
                        <span>{r.full_name} ({r.email})</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={isSelected}
                          onClick={() => {
                            setSelectedMembers([...selectedMembers, { id: r.id, name: r.full_name, hours: 0 }]);
                            setResults([]);
                            setQuery("");
                          }}
                        >
                          {isSelected ? "Selecionado" : <RiUserAddLine className="size-4" />}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {selectedMembers.length > 0 && (
                <div className="space-y-2">
                  {selectedMembers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{m.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground shrink-0">Horas:</label>
                          <Input
                            type="number"
                            min={0}
                            className="h-8 w-16 px-2 text-xs"
                            value={m.hours}
                            onChange={(e) => {
                              const hours = parseInt(e.target.value) || 0;
                              setSelectedMembers(selectedMembers.map(sm => sm.id === m.id ? { ...sm, hours } : sm));
                            }}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setSelectedMembers(selectedMembers.filter(sm => sm.id !== m.id))}
                        >
                          <RiDeleteBinLine className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <MemberHoursChart members={selectedMembers} />
            </div>
          )}
        </>
      )}
    </EntityForm>
  );
}
