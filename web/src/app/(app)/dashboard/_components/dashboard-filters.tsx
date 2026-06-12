"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  countDashboardFilters,
  type DashboardFilters as DashboardFilterValues,
} from "@/lib/data/dashboard-filters";
import type { ResearcherOption } from "@/lib/data/kpis";

type Props = {
  departments: string[];
  researchers: ResearcherOption[];
  filters: DashboardFilterValues;
};

type FilterState = {
  department: string;
  researcher: string;
  startYear: string;
  endYear: string;
  minMoney: string;
  maxMoney: string;
};

export function DashboardFilters({ departments, researchers, filters }: Props) {
  const router = useRouter();
  const activeCount = countDashboardFilters(filters);
  const [isOpen, setIsOpen] = useState(activeCount > 0);
  const [values, setValues] = useState<FilterState>({
    department: filters.department ?? "",
    researcher: filters.researcher ?? "",
    startYear: filters.startYear?.toString() ?? "",
    endYear: filters.endYear?.toString() ?? "",
    minMoney: filters.minMoney?.toString() ?? "",
    maxMoney: filters.maxMoney?.toString() ?? "",
  });

  const update = (field: keyof FilterState, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value.trim()) params.set(key, value.trim());
    });

    router.push(params.size ? `/dashboard?${params.toString()}` : "/dashboard");
  };

  const clear = () => {
    setValues(emptyFilters);
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={apply}
      className="overflow-hidden rounded-xl border bg-card/50 shadow-sm"
      aria-label="Filtros do dashboard"
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-expanded={isOpen}
        aria-controls="dashboard-filter-fields"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Filter className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Filtros de análise</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Combine dimensões para recalcular os indicadores e gráficos.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 ? (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {activeCount} {activeCount === 1 ? "filtro ativo" : "filtros ativos"}
            </span>
          ) : null}
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen ? (
        <div id="dashboard-filter-fields" className="border-t p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <FilterField label="Departamento" className="xl:col-span-2">
              <select
                value={values.department}
                onChange={(event) => update("department", event.target.value)}
                className={selectClassName}
              >
                <option value="">Todos os departamentos</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Pesquisador" className="xl:col-span-2">
              <select
                value={values.researcher}
                onChange={(event) => update("researcher", event.target.value)}
                className={selectClassName}
              >
                <option value="">Todos os pesquisadores</option>
                {researchers.map((researcher) => (
                  <option key={researcher.id} value={researcher.id}>
                    {researcher.full_name}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Período inicial">
              <Input
                value={values.startYear}
                onChange={(event) => update("startYear", event.target.value)}
                type="number"
                min="1900"
                max="2200"
                step="1"
                placeholder="Ex.: 2022"
              />
            </FilterField>

            <FilterField label="Período final">
              <Input
                value={values.endYear}
                onChange={(event) => update("endYear", event.target.value)}
                type="number"
                min="1900"
                max="2200"
                step="1"
                placeholder="Ex.: 2026"
              />
            </FilterField>

            <FilterField label="Valor mínimo (R$)" className="xl:col-start-3">
              <Input
                value={values.minMoney}
                onChange={(event) => update("minMoney", event.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
              />
            </FilterField>

            <FilterField label="Valor máximo (R$)">
              <Input
                value={values.maxMoney}
                onChange={(event) => update("maxMoney", event.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="Sem limite"
              />
            </FilterField>

            <div className="flex items-end gap-2 md:col-span-2 xl:col-span-2">
              <Button type="submit" className="flex-1">
                <Filter data-icon="inline-start" />
                Aplicar filtros
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clear}
                disabled={activeCount === 0}
              >
                <RotateCcw data-icon="inline-start" />
                Limpar
              </Button>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            A faixa de valores considera recursos recebidos em projetos e
            orçamento estimado em submissões.
          </p>
        </div>
      ) : null}
    </form>
  );
}

function FilterField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const emptyFilters: FilterState = {
  department: "",
  researcher: "",
  startYear: "",
  endYear: "",
  minMoney: "",
  maxMoney: "",
};

const selectClassName =
  "h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";
