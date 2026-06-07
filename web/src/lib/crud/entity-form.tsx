"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { labels } from "@/lib/labels";
import type { ActionState } from "@/lib/crud/action";

/**
 * Shared form shell: wires a Server Action via useActionState, surfaces the
 * top-level message, and renders entity fields via a render-prop so each field
 * can read its own error from the returned state. Per-entity field markup is
 * composed by the caller (KTD6 boundary).
 */
export function EntityForm({
  action,
  children,
  submitLabel,
  onSuccess,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: (state: ActionState) => ReactNode;
  submitLabel?: string;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.ok) onSuccess?.();
  }, [state.ok, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      {children(state)}
      {state.message ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={pending}>
          {submitLabel ?? labels.actions.save}
        </Button>
      </div>
    </form>
  );
}
