"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/button"; // I should check if Select is available or use a standard select
import { labels } from "@/lib/labels";

export function DashboardFilters({ departments }: { departments: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDept = searchParams.get("department") ?? "all";

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("department");
    } else {
      params.set("department", value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Filtrar por:</span>
      <select
        value={currentDept}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex h-9 w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="all">Todos os Departamentos</option>
        {departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}
