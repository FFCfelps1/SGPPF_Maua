import { describe, expect, test } from "bun:test";
import { parsePagination, DEFAULT_PAGE_SIZE } from "./pagination";

describe("parsePagination", () => {
  test("defaults to page 1 with the default page size", () => {
    const r = parsePagination({});
    expect(r.page).toBe(1);
    expect(r.perPage).toBe(DEFAULT_PAGE_SIZE);
    expect(r.from).toBe(0);
    expect(r.to).toBe(DEFAULT_PAGE_SIZE - 1);
  });

  test("computes the range for a given page", () => {
    const r = parsePagination({ page: "3", perPage: "10" });
    expect(r.page).toBe(3);
    expect(r.perPage).toBe(10);
    expect(r.from).toBe(20);
    expect(r.to).toBe(29);
  });

  test("clamps invalid input (page < 1, perPage > 100)", () => {
    const r = parsePagination({ page: "0", perPage: "999" });
    expect(r.page).toBe(1);
    expect(r.perPage).toBe(100);
  });

  test("falls back to defaults on non-numeric input", () => {
    const r = parsePagination({ page: "abc", perPage: "" });
    expect(r.page).toBe(1);
    expect(r.perPage).toBe(DEFAULT_PAGE_SIZE);
  });
});
