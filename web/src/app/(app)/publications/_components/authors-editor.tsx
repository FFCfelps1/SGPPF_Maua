"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addSelfAsAuthor, removeAuthor } from "../_actions";
import { labels } from "@/lib/labels";

export type AuthorRow = {
  profile_id: string;
  author_position: number | null;
  is_corresponding: boolean;
  profiles: { full_name: string } | null;
};

export function AuthorsEditor({
  publicationId,
  authors,
  viewerId,
  canManageOthers,
  canWrite,
}: {
  publicationId: number;
  authors: AuthorRow[];
  viewerId?: string;
  canManageOthers: boolean;
  canWrite: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const isAuthor = authors.some((a) => a.profile_id === viewerId);
  const ordered = [...authors].sort(
    (a, b) => (a.author_position ?? 0) - (b.author_position ?? 0),
  );

  return (
    <div className="space-y-3">
      {ordered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {labels.publication.noAuthors}
        </p>
      ) : (
        <ul className="space-y-1">
          {ordered.map((a) => (
            <li key={a.profile_id} className="flex items-center gap-2 text-sm">
              <span>
                {a.author_position}. {a.profiles?.full_name ?? "—"}
              </span>
              {a.is_corresponding ? (
                <Badge variant="outline">{labels.publication.corresponding}</Badge>
              ) : null}
              {canWrite && (canManageOthers || a.profile_id === viewerId) ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await removeAuthor(publicationId, a.profile_id);
                    })
                  }
                >
                  {labels.actions.delete}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {canWrite && !isAuthor ? (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await addSelfAsAuthor(publicationId);
            })
          }
        >
          {labels.publication.claimAuthorship}
        </Button>
      ) : null}
    </div>
  );
}
