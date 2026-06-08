import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  icon,
  href,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  href: string;
  tone?: "blue" | "cyan" | "green" | "amber" | "violet";
}) {
  const tones = {
    blue: "bg-primary/10 text-primary",
    cyan: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  };

  return (
    <Card className="group relative transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={href}
        className="absolute inset-0 z-10 rounded-xl"
        aria-label={label}
      />
      <CardHeader className="flex-row items-start justify-between gap-4 pb-1">
        <span className={cn("grid size-10 place-items-center rounded-xl", tones[tone])}>
          {icon}
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardContent>
    </Card>
  );
}
