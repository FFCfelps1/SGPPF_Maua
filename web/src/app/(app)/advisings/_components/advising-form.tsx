"use client";

import { useRouter } from "next/navigation";
import { EntityForm } from "@/lib/crud/entity-form";
import { Field } from "@/lib/crud/field";
import { Input } from "@/components/ui/input";
import { labels } from "@/lib/labels";
import { ADVISING_LEVEL, ADVISING_STATUS } from "@/lib/schemas/advising";
import type { ActionState } from "@/lib/crud/action";
import type { Database } from "@/lib/database.types";

type Advising = Database["public"]["Tables"]["advisings"]["Row"];
type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2";

export function AdvisingForm({
  action,
  defaults,
  afterSuccess = "refresh",
  researchers,
  projects,
}: {
  action: Action;
  defaults?: Partial<Advising>;
  afterSuccess?: "refresh" | string;
  researchers: { id: string; full_name: string }[];
  projects: { id: number; title: string }[];
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
          <Field name="student_name" label={labels.advising.student} required error={state.errors?.student_name}>
            <Input id="student_name" name="student_name" defaultValue={d.student_name ?? ""} required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="level" label={labels.advising.level} error={state.errors?.level}>
              <select id="level" name="level" defaultValue={d.level ?? "masters"} className={selectClass}>
                {ADVISING_LEVEL.map((l) => (
                  <option key={l} value={l}>{labels.advisingLevel[l]}</option>
                ))}
              </select>
            </Field>
            <Field name="status" label={labels.advising.status} error={state.errors?.status}>
              <select id="status" name="status" defaultValue={d.status ?? "in_progress"} className={selectClass}>
                {ADVISING_STATUS.map((s) => (
                  <option key={s} value={s}>{labels.advisingStatus[s]}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field name="work_title" label={labels.advising.workTitle} error={state.errors?.work_title}>
            <Input id="work_title" name="work_title" defaultValue={d.work_title ?? ""} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="co_advisor_id" label={labels.advising.coAdvisor} error={state.errors?.co_advisor_id}>
              <select id="co_advisor_id" name="co_advisor_id" defaultValue={d.co_advisor_id ?? ""} className={selectClass}>
                <option value="">{labels.advising.none}</option>
                {researchers.map((r) => (
                  <option key={r.id} value={r.id}>{r.full_name}</option>
                ))}
              </select>
            </Field>
            <Field name="project_id" label={labels.advising.project} error={state.errors?.project_id}>
              <select id="project_id" name="project_id" defaultValue={d.project_id ?? ""} className={selectClass}>
                <option value="">{labels.advising.none}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </Field>
            <Field name="scholarship_agency" label={labels.advising.scholarshipAgency} error={state.errors?.scholarship_agency}>
              <Input id="scholarship_agency" name="scholarship_agency" defaultValue={d.scholarship_agency ?? ""} />
            </Field>
            <div className="hidden sm:block" />
            <Field name="start_date" label={labels.advising.startDate} error={state.errors?.start_date}>
              <Input id="start_date" name="start_date" type="date" defaultValue={d.start_date ?? ""} />
            </Field>
            <Field name="end_date" label={labels.advising.endDate} error={state.errors?.end_date}>
              <Input id="end_date" name="end_date" type="date" defaultValue={d.end_date ?? ""} />
            </Field>
          </div>
        </>
      )}
    </EntityForm>
  );
}
