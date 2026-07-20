"use client"

import { useState } from "react"

const INDUSTRIES = [
  "retail", "servicios_profesionales", "restaurante", "salud",
  "inmobiliaria", "logistica",
]

interface RetrievalResult {
  chunks: {
    id: string
    contenido: string
    tipo: string
    fuente: string
    distancia: number
    similitud: number
  }[]
  promptGuidance: string
  elapsed: number
  total: number
}

const TIPO_BADGES: Record<string, string> = {
  sintoma: "bg-rose-100 text-rose-700",
  accion: "bg-blue-100 text-blue-700",
  benchmark: "bg-emerald-100 text-emerald-700",
  historia: "bg-amber-100 text-amber-700",
  pregunta_guia: "bg-purple-100 text-purple-700",
}

export function RetrievalTester() {
  const [query, setQuery] = useState("")
  const [industria, setIndustria] = useState("restaurante")
  const [topK, setTopK] = useState(6)
  const [result, setResult] = useState<RetrievalResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  const handleTest = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/admin/knowledge/test-retrieval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, industria, topK }),
      })
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Probar retrieval</h3>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTest()}
            placeholder="Escribe una query de diagnóstico..."
            className="flex-1 min-w-[300px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <select value={industria} onChange={(e) => setIndustria(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <select value={topK} onChange={(e) => setTopK(Number(e.target.value))} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {[3, 5, 6, 8, 10].map((n) => <option key={n} value={n}>Top {n}</option>)}
          </select>
          <button onClick={handleTest} disabled={loading || !query.trim()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {loading ? "Buscando..." : "Probar"}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Resultados ({result.total} chunks, {result.elapsed}ms)
              </h3>
              <button onClick={() => setShowPrompt(!showPrompt)} className="text-xs text-primary hover:underline">
                {showPrompt ? "Ocultar prompt" : "Ver prompt generado"}
              </button>
            </div>
            <div className="space-y-3">
              {result.chunks.map((chunk, i) => (
                <div key={chunk.id} className="flex items-start gap-3 rounded-lg border border-border/30 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed">{chunk.contenido}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${TIPO_BADGES[chunk.tipo] ?? "bg-muted"}`}>
                        {chunk.tipo}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{chunk.fuente}</span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    {chunk.similitud}
                  </span>
                </div>
              ))}
              {result.chunks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Sin resultados para esta query</p>
              )}
            </div>
          </div>

          {showPrompt && (
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Prompt Guidance generado</h3>
              <pre className="whitespace-pre-wrap rounded-lg bg-muted/30 p-4 text-xs text-foreground leading-relaxed font-mono">
                {result.promptGuidance || "(vacío)"}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}
