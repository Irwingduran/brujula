"use client"

import { useState, useEffect } from "react"
import { Wrench, Check, CurrencyCircleDollar, Clock, CaretRight } from "@phosphor-icons/react"
import type { LeadServiceAssignment, LeadServiceStatus } from "@/lib/servicios/types"
import type { ServiceCategory } from "@/lib/servicios/catalog"
import { SERVICE_CATEGORIES } from "@/lib/servicios/catalog"

interface LeadService {
  service: {
    name: string
    slug: string
    short_description: string
    long_description: string
    category: ServiceCategory
    price_monthly: string | null
    price_setup: string | null
    timeline: string | null
    deliverables: string[]
    roi_estimate: string | null
  }
  assigned_by: LeadServiceAssignment
  status: LeadServiceStatus
}

export function ServiciosRecomendados({ leadId }: { leadId: string }) {
  const [services, setServices] = useState<LeadService[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/leads/${leadId}/services`)
      .then((r) => r.json())
      .then((data) => {
        setServices(data.filter((s: LeadService) => s.status !== "rejected"))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [leadId])

  if (loading) return null
  if (services.length === 0) return null

  function CategoryLabel({ category }: { category: ServiceCategory }) {
    return (
      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
        {SERVICE_CATEGORIES[category]?.label || category}
      </span>
    )
  }

  return (
    <div className="rounded-xl border-2 border-accent/20 bg-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
          <Wrench className="h-5 w-5" weight="fill" />
        </div>
        <div>
          <h2 className="font-sans text-xl font-bold text-foreground">
            Soluciones para tu negocio
          </h2>
          <p className="text-sm text-muted-foreground">
            Esto es lo que podemos hacer por ti
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {services.map((ls) => {
          const svc = ls.service
          const isExpanded = expanded === svc.slug

          return (
            <div
              key={svc.slug}
              className="rounded-xl border border-border bg-card overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : svc.slug)}
                className="flex w-full items-start gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{svc.name}</h3>
                    <CategoryLabel category={svc.category} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {svc.short_description}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {svc.price_monthly && (
                      <span className="flex items-center gap-1">
                        <CurrencyCircleDollar className="h-3.5 w-3.5" />
                        {svc.price_monthly}
                      </span>
                    )}
                    {svc.timeline && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {svc.timeline}
                      </span>
                    )}
                  </div>
                </div>
                <CaretRight
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-border px-4 py-4 space-y-4 bg-muted/20">
                  <p className="text-sm text-foreground leading-relaxed">
                    {svc.long_description}
                  </p>

                  {svc.deliverables.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Incluye
                      </h4>
                      <ul className="space-y-1.5">
                        {svc.deliverables.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" weight="bold" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {svc.roi_estimate && (
                    <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                      <span className="text-xs font-bold text-accent">ROI estimado: </span>
                      <span className="text-sm text-foreground">{svc.roi_estimate}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
