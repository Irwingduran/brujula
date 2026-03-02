"use client"

import { useState } from "react"
import type { Lead, PipelineStage } from "@/lib/types"
import { PIPELINE_STAGES, INDUSTRIES, PAIN_POINTS, COMPANY_SIZES, BUDGET_RANGES, URGENCY_OPTIONS } from "@/lib/constants"
import { ScoreBadge } from "./score-badge"
import { cn } from "@/lib/utils"
import { ArrowLeft, Mail, Phone, Building2, Calendar, Save } from "lucide-react"
import Link from "next/link"
import useSWR, { mutate } from "swr"

interface LeadDetailProps {
  leadId: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted">
        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function getLabel(value: string, list: { value: string; label: string }[]) {
  return list.find((item) => item.value === value)?.label ?? value
}

export function LeadDetail({ leadId }: LeadDetailProps) {
  const { data: lead, error } = useSWR<Lead>(`/api/leads/${leadId}`, fetcher)
  const [notes, setNotes] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  if (error) return <div className="p-8 text-center text-muted-foreground">Lead no encontrado.</div>
  if (!lead) return <div className="p-8 text-center text-muted-foreground">Cargando...</div>

  const displayNotes = notes ?? lead.notas_freelancer

  async function handlePipelineChange(stage: PipelineStage) {
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_pipeline: stage }),
    })
    mutate(`/api/leads/${leadId}`)
  }

  async function handleSaveNotes() {
    setSaving(true)
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notas_freelancer: displayNotes }),
    })
    mutate(`/api/leads/${leadId}`)
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Link
        href="/admin/pipeline"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al pipeline
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-foreground">{lead.nombre}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {lead.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {lead.telefono}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {getLabel(lead.industria, [...INDUSTRIES])}
            </span>
          </div>
        </div>
        {lead.score && <ScoreBadge score={lead.score.total} segment={lead.segmento} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - details */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Score breakdown */}
          {lead.score && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-semibold text-card-foreground">Score Breakdown</h2>
              <div className="flex flex-col gap-3">
                <ScoreBar label="Presupuesto" value={lead.score.presupuesto} max={30} />
                <ScoreBar label="Urgencia" value={lead.score.urgencia} max={25} />
                <ScoreBar label="Tamano de empresa" value={lead.score.tamano_empresa} max={20} />
                <ScoreBar label="Claridad del problema" value={lead.score.claridad_problema} max={15} />
                <ScoreBar label="Fit de industria" value={lead.score.industria_fit} max={10} />
              </div>
            </div>
          )}

          {/* Wizard responses */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-card-foreground">Respuestas del Wizard</h2>
            <div className="flex flex-col gap-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">Industria: </span>
                  <span className="text-card-foreground">{getLabel(lead.industria, [...INDUSTRIES])}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Tamano: </span>
                  <span className="text-card-foreground">{getLabel(lead.tamano_empresa, COMPANY_SIZES)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Presupuesto: </span>
                  <span className="text-card-foreground">{getLabel(lead.presupuesto, BUDGET_RANGES)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Urgencia: </span>
                  <span className="text-card-foreground">{getLabel(lead.urgencia, URGENCY_OPTIONS)}</span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground">Dolores principales: </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {lead.dolores_principales.map((d) => (
                    <span key={d} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-card-foreground">
                      {getLabel(d, PAIN_POINTS)}
                    </span>
                  ))}
                </div>
              </div>

              {Object.keys(lead.respuestas_branch).length > 0 && (
                <div>
                  <span className="text-muted-foreground">Respuestas adicionales:</span>
                  <div className="mt-1 flex flex-col gap-1">
                    {Object.entries(lead.respuestas_branch).map(([key, val]) => (
                      <div key={key} className="text-xs">
                        <span className="text-muted-foreground">{key}: </span>
                        <span className="text-card-foreground">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lead.respuestas_ia.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Respuestas del analisis:</span>
                  <div className="mt-1 flex flex-col gap-1">
                    {lead.respuestas_ia.map((a, i) => (
                      <div key={i} className="rounded bg-muted px-2 py-1 text-xs text-card-foreground">{a}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis */}
          {lead.diagnostico && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-2 text-sm font-semibold text-card-foreground">Diagnostico Generado</h2>
              <h3 className="text-base font-bold text-card-foreground">{lead.diagnostico.titulo_servicio}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{lead.diagnostico.diagnostico_texto}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">ROI estimado</div>
                  <div className="mt-0.5 text-sm font-medium text-card-foreground">{lead.diagnostico.roi_estimado}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">Precio sugerido</div>
                  <div className="mt-0.5 text-sm font-medium text-card-foreground">{lead.diagnostico.precio_rango}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column - actions */}
        <div className="flex flex-col gap-4">
          {/* Pipeline stage */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-card-foreground">Etapa del Pipeline</h2>
            <div className="flex flex-col gap-1.5">
              {PIPELINE_STAGES.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => handlePipelineChange(stage.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors",
                    lead.estado_pipeline === stage.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <span className={cn(
                    "inline-block h-2 w-2 rounded-full",
                    lead.estado_pipeline === stage.value ? "bg-primary-foreground" : stage.color.split(" ")[0]
                  )} />
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-card-foreground">Fechas</h2>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Creado: {new Date(lead.created_at).toLocaleDateString("es-MX")}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Ultima actividad: {new Date(lead.ultima_actividad_at).toLocaleDateString("es-MX")}
              </div>
              {lead.llamada_agendada_at && (
                <div className="flex items-center gap-2 text-accent">
                  <Calendar className="h-3.5 w-3.5" />
                  Llamada: {new Date(lead.llamada_agendada_at).toLocaleDateString("es-MX")}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-card-foreground">Notas</h2>
            <textarea
              rows={4}
              value={displayNotes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega notas sobre este lead..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Save className="h-3 w-3" />
              {saving ? "Guardando..." : "Guardar notas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
