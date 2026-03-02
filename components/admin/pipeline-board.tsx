"use client"

import { useState, useCallback } from "react"
import type { Lead, PipelineStage, LeadSegment } from "@/lib/types"
import { PIPELINE_STAGES, INDUSTRIES } from "@/lib/constants"
import { ScoreBadge } from "./score-badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { GripVertical, Filter } from "lucide-react"
import useSWR, { mutate } from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function LeadCard({ lead }: { lead: Lead }) {
  const industryLabel = INDUSTRIES.find((i) => i.value === lead.industria)?.label ?? lead.industria

  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", lead.id)
        e.dataTransfer.effectAllowed = "move"
      }}
      className="group flex cursor-grab flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow active:cursor-grabbing hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-card-foreground">{lead.nombre}</div>
          <div className="text-xs text-muted-foreground">{industryLabel}</div>
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      {lead.score && <ScoreBadge score={lead.score.total} segment={lead.segmento} />}
      <div className="text-xs text-muted-foreground">
        {new Date(lead.created_at).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}
      </div>
    </Link>
  )
}

function Column({
  stage,
  leads,
  onDrop,
}: {
  stage: (typeof PIPELINE_STAGES)[number]
  leads: Lead[]
  onDrop: (leadId: string, stage: PipelineStage) => void
}) {
  const [isOver, setIsOver] = useState(false)

  return (
    <div
      className={cn(
        "flex min-h-[400px] w-64 shrink-0 flex-col rounded-xl border bg-muted/50 transition-colors",
        isOver ? "border-primary bg-primary/5" : "border-border"
      )}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        setIsOver(true)
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsOver(false)
        const leadId = e.dataTransfer.getData("text/plain")
        if (leadId) onDrop(leadId, stage.value)
      }}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("inline-block h-2 w-2 rounded-full", stage.color.split(" ")[0])} />
          <span className="text-xs font-semibold text-foreground">{stage.label}</span>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {leads.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  )
}

export function PipelineBoard() {
  const { data: leads = [] } = useSWR<Lead[]>("/api/leads", fetcher, {
    refreshInterval: 5000,
  })
  const [filter, setFilter] = useState<LeadSegment | "ALL">("ALL")

  const filteredLeads = filter === "ALL" ? leads : leads.filter((l) => l.segmento === filter)

  const handleDrop = useCallback(async (leadId: string, stage: PipelineStage) => {
    // Optimistic update
    mutate(
      "/api/leads",
      (current: Lead[] | undefined) =>
        current?.map((l) => (l.id === leadId ? { ...l, estado_pipeline: stage } : l)),
      false
    )

    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_pipeline: stage }),
    })

    mutate("/api/leads")
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Filtrar:</span>
        {(["ALL", "HOT", "WARM", "COLD"] as const).map((seg) => (
          <button
            key={seg}
            onClick={() => setFilter(seg)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filter === seg
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {seg === "ALL" ? "Todos" : seg}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <Column
            key={stage.value}
            stage={stage}
            leads={filteredLeads.filter((l) => l.estado_pipeline === stage.value)}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  )
}
