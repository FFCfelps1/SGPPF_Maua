import { describe, expect, test } from "bun:test";
import { buildMemberHoursChart } from "./member-hours";

describe("buildMemberHoursChart", () => {
  test("calculates total hours and contribution percentages", () => {
    const chart = buildMemberHoursChart([
      { id: "1", name: "Ana", hours: 30 },
      { id: "2", name: "Bruno", hours: 10 },
    ]);

    expect(chart.totalHours).toBe(40);
    expect(chart.slices.map(({ name, hours, percentage }) => ({
      name,
      hours,
      percentage,
    }))).toEqual([
      { name: "Ana", hours: 30, percentage: 75 },
      { name: "Bruno", hours: 10, percentage: 25 },
    ]);
  });

  test("ignores zero, negative, and invalid hours", () => {
    const chart = buildMemberHoursChart([
      { id: "1", name: "Ana", hours: 0 },
      { id: "2", name: "Bruno", hours: -4 },
      { id: "3", name: "Carla", hours: Number.NaN },
    ]);

    expect(chart).toEqual({ totalHours: 0, slices: [] });
  });
});
