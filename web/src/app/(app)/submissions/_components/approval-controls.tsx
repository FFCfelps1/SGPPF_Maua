"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { labels } from "@/lib/labels";
import { approveSubmission, rejectSubmission, submitForApproval, updateAgencyStatus } from "../_actions";
import { AGENCY_PROJECT_STATUS, AgencyProjectStatus } from "@/lib/schemas/submission";
import { toast } from "sonner";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2";

export function ApprovalControls({ 
  submission, 
  userRole, 
  userId 
}: { 
  submission: any, 
  userRole: string, 
  userId: string 
}) {
  const [feedback, setFeedback] = useState("");
  const [agencyStatus, setAgencyStatus] = useState<AgencyProjectStatus | "">(submission.funding_agency_status || "");
  const [loading, setLoading] = useState(false);

  const isOwner = submission.researcher_id === userId;
  const canSubmit = isOwner && submission.status === "draft";
  
  const canApprove = 
    (userRole === "dept_manager" && submission.status === "submitted") ||
    (userRole === "cp_manager" && submission.status === "approved_dept") ||
    (userRole === "maua_manager" && submission.status === "approved_cp") ||
    (userRole === "admin" && ["submitted", "approved_dept", "approved_cp"].includes(submission.status));

  const isFullyApproved = submission.status === "approved_maua";

  let approvalLabel = "Aprovar";
  if (userRole === "admin") {
    if (submission.status === "submitted") approvalLabel = "Aprovar (como Dept.)";
    if (submission.status === "approved_dept") approvalLabel = "Aprovar (como CP)";
    if (submission.status === "approved_cp") approvalLabel = "Aprovar (como Mauá)";
  }

  async function handleAction(action: () => Promise<void>) {
    setLoading(true);
    try {
      await action();
      toast.success("Ação realizada com sucesso");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
      <h3 className="font-semibold text-lg">Ações e Fluxo</h3>
      
      {canSubmit && (
        <Button onClick={() => handleAction(() => submitForApproval(submission.id))} disabled={loading} className="w-full">
          Enviar para Aprovação
        </Button>
      )}

      {canApprove && (
        <div className="space-y-2">
          <textarea 
            placeholder="Feedback/Parecer (opcional para aprovação, obrigatório para rejeição)" 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="default" 
              onClick={() => handleAction(() => approveSubmission(submission.id, userRole, feedback))}
              disabled={loading}
            >
              {approvalLabel}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (!feedback) return toast.error("Feedback é obrigatório para rejeitar");
                handleAction(() => rejectSubmission(submission.id, feedback));
              }}
              disabled={loading}
            >
              Rejeitar
            </Button>
          </div>
        </div>
      )}

      {isFullyApproved && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{labels.submission.agencyStatus}</label>
          <div className="flex gap-2">
            <select
              value={agencyStatus}
              onChange={(e) => setAgencyStatus(e.target.value as AgencyProjectStatus)}
              className={selectClass}
            >
              <option value="">Selecione a situação...</option>
              {AGENCY_PROJECT_STATUS.map((s) => (
                <option key={s} value={s}>
                  {labels.agencyProjectStatus[s]}
                </option>
              ))}
            </select>
            <Button 
              size="sm"
              onClick={() => handleAction(() => updateAgencyStatus(submission.id, agencyStatus as AgencyProjectStatus))}
              disabled={loading || !agencyStatus}
            >
              {labels.actions.save}
            </Button>
          </div>
        </div>
      )}

      {!canSubmit && !canApprove && !isFullyApproved && (
        <p className="text-sm text-muted-foreground italic text-center">
          Nenhuma ação disponível no momento para o seu perfil/status atual.
        </p>
      )}
    </div>
  );
}
