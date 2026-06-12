export type DashboardFilterParams = {
  department?: string;
  researcher?: string;
  startYear?: string;
  endYear?: string;
  minMoney?: string;
  maxMoney?: string;
};

export type DashboardFilters = {
  department?: string;
  researcher?: string;
  startYear?: number;
  endYear?: number;
  minMoney?: number;
  maxMoney?: number;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function text(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function year(value: string | undefined): number | undefined {
  if (!value || !/^\d{4}$/.test(value)) return undefined;
  const parsed = Number(value);
  return parsed >= 1900 && parsed <= 2200 ? parsed : undefined;
}

function money(value: string | undefined): number | undefined {
  if (!value || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parseDashboardFilters(
  params: DashboardFilterParams,
): DashboardFilters {
  let startYear = year(params.startYear);
  let endYear = year(params.endYear);
  let minMoney = money(params.minMoney);
  let maxMoney = money(params.maxMoney);

  if (startYear !== undefined && endYear !== undefined && startYear > endYear) {
    [startYear, endYear] = [endYear, startYear];
  }

  if (minMoney !== undefined && maxMoney !== undefined && minMoney > maxMoney) {
    [minMoney, maxMoney] = [maxMoney, minMoney];
  }

  const researcher = text(params.researcher);

  return {
    department: text(params.department),
    researcher:
      researcher && UUID_PATTERN.test(researcher) ? researcher : undefined,
    startYear,
    endYear,
    minMoney,
    maxMoney,
  };
}

export function countDashboardFilters(filters: DashboardFilters): number {
  return [
    filters.department,
    filters.researcher,
    filters.startYear !== undefined || filters.endYear !== undefined,
    filters.minMoney !== undefined || filters.maxMoney !== undefined,
  ].filter(Boolean).length;
}
