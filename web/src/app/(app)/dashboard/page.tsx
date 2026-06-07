import { getDashboardKpis } from "@/lib/data/kpis";
import { KpiCard } from "./_components/kpi-card";
import { labels } from "@/lib/labels";

const fmtBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export default async function DashboardPage() {
  const k = await getDashboardKpis();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {labels.dashboard.title}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label={labels.dashboard.publicationsTotal} value={k.total_publications} />
        <KpiCard label={labels.dashboard.publicationsLast3y} value={k.recent_publications} />
        <KpiCard label={labels.dashboard.advisingsTotal} value={k.total_advisings} />
        <KpiCard label={labels.dashboard.advisingsCompleted} value={k.completed_advisings} />
        <KpiCard label={labels.dashboard.activeFundedProjects} value={k.active_funded_projects} />
        <KpiCard label={labels.dashboard.fundsReceived} value={fmtBRL(k.funds_received)} />
      </div>
    </div>
  );
}
