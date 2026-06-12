import { z } from "zod";
import { labels } from "@/lib/labels";

export const departmentSchema = z.object({
  id: z.coerce.number().int().optional(),
  name: z.string().trim().min(2, labels.errors.required),
  description: z.string().trim().optional().nullable().transform(v => v || null),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;
