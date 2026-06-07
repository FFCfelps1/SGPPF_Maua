"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/lib/crud/confirm-dialog";
import { FundingForm } from "./funding-form";
import { deleteFunding } from "../_actions";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

type Funding = Database["public"]["Tables"]["funding"]["Row"];

const fmtBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export function FundingTab({
  projectId,
  funding,
  canManage,
}: {
  projectId: number;
  funding: Funding[];
  canManage: boolean;
}) {
  return (
    <div className="space-y-6">
      {funding.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {labels.empty.funding.title}
        </p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{labels.funding.agency}</TableHead>
                <TableHead>{labels.funding.approved}</TableHead>
                <TableHead>{labels.funding.received}</TableHead>
                <TableHead>{labels.funding.pending}</TableHead>
                <TableHead>{labels.funding.status}</TableHead>
                {canManage ? <TableHead /> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {funding.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.agency}</TableCell>
                  <TableCell>{fmtBRL(f.approved_amount)}</TableCell>
                  <TableCell>{fmtBRL(f.received_amount)}</TableCell>
                  <TableCell>{fmtBRL(f.pending_amount ?? 0)}</TableCell>
                  <TableCell>{labels.fundingStatus[f.status]}</TableCell>
                  {canManage ? (
                    <TableCell className="text-right">
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="sm">
                            {labels.actions.delete}
                          </Button>
                        }
                        onConfirm={deleteFunding.bind(null, f.id, projectId)}
                      />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {canManage ? (
        <div>
          <h3 className="mb-3 text-sm font-medium">{labels.funding.addTitle}</h3>
          <FundingForm projectId={projectId} />
        </div>
      ) : null}
    </div>
  );
}
