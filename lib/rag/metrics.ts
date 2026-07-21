const WINDOW_MS = 10 * 60 * 1000 // ventana de 10 minutos
const ALERT_THRESHOLD = 0.6 // 60% fallback rate triggers alert

interface MetricEntry {
  timestamp: number
  hit: boolean // true = RAG usado, false = fallback
  industry: string
  chunksFound: number
  durationMs: number
}

const metrics: MetricEntry[] = []

function pruneOld() {
  const cutoff = Date.now() - WINDOW_MS
  while (metrics.length > 0 && metrics[0].timestamp < cutoff) {
    metrics.shift()
  }
}

export function recordRagMetric(entry: Omit<MetricEntry, "timestamp">) {
  metrics.push({ ...entry, timestamp: Date.now() })
  pruneOld()
  checkFallbackRate()
}

function checkFallbackRate() {
  if (metrics.length < 5) return

  const fallbacks = metrics.filter((m) => !m.hit).length
  const rate = fallbacks / metrics.length

  if (rate >= ALERT_THRESHOLD) {
    console.warn(
      `[RAG-METRICS] Alerta: tasa de fallback=${(rate * 100).toFixed(0)}% ` +
      `(${fallbacks}/${metrics.length} en últimos ${WINDOW_MS / 1000}s) — posible problema en retrieval o cobertura insuficiente`
    )
  }
}

export function getRagMetrics() {
  pruneOld()
  const total = metrics.length
  const hits = metrics.filter((m) => m.hit).length
  const fallbacks = total - hits
  const avgDuration = total > 0
    ? Math.round(metrics.reduce((sum, m) => sum + m.durationMs, 0) / total)
    : 0

  return { total, hits, fallbacks, fallbackRate: total > 0 ? fallbacks / total : 0, avgDurationMs: avgDuration }
}
