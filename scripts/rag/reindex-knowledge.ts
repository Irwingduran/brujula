/**
 * Script de reindexación — Prioridad 1
 *
 * Toma todos los Knowledge Packs registrados en el sistema y los convierte
 * en filas de KnowledgeChunk con su embedding en la DB.
 *
 * Uso: npx tsx scripts/rag/reindex-knowledge.ts
 */
import { PrismaClient } from "@prisma/client";
import { embed, toPgVectorLiteral } from "../../lib/rag/embeddings";
import { getAllKnowledgePacks } from "../../lib/diagnostico/knowledge";

const prisma = new PrismaClient();

interface ChunkCandidato {
  contenido: string;
  industria: string;
  segmento: string | null;
  tipo: string;
  fuente: "knowledge_pack";
}

function construirCandidatos(): ChunkCandidato[] {
  const packs = getAllKnowledgePacks();
  const candidatos: ChunkCandidato[] = [];

  for (const [industria, pack] of Object.entries(packs)) {
    // Síntomas
    for (const s of pack.symptoms) {
      candidatos.push({
        contenido: `${s.nombre}. ${s.descripcion}`,
        industria,
        segmento: null,
        tipo: "sintoma",
        fuente: "knowledge_pack",
      });
    }

    // Acciones
    for (const a of pack.actions) {
      candidatos.push({
        contenido: `${a.titulo}. ${a.descripcion}`,
        industria,
        segmento: null,
        tipo: "accion",
        fuente: "knowledge_pack",
      });
    }

    // Benchmarks
    for (const b of pack.benchmarks) {
      candidatos.push({
        contenido: `${b.metrica}: ${b.valor}. ${b.descripcion}`,
        industria,
        segmento: null,
        tipo: "benchmark",
        fuente: "knowledge_pack",
      });
    }

    // Historias de éxito
    for (const h of pack.successStories) {
      candidatos.push({
        contenido: `${h.empresa}: ${h.problema} ${h.solucion} Resultado: ${h.resultado}`,
        industria,
        segmento: null,
        tipo: "historia",
        fuente: "knowledge_pack",
      });
    }

    // Prompt guidance como chunk tipo pregunta_guia
    candidatos.push({
      contenido: pack.promptGuidance,
      industria,
      segmento: null,
      tipo: "pregunta_guia",
      fuente: "knowledge_pack",
    });
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
  const candidatos = construirCandidatos();
  console.log(`Reindexando ${candidatos.length} chunks desde ${Object.keys(getAllKnowledgePacks()).length} knowledge packs...`);

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
    // Throttle para no saturar rate limit de embeddings
    await new Promise((r) => setTimeout(r, 50));
  }

  console.log(`Listo. ${ok} chunks insertados, ${fallidos} fallidos.`);

  // Resumen por industria
  const resumen = await prisma.$queryRawUnsafe<{ industria: string; total: bigint }[]>(
    `SELECT industria, COUNT(*) as total FROM "KnowledgeChunk" WHERE activo = true GROUP BY industria ORDER BY industria`
  );
  console.log("\nCobertura por industria:");
  for (const r of resumen) {
    console.log(`  ${r.industria}: ${r.total} chunks`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
