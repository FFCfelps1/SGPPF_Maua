"use client";

import { useRouter } from "next/navigation";
import { EntityForm } from "@/lib/crud/entity-form";
import { Field } from "@/lib/crud/field";
import { Input } from "@/components/ui/input";
import { createFunding } from "../_actions";
import { labels } from "@/lib/labels";
import { FUNDING_STATUS } from "@/lib/schemas/funding";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2";

export function FundingForm({ projectId }: { projectId: number }) {
  const router = useRouter();
  return (
    <EntityForm action={createFunding} onSuccess={() => router.refresh()}>
      {(state) => (
        <>
          <input type="hidden" name="project_id" value={projectId} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="agency" label={labels.funding.agency} required error={state.errors?.agency}>
              <Input id="agency" name="agency" required />
            </Field>
            <Field name="modality" label={labels.funding.modality} error={state.errors?.modality}>
              <Input id="modality" name="modality" />
            </Field>
            <Field name="approved_amount" label={labels.funding.approved} error={state.errors?.approved_amount}>
              <Input id="approved_amount" name="approved_amount" type="number" step="0.01" defaultValue="0" />
            </Field>
            <Field name="received_amount" label={labels.funding.received} error={state.errors?.received_amount}>
              <Input id="received_amount" name="received_amount" type="number" step="0.01" defaultValue="0" />
            </Field>
            <Field name="status" label={labels.funding.status} error={state.errors?.status}>
              <select id="status" name="status" defaultValue="approved" className={selectClass}>
                {FUNDING_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {labels.fundingStatus[s]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="hidden sm:block" />
            <Field name="start_date" label={labels.funding.startDate} error={state.errors?.start_date}>
              <Input id="start_date" name="start_date" type="date" />
            </Field>
            <Field name="end_date" label={labels.funding.endDate} error={state.errors?.end_date}>
              <Input id="end_date" name="end_date" type="date" />
            </Field>
          </div>
        </>
      )}
    </EntityForm>
  );
}
