"use client"

import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface CoverageData {
  total: number
  pendientesRevision: number
  porIndustria: { industria: string; total: number }[]
  porTipo: { tipo: string; total: number }[]
  porFuente: { fuente: string; total: number }[]
}

const INDUSTRY_LABELS: Record<string, string> = {
  retail: "Retail / Tienda",
  servicios_profesionales: "Servicios Profesionales",
  restaurante: "Restaurante / Alimentos",
  salud: "Salud / Bienestar",
  inmobiliaria: "Inmobiliaria",
  logistica: "Logística / Transporte",
  generico: "Genérico (transversal)",
}

const TIPO_LABELS: Record<string, string> = {
  sintoma: "Síntomas",
  accion: "Acciones",
  benchmark: "Benchmarks",
  historia: "Historias",
  pregunta_guia: "Preguntas guía",
}

const FUENTE_LABELS: Record<string, string> = {
  knowledge_pack: "Knowledge Pack",
  generico: "Genérico",
  auto_generado: "Auto-generado",
  manual: "Manual",
}

function Bar({ value, max, color = "bg-primary" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="h-4 rounded-full bg-muted/50 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function CoverageDashboard() {
  const { data, isLoading } = useSWR<CoverageData>("/api/admin/knowledge/coverage", fetcher, {
    refreshInterval: 30000,
  })

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/30" />
        ))}
      </div>
    )
  }

  const maxIndustria = Math.max(...data.porIndustria.map((r) => r.total), 1)

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Link href="/admin/knowledge/chunks" className="rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-colors">
          <p className="text-2xl font-bold text-foreground">{data.total}</p>
          <p className="text-xs text-muted-foreground">Chunks totales</p>
        </Link>
        <Link href="/admin/knowledge/chunks" className="rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-colors">
          <p className="text-2xl font-bold text-foreground">{data.porIndustria.length}</p>
          <p className="text-xs text-muted-foreground">Industrias con cobertura</p>
        </Link>
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <p className="text-2xl font-bold text-foreground">
            {data.porIndustria.find((r) => r.industria === "generico")?.total ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Genéricos transversales</p>
        </div>
        <Link href="/admin/knowledge/review" className="rounded-xl border border-border/50 bg-card p-4 hover:border-amber-300/50 transition-colors">
          <p className="text-2xl font-bold text-foreground">{data.pendientesRevision}</p>
          <p className="text-xs text-muted-foreground">Pendientes de revisión</p>
        </Link>
      </div>

      {/* Coverage by industry */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Cobertura por industria</h3>
        <div className="space-y-3">
          {data.porIndustria
            .sort((a, b) => b.total - a.total)
            .map((r) => (
              <div key={r.industria} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-xs text-muted-foreground">
                  {INDUSTRY_LABELS[r.industria] ?? r.industria}
                </span>
                <div className="flex-1">
                  <Bar value={r.total} max={maxIndustria} />
                </div>
                <span className="w-10 text-right text-xs font-medium text-foreground">{r.total}</span>
              </div>
            ))}
        </div>
      </div>

      {/* By type + by source */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Por tipo</h3>
          <div className="flex flex-wrap gap-3">
            {data.porTipo.map((r) => (
              <span key={r.tipo} className="inline-flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-xs">
                <span className="font-medium text-foreground">{TIPO_LABELS[r.tipo] ?? r.tipo}</span>
                <span className="text-muted-foreground">{r.total}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Por fuente</h3>
          <div className="flex flex-wrap gap-3">
            {data.porFuente.map((r) => (
              <span key={r.fuente} className="inline-flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-xs">
                <span className="font-medium text-foreground">{FUENTE_LABELS[r.fuente] ?? r.fuente}</span>
                <span className="text-muted-foreground">{r.total}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
