import { labels } from "@/lib/labels";

// Placeholder shell page; KPI cards backed by SQL views land in U12.
export default function DashboardPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        {labels.dashboard.title}
      </h1>
      <p className="text-muted-foreground">{labels.dashboard.empty}</p>
    </div>
  );
}
