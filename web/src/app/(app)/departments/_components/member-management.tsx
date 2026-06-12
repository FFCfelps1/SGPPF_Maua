"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { labels } from "@/lib/labels";
import { searchResearchers } from "@/app/(app)/submissions/_actions";
import { addResearcherToDepartment, removeResearcherFromDepartment } from "../_actions";
import { RiUserAddLine, RiDeleteBinLine, RiSearchLine } from "@remixicon/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function MemberManagement({ 
  departmentId,
  departmentName,
  members 
}: { 
  departmentId: number;
  departmentName: string;
  members: { id: string; full_name: string; email: string }[];
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (query.length < 2) return;
    setLoading(true);
    try {
      const data = await searchResearchers(query);
      // Filter out researchers already in this department
      const filtered = (data || []).filter(r => !members.find(m => m.id === r.id));
      setResults(filtered);
    } catch (err) {
      toast.error("Erro ao buscar pesquisadores");
    } finally {
      setLoading(false);
    }
  }

  async function onAdd(profileId: string) {
    try {
      await addResearcherToDepartment(profileId, departmentId);
      toast.success("Pesquisador adicionado ao departamento");
      setResults(prev => prev.filter(r => r.id !== profileId));
    } catch (err) {
      toast.error("Erro ao adicionar pesquisador");
    }
  }

  async function onRemove(profileId: string) {
    try {
      await removeResearcherFromDepartment(profileId);
      toast.success("Pesquisador removido do departamento");
    } catch (err) {
      toast.error("Erro ao remover pesquisador");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Membros do Departamento</CardTitle>
          <CardDescription>Pesquisadores vinculados a {departmentName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Nenhum pesquisador vinculado a este departamento.</p>
            ) : (
              <div className="divide-y rounded-md border">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 text-sm">
                    <div>
                      <p className="font-medium">{member.full_name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => onRemove(member.id)}
                    >
                      <RiDeleteBinLine className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Pesquisador</CardTitle>
          <CardDescription>Busque pesquisadores para vincular a este departamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Nome do pesquisador..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <Button size="sm" onClick={handleSearch} disabled={loading}>
              <RiSearchLine className="size-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {results.map(r => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50">
                <div>
                  <p className="font-medium">{r.full_name}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => onAdd(r.id)}>
                  <RiUserAddLine className="mr-2 size-3.5" />
                  Vincular
                </Button>
              </div>
            ))}
            {query.length >= 2 && results.length === 0 && !loading && (
              <p className="text-center text-xs text-muted-foreground py-2">Nenhum pesquisador encontrado (ou já vinculado).</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
