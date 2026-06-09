"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { addMember, removeMember, searchResearchers } from "../_actions";
import { labels } from "@/lib/labels";
import { RiUserAddLine, RiDeleteBinLine, RiSearchLine } from "@remixicon/react";

type Member = {
  profile_id: string;
  role: string | null;
  profiles: { full_name: string; email: string } | null;
};

export function SubmissionMembersEditor({
  submissionId,
  members,
  canWrite,
}: {
  submissionId: number;
  members: Member[];
  canWrite: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [pending, startTransition] = useTransition();

  async function handleSearch() {
    if (query.length < 2) return;
    const data = await searchResearchers(query);
    setResults(data || []);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{labels.submission.members}</h3>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Nenhum membro vinculado ainda.</p>
        ) : (
          <ul className="divide-y rounded-md border">
            {members.map((m) => (
              <li key={m.profile_id} className="flex items-center justify-between p-3 text-sm">
                <div>
                  <p className="font-medium">{m.profiles?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{m.profiles?.email}</p>
                  {m.role && <Badge variant="outline" className="mt-1">{m.role}</Badge>}
                </div>
                {canWrite && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={pending}
                    onClick={() => startTransition(() => removeMember(submissionId, m.profile_id))}
                  >
                    <RiDeleteBinLine className="size-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {canWrite && (
        <div className="space-y-2 pt-2 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar pesquisador por nome..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="outline" onClick={handleSearch}>
              <RiSearchLine className="size-4" />
            </Button>
          </div>

          {results.length > 0 && (
            <ul className="rounded-md border bg-muted/50 overflow-hidden">
              {results.map((r) => {
                const isMember = members.some((m) => m.profile_id === r.id);
                return (
                  <li key={r.id} className="flex items-center justify-between p-2 text-sm hover:bg-muted">
                    <span>{r.full_name} ({r.email})</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isMember || pending}
                      onClick={() => {
                        startTransition(async () => {
                          await addMember(submissionId, r.id, "Pesquisador");
                          setResults([]);
                          setQuery("");
                        });
                      }}
                    >
                      {isMember ? "Já incluso" : <RiUserAddLine className="size-4" />}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
