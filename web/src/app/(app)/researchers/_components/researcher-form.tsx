"use client";

import { useRouter } from "next/navigation";
import { EntityForm } from "@/lib/crud/entity-form";
import { Field } from "@/lib/crud/field";
import { Input } from "@/components/ui/input";
import { updateResearcher } from "../_actions";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2";

export function ResearcherForm({ 
  profile,
  afterSuccess = "refresh",
}: { 
  profile: Profile;
  afterSuccess?: "refresh" | string;
}) {
  const router = useRouter();
  const onSuccess = () =>
    afterSuccess === "refresh" ? router.refresh() : router.push(afterSuccess);

  return (
    <EntityForm action={updateResearcher} onSuccess={onSuccess}>
      {(state) => (
        <>
          <input type="hidden" name="id" value={profile.id} />
          <Field name="full_name" label={labels.researcher.name} required error={state.errors?.full_name}>
            <Input id="full_name" name="full_name" defaultValue={profile.full_name ?? ""} required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="department" label={labels.researcher.department} error={state.errors?.department}>
              <Input id="department" name="department" defaultValue={profile.department ?? ""} />
            </Field>
            <Field name="unit" label={labels.researcher.unit} error={state.errors?.unit}>
              <Input id="unit" name="unit" defaultValue={profile.unit ?? ""} />
            </Field>
          </div>
          <Field name="position" label={labels.researcher.position} error={state.errors?.position}>
            <Input id="position" name="position" defaultValue={profile.position ?? ""} />
          </Field>
          <Field name="area_of_expertise" label={labels.researcher.area} error={state.errors?.area_of_expertise}>
            <Input id="area_of_expertise" name="area_of_expertise" defaultValue={profile.area_of_expertise ?? ""} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="orcid" label={labels.researcher.orcid} error={state.errors?.orcid}>
              <Input id="orcid" name="orcid" defaultValue={profile.orcid ?? ""} />
            </Field>
            <Field name="lattes_url" label={labels.researcher.lattes} error={state.errors?.lattes_url}>
              <Input id="lattes_url" name="lattes_url" type="url" defaultValue={profile.lattes_url ?? ""} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="google_scholar_id" label={labels.researcher.scholar} error={state.errors?.google_scholar_id}>
              <Input id="google_scholar_id" name="google_scholar_id" defaultValue={profile.google_scholar_id ?? ""} />
            </Field>
            <Field name="research_gate_id" label={labels.researcher.researchGate} error={state.errors?.research_gate_id}>
              <Input id="research_gate_id" name="research_gate_id" defaultValue={profile.research_gate_id ?? ""} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="employment_type" label={labels.researcher.employmentType} error={state.errors?.employment_type}>
              <select id="employment_type" name="employment_type" defaultValue={profile.employment_type ?? "full_time"} className={selectClass}>
                <option value="full_time">{labels.employmentTypes.full_time}</option>
                <option value="part_time">{labels.employmentTypes.part_time}</option>
                <option value="hourly">{labels.employmentTypes.hourly}</option>
              </select>
            </Field>
            <Field name="affiliation_date" label={labels.researcher.affiliationDate} error={state.errors?.affiliation_date}>
              <Input id="affiliation_date" name="affiliation_date" type="date" defaultValue={profile.affiliation_date ?? ""} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field name="teaching_hours" label={labels.researcher.teachingHours} error={state.errors?.teaching_hours}>
              <Input id="teaching_hours" name="teaching_hours" type="number" min={0} defaultValue={profile.teaching_hours ?? 0} />
            </Field>
            <Field name="research_hours" label={labels.researcher.researchHours} error={state.errors?.research_hours}>
              <Input id="research_hours" name="research_hours" type="number" min={0} defaultValue={profile.research_hours ?? 0} />
            </Field>
            <Field name="other_hours" label={labels.researcher.otherHours} error={state.errors?.other_hours}>
              <Input id="other_hours" name="other_hours" type="number" min={0} defaultValue={profile.other_hours ?? 0} />
            </Field>
          </div>
        </>
      )}
    </EntityForm>
  );
}
