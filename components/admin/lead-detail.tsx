"use client"

import { useState } from "react"
import type { Lead, PipelineStage } from "@/lib/types"
import { PIPELINE_STAGES, INDUSTRIES, PAIN_POINTS, COMPANY_SIZES, BUDGET_RANGES, URGENCY_OPTIONS } from "@/lib/constants"
import { ScoreBadge } from "./score-badge"
import { cn } from "@/lib/utils"
import { ArrowLeft, Envelope, Phone, Buildings, Calendar, FloppyDisk, Target, WarningCircle, ChatCircleText, TrendUp, Clock, Lightbulb, Globe } from "@phosphor-icons/react"
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
              <Envelope className="h-3.5 w-3.5" />
              {lead.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {lead.telefono}
            </span>
            <span className="flex items-center gap-1">
              <Buildings className="h-3.5 w-3.5" />
              {getLabel(lead.industria, [...INDUSTRIES])}
            </span>
          </div>
        </div>
        {lead.score && <ScoreBadge score={lead.score.total} segment={lead.segmento} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - details */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Professional Briefing (AI) */}
          {lead.briefing_profesional && (
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                  <Target className="h-6 w-6" weight="fill" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Briefing Pre-Meet</h2>
                  <p className="text-xs text-muted-foreground">Generado por IA para el profesional</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Resumen */}
                <div className="rounded-lg bg-white/60 p-4 border border-primary/10">
                  <p className="text-sm font-medium text-foreground leading-relaxed">{lead.briefing_profesional.resumen_rapido}</p>
                </div>

                {/* Perfil & Señales */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Perfil del Prospecto</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">Rol:</span>
                        <span className="font-medium text-foreground">{lead.briefing_profesional.perfil.tipo_decision_maker}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">Madurez Digital:</span>
                        <span className="font-medium capitalize text-foreground">{lead.briefing_profesional.perfil.madurez_digital}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <TrendUp className="h-3.5 w-3.5" /> Señales de Compra
                    </h3>
                    <ul className="space-y-1">
                      {lead.briefing_profesional.perfil.señales_compra.map((s: string, i: number) => (
                        <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Riesgos */}
                {lead.briefing_profesional.perfil.riesgos?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <WarningCircle className="h-3.5 w-3.5" /> Riesgos / Objeciones
                    </h3>
                    <ul className="space-y-1">
                      {lead.briefing_profesional.perfil.riesgos.map((r: string, i: number) => (
                        <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                          <span className="text-red-500 mt-0.5">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Website Analysis for Pro */}
                {lead.briefing_profesional.analisis_web_para_profesional && (
                  <div className="rounded-lg bg-blue-50/50 p-4 border border-blue-100">
                    <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Globe className="h-4 w-4" /> Inteligencia Web
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground block mb-0.5">Estado Actual</span>
                        <p className="text-sm text-foreground">{lead.briefing_profesional.analisis_web_para_profesional.estado_actual}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground block mb-0.5">Quick Wins</span>
                          <ul className="space-y-1">
                            {lead.briefing_profesional.analisis_web_para_profesional.oportunidades_quick_win.map((q: string, i: number) => (
                              <li key={i} className="text-xs text-foreground flex items-start gap-1">
                                <span className="text-blue-500">•</span> {q}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground block mb-0.5">Brecha Competitiva</span>
                          <p className="text-xs text-foreground">{lead.briefing_profesional.analisis_web_para_profesional.brechas_vs_competencia}</p>
                        </div>
                      </div>
                      <div className="bg-white/80 p-2 rounded text-xs">
                        <span className="font-semibold text-primary">Tech Rec:</span> {lead.briefing_profesional.analisis_web_para_profesional.recomendacion_tecnica}
                      </div>
                    </div>
                  </div>
                )}

                {/* Talking Points */}
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ChatCircleText className="h-4 w-4" /> Talking Points
                  </h3>
                  <div className="space-y-3 bg-white/60 p-4 rounded-lg border border-border">
                    <div>
                      <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary mb-1">Abrir con:</span>
                      <p className="text-sm italic text-foreground">&quot;{lead.briefing_profesional.puntos_conversacion.abrir_con}&quot;</p>
                    </div>
                    <div>
                      <span className="inline-block rounded bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent mb-1">Preguntar:</span>
                      <ul className="space-y-1">
                        {lead.briefing_profesional.puntos_conversacion.profundizar.map((p: string, i: number) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-1.5">
                            <span className="text-accent mt-0.5">?</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {lead.briefing_profesional.puntos_conversacion.no_mencionar?.length > 0 && (
                      <div>
                        <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 mb-1">Evitar:</span>
                        <ul className="space-y-0.5">
                          {lead.briefing_profesional.puntos_conversacion.no_mencionar.map((n: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-red-500">✕</span> {n}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Proposal */}
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4" /> Propuesta Sugerida
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-white/60 p-3 border border-border">
                      <div className="text-xs text-muted-foreground mb-0.5">Servicio Principal</div>
                      <div className="text-sm font-bold text-foreground">{lead.briefing_profesional.propuesta_sugerida.servicio_primario}</div>
                    </div>
                    <div className="rounded-lg bg-white/60 p-3 border border-border">
                      <div className="text-xs text-muted-foreground mb-0.5">Rango Sugerido</div>
                      <div className="text-sm font-bold text-emerald-700">{lead.briefing_profesional.propuesta_sugerida.rango_precio_sugerido}</div>
                    </div>
                    <div className="rounded-lg bg-white/60 p-3 border border-border sm:col-span-2">
                      <div className="text-xs text-muted-foreground mb-1">Argumento ROI</div>
                      <div className="text-sm text-foreground">{lead.briefing_profesional.propuesta_sugerida.roi_argumento}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
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

          {/* Website URL + Analysis */}
          {lead.url_sitio && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 text-sm font-semibold text-card-foreground">Sitio web</h2>
              <a
                href={lead.url_sitio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline underline-offset-2 hover:opacity-80 break-all"
              >
                {lead.url_sitio}
              </a>
              {(() => {
                const wa = lead.website_analisis as Record<string, unknown> | null
                const ops = wa?.oportunidades_mejora as string[] | undefined
                if (!ops?.length) return null
                return (
                  <div className="mt-3 space-y-2">
                    <span className="text-xs font-semibold text-amber-700">Oportunidades de mejora</span>
                    <div className="flex flex-col gap-1">
                      {ops.map((o: string, i: number) => (
                        <div key={i} className="rounded bg-amber-50 px-2 py-1 text-xs text-card-foreground border border-amber-100">{o}</div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Diagnosis */}
          {lead.diagnostico && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-2 text-sm font-semibold text-card-foreground">Diagnostico Generado</h2>
              <h3 className="text-base font-bold text-card-foreground">
                {lead.diagnostico_ia?.titulo_servicio ?? lead.diagnostico.titulo_servicio}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {lead.diagnostico_ia?.diagnostico_texto ?? lead.diagnostico.diagnostico_texto}
              </p>
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

          {/* AI Diagnosis Extended */}
          {lead.diagnostico_ia && (
            <div className="rounded-xl border-2 border-primary/20 bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs">✦</span>
                <h2 className="text-sm font-semibold text-card-foreground">Diagnóstico IA Personalizado</h2>
              </div>

              {/* Diagnostico ejecutivo */}
              {lead.diagnostico_ia.diagnostico_ejecutivo && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Diagnóstico ejecutivo</div>
                  <p className="text-sm text-card-foreground leading-relaxed">{lead.diagnostico_ia.diagnostico_ejecutivo}</p>
                </div>
              )}

              {/* Sugerencia de mejora (lo que vio el cliente) */}
              {lead.diagnostico_ia.sugerencia_mejora && (
                <div className="mb-4 rounded-lg border-2 border-primary/20 bg-primary/[0.03] p-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1.5">
                    <span className="text-primary">★</span> Sugerencia que vio el cliente
                  </div>
                  <p className="text-sm text-card-foreground leading-relaxed">{lead.diagnostico_ia.sugerencia_mejora}</p>
                </div>
              )}

              {/* Prioridades + Plan 30/60/90 */}
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                {lead.diagnostico_ia.prioridades_inmediatas && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Prioridades inmediatas</div>
                    <ol className="space-y-1.5 text-xs list-decimal list-inside">
                      {lead.diagnostico_ia.prioridades_inmediatas.map((p: string, i: number) => (
                        <li key={i} className="text-card-foreground">{p}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {lead.diagnostico_ia.plan_30_60_90 && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Plan 30/60/90</div>
                    <div className="space-y-1.5">
                      {[
                        { label: "30d", text: lead.diagnostico_ia.plan_30_60_90.dia_30 },
                        { label: "60d", text: lead.diagnostico_ia.plan_30_60_90.dia_60 },
                        { label: "90d", text: lead.diagnostico_ia.plan_30_60_90.dia_90 },
                      ].map((item) => (
                        <div key={item.label} className="rounded bg-muted/50 px-2 py-1.5 text-xs text-card-foreground">
                          <span className="font-semibold text-primary">{item.label}:</span> {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Beneficios IA */}
              {lead.diagnostico_ia.beneficios && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Beneficios esperados</div>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {lead.diagnostico_ia.beneficios.map((b: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-card-foreground">
                        <span className="text-accent mt-0.5">✓</span> {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tiempo ahorro + Dato industria */}
              <div className="grid gap-2 sm:grid-cols-2 mb-4">
                {lead.diagnostico_ia.tiempo_ahorro && (
                  <div className="rounded-lg bg-accent/5 border border-accent/10 p-3">
                    <div className="text-xs text-muted-foreground">Tiempo estimado de ahorro</div>
                    <div className="mt-0.5 text-sm font-bold text-card-foreground">{lead.diagnostico_ia.tiempo_ahorro}</div>
                  </div>
                )}
                {lead.diagnostico_ia.dato_industria && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                    <div className="text-xs text-muted-foreground">Dato de industria</div>
                    <div className="mt-0.5 text-xs text-card-foreground leading-snug">{lead.diagnostico_ia.dato_industria}</div>
                  </div>
                )}
              </div>

              {/* Hallazgos web */}
              {lead.diagnostico_ia.hallazgos_web && (
                <div className="mb-4 rounded-lg border border-border p-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">🌐 Análisis del sitio web</div>
                  <div className="space-y-2">
                    {lead.diagnostico_ia.hallazgos_web.fortalezas?.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700">FORTALEZAS</span>
                        {lead.diagnostico_ia.hallazgos_web.fortalezas.map((f: string, i: number) => (
                          <div key={i} className="text-xs text-card-foreground ml-2">• {f}</div>
                        ))}
                      </div>
                    )}
                    {lead.diagnostico_ia.hallazgos_web.brechas_criticas?.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-amber-700">BRECHAS</span>
                        {lead.diagnostico_ia.hallazgos_web.brechas_criticas.map((b: string, i: number) => (
                          <div key={i} className="text-xs text-card-foreground ml-2">• {b}</div>
                        ))}
                      </div>
                    )}
                    {lead.diagnostico_ia.hallazgos_web.recomendaciones_tecnicas?.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-primary">RECOMENDACIONES</span>
                        {lead.diagnostico_ia.hallazgos_web.recomendaciones_tecnicas.map((r: string, i: number) => (
                          <div key={i} className="text-xs text-card-foreground ml-2">{i + 1}. {r}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Caso de éxito */}
              {lead.diagnostico_ia.caso_exito && (
                <div className="rounded-lg bg-muted/30 border border-border p-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Caso de éxito similar</div>
                  <div className="text-xs font-bold text-card-foreground">{lead.diagnostico_ia.caso_exito.empresa}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="text-red-600 font-medium">Reto:</span> {lead.diagnostico_ia.caso_exito.problema}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-blue-600 font-medium">Solución:</span> {lead.diagnostico_ia.caso_exito.solucion}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-emerald-600 font-medium">Resultado:</span> {lead.diagnostico_ia.caso_exito.resultado}
                  </div>
                </div>
              )}
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

          {/* Quick actions */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-card-foreground">Acciones rápidas</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handlePipelineChange("cerrado")}
                className="rounded-lg bg-emerald-50 px-3 py-2 text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                Marcar como cerrado
              </button>
              <button
                onClick={() => handlePipelineChange("archivado")}
                className="rounded-lg bg-zinc-50 px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
              >
                Archivar lead
              </button>
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
              <FloppyDisk className="h-3 w-3" />
              {saving ? "Guardando..." : "Guardar notas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
