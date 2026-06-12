import { describe, expect, test } from "bun:test";
import {
  countDashboardFilters,
  parseDashboardFilters,
} from "./dashboard-filters";

describe("parseDashboardFilters", () => {
  test("normalizes valid filters", () => {
    const filters = parseDashboardFilters({
      department: "  Computacao ",
      researcher: "00000000-0000-4000-8000-000000000001",
      startYear: "2022",
      endYear: "2026",
      minMoney: "1000.50",
      maxMoney: "50000",
    });

    expect(filters).toEqual({
      department: "Computacao",
      researcher: "00000000-0000-4000-8000-000000000001",
      startYear: 2022,
      endYear: 2026,
      minMoney: 1000.5,
      maxMoney: 50000,
    });
    expect(countDashboardFilters(filters)).toBe(4);
  });

  test("swaps inverted ranges", () => {
    expect(
      parseDashboardFilters({
        startYear: "2026",
        endYear: "2020",
        minMoney: "500",
        maxMoney: "100",
      }),
    ).toEqual({
      department: undefined,
      researcher: undefined,
      startYear: 2020,
      endYear: 2026,
      minMoney: 100,
      maxMoney: 500,
    });
  });

  test("ignores invalid values", () => {
    expect(
      parseDashboardFilters({
        researcher: "not-a-uuid",
        startYear: "1800",
        endYear: "later",
        minMoney: "-1",
        maxMoney: "many",
      }),
    ).toEqual({
      department: undefined,
      researcher: undefined,
      startYear: undefined,
      endYear: undefined,
      minMoney: undefined,
      maxMoney: undefined,
    });
  });
});
