import type { ReactNode } from "react";
import { labels } from "@/lib/labels";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {labels.app.name}
          </h1>
          <p className="text-sm text-muted-foreground">{labels.app.full}</p>
        </div>
        {children}
      </div>
    </main>
  );
}
