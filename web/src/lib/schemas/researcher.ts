import { z } from "zod";
import { labels } from "@/lib/labels";

/** Empty form value -> null; otherwise the trimmed string. */
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null));

/** Editable profile fields (email is tied to auth; role is admin-only via U14). */
export const researcherUpdateSchema = z.object({
  id: z.uuid(),
  full_name: z.string().trim().min(2, labels.errors.required),
  department_id: z.coerce.number().int().optional().nullable(),
  unit: optionalText,
  position: optionalText,
  area_of_expertise: optionalText,
  orcid: optionalText,
  lattes_url: optionalText,
  google_scholar_id: optionalText,
  research_gate_id: optionalText,
  employment_type: optionalText,
  affiliation_date: optionalText,
  teaching_hours: z.coerce.number().int().nonnegative().default(0),
  research_hours: z.coerce.number().int().nonnegative().default(0),
  other_hours: z.coerce.number().int().nonnegative().default(0),
  cv_url: optionalText,
});

export type ResearcherUpdate = z.infer<typeof researcherUpdateSchema>;

export const researcherCreateSchema = z.object({
  full_name: z.string().trim().min(2, labels.errors.required),
  email: z
    .string()
    .email(labels.errors.invalidEmail)
    .regex(/@maua\.br$/i, labels.errors.notMauaEmail),
  department_id: z.coerce.number().int().optional().nullable(),
  unit: optionalText,
  position: optionalText,
  area_of_expertise: optionalText,
  orcid: optionalText,
  lattes_url: optionalText,
  google_scholar_id: optionalText,
  research_gate_id: optionalText,
  employment_type: optionalText,
  affiliation_date: optionalText,
  teaching_hours: z.coerce.number().int().nonnegative().default(0),
  research_hours: z.coerce.number().int().nonnegative().default(0),
  other_hours: z.coerce.number().int().nonnegative().default(0),
  cv_url: optionalText,
});

export type ResearcherCreate = z.infer<typeof researcherCreateSchema>;
