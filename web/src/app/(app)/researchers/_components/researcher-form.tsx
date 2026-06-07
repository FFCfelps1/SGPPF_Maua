"use client";

import { useRouter } from "next/navigation";
import { EntityForm } from "@/lib/crud/entity-form";
import { Field } from "@/lib/crud/field";
import { Input } from "@/components/ui/input";
import { updateResearcher } from "../_actions";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function ResearcherForm({ profile }: { profile: Profile }) {
  const router = useRouter();

  return (
    <EntityForm action={updateResearcher} onSuccess={() => router.refresh()}>
      {(state) => (
        <>
          <input type="hidden" name="id" value={profile.id} />
          <Field name="full_name" label={labels.researcher.name} required error={state.errors?.full_name}>
            <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
          </Field>
          <Field name="position" label={labels.researcher.position} error={state.errors?.position}>
            <Input id="position" name="position" defaultValue={profile.position ?? ""} />
          </Field>
          <Field name="area_of_expertise" label={labels.researcher.area} error={state.errors?.area_of_expertise}>
            <Input id="area_of_expertise" name="area_of_expertise" defaultValue={profile.area_of_expertise ?? ""} />
          </Field>
          <Field name="orcid" label={labels.researcher.orcid} error={state.errors?.orcid}>
            <Input id="orcid" name="orcid" defaultValue={profile.orcid ?? ""} />
          </Field>
          <Field name="lattes_url" label={labels.researcher.lattes} error={state.errors?.lattes_url}>
            <Input id="lattes_url" name="lattes_url" type="url" defaultValue={profile.lattes_url ?? ""} />
          </Field>
          <Field name="google_scholar_id" label={labels.researcher.scholar} error={state.errors?.google_scholar_id}>
            <Input id="google_scholar_id" name="google_scholar_id" defaultValue={profile.google_scholar_id ?? ""} />
          </Field>
          <Field name="employment_type" label={labels.researcher.employmentType} error={state.errors?.employment_type}>
            <Input id="employment_type" name="employment_type" defaultValue={profile.employment_type ?? ""} />
          </Field>
          <Field name="affiliation_date" label={labels.researcher.affiliationDate} error={state.errors?.affiliation_date}>
            <Input id="affiliation_date" name="affiliation_date" type="date" defaultValue={profile.affiliation_date ?? ""} />
          </Field>
        </>
      )}
    </EntityForm>
  );
}
