"use client"

import { MagnifyingGlass, Warning, Compass, Target, Gauge } from "@phosphor-icons/react"
import type { DiagnosticoResult } from "@/lib/diagnostico/schemas"

interface V2DiagnosisSummaryProps {
  diagnostico: DiagnosticoResult
  isLoading?: boolean
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

export function V2DiagnosisSummary({ diagnostico, isLoading = false }: V2DiagnosisSummaryProps) {
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

  const { redaccion, clasificacion, sintomas } = diagnostico

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
    </section>
  )
}
