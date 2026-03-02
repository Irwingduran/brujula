import type { Lead } from "@/lib/types"
import { Users, TrendingUp, Flame, Thermometer } from "lucide-react"

interface MetricsCardsProps {
  leads: Lead[]
}

export function MetricsCards({ leads }: MetricsCardsProps) {
  const totalLeads = leads.length
  const avgScore = totalLeads > 0
    ? Math.round(leads.reduce((sum, l) => sum + (l.score?.total ?? 0), 0) / totalLeads)
    : 0
  const hotCount = leads.filter((l) => l.segmento === "HOT").length
  const warmCount = leads.filter((l) => l.segmento === "WARM").length
  const callsScheduled = leads.filter((l) => l.estado_pipeline === "llamada_agendada").length

  const cards = [
    { label: "Total Leads", value: totalLeads, icon: Users, color: "text-primary" },
    { label: "Score Promedio", value: avgScore, icon: TrendingUp, color: "text-accent" },
    { label: "Leads HOT", value: hotCount, icon: Flame, color: "text-red-500" },
    { label: "Llamadas Agendadas", value: callsScheduled, icon: Thermometer, color: "text-amber-500" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{card.label}</span>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </div>
          <div className="mt-2 font-sans text-3xl font-bold text-card-foreground">{card.value}</div>
        </div>
      ))}
    </div>
  )
}
