"use client"

import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Chunk {
  id: string
  contenido: string
  industria: string
  tipo: string
  fuente: string
  creadoEn: string
}

export function ReviewQueue() {
  const { data, isLoading, mutate } = useSWR<{ chunks: Chunk[] }>(
    "/api/admin/knowledge/chunks?fuente=auto_generado",
    fetcher
  )
  const [processing, setProcessing] = useState<string | null>(null)

  const handleReview = async (id: string, aprobado: boolean) => {
    setProcessing(id)
    try {
      await fetch(`/api/admin/knowledge/review/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aprobado }),
      })
      mutate()
    } finally {
      setProcessing(null)
    }
  }

  const chunks = data?.chunks ?? []

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-muted/30" />
        ))}
      </div>
    )
  }

  if (chunks.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">No hay chunks pendientes de revisión</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Los chunks auto-generados aparecerán aquí cuando el loop de auto-mejora esté activo
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {chunks.map((chunk) => (
        <div key={chunk.id} className="rounded-xl border border-border/50 bg-card p-4">
          <p className="text-sm text-foreground leading-relaxed">{chunk.contenido}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{chunk.industria}</span>
            <span>·</span>
            <span>{chunk.tipo}</span>
            <span>·</span>
            <span>{new Date(chunk.creadoEn).toLocaleDateString("es-MX")}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleReview(chunk.id, true)}
              disabled={processing === chunk.id}
              className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 transition-colors"
            >
              Aprobar
            </button>
            <button
              onClick={() => handleReview(chunk.id, false)}
              disabled={processing === chunk.id}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
            >
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
