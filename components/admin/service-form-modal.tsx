"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { SERVICE_CATEGORIES, type ServiceCategory } from "@/lib/servicios/catalog"

const INDUSTRIES = [
  { value: "restaurante", label: "Restaurante" },
  { value: "retail", label: "Retail" },
  { value: "servicios_profesionales", label: "Servicios Profesionales" },
  { value: "salud", label: "Salud" },
  { value: "educacion", label: "Educación" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
  { value: "tecnologia", label: "Tecnología" },
  { value: "manufactura", label: "Manufactura" },
  { value: "logistica", label: "Logística" },
  { value: "otra", label: "Otra" },
]

const COMMON_PAIN_POINTS = [
  "atencion_cliente",
  "ventas_estancadas",
  "procesos_manuales",
  "falta_visibilidad",
  "baja_retencion",
  "sin_datos",
  "competencia_digital",
]

const PAIN_POINT_LABELS: Record<string, string> = {
  atencion_cliente: "Atención al cliente",
  ventas_estancadas: "Ventas estancadas",
  procesos_manuales: "Procesos manuales",
  falta_visibilidad: "Falta visibilidad digital",
  baja_retencion: "Baja retención",
  sin_datos: "Sin datos",
  competencia_digital: "Competencia digital",
}

export interface ServiceFormData {
  id?: string
  name: string
  slug: string
  short_description: string
  long_description: string
  industries: string[]
  category: string
  pain_points: string[]
  tags: string[]
  price_monthly: string
  price_setup: string
  timeline: string
  deliverables: string[]
  roi_estimate: string
  case_study_title: string
  case_study_text: string
  active: boolean
  featured: boolean
  sort_order: number
}

const EMPTY_FORM: ServiceFormData = {
  name: "",
  slug: "",
  short_description: "",
  long_description: "",
  industries: [],
  category: "ventas",
  pain_points: [],
  tags: [],
  price_monthly: "",
  price_setup: "",
  timeline: "",
  deliverables: [],
  roi_estimate: "",
  case_study_title: "",
  case_study_text: "",
  active: true,
  featured: false,
  sort_order: 0,
}

interface ServiceFormModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  initial?: ServiceFormData | null
}

export function ServiceFormModal({ open, onClose, onSave, initial }: ServiceFormModalProps) {
  const [form, setForm] = useState<ServiceFormData>(initial ?? EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const isEditing = !!initial

  function update<K extends keyof ServiceFormData>(key: K, value: ServiceFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleArrayItem(key: "industries" | "pain_points" | "tags", value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }))
  }

  function toggleDeliverable(value: string) {
    setForm((prev) => ({
      ...prev,
      deliverables: prev.deliverables.includes(value)
        ? prev.deliverables.filter((v) => v !== value)
        : [...prev.deliverables, value],
    }))
  }

  async function handleSubmit() {
    setSaving(true)
    setError("")
    try {
      const url = isEditing ? `/api/services/${form.id}` : "/api/services"
      const method = isEditing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al guardar")
      }
      onSave()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modifica los datos del servicio" : "Completa los datos para crear un nuevo servicio"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nombre</label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ej: Agente AI para WhatsApp" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Slug</label>
              <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="Ej: agente-ai-whatsapp" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Descripción corta</label>
            <Input value={form.short_description} onChange={(e) => update("short_description", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Descripción larga</label>
            <Textarea value={form.long_description} onChange={(e) => update("long_description", e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {Object.entries(SERVICE_CATEGORIES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Timeline</label>
              <Input value={form.timeline} onChange={(e) => update("timeline", e.target.value)} placeholder="Ej: 2-3 semanas" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Precio mensual</label>
              <Input value={form.price_monthly} onChange={(e) => update("price_monthly", e.target.value)} placeholder="Ej: $350 - $700 USD/mes" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Precio setup</label>
              <Input value={form.price_setup} onChange={(e) => update("price_setup", e.target.value)} placeholder="Ej: $500 USD" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">ROI estimado</label>
            <Input value={form.roi_estimate} onChange={(e) => update("roi_estimate", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Industrias</label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind.value}
                  type="button"
                  onClick={() => toggleArrayItem("industries", ind.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    form.industries.includes(ind.value)
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Pain Points</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_PAIN_POINTS.map((pp) => (
                <button
                  key={pp}
                  type="button"
                  onClick={() => toggleArrayItem("pain_points", pp)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    form.pain_points.includes(pp)
                      ? "bg-amber-100 dark:bg-amber-900/30 border-amber-500 text-amber-800 dark:text-amber-400"
                      : "bg-muted border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {PAIN_POINT_LABELS[pp] || pp}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Deliverables</label>
            <Textarea
              value={form.deliverables.join("\n")}
              onChange={(e) => update("deliverables", e.target.value.split("\n").filter(Boolean))}
              placeholder="Un deliverable por línea"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Caso de estudio (título)</label>
              <Input value={form.case_study_title} onChange={(e) => update("case_study_title", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Caso de estudio (texto)</label>
              <Input value={form.case_study_text} onChange={(e) => update("case_study_text", e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tags (separados por coma)</label>
            <Input
              value={form.tags.join(", ")}
              onChange={(e) => update("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              placeholder="Ej: whatsapp, ia, chatbot"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Orden</label>
              <Input type="number" value={form.sort_order} onChange={(e) => update("sort_order", Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={form.active} onCheckedChange={(v) => update("active", v)} />
              <span className="text-sm">Activo</span>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={form.featured} onCheckedChange={(v) => update("featured", v)} />
              <span className="text-sm">Destacado</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Spinner className="mr-2 h-4 w-4" />}
            {isEditing ? "Guardar cambios" : "Crear servicio"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
