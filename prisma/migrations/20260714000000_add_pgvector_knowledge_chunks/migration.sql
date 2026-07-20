-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "industria" TEXT NOT NULL,
    "segmento" TEXT,
    "tipo" TEXT NOT NULL,
    "fuente" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeChunk_industria_segmento_tipo_idx" ON "KnowledgeChunk"("industria", "segmento", "tipo");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_activo_idx" ON "KnowledgeChunk"("activo");
