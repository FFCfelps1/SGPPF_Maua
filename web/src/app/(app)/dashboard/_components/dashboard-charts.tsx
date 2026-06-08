"use client";

import { useState } from "react";
import { Pie, PieChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardCharts({ k }: { k: any }) {
  const [selectedMetric, setSelectedMetric] = useState<"projects" | "researchers" | "publications" | "advisings">("projects");

  // Data for Advisings Pie Chart
  const advisingsData = [
    { status: "completed", count: k.completed_advisings, fill: "var(--color-completed)" },
    { status: "in_progress", count: Math.max(0, k.total_advisings - k.completed_advisings), fill: "var(--color-in_progress)" },
  ];

  const advisingsConfig = {
    completed: { label: "Concluídas", color: "hsl(var(--chart-2))" },
    in_progress: { label: "Em Andamento", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  // Data for Publications Bar Chart
  const publicationsData = [
    { period: "Últimos 3 Anos", count: k.recent_publications },
    { period: "Anteriores", count: Math.max(0, k.total_publications - k.recent_publications) },
  ];

  const pubConfig = {
    count: { label: "Publicações", color: "hsl(var(--primary))" },
  } satisfies ChartConfig;

  // Department distribution data based on selected metric
  const rawData = 
    selectedMetric === "projects" ? k.projects_by_dept :
    selectedMetric === "researchers" ? k.researchers_by_dept :
    selectedMetric === "publications" ? k.publications_by_dept :
    k.advisings_by_dept;

  const deptData = (rawData ?? [])
    .filter((d: any) => d.value > 0)
    .map((d: any, i: number) => ({
      label: d.label || "Indefinido",
      value: d.value,
      fill: `hsl(var(--chart-${(i % 5) + 1}))`,
    }));

  const deptConfig = deptData.reduce((acc: any, d: any) => {
    acc[d.label] = { label: d.label, color: d.fill };
    return acc;
  }, {} as ChartConfig);

  const metrics = [
    { id: "projects", label: "Projetos" },
    { id: "researchers", label: "Pesquisadores" },
    { id: "publications", label: "Publicações" },
    { id: "advisings", label: "Orientações" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col border-none shadow-sm bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Status de Orientações</CardTitle>
            <CardDescription>Distribuição de orientações concluídas vs. ativas</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <ChartContainer config={advisingsConfig} className="mx-auto aspect-square max-h-[220px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={advisingsData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  outerRadius={80}
                  strokeWidth={5}
                  paddingAngle={2}
                >
                  {advisingsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend 
                  content={<ChartLegendContent nameKey="status" />} 
                  className="mt-4 flex-wrap justify-center gap-4" 
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-none shadow-sm bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Produção Científica</CardTitle>
            <CardDescription>Volume de publicações por período</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            <ChartContainer config={pubConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={publicationsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
                <XAxis 
                  dataKey="period" 
                  tickLine={false} 
                  tickMargin={10} 
                  axisLine={false}
                  className="text-xs font-medium text-muted-foreground"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-card/50">
        <CardHeader className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">Distribuição por Departamento</CardTitle>
            <CardDescription>Visualização comparativa entre departamentos</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1">
            {metrics.map((m) => (
              <Button
                key={m.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-3 text-xs font-medium transition-all",
                  selectedMetric === m.id 
                    ? "bg-background text-foreground shadow-sm hover:bg-background" 
                    : "text-muted-foreground hover:bg-transparent hover:text-foreground"
                )}
                onClick={() => setSelectedMetric(m.id)}
              >
                {m.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {deptData.length > 0 ? (
            <ChartContainer config={deptConfig} className="h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={deptData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted/50" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="label"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="text-xs font-medium"
                  width={100}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              Nenhum dado disponível para esta métrica.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
