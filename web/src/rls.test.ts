import { beforeAll, describe, expect, test } from "bun:test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Integration tests against the local Supabase stack (well-known local dev keys).
// Run `bun db:reset` + `supabase start` first; they self-skip if the stack is down.
const URL = "http://127.0.0.1:54321";
const KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";
const ADMIN = "00000000-0000-0000-0000-0000000000a1";
const RESEARCHER = "00000000-0000-0000-0000-0000000000a2";

let up = false;

async function signedIn(email: string): Promise<SupabaseClient> {
  const client = createClient(URL, KEY);
  await client.auth.signInWithPassword({ email, password: "password123" });
  return client;
}

beforeAll(async () => {
  try {
    up = (await fetch(`${URL}/auth/v1/health`)).ok;
  } catch {
    up = false;
  }
  if (!up) {
    console.warn("Local Supabase stack unreachable — skipping RLS integration tests.");
  }
});

describe("RLS — negative authorization (the legacy app enforced none)", () => {
  test("researcher reads all, edits only own, cannot self-escalate role", async () => {
    if (!up) return;
    const res = await signedIn("pesquisador@maua.br");

    const all = await res.from("profiles").select("id");
    expect(all.data?.length ?? 0).toBeGreaterThanOrEqual(3);

    const own = await res.from("profiles").update({ position: "Prof." }).eq("id", RESEARCHER).select();
    expect(own.data?.length).toBe(1);

    const other = await res.from("profiles").update({ position: "x" }).eq("id", ADMIN).select();
    expect(other.data?.length ?? 0).toBe(0);

    const escalate = await res.from("profiles").update({ role: "admin" }).eq("id", RESEARCHER).select();
    expect(escalate.error).not.toBeNull();
  });

  test("consultant reads all but cannot write", async () => {
    if (!up) return;
    const con = await signedIn("consultor@maua.br");

    const read = await con.from("profiles").select("id");
    expect(read.data?.length ?? 0).toBeGreaterThanOrEqual(3);

    const write = await con.from("profiles").update({ position: "x" }).eq("id", RESEARCHER).select();
    expect(write.data?.length ?? 0).toBe(0);
  });

  test("role_permissions is deny-all to clients; only my_permissions() exposes them", async () => {
    if (!up) return;
    const res = await signedIn("pesquisador@maua.br");

    const direct = await res.from("role_permissions").select("*");
    expect(direct.data?.length ?? 0).toBe(0);

    const mine = await res.rpc("my_permissions");
    expect(mine.data?.length ?? 0).toBeGreaterThan(0);
  });

  test("admin can change roles", async () => {
    if (!up) return;
    const admin = await signedIn("admin@maua.br");

    const set = await admin
      .from("profiles")
      .update({ role: "consultant" })
      .eq("id", RESEARCHER)
      .select("role")
      .single();
    expect(set.data?.role).toBe("consultant");

    await admin.from("profiles").update({ role: "researcher" }).eq("id", RESEARCHER);
  });

  test("dashboard filters combine researcher, period, and money ranges", async () => {
    if (!up) return;
    const admin = await signedIn("admin@maua.br");

    const matching = await admin
      .rpc("get_dashboard_stats_filtered", {
        p_researcher: RESEARCHER,
        p_start_year: 2025,
        p_end_year: 2025,
        p_min_money: 40000,
        p_max_money: 40000,
      })
      .single();

    expect(matching.error).toBeNull();
    expect(matching.data?.total_publications).toBe(1);
    expect(matching.data?.total_advisings).toBe(1);
    expect(matching.data?.active_funded_projects).toBe(1);
    expect(matching.data?.funds_received).toBe(40000);

    const outsideMoneyRange = await admin
      .rpc("get_dashboard_stats_filtered", { p_min_money: 40001 })
      .single();

    expect(outsideMoneyRange.error).toBeNull();
    expect(outsideMoneyRange.data?.active_funded_projects).toBe(0);
    expect(outsideMoneyRange.data?.funds_received).toBe(0);
  });
});
