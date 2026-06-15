"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Wrench, Check, X, SpinnerGap, Plus } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { LeadServiceStatus } from "@/lib/servicios/types"
import type { ServiceCategory } from "@/lib/servicios/catalog"
import { SERVICE_CATEGORIES } from "@/lib/servicios/catalog"

interface LeadService {
  lead_id: string
  service_id: string
  assigned_at: string
  assigned_by: string
  status: LeadServiceStatus
  notes: string | null
  service: {
    id: string
    name: string
    slug: string
    short_description: string
    category: ServiceCategory
    price_monthly: string | null
    price_setup: string | null
    timeline: string | null
    deliverables: string[]
    roi_estimate: string | null
    featured: boolean
  }
}

interface ServiceOption {
  id: string
  slug: string
  name: string
  short_description: string
  category: ServiceCategory
  industries: string[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const STATUS_COLORS: Record<LeadServiceStatus, string> = {
  suggested: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-zinc-100 text-zinc-500 dark:bg-zinc-900/30 dark:text-zinc-400",
  in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
}

const STATUS_LABELS: Record<LeadServiceStatus, string> = {
  suggested: "Sugerido",
  approved: "Aprobado",
  rejected: "Descartado",
  in_progress: "En Progreso",
  completed: "Completado",
}

function CategoryBadge({ category }: { category: string }) {
  const label = SERVICE_CATEGORIES[category as ServiceCategory]?.label || category
  return (
    <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      {label}
    </span>
  )
}

export function LeadServices({ leadId, industry }: { leadId: string; industry?: string }) {
  const { data: assigned, error, isLoading } = useSWR<LeadService[]>(
    `/api/leads/${leadId}/services`,
    fetcher,
  )

  const [showAddPanel, setShowAddPanel] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [adding, setAdding] = useState(false)

  const { data: availableServices } = useSWR<ServiceOption[]>(
    showAddPanel ? `/api/services?industry=${industry || ""}` : null,
    fetcher,
  )

  async function handleUpdateStatus(serviceId: string, status: LeadServiceStatus) {
    await fetch(`/api/leads/${leadId}/services`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: serviceId, status }),
    })
    mutate(`/api/leads/${leadId}/services`)
  }

  async function handleAssignServices() {
    if (selectedIds.length === 0) return
    setAdding(true)
    await fetch(`/api/leads/${leadId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_ids: selectedIds,
        assigned_by: "admin",
      }),
    })
    setSelectedIds([])
    setShowAddPanel(false)
    setAdding(false)
    mutate(`/api/leads/${leadId}/services`)
  }

  const alreadyAssignedIds = new Set(assigned?.map((a) => a.service_id) || [])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-center py-4">
          <SpinnerGap className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          Servicios Recomendados
        </h2>
        <button
          onClick={() => setShowAddPanel(!showAddPanel)}
          className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
        >
          <Plus className="h-3 w-3" />
          Asignar servicio
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500">Error al cargar servicios.</p>
      )}

      {assigned && assigned.length === 0 && !showAddPanel && (
        <p className="text-xs text-muted-foreground py-2">
          No hay servicios asignados. Haz clic en &quot;Asignar servicio&quot; para agregar.
        </p>
      )}

      {assigned && assigned.length > 0 && (
        <div className="flex flex-col gap-2">
          {assigned.map((ls) => (
            <div
              key={ls.service_id}
              className={cn(
                "rounded-lg border p-3 transition-colors",
                ls.status === "suggested" ? "border-blue-200 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-950/10" :
                ls.status === "approved" ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/10" :
                ls.status === "in_progress" ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10" :
                ls.status === "completed" ? "border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-950/10" :
                "border-border bg-card"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-medium text-card-foreground">
                      {ls.service.name}
                    </span>
                    <CategoryBadge category={ls.service.category} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {ls.service.short_description}
                  </p>
                  {(ls.service.price_monthly || ls.service.timeline) && (
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      {ls.service.price_monthly && <span>{ls.service.price_monthly}</span>}
                      {ls.service.timeline && <span>• {ls.service.timeline}</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={cn(
                    "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                    STATUS_COLORS[ls.status]
                  )}>
                    {STATUS_LABELS[ls.status]}
                  </span>
                  {ls.assigned_by === "pipeline" && (
                    <span className="text-[9px] text-muted-foreground">Auto-sugerido</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              {(ls.status === "suggested" || ls.status === "approved" || ls.status === "in_progress") && (
                <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-2">
                  {ls.status === "suggested" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(ls.service_id, "approved")}
                        className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                      >
                        <Check className="h-3 w-3" /> Aprobar
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(ls.service_id, "rejected")}
                        className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900/30 dark:text-zinc-400"
                      >
                        <X className="h-3 w-3" /> Descartar
                      </button>
                    </>
                  )}
                  {ls.status === "approved" && (
                    <button
                      onClick={() => handleUpdateStatus(ls.service_id, "in_progress")}
                      className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      Iniciar implementación
                    </button>
                  )}
                  {ls.status === "in_progress" && (
                    <button
                      onClick={() => handleUpdateStatus(ls.service_id, "completed")}
                      className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-[10px] font-medium text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                    >
                      <Check className="h-3 w-3" /> Marcar completado
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add panel */}
      {showAddPanel && (
        <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
          <h3 className="text-xs font-semibold text-card-foreground mb-2">Agregar servicios</h3>

          {!availableServices ? (
            <div className="flex items-center justify-center py-4">
              <SpinnerGap className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              {availableServices
                .filter((s) => !alreadyAssignedIds.has(s.id))
                .map((svc) => (
                  <label
                    key={svc.id}
                    className={cn(
                      "flex items-start gap-2 rounded px-2 py-1.5 text-xs cursor-pointer hover:bg-muted",
                      selectedIds.includes(svc.id) && "bg-primary/10"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(svc.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, svc.id])
                        } else {
                          setSelectedIds(selectedIds.filter((id) => id !== svc.id))
                        }
                      }}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-card-foreground">{svc.name}</span>
                      <CategoryBadge category={svc.category} />
                    </div>
                  </label>
                ))}

              {availableServices.filter((s) => !alreadyAssignedIds.has(s.id)).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Todos los servicios disponibles ya están asignados.
                </p>
              )}
            </div>
          )}

          {selectedIds.length > 0 && (
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="text-[10px] text-muted-foreground">
                {selectedIds.length} servicio(s) seleccionados
              </span>
              <button
                onClick={handleAssignServices}
                disabled={adding}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {adding ? "Asignando..." : "Asignar"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
