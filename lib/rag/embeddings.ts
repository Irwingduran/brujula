import OpenAI from "openai"

const EMBEDDING_MODEL = "text-embedding-3-small"
const EMBEDDING_DIMENSIONS = 1536

let _client: OpenAI | null = null

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _client
}

const pendingRequests: Promise<number[]>[] = []
let lastRequestTime = 0
const MIN_INTERVAL_MS = 100

async function throttledEmbed(texto: string): Promise<number[]> {
  const now = Date.now()
  const timeSinceLast = now - lastRequestTime
  if (timeSinceLast < MIN_INTERVAL_MS) {
    await new Promise((r) => setTimeout(r, MIN_INTERVAL_MS - timeSinceLast))
  }

  lastRequestTime = Date.now()
  const client = getClient()
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texto,
  })

  const vector = response.data[0].embedding
  if (vector.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Embedding con dimensión inesperada: ${vector.length} (se esperaba ${EMBEDDING_DIMENSIONS})`
    )
  }
  return vector
}

export async function embed(texto: string): Promise<number[]> {
  return throttledEmbed(texto)
}

export async function embedBatch(textos: string[]): Promise<number[][]> {
  const client = getClient()
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: textos,
  })

  return response.data
    .sort((a, b) => a.index - b.index)
    .map((item) => {
      if (item.embedding.length !== EMBEDDING_DIMENSIONS) {
        throw new Error(
          `Embedding con dimensión inesperada: ${item.embedding.length} (se esperaba ${EMBEDDING_DIMENSIONS})`
        )
      }
      return item.embedding
    })
}

export function toPgVectorLiteral(vector: number[]): string {
  return `[${vector.join(",")}]`
}
