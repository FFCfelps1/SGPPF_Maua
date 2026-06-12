"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/lib/crud/entity-form";
import { Field } from "@/lib/crud/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { labels } from "@/lib/labels";
import { PROJECT_STATUS } from "@/lib/schemas/project";
import { searchResearchers } from "@/app/(app)/submissions/_actions";
import { RiUserAddLine, RiDeleteBinLine, RiSearchLine } from "@remixicon/react";
import type { ActionState } from "@/lib/crud/action";
import type { Database } from "@/lib/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2";

export function ProjectForm({
  action,
  defaults,
  afterSuccess = "refresh",
}: {
  action: Action;
  defaults?: Partial<Project>;
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

          <Field name="title" label={labels.project.title} required error={state.errors?.title}>
            <Input id="title" name="title" defaultValue={d.title ?? ""} required />
          </Field>
          <div className="pt-2">
            <FileUpload
              label={labels.project.document}
              value={documentUrl}
              onUpload={setDocumentUrl}
              onRemove={() => setDocumentUrl("")}
              folder="projects"
            />
          </div>
          <Field name="description" label={labels.project.description} error={state.errors?.description}>
            <Input id="description" name="description" defaultValue={d.description ?? ""} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="department" label={labels.researcher.department} error={state.errors?.department}>
              <Input id="department" name="department" defaultValue={d.department ?? ""} />
            </Field>
            <Field name="unit" label={labels.researcher.unit} error={state.errors?.unit}>
              <Input id="unit" name="unit" defaultValue={d.unit ?? ""} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="code" label={labels.project.code} error={state.errors?.code}>
              <Input id="code" name="code" defaultValue={d.code ?? ""} />
            </Field>
            <Field name="modality" label={labels.project.modality} error={state.errors?.modality}>
              <Input id="modality" name="modality" defaultValue={d.modality ?? ""} />
            </Field>
            <Field name="status" label={labels.project.status} error={state.errors?.status}>
              <select id="status" name="status" defaultValue={d.status ?? "in_progress"} className={selectClass}>
                {PROJECT_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {labels.projectStatus[s]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="hidden sm:block" />
            <Field name="start_date" label={labels.project.startDate} error={state.errors?.start_date}>
              <Input id="start_date" name="start_date" type="date" defaultValue={d.start_date ?? ""} />
            </Field>
            <Field name="end_date" label={labels.project.endDate} error={state.errors?.end_date}>
              <Input id="end_date" name="end_date" type="date" defaultValue={d.end_date ?? ""} />
            </Field>
          </div>

          {isNew && (
            <div className="space-y-4 pt-4 border-t mt-4">
              <h3 className="text-sm font-medium">{labels.project.members}</h3>
              
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
            </div>
          )}
        </>
      )}
    </EntityForm>
  );
}
