"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { labels } from "@/lib/labels";

type AuthAction = (
  state: { error?: string },
  formData: FormData,
) => Promise<{ error?: string }>;

export function AuthForm({
  action,
  mode,
}: {
  action: AuthAction;
  mode: "signin" | "signup";
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      {mode === "signup" ? (
        <div className="space-y-2">
          <Label htmlFor="full_name">{labels.auth.fullName}</Label>
          <Input id="full_name" name="full_name" required autoComplete="name" />
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">{labels.auth.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@maua.br"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{labels.auth.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {mode === "signup" ? labels.auth.signUp : labels.auth.signIn}
      </Button>
    </form>
  );
}
