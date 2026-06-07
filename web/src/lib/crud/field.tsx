import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

/** Label + control + per-field error. The error comes from the action's returned state. */
export function Field({
  name,
  label,
  error,
  required,
  children,
}: {
  name: string;
  label: string;
  error?: string[];
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error?.[0] ? <p className="text-sm text-destructive">{error[0]}</p> : null}
    </div>
  );
}
