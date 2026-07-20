/**
 * Script de reindexación — Prioridad 1
 *
 * Toma el contenido que YA existe en el código (fallback pre-escrito +
 * Knowledge Packs de servicios_profesionales y retail) y lo convierte en
 * filas de KnowledgeChunk con su embedding.
 *
 * Uso: npx tsx scripts/rag/reindex-knowledge.ts
 *
 * IMPORTANTE: este script asume que tienes en tu código dos fuentes con esta forma:
 *   - fallbackContent: { [nivel: string]: { industria: string; tipo: string; texto: string }[] }
 *   - knowledgePacks: { [industria: string]: { sintomas: string[]; acciones: string[];
 *                       benchmarks: string[]; historias: string[] } }
 * Ajusta los imports de abajo a la ubicación real de esos objetos en tu repo.
 */
import { PrismaClient } from "@prisma/client";
import { embed, toPgVectorLiteral } from "../../lib/rag/embeddings";

// TODO: ajustar a la ruta real donde vive tu contenido de fallback y tus Knowledge Packs
// import { fallbackContent } from "../src/content/fallback";
// import { knowledgePacks } from "../src/content/knowledge-packs";

const prisma = new PrismaClient();

interface ChunkCandidato {
  contenido: string;
  industria: string;
  segmento: string | null;
  tipo: string;
  fuente: "fallback" | "knowledge_pack";
}

function construirCandidatosDesdeFallback(fallbackContent: any): ChunkCandidato[] {
  const candidatos: ChunkCandidato[] = [];
  for (const [, items] of Object.entries<any>(fallbackContent)) {
    for (const item of items) {
      candidatos.push({
        contenido: item.texto,
        industria: item.industria,
        segmento: item.segmento ?? null,
        tipo: item.tipo,
        fuente: "fallback",
      });
    }
  }
  return candidatos;
}

function construirCandidatosDesdePacks(knowledgePacks: any): ChunkCandidato[] {
  const candidatos: ChunkCandidato[] = [];
  const tiposPorCampo: Record<string, string> = {
    sintomas: "sintoma",
    acciones: "accion",
    benchmarks: "benchmark",
    historias: "historia",
  };

  for (const [industria, pack] of Object.entries<any>(knowledgePacks)) {
    for (const [campo, tipo] of Object.entries(tiposPorCampo)) {
      const items: string[] = pack[campo] ?? [];
      for (const texto of items) {
        candidatos.push({
          contenido: texto,
          industria,
          segmento: null,
          tipo,
          fuente: "knowledge_pack",
        });
      }
    }
  }
  return candidatos;
}

async function insertarChunk(candidato: ChunkCandidato) {
  const vector = await embed(candidato.contenido);
  const literal = toPgVectorLiteral(vector);

  await prisma.$executeRawUnsafe(
    `INSERT INTO "KnowledgeChunk"
      ("id", "contenido", "embedding", "industria", "segmento", "tipo", "fuente", "activo")
     VALUES
      (gen_random_uuid()::text, $1, $2::vector, $3, $4, $5, $6, true)`,
    candidato.contenido,
    literal,
    candidato.industria,
    candidato.segmento,
    candidato.tipo,
    candidato.fuente
  );
}

async function main() {
  // TODO: descomentar tras ajustar los imports de arriba
  // const candidatos = [
  //   ...construirCandidatosDesdeFallback(fallbackContent),
  //   ...construirCandidatosDesdePacks(knowledgePacks),
  // ];

  const candidatos: ChunkCandidato[] = []; // placeholder hasta conectar las fuentes reales

  console.log(`Reindexando ${candidatos.length} chunks...`);

  let ok = 0;
  let fallidos = 0;

  for (const candidato of candidatos) {
    try {
      await insertarChunk(candidato);
      ok++;
    } catch (err) {
      fallidos++;
      console.error(`Error indexando chunk de industria ${candidato.industria}:`, err);
    }
    // Pequeño respiro para no saturar el rate limit de embeddings
    await new Promise((r) => setTimeout(r, 50));
  }

  console.log(`Listo. ${ok} chunks insertados, ${fallidos} fallidos.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
