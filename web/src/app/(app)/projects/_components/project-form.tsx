"use client";

import { useRouter } from "next/navigation";
import { EntityForm } from "@/lib/crud/entity-form";
import { Field } from "@/lib/crud/field";
import { Input } from "@/components/ui/input";
import { labels } from "@/lib/labels";
import { PROJECT_STATUS } from "@/lib/schemas/project";
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
  const onSuccess = () =>
    afterSuccess === "refresh" ? router.refresh() : router.push(afterSuccess);

  return (
    <EntityForm action={action} onSuccess={onSuccess}>
      {(state) => (
        <>
          {d.id ? <input type="hidden" name="id" value={d.id} /> : null}
          <Field name="title" label={labels.project.title} required error={state.errors?.title}>
            <Input id="title" name="title" defaultValue={d.title ?? ""} required />
          </Field>
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
        </>
      )}
    </EntityForm>
  );
}
