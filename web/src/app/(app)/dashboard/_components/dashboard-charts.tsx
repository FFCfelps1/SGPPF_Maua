"use client";

import { Pie, PieChart, Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DashboardCharts({ k }: { k: any }) {
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

  return (
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
  );
}
