"use client"

import type { Lead } from "@/lib/types"
import { INDUSTRIES, PIPELINE_STAGES } from "@/lib/constants"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface DashboardChartsProps {
  leads: Lead[]
}

const SEGMENT_COLORS = {
  HOT: "#ef4444",
  WARM: "#f59e0b",
  COLD: "#3b82f6",
}

export function DashboardCharts({ leads }: DashboardChartsProps) {
  // Leads by industry
  const industryData = INDUSTRIES
    .map((ind) => ({
      name: ind.label.split(" / ")[0].substring(0, 12),
      count: leads.filter((l) => l.industria === ind.value).length,
    }))
    .filter((d) => d.count > 0)

  // Segment distribution
  const segmentData = [
    { name: "HOT", value: leads.filter((l) => l.segmento === "HOT").length },
    { name: "WARM", value: leads.filter((l) => l.segmento === "WARM").length },
    { name: "COLD", value: leads.filter((l) => l.segmento === "COLD").length },
  ].filter((d) => d.value > 0)

  // Pipeline distribution
  const pipelineData = PIPELINE_STAGES
    .map((stage) => ({
      name: stage.label.substring(0, 14),
      count: leads.filter((l) => l.estado_pipeline === stage.value).length,
    }))
    .filter((d) => d.count > 0)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Industry Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Leads por Industria</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={industryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Segment Distribution */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Distribucion por Segmento</h3>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {segmentData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={SEGMENT_COLORS[entry.name as keyof typeof SEGMENT_COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3">
            {segmentData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: SEGMENT_COLORS[entry.name as keyof typeof SEGMENT_COLORS] }}
                />
                <span className="text-sm text-card-foreground">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Distribution */}
      <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Leads por Etapa del Pipeline</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={pipelineData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} allowDecimals={false} />
            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" fill="var(--accent)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
