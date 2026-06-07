import type { Database } from "@/lib/database.types";

type PubType = Database["public"]["Enums"]["publication_type"];

/** Crossref metadata mapped to the publication shape (a subset of the row). */
export type CrossrefMapped = {
  title: string;
  doi: string;
  type: PubType | null;
  year: number | null;
  venue: string | null;
  issn: string | null;
  authors_text: string | null;
};

export type DoiResult =
  | { status: "preview"; data: CrossrefMapped }
  | { status: "exists"; id: number }
  | { status: "error"; message: string };

/** Strip a DOI URL prefix and validate the shape. Returns a lowercased DOI or null. */
export function normalizeDoi(raw: string): string | null {
  const trimmed = raw.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  return /^10\.\d{4,}\/\S+$/.test(trimmed) ? trimmed.toLowerCase() : null;
}

function mapType(crossrefType: string | undefined): PubType | null {
  switch (crossrefType) {
    case "journal-article":
      return "article";
    case "proceedings-article":
      return "conference_paper";
    case "book":
    case "monograph":
      return "book";
    case "book-chapter":
      return "book_chapter";
    case "report":
      return "technical_report";
    default:
      return null;
  }
}

export async function fetchCrossref(doi: string): Promise<CrossrefMapped | null> {
  const res = await fetch(
    `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
    { headers: { "User-Agent": "SGPPF/1.0 (Instituto Maua de Tecnologia)" } },
  );
  if (!res.ok) return null;

  const json = (await res.json()) as { message?: Record<string, unknown> };
  const m = json.message;
  if (!m) return null;

  const title = Array.isArray(m.title) ? String(m.title[0] ?? "").trim() : "";
  if (!title) return null;

  const authorsText = Array.isArray(m.author)
    ? (m.author as { given?: string; family?: string }[])
        .map((a) => `${a.given ?? ""} ${a.family ?? ""}`.trim())
        .filter(Boolean)
        .join("; ")
    : "";
  const issued = m.issued as { "date-parts"?: number[][] } | undefined;
  const firstOf = (v: unknown) =>
    Array.isArray(v) && v[0] ? String(v[0]) : null;

  return {
    title,
    doi,
    type: mapType(typeof m.type === "string" ? m.type : undefined),
    year: issued?.["date-parts"]?.[0]?.[0] ?? null,
    venue: firstOf(m["container-title"]),
    issn: firstOf(m.ISSN),
    authors_text: authorsText || null,
  };
}
