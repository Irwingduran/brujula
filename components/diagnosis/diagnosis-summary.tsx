"use client"

import { CheckCircle, Lightning, Target, ChartBar, ArrowRight, Quotes } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface CasoExito {
  empresa: string
  industria: string
  problema: string
  solucion: string
  resultado: string
}

interface DiagnosisSummaryProps {
  readinessLabel: string
  readinessColor: string
  readinessDescription: string
  diagnosticText: string
  beneficios: string[]
  plan: string[]
  isLoading?: boolean
  sugerenciaMejora?: string
  casoExito?: CasoExito | null
  businessName?: string
}

function getPlanLabels(industryCode?: string): string[] {
  return ["Primer mes", "Segundo mes", "Tercer mes"]
}

export function DiagnosisSummary({
  readinessLabel,
  readinessColor,
  readinessDescription,
  diagnosticText,
  beneficios,
  plan,
  sugerenciaMejora,
  casoExito,
  businessName,
  isLoading = false,
}: DiagnosisSummaryProps) {
  const labels = getPlanLabels()

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

  return (
    <section className="space-y-5">
      {/* Diagnostic text — prominent */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" weight="fill" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Diagnóstico
            </span>
          </div>
          <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium">
            {diagnosticText}
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Lightning className="h-5 w-5 text-accent" weight="fill" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Lo que puedes lograr
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {beneficios.map((b, i) => {
              const icons = [Lightning, ChartBar, CheckCircle]
              const Icon = icons[i % 3]
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-accent/15 bg-accent/5 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-4 w-4 text-accent" weight="fill" />
                  </div>
                  <p className="text-sm text-foreground leading-snug">{b}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Suggestion */}
      {sugerenciaMejora && (
        <div className="glass-card rounded-2xl overflow-hidden border-l-4 border-l-primary">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Quotes className="h-4 w-4 text-primary" weight="fill" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Recomendación rápida
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {sugerenciaMejora}
            </p>
          </div>
        </div>
      )}

      {/* Plan */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-foreground" weight="fill" />
            <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
              Tu plan de acción
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {plan.map((item, i) => {
              const gradients = [
                "from-accent to-accent/60",
                "from-primary to-primary/60",
                "from-emerald-500 to-emerald-400",
              ]
              return (
                <div
                  key={i}
                  className="relative rounded-xl bg-linear-to-br p-[1px]"
                  style={{ backgroundImage: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))` }}
                >
                  <div className="rounded-[11px] bg-white p-4 h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white",
                        i === 0 ? "bg-accent" : i === 1 ? "bg-primary" : "bg-emerald-500"
                      )}>
                        {i + 1}
                      </span>
                      <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider">
                        {labels[i]}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-snug">
                      {item}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Success Story */}
      {casoExito && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-emerald-600" weight="fill" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Caso similar
              </span>
            </div>
            <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-foreground">{casoExito.empresa}</span>
                <span className="text-[11px] text-muted-foreground bg-white px-2 py-0.5 rounded-full border border-emerald-200/50">
                  {casoExito.industria}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 text-sm">
                <div>
                  <span className="block text-[11px] font-semibold text-rose-600 uppercase tracking-wider mb-1">Reto</span>
                  <p className="text-muted-foreground">{casoExito.problema}</p>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-1">Solución</span>
                  <p className="text-muted-foreground">{casoExito.solucion}</p>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">Resultado</span>
                  <p className="font-semibold text-emerald-700">{casoExito.resultado}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
