"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { searchResearchers } from "@/app/(app)/submissions/_actions";
import { addProjectMember, removeProjectMember, updateProjectMemberHours } from "../_actions";
import { labels } from "@/lib/labels";
import { RiUserAddLine, RiDeleteBinLine, RiSearchLine, RiCheckLine } from "@remixicon/react";

type Member = {
  profile_id: string;
  role: string | null;
  dedication_hours: number;
  profiles: { full_name: string; email: string } | null;
};

export function ProjectMembersEditor({
  projectId,
  members,
  canWrite,
}: {
  projectId: number;
  members: Member[];
  canWrite: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [pending, startTransition] = useTransition();

  // For inline editing
  const [editingHours, setEditingHours] = useState<Record<string, number>>({});

  function saveHours(profileId: string, value: number) {
    const original = members.find((m) => m.profile_id === profileId)?.dedication_hours ?? 0;
    if (value === original) return;
    startTransition(async () => {
      try {
        await updateProjectMemberHours(projectId, profileId, value);
        setEditingHours((prev) => {
          const next = { ...prev };
          delete next[profileId];
          return next;
        });
      } catch (err) {
        console.error("Failed to update hours:", err);
      }
    });
  }

  async function handleSearch() {
    if (query.length < 2) return;
    const data = await searchResearchers(query);
    setResults(data || []);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{labels.project.members}</h3>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Nenhum membro vinculado ainda.</p>
        ) : (
          <ul className="divide-y rounded-md border">
            {members.map((m) => {
              const currentVal = editingHours[m.profile_id] ?? m.dedication_hours;
              const hasChanged = currentVal !== m.dedication_hours;

              return (
                <li key={m.profile_id} className="flex items-center justify-between p-3 text-sm">
                  <div>
                    <p className="font-medium">{m.profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{m.profiles?.email}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {m.role && <Badge variant="outline">{m.role}</Badge>}
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={0}
                          className="h-7 w-16 px-1.5 text-xs"
                          value={currentVal}
                          onChange={(e) => setEditingHours({
                            ...editingHours,
                            [m.profile_id]: parseInt(e.target.value) || 0
                          })}
                          onBlur={() => saveHours(m.profile_id, currentVal)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveHours(m.profile_id, currentVal);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          disabled={!canWrite || pending}
                        />
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">h</span>
                        {hasChanged && (
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            className="text-primary"
                            disabled={pending}
                            onClick={() => saveHours(m.profile_id, currentVal)}
                          >
                            <RiCheckLine className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {canWrite && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={pending}
                      onClick={() => startTransition(() => removeProjectMember(projectId, m.profile_id))}
                    >
                      <RiDeleteBinLine className="size-4" />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {canWrite && (
        <div className="space-y-3 pt-2 border-t">
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
                          await addProjectMember(projectId, r.id, "Pesquisador", 0);
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
