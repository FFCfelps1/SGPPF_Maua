"use client";

import { useTransition } from "react";
import { updateRole } from "../_actions/update-role";
import { labels } from "@/lib/labels";
import type { Database } from "@/lib/database.types";

type AppRole = Database["public"]["Enums"]["app_role"];
const ROLES: AppRole[] = ["admin", "researcher", "consultant"];

const selectClass =
  "h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2";

export function RoleSelect({
  userId,
  current,
}: {
  userId: string;
  current: AppRole;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={pending}
      className={selectClass}
      onChange={(e) => {
        const role = e.target.value as AppRole;
        startTransition(async () => {
          await updateRole(userId, role);
        });
      }}
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {labels.roles[r]}
        </option>
      ))}
    </select>
  );
}
