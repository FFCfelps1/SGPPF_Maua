import { z } from "zod";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

export const PUBLICATION_TYPES = [
  "article",
  "conference_paper",
  "book",
  "book_chapter",
  "technical_report",
  "patent",
] as const satisfies readonly Database["public"]["Enums"]["publication_type"][];

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
const optText = z.preprocess(emptyToNull, z.string().nullable());
const optInt = z.preprocess(emptyToNull, z.coerce.number().int().nullable());
const optNum = z.preprocess(emptyToNull, z.coerce.number().nullable());

const base = {
  title: z.string().trim().min(2, labels.errors.required),
  doi: optText,
  type: z.preprocess(emptyToNull, z.enum(PUBLICATION_TYPES).nullable()),
  year: optInt,
  venue: optText,
  issn: optText,
  url: optText,
  qualis: optText,
  impact_factor: optNum,
  citation_count: optInt,
  knowledge_area: optText,
};

export const publicationCreateSchema = z.object(base);
export const publicationUpdateSchema = z.object({
  ...base,
  id: z.coerce.number().int(),
});
export type PublicationInput = z.infer<typeof publicationCreateSchema>;
