import { z } from "zod";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

export const SUBMISSION_STATUS = [
  "draft",
  "submitted",
  "approved_dept",
  "approved_cp",
  "approved_maua",
  "rejected",
] as const satisfies readonly Database["public"]["Enums"]["submission_status"][];

export const AGENCY_PROJECT_STATUS = [
  "em_analise",
  "pendente",
  "aprovado",
  "em_execucao",
  "concluido",
  "rejeitado",
  "cancelado",
] as const satisfies readonly Database["public"]["Enums"]["agency_project_status"][];

export type AgencyProjectStatus = (typeof AGENCY_PROJECT_STATUS)[number];

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
const optText = z.preprocess(emptyToNull, z.string().nullable());

const base = {
  title: z.string().trim().min(2, labels.errors.required),
  abstract: optText,
  objectives: optText,
  methodology: optText,
  estimated_budget: z.coerce.number().min(0).default(0),
  funding_agency: optText,
  modality: optText,
  knowledge_area: optText,
  department: optText,
  unit: optText,
  research_duration: optText,
  partners: optText,
  status: z.enum(SUBMISSION_STATUS).default("draft"),
  funding_agency_status: z.preprocess(emptyToNull, z.enum(AGENCY_PROJECT_STATUS).nullable()),
  internal_feedback: optText,
};

export const submissionCreateSchema = z.object(base);
export const submissionUpdateSchema = z.object({
  ...base,
  id: z.coerce.number().int(),
});

export const submissionApprovalSchema = z.object({
  id: z.coerce.number().int(),
  status: z.enum(SUBMISSION_STATUS),
  feedback: z.string().trim().optional(),
});
