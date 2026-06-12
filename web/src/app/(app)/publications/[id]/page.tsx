import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyPermissions } from "@/lib/permissions";
import { PublicationForm } from "../_components/publication-form";
import { AuthorsEditor, type AuthorRow } from "../_components/authors-editor";
import { deletePublication, updatePublication } from "../_actions";
import { ConfirmDialog } from "@/lib/crud/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { labels } from "@/lib/labels";
import { RiArrowLeftLine, RiFilePdfLine } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pub } = await supabase
    .from("publications")
    .select(
      "*, authors:publication_authors(profile_id, author_position, is_corresponding, profiles(full_name))",
    )
    .eq("id", Number(id))
    .single();
  if (!pub) notFound();

  const { data: claims } = await supabase.auth.getClaims();
  const viewerId = claims?.claims?.sub;
  const perms = await getMyPermissions();
  const authors = (pub.authors ?? []) as AuthorRow[];
  const isAuthor = authors.some((a) => a.profile_id === viewerId);
  const canManageOthers = perms.has("users:manage");
  const canWrite = perms.has("publications:write");
  const canEdit = canWrite && (isAuthor || canManageOthers);
  const canDelete = perms.has("publications:delete") && (isAuthor || canManageOthers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/publications" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
            title="Voltar"
          >
            <RiArrowLeftLine className="size-4" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{pub.title}</h1>
          {pub.document_url && (
            <a
              href={pub.document_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
            >
              <RiFilePdfLine className="size-4 text-primary" />
              {labels.publication.document.split("(")[0].trim()}
            </a>
          )}
        </div>
        {canDelete ? (
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm">
                {labels.actions.delete}
              </Button>
            }
            onConfirm={deletePublication.bind(null, pub.id)}
          />
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{labels.publication.authors}</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthorsEditor
            publicationId={pub.id}
            authors={authors}
            viewerId={viewerId}
            canManageOthers={canManageOthers}
            canWrite={canWrite}
          />
        </CardContent>
      </Card>

      {canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle>{labels.actions.edit}</CardTitle>
          </CardHeader>
          <CardContent>
            <PublicationForm
              action={updatePublication}
              defaults={pub}
              afterSuccess="/publications"
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
