import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyPermissions } from "@/lib/permissions";
import { RoleSelect } from "./_components/role-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { labels } from "@/lib/labels";

export default async function AdminPage() {
  const perms = await getMyPermissions();
  if (!perms.has("users:manage")) redirect("/dashboard");

  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active")
    .order("full_name");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {labels.nav.admin}
      </h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{labels.researcher.name}</TableHead>
              <TableHead>{labels.researcher.email}</TableHead>
              <TableHead>{labels.researcher.role}</TableHead>
              <TableHead>{labels.admin.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(profiles ?? []).map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.full_name}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>
                  <RoleSelect userId={p.id} current={p.role} />
                </TableCell>
                <TableCell>
                  {p.is_active ? labels.admin.active : labels.researcher.inactive}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
