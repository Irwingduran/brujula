"use client"

import { useState } from "react"
import { MagnifyingGlass, Warning, Compass, Target, Gauge, ThumbsUp, ThumbsDown } from "@phosphor-icons/react"
import type { DiagnosticoResult } from "@/lib/diagnostico/schemas"

interface V2DiagnosisSummaryProps {
  diagnostico: DiagnosticoResult
  isLoading?: boolean
  leadId?: string | null
}

const urgenciaColors: Record<string, string> = {
  inmediata: "bg-rose-100 text-rose-700 border-rose-200",
  alta: "bg-amber-100 text-amber-700 border-amber-200",
  media: "bg-blue-100 text-blue-700 border-blue-200",
  baja: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

function getUrgenciaColor(urgencia: string): string {
  const lower = urgencia.toLowerCase()
  for (const [key, value] of Object.entries(urgenciaColors)) {
    if (lower.includes(key)) return value
  }
  return "bg-muted text-muted-foreground border-border"
}

export function V2DiagnosisSummary({ diagnostico, isLoading = false, leadId }: V2DiagnosisSummaryProps) {
  const [feedback, setFeedback] = useState<"positivo" | "negativo" | null>(null)

  async function enviarFeedback(valor: "positivo" | "negativo") {
    if (!leadId || feedback) return
    setFeedback(valor)
    fetch(`/api/leads/${leadId}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evento: "feedback_diagnostico", valor }),
    }).catch(() => {})
  }

  if (isLoading) {
    return (
      <section className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
              <div className="h-16 w-full animate-pulse rounded-xl bg-muted/50" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  const { redaccion, clasificacion, sintomas, findings, capabilities, recommendations, metrics } = diagnostico

  return (
    <section className="space-y-5">
      {/* Resumen ejecutivo */}
      <div className="glass-card rounded-2xl overflow-hidden border-l-4 border-l-accent">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <MagnifyingGlass className="h-5 w-5 text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Resumen de tu diagnóstico
            </span>
          </div>
          <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium">
            {redaccion.resumen}
          </p>
        </div>
      </div>

      {/* Score de madurez */}
      <div className="glass-card rounded-2xl overflow-hidden border-l-4 border-l-primary">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Nivel de madurez digital
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-foreground">
              {clasificacion.madurezDigital}
            </span>
            <span className="text-lg text-muted-foreground">/ 5</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {redaccion.scoreTexto}
          </p>
        </div>
      </div>

      {/* Síntomas principales */}
      <div className="glass-card rounded-2xl overflow-hidden border-l-4 border-l-rose-500">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Warning className="h-5 w-5 text-rose-500" weight="fill" />
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Señales que detectamos
            </span>
          </div>
          <ul className="space-y-3">
            {redaccion.sintomasPrincipales.map((sintoma, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  {i + 1}
                </span>
                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  {sintoma}
                </p>
              </li>
            ))}
          </ul>
          {sintomas.length > 0 && (
            <div className="mt-5 space-y-3 border-t border-rose-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Por qué detectamos esto
              </p>
              {sintomas.map((sintoma) => {
                const references = sintoma.evidenceIds
                  .map((id) => diagnostico.evidence.find((evidence) => evidence.id === id))
                  .filter((evidence): evidence is NonNullable<typeof evidence> => Boolean(evidence))
                return (
                  <div key={sintoma.sintomaId} className="rounded-xl border border-rose-100 bg-rose-50/40 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold capitalize text-rose-800">{sintoma.sintomaId.replace(/_/g, " ")}</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-rose-700">Confianza {sintoma.confidence}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-foreground">{sintoma.evidencia}</p>
                    <ul className="mt-2 space-y-1">
                      {references.map((evidence) => (
                        <li key={evidence.id} className="text-xs text-muted-foreground">• {evidence.label}</li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
          {/* Chips de síntomas con scores */}
          {sintomas && sintomas.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {sintomas.map((s) => (
                <span
                  key={s.sintomaId}
                  className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 border border-rose-100"
                >
                  {s.sintomaId.replace(/_/g, " ")}
                  <span className="ml-1 text-rose-500">({s.score}/5)</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {findings.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden border-l-4 border-l-amber-500">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="h-5 w-5 text-amber-600" weight="fill" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Hallazgos prioritarios
              </span>
            </div>
            <div className="space-y-4">
              {findings.map((finding) => (
                <article key={finding.id} className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-foreground">{finding.title}</h3>
                    <div className="flex gap-2 text-[10px] font-medium">
                      <span className="rounded-full bg-white px-2 py-0.5 text-amber-800">Severidad {finding.severity}/5</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-amber-800">Confianza {finding.confidence}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">{finding.summary}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Impacto probable:</strong> {finding.businessImpact}</p>
                  {(finding.missingInformation.length > 0 || finding.contradictions.length > 0) && (
                    <div className="mt-3 space-y-2 border-t border-amber-100 pt-3 text-xs text-muted-foreground">
                      {finding.missingInformation.length > 0 && <p><strong className="text-foreground">Para confirmarlo conviene conocer:</strong> {finding.missingInformation.join(" · ")}</p>}
                      {finding.contradictions.length > 0 && <p><strong className="text-foreground">Información a revisar:</strong> {finding.contradictions.join(" · ")}</p>}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {capabilities.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden border-l-4 border-l-primary">
          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Lo que conviene desarrollar ahora</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div key={capability.id} className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <div className="flex items-start justify-between gap-2"><h3 className="text-sm font-bold text-foreground">{capability.name}</h3><span className="text-[10px] font-medium text-primary capitalize">{capability.level}</span></div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{capability.description}</p>
                </div>
              ))}
            </div>
            {recommendations.length > 0 && (
              <div className="space-y-3 border-t border-primary/15 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ruta recomendada</p>
                {recommendations.map((recommendation) => {
                  const metric = metrics.find((item) => recommendation.metricIds.includes(item.id))
                  return <article key={recommendation.id} className="rounded-xl border border-border bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-bold text-foreground">{recommendation.title}</h3><span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{recommendation.horizon.replaceAll("_", " ")}</span></div>
                    <p className="mt-2 text-xs text-muted-foreground"><strong className="text-foreground">Objetivo:</strong> {recommendation.objective}</p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">{recommendation.actions.map((action) => <li key={action}>• {action}</li>)}</ul>
                    <p className="mt-3 text-xs text-muted-foreground"><strong className="text-foreground">Antes de avanzar:</strong> {recommendation.prerequisites.join(" · ")}</p>
                    {metric && <p className="mt-1 text-xs text-muted-foreground"><strong className="text-foreground">Métrica:</strong> {metric.name} — {metric.baselineStatus === "por_medir" ? "por medir" : metric.baselineStatus}</p>}
                    {recommendation.notRecommendedYet.length > 0 && <p className="mt-1 text-xs text-muted-foreground"><strong className="text-foreground">Todavía no:</strong> {recommendation.notRecommendedYet.join(" · ")}</p>}
                  </article>
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan de acción */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-foreground" />
            <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
              Tu plan de acción
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {redaccion.planDeAccion.map((paso, i) => {
              const labels = ["Paso 1", "Paso 2", "Paso 3"]
              return (
                <div
                  key={i}
                  className="relative rounded-xl bg-linear-to-br p-[1px]"
                  style={{ backgroundImage: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))` }}
                >
                  <div className="rounded-[11px] bg-white p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white bg-foreground/70">
                        {i + 1}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getUrgenciaColor(paso.urgencia)}`}>
                        {paso.urgencia}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{paso.paso}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                      {paso.descripcion}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {leadId && (
        <div className="flex items-center gap-3 px-6 pb-6 sm:px-8">
          {feedback ? (
            <p className="text-sm text-muted-foreground">Gracias por tu retroalimentación.</p>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">¿Te sirvió este diagnóstico?</span>
              <button onClick={() => enviarFeedback("positivo")} className="rounded-full p-2 hover:bg-muted/50 transition-colors">
                <ThumbsUp className="h-5 w-5" />
              </button>
              <button onClick={() => enviarFeedback("negativo")} className="rounded-full p-2 hover:bg-muted/50 transition-colors">
                <ThumbsDown className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  )
}
