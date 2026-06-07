/** Pure list view-state helpers (no env/Supabase imports, so they're unit-testable). */

export type ListSearchParams = {
  q?: string;
  sort?: string;
  dir?: string;
  page?: string;
  perPage?: string;
};

export const DEFAULT_PAGE_SIZE = 20;

export function parsePagination(sp: ListSearchParams) {
  const page = Math.max(1, Math.trunc(Number(sp.page)) || 1);
  const perPage = Math.min(
    100,
    Math.max(1, Math.trunc(Number(sp.perPage)) || DEFAULT_PAGE_SIZE),
  );
  const from = (page - 1) * perPage;
  return { page, perPage, from, to: from + perPage - 1 };
}
