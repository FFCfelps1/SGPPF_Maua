import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyPermissions } from "@/lib/permissions";
import { signOut } from "@/app/(auth)/_actions";
import { Button } from "@/components/ui/button";
import { AppNav } from "./_components/nav";
import { labels } from "@/lib/labels";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  const permissions = [...(await getMyPermissions())];
  const email = (data.claims.email as string | undefined) ?? "";

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <span className="font-semibold">{labels.app.name}</span>
            <AppNav permissions={permissions} />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {email}
            </span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                {labels.nav.signOut}
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
