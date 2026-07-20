/**
 * Job en background — loop de auto-mejora (Prioridad 3)
 *
 * No corre en el pipeline en vivo (no agrega latencia a la generación).
 * Se dispara periódicamente (cron / queue) o después de cada diagnóstico
 * aprobado, de forma asíncrona.
 *
 * Gate de dos capas (acordado en el documento de arquitectura):
 *   1. El diagnóstico debe haber pasado las 4 capas de guardrails sin flags
 *   2. Chequeo de deduplicación por similitud contra chunks existentes
 * Después: auditoría muestreada semanal (no bloqueante), no revisión previa.
 */
import { PrismaClient } from "@prisma/client";
import { embed, toPgVectorLiteral } from "../../lib/rag/embeddings";

const prisma = new PrismaClient();

const UMBRAL_DEDUPLICACION = 0.05; // distancia coseno; ajustar tras observar datos reales

interface DiagnosticoAprobado {
  contenido: string; // fragmento de la narrativa/acción a indexar (anonimizado)
  industria: string;
  segmento: string | null;
  tipo: string; // normalmente "historia" o "accion"
  paso4Guardrails: boolean; // resultado ya conocido de las 4 capas
}

async function esDuplicado(vector: number[], industria: string): Promise<boolean> {
  const literal = toPgVectorLiteral(vector);
  const rows = await prisma.$queryRawUnsafe<{ distancia: number }[]>(
    `SELECT "embedding" <=> $1::vector AS distancia
     FROM "KnowledgeChunk"
     WHERE "industria" = $2 AND "activo" = true
     ORDER BY distancia ASC
     LIMIT 1`,
    literal,
    industria
  );
  return rows.length > 0 && rows[0].distancia < UMBRAL_DEDUPLICACION;
}

/**
 * Anonimiza el contenido antes de indexar — remueve nombre de negocio,
 * datos de contacto y cualquier identificador directo. Ajustar según los
 * campos reales que puedan colarse en la narrativa generada.
 */
function anonimizar(contenido: string): string {
  // TODO: reemplazar con la lógica real de anonimización del proyecto
  // (ej. regex sobre nombres de negocio capturados en el request original,
  // no sobre el texto libre, que es más frágil)
  return contenido;
}

export async function procesarDiagnosticoParaAutoMejora(diagnostico: DiagnosticoAprobado) {
  if (!diagnostico.paso4Guardrails) {
    return { indexado: false, razon: "no_paso_guardrails" as const };
  }

  const contenidoAnonimo = anonimizar(diagnostico.contenido);
  const vector = await embed(contenidoAnonimo);

  if (await esDuplicado(vector, diagnostico.industria)) {
    return { indexado: false, razon: "duplicado" as const };
  }

  const literal = toPgVectorLiteral(vector);
  await prisma.$executeRawUnsafe(
    `INSERT INTO "KnowledgeChunk"
      ("id", "contenido", "embedding", "industria", "segmento", "tipo", "fuente", "activo")
     VALUES
      (gen_random_uuid()::text, $1, $2::vector, $3, $4, $5, 'auto_generado', true)`,
    contenidoAnonimo,
    literal,
    diagnostico.industria,
    diagnostico.segmento,
    diagnostico.tipo
  );

  return { indexado: true as const };
}

/**
 * Auditoría muestreada semanal — no bloquea el gate de entrada, solo
 * genera un reporte para revisión humana rápida. Correr como cron semanal.
 */
export async function generarMuestraAuditoriaSemanal(porcentaje = 0.1) {
  const rows = await prisma.$queryRawUnsafe<{ id: string; contenido: string; industria: string }[]>(
    `SELECT "id", "contenido", "industria"
     FROM "KnowledgeChunk"
     WHERE "fuente" = 'auto_generado'
       AND "activo" = true
       AND "creadoEn" >= NOW() - INTERVAL '7 days'
     ORDER BY RANDOM()
     LIMIT (SELECT GREATEST(1, CEIL(COUNT(*) * $1))
            FROM "KnowledgeChunk"
            WHERE "fuente" = 'auto_generado' AND "creadoEn" >= NOW() - INTERVAL '7 days')`,
    porcentaje
  );

  // TODO: enviar `rows` a donde se haga la revisión (email, Slack, dashboard interno)
  return rows;
}
