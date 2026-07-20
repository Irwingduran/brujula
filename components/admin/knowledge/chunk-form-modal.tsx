"use client"

import { useState } from "react"

interface ChunkFormModalProps {
  chunk?: { id: string; contenido: string; industria: string; segmento: string | null; tipo: string; activo: boolean } | null
  onClose: () => void
  onSaved: () => void
}

const INDUSTRIES = [
  "retail", "servicios_profesionales", "restaurante", "salud",
  "inmobiliaria", "logistica", "generico",
]

const TIPOS = ["sintoma", "accion", "benchmark", "historia", "pregunta_guia"]

export function ChunkFormModal({ chunk, onClose, onSaved }: ChunkFormModalProps) {
  const [contenido, setContenido] = useState(chunk?.contenido ?? "")
  const [industria, setIndustria] = useState(chunk?.industria ?? "retail")
  const [segmento, setSegmento] = useState(chunk?.segmento ?? "")
  const [tipo, setTipo] = useState(chunk?.tipo ?? "sintoma")
  const [activo, setActivo] = useState(chunk?.activo ?? true)
  const [saving, setSaving] = useState(false)

  const isEdit = !!chunk

  const handleSave = async () => {
    if (!contenido.trim()) return
    setSaving(true)
    try {
      if (isEdit) {
        await fetch(`/api/admin/knowledge/chunks/${chunk.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contenido, activo }),
        })
      } else {
        await fetch("/api/admin/knowledge/chunks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contenido, industria, segmento: segmento || null, tipo }),
        })
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-card border border-border p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold text-foreground">{isEdit ? "Editar chunk" : "Nuevo chunk"}</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Contenido</label>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Texto del chunk..."
            />
          </div>
          {!isEdit && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Industria</label>
                <select value={industria} onChange={(e) => setIndustria(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tipo</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}
          {!isEdit && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Segmento (opcional)</label>
              <input value={segmento} onChange={(e) => setSegmento(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Ej: pequena_retail" />
            </div>
          )}
          {isEdit && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="rounded" />
              <span className="text-muted-foreground">Activo</span>
            </label>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={saving || !contenido.trim()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {saving ? "Guardando..." : isEdit ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  )
}
