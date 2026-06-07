"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { labels } from "@/lib/labels";

/** Calls a CSV-producing Server Action and downloads the result (no API route). */
export function ExportButton({
  action,
  filename,
}: {
  action: () => Promise<string>;
  filename: string;
}) {
  const [pending, startTransition] = useTransition();

  const onClick = () =>
    startTransition(async () => {
      const csv = await action();
      // BOM so Excel reads UTF-8 correctly.
      const blob = new Blob([`﻿${csv}`], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });

  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={onClick}>
      {labels.actions.exportCsv}
    </Button>
  );
}
