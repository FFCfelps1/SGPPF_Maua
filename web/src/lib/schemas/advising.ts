import { z } from "zod";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

export const ADVISING_LEVEL = [
  "scientific_initiation",
  "undergraduate_thesis",
  "masters",
  "doctorate",
  "postdoc",
] as const satisfies readonly Database["public"]["Enums"]["advising_level"][];

export const ADVISING_STATUS = [
  "in_progress",
  "completed",
  "cancelled",
] as const satisfies readonly Database["public"]["Enums"]["advising_status"][];

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
const optText = z.preprocess(emptyToNull, z.string().nullable());

const base = {
  student_name: z.string().trim().min(2, labels.errors.required),
  level: z.enum(ADVISING_LEVEL),
  work_title: optText,
  status: z.enum(ADVISING_STATUS),
  co_advisor_id: z.preprocess(emptyToNull, z.uuid().nullable()),
  project_id: z.preprocess(emptyToNull, z.coerce.number().int().nullable()),
  scholarship_agency: optText,
  start_date: optText,
  end_date: optText,
  document_url: optText,
};

export const advisingCreateSchema = z.object(base);
export const advisingUpdateSchema = z.object({
  ...base,
  id: z.coerce.number().int(),
});
