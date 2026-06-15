"use client"

import { useCallback, useState } from "react"
import { MagnifyingGlass, CaretDown, CaretUp, Pencil, Trash, Plus } from "@phosphor-icons/react"
import type { Service } from "@prisma/client"
import { SERVICE_CATEGORIES, type ServiceCategory } from "@/lib/servicios/catalog"
import { ServiceFormModal, type ServiceFormData } from "@/components/admin/service-form-modal"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type ServiceWithCount = Service & { _count: { leads: number } }

const CATEGORY_LABELS: Record<string, string> = {}
for (const [key, val] of Object.entries(SERVICE_CATEGORIES)) {
  CATEGORY_LABELS[key] = val.label
}

const INDUSTRY_LABELS: Record<string, string> = {
  restaurante: "Restaurante",
  retail: "Retail",
  servicios_profesionales: "Servicios Profesionales",
  salud: "Salud",
  educacion: "Educación",
  inmobiliaria: "Inmobiliaria",
  tecnologia: "Tecnología",
  manufactura: "Manufactura",
  logistica: "Logística",
  otra: "Otra",
}

function ServiceCategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    ventas: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    automatizacion: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
    atencion: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    presencia_digital: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    datos_analytics: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    fidelizacion: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    operaciones: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
    marketing: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  }

  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[category] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400"}`}>
      {CATEGORY_LABELS[category] || category}
    </span>
  )
}

function serviceToFormData(svc: ServiceWithCount): ServiceFormData {
  return {
    id: svc.id,
    name: svc.name,
    slug: svc.slug,
    short_description: svc.short_description,
    long_description: svc.long_description,
    industries: svc.industries,
    category: svc.category,
    pain_points: svc.pain_points,
    tags: svc.tags,
    price_monthly: svc.price_monthly || "",
    price_setup: svc.price_setup || "",
    timeline: svc.timeline || "",
    deliverables: svc.deliverables,
    roi_estimate: svc.roi_estimate || "",
    case_study_title: svc.case_study_title || "",
    case_study_text: svc.case_study_text || "",
    active: svc.active,
    featured: svc.featured,
    sort_order: svc.sort_order,
  }
}

export function ServicesTable({ services: initialServices }: { services: ServiceWithCount[] }) {
  const [services, setServices] = useState(initialServices)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [industryFilter, setIndustryFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("sort_order")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const [editTarget, setEditTarget] = useState<ServiceWithCount | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ServiceWithCount | null>(null)
  const [deleting, setDeleting] = useState(false)

  const allIndustries = [...new Set(services.flatMap((s) => s.industries))].sort()

  const filtered = services.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.short_description.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter !== "all" && s.category !== categoryFilter) return false
    if (industryFilter !== "all" && !s.industries.includes(industryFilter)) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0
    if (sortField === "name") cmp = a.name.localeCompare(b.name)
    else if (sortField === "category") cmp = a.category.localeCompare(b.category)
    else if (sortField === "leads") cmp = a._count.leads - b._count.leads
    else if (sortField === "active") cmp = Number(b.active) - Number(a.active)
    else cmp = a.sort_order - b.sort_order
    return sortDir === "asc" ? cmp : -cmp
  })

  function toggleSort(field: string) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortField(field); setSortDir("asc") }
  }

  function SortIcon({ field }: { field: string }) {
    if (sortField !== field) return null
    return sortDir === "asc" ? <CaretUp className="inline h-3 w-3" /> : <CaretDown className="inline h-3 w-3" />
  }

  const refresh = useCallback(async () => {
    const res = await fetch("/api/services")
    if (res.ok) {
      const data = await res.json()
      setServices(data)
    }
  }, [])

  function handleSave() {
    refresh()
    setEditTarget(null)
    setShowNewModal(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/services/${deleteTarget.id}`, { method: "DELETE" })
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id))
        setDeleteTarget(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Todas las categorías</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Todas las industrias</option>
            {allIndustries.map((ind) => (
              <option key={ind} value={ind}>{INDUSTRY_LABELS[ind] || ind}</option>
            ))}
          </select>

          <Button onClick={() => setShowNewModal(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Nuevo servicio
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("sort_order")}>
                  # <SortIcon field="sort_order" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  Servicio <SortIcon field="name" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("category")}>
                  Categoría <SortIcon field="category" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Industrias
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Precio
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Timeline
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("active")}>
                  Activo <SortIcon field="active" />
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("leads")}>
                  Leads <SortIcon field="leads" />
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron servicios con esos filtros.
                  </td>
                </tr>
              ) : (
                sorted.map((svc) => (
                  <tr key={svc.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{svc.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{svc.name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{svc.short_description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <ServiceCategoryBadge category={svc.category} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {svc.industries.map((ind) => (
                          <span key={ind} className="inline-block rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            {INDUSTRY_LABELS[ind] || ind}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{svc.price_monthly || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{svc.timeline || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block h-2 w-2 rounded-full ${svc.active ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"}`} />
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-muted-foreground">{svc._count.leads}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditTarget(svc)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(svc)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                          title="Eliminar"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">
          Mostrando {sorted.length} de {services.length} servicios
        </p>
      </div>

      {editTarget && (
        <ServiceFormModal
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
          initial={serviceToFormData(editTarget)}
        />
      )}

      {showNewModal && (
        <ServiceFormModal
          open={showNewModal}
          onClose={() => setShowNewModal(false)}
          onSave={handleSave}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar servicio</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar <strong>{deleteTarget?.name}</strong>? Esta acción no se puede deshacer. Los leads que tengan este servicio asignado podrían verse afectados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting && <Spinner className="mr-2 h-4 w-4" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
