import { z } from "zod";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

export const FUNDING_STATUS = [
  "approved",
  "in_execution",
  "completed",
  "cancelled",
] as const satisfies readonly Database["public"]["Enums"]["funding_status"][];

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
const optText = z.preprocess(emptyToNull, z.string().nullable());
const amount = z.preprocess(
  (v) => (v === "" || v === undefined ? 0 : v),
  z.coerce.number().min(0),
);

const base = {
  project_id: z.coerce.number().int(),
  agency: z.string().trim().min(1, labels.errors.required),
  modality: optText,
  approved_amount: amount,
  received_amount: amount,
  status: z.enum(FUNDING_STATUS),
  start_date: optText,
  end_date: optText,
};

export const fundingCreateSchema = z.object(base);
