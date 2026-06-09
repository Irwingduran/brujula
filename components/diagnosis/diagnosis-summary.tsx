"use client"

import { CheckCircle, RocketLaunch, Printer, Sparkle, Star, ArrowRight } from "@phosphor-icons/react"
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
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <section className="glass-card rounded-2xl overflow-hidden">
      <div className="p-6 sm:p-8 space-y-6">
        {/* Business context + Readiness */}
        <div>
          {businessName && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-medium text-muted-foreground">{businessName}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <RocketLaunch className={cn("h-5 w-5", readinessColor)} weight="fill" />
            <h2 className={cn("text-xl font-bold", readinessColor)}>{readinessLabel}</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{readinessDescription}</p>
        </div>

        {/* Diagnosis */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            <Sparkle className="h-3.5 w-3.5" weight="fill" />
            Diagnóstico
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted/50" />
            </div>
          ) : (
            <p className="text-sm text-foreground leading-relaxed">{diagnosticText}</p>
          )}
        </div>

        {/* Benefits */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            <CheckCircle className="h-3.5 w-3.5 text-accent" weight="fill" />
            Lo que puedes lograr
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-muted/50" />
              ))}
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-3">
              {beneficios.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl border border-accent/15 bg-accent/5 p-3.5">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" weight="fill" />
                  <span className="text-sm text-foreground leading-snug">{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Suggestion */}
        {sugerenciaMejora && !isLoading && (
          <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="h-4 w-4 text-primary" weight="fill" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Sugerencia de mejora
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{sugerenciaMejora}</p>
          </div>
        )}

        {/* Plan */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            <RocketLaunch className="h-3.5 w-3.5" weight="fill" />
            Plan sugerido
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-muted/50" />
              ))}
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-3">
              {plan.map((item, i) => {
                const labels = ["Primer mes", "Segundo mes", "Tercer mes"]
                const colors = ["border-l-accent bg-accent/5", "border-l-primary bg-primary/5", "border-l-emerald-500 bg-emerald-50"]
                return (
                  <div
                    key={i}
                    className={cn("rounded-lg border border-border border-l-4 p-3 text-xs text-foreground leading-relaxed", colors[i % colors.length])}
                  >
                    <span className="block text-[11px] font-bold mb-1 opacity-60">{labels[i]}</span>
                    {item}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Success Story */}
        {casoExito && !isLoading && (
          <div className="rounded-xl border border-accent/15 bg-accent/[0.03] p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Star className="h-4 w-4 text-accent" weight="fill" />
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                Caso similar
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{casoExito.empresa}</span>
                <span className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{casoExito.industria}</span>
              </div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Reto:</span> {casoExito.problema}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Solución:</span> {casoExito.solucion}
              </p>
              <p className="font-medium text-emerald-700">
                {casoExito.resultado}
              </p>
            </div>
          </div>
        )}

        {/* Print */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <Printer className="h-4 w-4" />
            Guardar como PDF
          </button>
        </div>
      </div>
    </section>
  )
}
