"use client"

import { MagnifyingGlass, Warning, Compass, CalendarBlank } from "@phosphor-icons/react"

interface DiagnosisSummaryProps {
  patronNegocio: string
  riesgoPrincipal: string
  cambioClave: string
  plan: string[]
  isLoading?: boolean
}

export function DiagnosisSummary({
  patronNegocio,
  riesgoPrincipal,
  cambioClave,
  plan,
  isLoading = false,
}: DiagnosisSummaryProps) {
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
      {/* Pattern — prominent */}
      <div className="glass-card rounded-2xl overflow-hidden border-l-4 border-l-accent">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <MagnifyingGlass className="h-5 w-5 text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              El patrón de tu negocio
            </span>
          </div>
          <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium">
            {patronNegocio}
          </p>
        </div>
      </div>

      {/* Risk — highlighted */}
      <div className="glass-card rounded-2xl overflow-hidden border-l-4 border-l-rose-500">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Warning className="h-5 w-5 text-rose-500" weight="fill" />
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Tu riesgo más grande
            </span>
          </div>
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            {riesgoPrincipal}
          </p>
        </div>
      </div>

      {/* Key change — quote box */}
      <div className="glass-card rounded-2xl overflow-hidden border-l-4 border-l-primary">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              El cambio que recomendamos
            </span>
          </div>
          <p className="text-base text-foreground leading-relaxed font-medium">
            {cambioClave}
          </p>
        </div>
      </div>

      {/* Plan */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <CalendarBlank className="h-5 w-5 text-foreground" />
            <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
              Tu plan de 90 días
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {plan.map((item, i) => {
              const labels = ["Mes 1", "Mes 2", "Mes 3"]
              const icons = ["1", "2", "3"]
              return (
                <div
                  key={i}
                  className="relative rounded-xl bg-linear-to-br p-[1px]"
                  style={{ backgroundImage: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))` }}
                >
                  <div className="rounded-[11px] bg-white p-4 h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white bg-foreground/70">
                        {icons[i]}
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
    </section>
  )
}