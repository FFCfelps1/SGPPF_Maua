import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyPermissions } from "@/lib/permissions";
import { AppShell } from "./_components/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  const permissions = [...(await getMyPermissions())];
  const email = (data.claims.email as string | undefined) ?? "";

  return (
    <AppShell permissions={permissions} email={email}>
      {children}
    </AppShell>
  );
}
