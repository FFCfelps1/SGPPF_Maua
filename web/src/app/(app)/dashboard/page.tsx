import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  CircleDollarSign,
  ClipboardCheck,
  FolderKanban,
  GraduationCap,
  Library,
  Users,
} from "lucide-react";
import { DashboardCharts } from "./_components/dashboard-charts";
import { DashboardFilters } from "./_components/dashboard-filters";
import { getDashboardKpis, getDepartments } from "@/lib/data/kpis";
import { KpiCard } from "./_components/kpi-card";
import { labels } from "@/lib/labels";
import { getMyPermissions } from "@/lib/permissions";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const fmtBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>;
}) {
  const { department } = await searchParams;
  const k = await getDashboardKpis(department);
  const departments = await getDepartments();
  const permissions = await getMyPermissions();

  const recentShare = percentage(k.recent_publications, k.total_publications);
  const completedShare = percentage(k.completed_advisings, k.total_advisings);

  const shortcuts = ([
    {
      href: "/researchers",
      label: labels.nav.researchers,
      description: labels.shell.descriptions.researchers,
      permission: "researchers:read",
      icon: Users,
    },
    {
      href: "/projects",
      label: labels.nav.projects,
      description: labels.shell.descriptions.projects,
      permission: "projects:read",
      icon: FolderKanban,
    },
    {
      href: "/publications",
      label: labels.nav.publications,
      description: labels.shell.descriptions.publications,
      permission: "publications:read",
      icon: BookOpenText,
    },
    {
      href: "/advisings",
      label: labels.nav.advisings,
      description: labels.shell.descriptions.advisings,
      permission: "advisings:read",
      icon: GraduationCap,
    },
  ] as const).filter((item) => permissions.has(item.permission));

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-8 text-primary-foreground shadow-lg sm:px-8">
        <div className="absolute -right-16 -top-20 size-64 rounded-full border-[3rem] border-white/5" />
        <div className="absolute -bottom-24 right-32 size-56 rounded-full bg-white/5" />
        <div className="relative max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/65">
            {labels.dashboard.eyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {labels.dashboard.welcome}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/75 sm:text-base">
            {labels.dashboard.description}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <SectionHeading
            title={labels.dashboard.overview}
            description={labels.dashboard.overviewDescription}
          />
          <DashboardFilters departments={departments} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <KpiCard
            label={labels.dashboard.publicationsTotal}
            value={k.total_publications}
            icon={<Library className="size-5" />}
            href="/publications"
          />
          <KpiCard
            label={labels.dashboard.publicationsLast3y}
            value={k.recent_publications}
            icon={<BookOpenText className="size-5" />}
            href="/publications"
            tone="cyan"
          />
          <KpiCard
            label={labels.dashboard.advisingsTotal}
            value={k.total_advisings}
            icon={<GraduationCap className="size-5" />}
            href="/advisings"
            tone="violet"
          />
          <KpiCard
            label={labels.dashboard.advisingsCompleted}
            value={k.completed_advisings}
            icon={<ClipboardCheck className="size-5" />}
            href="/advisings"
            tone="green"
          />
          <KpiCard
            label={labels.dashboard.activeFundedProjects}
            value={k.active_funded_projects}
            icon={<FolderKanban className="size-5" />}
            href="/projects"
            tone="amber"
          />
          <KpiCard
            label={labels.dashboard.fundsReceived}
            value={fmtBRL(k.funds_received)}
            icon={<CircleDollarSign className="size-5" />}
            href="/projects"
            tone="green"
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Análise de Dados"
          description="Visualização gráfica do desempenho e distribuições."
        />
        <DashboardCharts k={k} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <section className="space-y-4">
          <SectionHeading
            title={labels.dashboard.activity}
            description={labels.dashboard.activityDescription}
          />
          <Card>
            <CardContent className="space-y-7">
              <ProgressMetric
                label={labels.dashboard.recentShare}
                description={labels.dashboard.recentShareDescription}
                value={recentShare}
                color="bg-primary"
              />
              <ProgressMetric
                label={labels.dashboard.completedShare}
                description={labels.dashboard.completedShareDescription}
                value={completedShare}
                color="bg-emerald-500"
              />
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <SectionHeading
            title={labels.dashboard.shortcuts}
            description={labels.dashboard.shortcutsDescription}
          />
          <Card className="gap-0 py-2">
            <CardContent className="divide-y px-2">
              {shortcuts.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted"
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{item.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function percentage(part: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.round((part / total) * 100);
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ProgressMetric({
  label,
  description,
  value,
  color,
}: {
  label: string;
  description: string;
  value: number | null;
  color: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
        <span className="text-lg font-semibold tracking-tight">
          {value === null ? "—" : `${value}%`}
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value ?? 0}
      >
        <div
          className={cn("h-full rounded-full transition-[width]", color)}
          style={{ width: `${value ?? 0}%` }}
        />
      </div>
      {value === null ? (
        <p className="text-xs text-muted-foreground">{labels.dashboard.noBasis}</p>
      ) : null}
    </div>
  );
}
