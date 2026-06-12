"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  buildMemberHoursChart,
  type SubmissionMemberHours,
} from "./member-hours";

export function MemberHoursChart({
  members,
}: {
  members: SubmissionMemberHours[];
}) {
  const { slices, totalHours } = buildMemberHoursChart(members);
  const config = slices.reduce<ChartConfig>((current, slice) => {
    current[slice.id] = { label: slice.name, color: slice.fill };
    return current;
  }, {});

  return (
    <section className="rounded-xl border bg-muted/20 p-4" aria-labelledby="member-hours-title">
      <div className="mb-4">
        <h4 id="member-hours-title" className="text-sm font-semibold">
          Distribuição de horas da equipe
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">
          Participação semanal prevista de cada pesquisador.
        </p>
      </div>

      {slices.length > 0 ? (
        <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.8fr)]">
          <ChartContainer
            config={config}
            className="mx-auto aspect-square h-[230px]"
            aria-label={`Gráfico com ${totalHours} horas semanais distribuídas`}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    nameKey="id"
                    hideLabel
                    formatter={(value, _name, item) => (
                      <div className="flex min-w-36 items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {item.payload.name}
                        </span>
                        <span className="font-mono font-medium">
                          {Number(value)} h
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={slices}
                dataKey="hours"
                nameKey="id"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={2}
                strokeWidth={4}
              >
                {slices.map((slice) => (
                  <Cell key={slice.id} fill={slice.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                      return null;
                    }

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-semibold"
                        >
                          {totalHours}h
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 20}
                          className="fill-muted-foreground text-[10px]"
                        >
                          por semana
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          <ul className="space-y-2.5" aria-label="Horas por pesquisador">
            {slices.map((slice) => (
              <li
                key={slice.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 text-xs"
              >
                <span
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: slice.fill }}
                />
                <span className="truncate font-medium">{slice.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  {slice.hours}h · {Math.round(slice.percentage)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex min-h-36 items-center justify-center rounded-lg border border-dashed bg-background/50 px-5 text-center">
          <p className="max-w-sm text-xs leading-5 text-muted-foreground">
            Adicione pesquisadores e informe suas horas para visualizar a
            distribuição da equipe.
          </p>
        </div>
      )}
    </section>
  );
}
