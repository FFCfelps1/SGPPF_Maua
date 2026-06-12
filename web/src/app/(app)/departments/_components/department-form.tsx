"use client";

import { useRouter } from "next/navigation";
import { EntityForm } from "@/lib/crud/entity-form";
import { Field } from "@/lib/crud/field";
import { Input } from "@/components/ui/input";
import { createDepartment, updateDepartment } from "../_actions";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";
import type { ActionState } from "@/lib/crud/action";

type Department = {
  id?: number;
  name?: string;
  description?: string | null;
};

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function DepartmentForm({
  department,
  action = department?.id ? updateDepartment : createDepartment,
  afterSuccess = "refresh",
}: {
  department?: Department;
  action?: Action;
  afterSuccess?: "refresh" | string;
}) {
  const router = useRouter();
  const d = department ?? {};

  const onSuccess = () =>
    afterSuccess === "refresh" ? router.refresh() : router.push(afterSuccess);

  return (
    <EntityForm action={action} onSuccess={onSuccess}>
      {(state) => (
        <div className="space-y-4">
          {d.id && <input type="hidden" name="id" value={d.id} />}
          
          <Field name="name" label={labels.department.name} required error={state.errors?.name}>
            <Input id="name" name="name" defaultValue={d.name ?? ""} required />
          </Field>

          <Field name="description" label={labels.department.description} error={state.errors?.description}>
            <textarea
              id="description"
              name="description"
              defaultValue={d.description ?? ""}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2"
            />
          </Field>
        </div>
      )}
    </EntityForm>
  );
}
