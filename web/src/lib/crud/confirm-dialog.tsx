"use client";

import { type ReactElement, useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { labels } from "@/lib/labels";

/** Gates a destructive action (delete / soft-delete) behind a confirmation. */
export function ConfirmDialog({
  trigger,
  onConfirm,
  title,
  description,
}: {
  trigger: ReactElement;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ?? labels.dialogs.confirmDelete.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ?? labels.dialogs.confirmDelete.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {labels.dialogs.confirmDelete.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                await onConfirm();
                setOpen(false);
              });
            }}
          >
            {labels.dialogs.confirmDelete.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
