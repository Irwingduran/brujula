"use client"

import { useState } from "react"
import useSWR from "swr"
import { ChunkFormModal } from "./chunk-form-modal"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Chunk {
  id: string
  contenido: string
  industria: string
  segmento: string | null
  tipo: string
  fuente: string
  activo: boolean
  creadoEn: string
}

interface ChunksResponse {
  chunks: Chunk[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const INDUSTRIES = [
  { value: "", label: "Todas" },
  { value: "retail", label: "Retail" },
  { value: "servicios_profesionales", label: "Servicios Profesionales" },
  { value: "restaurante", label: "Restaurante" },
  { value: "salud", label: "Salud" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
  { value: "logistica", label: "Logística" },
  { value: "generico", label: "Genérico" },
]

const TIPOS = [
  { value: "", label: "Todos" },
  { value: "sintoma", label: "Síntoma" },
  { value: "accion", label: "Acción" },
  { value: "benchmark", label: "Benchmark" },
  { value: "historia", label: "Historia" },
  { value: "pregunta_guia", label: "Pregunta guía" },
]

const FUENTES = [
  { value: "", label: "Todas" },
  { value: "knowledge_pack", label: "Knowledge Pack" },
  { value: "generico", label: "Genérico" },
  { value: "auto_generado", label: "Auto-generado" },
  { value: "manual", label: "Manual" },
]

const TIPO_BADGES: Record<string, string> = {
  sintoma: "bg-rose-100 text-rose-700",
  accion: "bg-blue-100 text-blue-700",
  benchmark: "bg-emerald-100 text-emerald-700",
  historia: "bg-amber-100 text-amber-700",
  pregunta_guia: "bg-purple-100 text-purple-700",
}

export function ChunksTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [industria, setIndustria] = useState("")
  const [tipo, setTipo] = useState("")
  const [fuente, setFuente] = useState("")
  const [editing, setEditing] = useState<Chunk | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const params = new URLSearchParams({ page: String(page) })
  if (search) params.set("search", search)
  if (industria) params.set("industria", industria)
  if (tipo) params.set("tipo", tipo)
  if (fuente) params.set("fuente", fuente)

  const { data, isLoading, mutate } = useSWR<ChunksResponse>(
    `/api/admin/knowledge/chunks?${params}`,
    fetcher,
    { keepPreviousData: true }
  )

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este chunk?")) return
    await fetch(`/api/admin/knowledge/chunks/${id}`, { method: "DELETE" })
    mutate()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Buscar contenido..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm w-64"
        />
        <select value={industria} onChange={(e) => { setIndustria(e.target.value); setPage(1) }} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          {INDUSTRIES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
        </select>
        <select value={tipo} onChange={(e) => { setTipo(e.target.value); setPage(1) }} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select value={fuente} onChange={(e) => { setFuente(e.target.value); setPage(1) }} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          {FUENTES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <button onClick={() => setShowCreate(true)} className="ml-auto rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          + Nuevo
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Contenido</th>
              <th className="px-4 py-3 w-32">Industria</th>
              <th className="px-4 py-3 w-24">Tipo</th>
              <th className="px-4 py-3 w-24">Fuente</th>
              <th className="px-4 py-3 w-20">Estado</th>
              <th className="px-4 py-3 w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Cargando...</td></tr>
            ) : data?.chunks.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Sin resultados</td></tr>
            ) : (
              data?.chunks.map((chunk) => (
                <tr key={chunk.id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="px-4 py-3 max-w-md truncate text-foreground">{chunk.contenido}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{chunk.industria}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${TIPO_BADGES[chunk.tipo] ?? "bg-muted text-muted-foreground"}`}>
                      {chunk.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{chunk.fuente}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block h-2 w-2 rounded-full ${chunk.activo ? "bg-emerald-500" : "bg-red-400"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(chunk)} className="text-xs text-primary hover:underline">Editar</button>
                      <button onClick={() => handleDelete(chunk.id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Mostrando {(data.page - 1) * data.pageSize + 1}-{Math.min(data.page * data.pageSize, data.total)} de {data.total}</span>
          <div className="flex gap-1">
            <button disabled={data.page <= 1} onClick={() => setPage(data.page - 1)} className="rounded px-2 py-1 hover:bg-muted disabled:opacity-30">←</button>
            {Array.from({ length: Math.min(data.totalPages, 7) }, (_, i) => {
              const p = data.page <= 4 ? i + 1 : data.page + i - 3
              if (p < 1 || p > data.totalPages) return null
              return (
                <button key={p} onClick={() => setPage(p)} className={`rounded px-2 py-1 ${p === data.page ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{p}</button>
              )
            })}
            <button disabled={data.page >= data.totalPages} onClick={() => setPage(data.page + 1)} className="rounded px-2 py-1 hover:bg-muted disabled:opacity-30">→</button>
          </div>
        </div>
      )}

      {/* Modals */}
      {(showCreate || editing) && (
        <ChunkFormModal
          chunk={editing}
          onClose={() => { setShowCreate(false); setEditing(null) }}
          onSaved={() => { setShowCreate(false); setEditing(null); mutate() }}
        />
      )}
    </div>
  )
}
