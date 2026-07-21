import { prisma } from "@/lib/prisma"
import { embed, toPgVectorLiteral } from "@/lib/rag/embeddings"
import type { DiagnosticoResult } from "@/lib/diagnostico/schemas"

const UMBRAL_DEDUPLICACION = 0.05

const PALABRAS_IDENTIFICABLES = [
  /(?<!\w)(?:Sr\.?|Sra\.?|Srita\.?|Don|Doña|Lic\.?|Ing\.?|Dr\.?|Dra\.?)\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,2}/g,
]

const PATRONES_NOMBRE_NEGOCIO = [
  /(?:negocio|empresa|estudio|despacho|consultorio|taller|local|tienda|restaurante|farmacia|clínica)\s+(?:se\s+llama?|llamado?|nombrado?|conocido?\s+como|es)\s+["'«]?[^"'.!,\n]+["'»]?/gi,
  /\b[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ.&\s-]{2,40}\s+S\.?\s?A\.?\s?(?:de\s?C\.?V\.?)?\b/g,
  /\b[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ.&\s-]{2,40}\s+S\.?\s?(?:de\s?)?R\.?L\.?\b/g,
]

function anonimizar(contenido: string, nombreNegocio?: string | null): string {
  let texto = contenido

  if (nombreNegocio) {
    const escaped = nombreNegocio.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    texto = texto.replace(new RegExp(escaped, "gi"), "[NEGOCIO]")
  }

  for (const patron of PATRONES_NOMBRE_NEGOCIO) {
    texto = texto.replace(patron, "[NEGOCIO]")
  }

  for (const patron of PALABRAS_IDENTIFICABLES) {
    texto = texto.replace(patron, "[PERSONA]")
  }

  texto = texto.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    "[EMAIL]",
  )

  texto = texto.replace(
    /(?:\+?52)?\s*(?:\(?\d{2,3}\)?\s*)?\d{3,4}[\s.-]?\d{4,6}/g,
    "[TELEFONO]",
  )

  return texto
}

function tieneDatosSensibles(texto: string): boolean {
  return [/\[NEGOCIO\]/, /\[EMAIL\]/, /\[TELEFONO\]/, /\[PERSONA\]/].some((p) =>
    p.test(texto),
  )
}

async function esDuplicado(vector: number[], industria: string): Promise<boolean> {
  const literal = toPgVectorLiteral(vector)
  const rows = await prisma.$queryRawUnsafe<{ distancia: number }[]>(
    `SELECT "embedding" <=> $1::vector AS distancia
     FROM "KnowledgeChunk"
     WHERE ("industria" = $2 OR "industria" = 'generico')
       AND "activo" = true
     ORDER BY distancia ASC
     LIMIT 1`,
    literal,
    industria,
  )
  return rows.length > 0 && rows[0].distancia < UMBRAL_DEDUPLICACION
}

interface ChunkCandidate {
  contenido: string
  industria: string
  segmento: string | null
  tipo: string
}

async function insertarSiCalifica(
  candidate: ChunkCandidate,
  nombreNegocio?: string | null,
  leadId?: string | null,
): Promise<{ insertado: boolean; razon?: string }> {
  const contenidoAnonimo = anonimizar(candidate.contenido, nombreNegocio)

  if (tieneDatosSensibles(contenidoAnonimo)) {
    return { insertado: false, razon: "datos_sensibles" }
  }

  if (contenidoAnonimo.trim().length < 50) {
    return { insertado: false, razon: "muy_corto" }
  }

  const vector = await embed(contenidoAnonimo)

  if (await esDuplicado(vector, candidate.industria)) {
    return { insertado: false, razon: "duplicado" }
  }

  const literal = toPgVectorLiteral(vector)
  await prisma.$executeRawUnsafe(
    `INSERT INTO "KnowledgeChunk"
      ("id", "contenido", "embedding", "industria", "segmento", "tipo", "fuente", "activo", "leadId")
     VALUES
      (gen_random_uuid()::text, $1, $2::vector, $3, $4, $5, 'auto_generado', false, $6)`,
    contenidoAnonimo,
    literal,
    candidate.industria,
    candidate.segmento,
    candidate.tipo,
    leadId ?? null,
  )

  return { insertado: true }
}

export async function extraerChunksDeDiagnostico(
  resultado: DiagnosticoResult,
  nombreNegocio?: string | null,
  leadId?: string | null,
): Promise<{ candidatos: number; insertados: number; rechazados: number }> {
  const industria = resultado.clasificacion.industryCode
  const segmento = resultado.clasificacion.segmento ?? null

  const candidates: ChunkCandidate[] = []

  if (resultado.redaccion.resumen.length > 50) {
    candidates.push({
      contenido: resultado.redaccion.resumen,
      industria,
      segmento,
      tipo: "historia",
    })
  }

  for (const paso of resultado.redaccion.planDeAccion) {
    if (paso.descripcion.length > 50) {
      candidates.push({
        contenido: `${paso.paso}: ${paso.descripcion}`,
        industria,
        segmento,
        tipo: "accion",
      })
    }
  }

  for (const s of resultado.sintomas) {
    if (s.evidencia.length > 50) {
      candidates.push({
        contenido: s.evidencia,
        industria,
        segmento,
        tipo: "sintoma",
      })
    }
  }

  const resultados = await Promise.allSettled(
    candidates.map((c) => insertarSiCalifica(c, nombreNegocio, leadId)),
  )

  const insertados = resultados.filter(
    (r) => r.status === "fulfilled" && r.value.insertado,
  ).length

  return { candidatos: candidates.length, insertados, rechazados: candidates.length - insertados }
}
