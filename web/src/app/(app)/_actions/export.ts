"use server";

import {
  runExport,
  type ExportConfig,
  type ExportEntity,
} from "@/lib/crud/export-csv";
import type { ListSearchParams } from "@/lib/crud/pagination";
import { labels } from "@/lib/labels";

const CONFIGS: Record<ExportEntity, ExportConfig> = {
  researchers: {
    table: "profiles",
    select: "full_name,email,position,area_of_expertise,role",
    searchColumns: ["full_name"],
    defaultSort: { column: "full_name" },
    activeOnly: true,
    columns: [
      { key: "full_name", header: labels.researcher.name },
      { key: "email", header: labels.researcher.email },
      { key: "position", header: labels.researcher.position },
      { key: "area_of_expertise", header: labels.researcher.area },
      { key: "role", header: labels.researcher.role },
    ],
  },
  publications: {
    table: "publications",
    select: "title,type,year,venue,doi,qualis",
    searchColumns: ["title", "doi"],
    defaultSort: { column: "year", ascending: false },
    columns: [
      { key: "title", header: labels.publication.title },
      { key: "type", header: labels.publication.type },
      { key: "year", header: labels.publication.year },
      { key: "venue", header: labels.publication.venue },
      { key: "doi", header: labels.publication.doi },
      { key: "qualis", header: labels.publication.qualis },
    ],
  },
  projects: {
    table: "projects",
    select: "title,code,modality,status,start_date,end_date",
    searchColumns: ["title", "code"],
    defaultSort: { column: "title" },
    columns: [
      { key: "title", header: labels.project.title },
      { key: "code", header: labels.project.code },
      { key: "modality", header: labels.project.modality },
      { key: "status", header: labels.project.status },
      { key: "start_date", header: labels.project.startDate },
      { key: "end_date", header: labels.project.endDate },
    ],
  },
  advisings: {
    table: "advisings",
    select: "student_name,level,status,scholarship_agency,start_date,end_date",
    searchColumns: ["student_name"],
    defaultSort: { column: "start_date", ascending: false },
    columns: [
      { key: "student_name", header: labels.advising.student },
      { key: "level", header: labels.advising.level },
      { key: "status", header: labels.advising.status },
      { key: "scholarship_agency", header: labels.advising.scholarshipAgency },
      { key: "start_date", header: labels.advising.startDate },
      { key: "end_date", header: labels.advising.endDate },
    ],
  },
};

export async function exportEntityCsv(
  entity: ExportEntity,
  sp: ListSearchParams,
): Promise<string> {
  return runExport(sp, CONFIGS[entity]);
}
