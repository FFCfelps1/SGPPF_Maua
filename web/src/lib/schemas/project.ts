import { z } from "zod";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

export const PROJECT_STATUS = [
  "planned",
  "in_progress",
  "completed",
  "cancelled",
] as const satisfies readonly Database["public"]["Enums"]["project_status"][];

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
const optText = z.preprocess(emptyToNull, z.string().nullable());

const base = {
  title: z.string().trim().min(2, labels.errors.required),
  code: optText,
  description: optText,
  department: optText,
  unit: optText,
  modality: optText,
  status: z.enum(PROJECT_STATUS),
  start_date: optText,
  end_date: optText,
};

export const projectCreateSchema = z.object(base);
export const projectUpdateSchema = z.object({
  ...base,
  id: z.coerce.number().int(),
});
