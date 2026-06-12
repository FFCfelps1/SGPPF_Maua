import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyPermissions } from "@/lib/permissions";
import { ResearcherForm } from "../_components/researcher-form";
import { softDeleteResearcher } from "../_actions";
import { ConfirmDialog } from "@/lib/crud/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";
import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function ResearcherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (!profile) notFound();

  const { data: claimsData } = await supabase.auth.getClaims();
  const viewerId = claimsData?.claims?.sub;
  const perms = await getMyPermissions();
  const canEdit = profile.id === viewerId || perms.has("users:manage");
  const canDelete = perms.has("researchers:delete");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/researchers" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
            title="Voltar"
          >
            <RiArrowLeftLine className="size-4" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {profile.full_name}
          </h1>
          <Badge variant="secondary">{labels.roles[profile.role]}</Badge>
          {!profile.is_active ? (
            <Badge variant="outline">{labels.researcher.inactive}</Badge>
          ) : null}
        </div>
        {canDelete && profile.is_active ? (
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm">
                {labels.actions.delete}
              </Button>
            }
            onConfirm={softDeleteResearcher.bind(null, profile.id)}
          />
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">{profile.email}</p>

      <Card>
        <CardHeader>
          <CardTitle>{labels.actions.edit}</CardTitle>
        </CardHeader>
        <CardContent>
          {canEdit ? (
            <ResearcherForm profile={profile} afterSuccess="/researchers" />
          ) : (
            <ReadOnlyProfile profile={profile} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReadOnlyProfile({ profile }: { profile: Profile }) {
  const rows: [string, string | null][] = [
    [labels.researcher.department, profile.department],
    [labels.researcher.unit, profile.unit],
    [labels.researcher.position, profile.position],
    [labels.researcher.area, profile.area_of_expertise],
    [labels.researcher.orcid, profile.orcid],
    [labels.researcher.lattes, profile.lattes_url],
    [labels.researcher.scholar, profile.google_scholar_id],
    [labels.researcher.researchGate, profile.research_gate_id],
    [
      labels.researcher.employmentType, 
      profile.employment_type 
        ? (labels.employmentTypes as any)[profile.employment_type] || profile.employment_type 
        : null
    ],
    [labels.researcher.affiliationDate, profile.affiliation_date],
    [labels.researcher.teachingHours, profile.teaching_hours?.toString() || "0"],
    [labels.researcher.researchHours, profile.research_hours?.toString() || "0"],
    [labels.researcher.otherHours, profile.other_hours?.toString() || "0"],
  ];
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd>{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
