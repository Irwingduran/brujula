import type { Lead } from "@/lib/types"
import { ScoreBadge } from "./score-badge"
import { PIPELINE_STAGES, INDUSTRIES } from "@/lib/constants"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LeadsTableProps {
  leads: Lead[]
}

function getIndustryLabel(value: string) {
  return INDUSTRIES.find((i) => i.value === value)?.label ?? value
}

function getPipelineLabel(value: string) {
  return PIPELINE_STAGES.find((s) => s.value === value)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Industria</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Score</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Pipeline</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const pipeline = getPipelineLabel(lead.estado_pipeline)
            return (
              <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-foreground hover:text-primary">
                    {lead.nombre}
                  </Link>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{getIndustryLabel(lead.industria)}</td>
                <td className="px-4 py-3">
                  {lead.score && <ScoreBadge score={lead.score.total} segment={lead.segmento} />}
                </td>
                <td className="px-4 py-3">
                  {pipeline && (
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", pipeline.color)}>
                      {pipeline.label}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.created_at)}</td>
              </tr>
            )
          })}
          {leads.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                No hay leads aun.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
