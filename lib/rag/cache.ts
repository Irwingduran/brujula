const TTL_MS = 5 * 60 * 1000 // 5 minutos
const MAX_ENTRIES = 500

interface CacheEntry {
  vector: number[]
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

function normalize(texto: string): string {
  return texto.trim().toLowerCase()
}

export function getCachedEmbedding(texto: string): number[] | null {
  const key = normalize(texto)
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.vector
}

export function setCachedEmbedding(texto: string, vector: number[]): void {
  const key = normalize(texto)

  if (cache.size >= MAX_ENTRIES) {
    const oldest = cache.keys().next().value
    if (oldest) cache.delete(oldest)
  }

  cache.set(key, { vector, expiresAt: Date.now() + TTL_MS })
}

export function embeddingCacheStats() {
  return { size: cache.size, maxEntries: MAX_ENTRIES, ttlMs: TTL_MS }
}
