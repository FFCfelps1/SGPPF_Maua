import Link from "next/link";
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { labels } from "@/lib/labels";
import type { ListSearchParams } from "@/lib/crud/pagination";

export type Column<Row> = {
  key: string;
  header: string;
  sortable?: boolean;
  cell?: (row: Row) => ReactNode;
};

function hrefWith(
  basePath: string,
  current: ListSearchParams,
  patch: Partial<ListSearchParams>,
): string {
  const params = new URLSearchParams();
  const merged = { ...current, ...patch };
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Server-rendered, URL-driven table: sort via header links, paginate via footer links. */
export function DataTable<Row extends Record<string, unknown>>({
  basePath,
  searchParams,
  columns,
  rows,
  count,
  page,
  perPage,
  getRowHref,
  emptyTitle,
  emptyDescription,
}: {
  basePath: string;
  searchParams: ListSearchParams;
  columns: Column<Row>[];
  rows: Row[];
  count: number;
  page: number;
  perPage: number;
  getRowHref?: (row: Row) => string;
  emptyTitle: string;
  emptyDescription?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center">
        <p className="font-medium">{emptyTitle}</p>
        {emptyDescription ? (
          <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
        ) : null}
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(count / perPage));

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
        <Table className="min-w-[42rem]">
          <TableHeader>
            <TableRow>
              {columns.map((col) => {
                if (!col.sortable) {
                  return <TableHead key={col.key}>{col.header}</TableHead>;
                }
                const active = searchParams.sort === col.key;
                const nextDir = active && searchParams.dir === "asc" ? "desc" : "asc";
                const arrow = active ? (searchParams.dir === "asc" ? " ↑" : " ↓") : "";
                return (
                  <TableHead key={col.key}>
                    <Link
                      href={hrefWith(basePath, searchParams, {
                        sort: col.key,
                        dir: nextDir,
                        page: undefined,
                      })}
                      className="hover:underline"
                    >
                      {col.header}
                      {arrow}
                    </Link>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => {
                  const content = col.cell
                    ? col.cell(row)
                    : String(row[col.key] ?? "—");
                  return (
                    <TableCell key={col.key}>
                      {getRowHref ? (
                        <Link href={getRowHref(row)} className="block">
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {count} {count === 1 ? labels.table.recordsOne : labels.table.records}
        </span>
        <div className="flex items-center gap-2">
          <PageLink
            href={hrefWith(basePath, searchParams, { page: String(page - 1) })}
            disabled={page <= 1}
          >
            {labels.table.previous}
          </PageLink>
          <span>
            {page}/{totalPages}
          </span>
          <PageLink
            href={hrefWith(basePath, searchParams, { page: String(page + 1) })}
            disabled={page >= totalPages}
          >
            {labels.table.next}
          </PageLink>
        </div>
      </div>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: ReactNode;
}) {
  const className = cn(buttonVariants({ variant: "outline", size: "sm" }));
  if (disabled) {
    return (
      <span className={cn(className, "pointer-events-none opacity-50")}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
