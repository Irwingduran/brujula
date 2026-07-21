-- AlterTable: add revisadoEn to KnowledgeChunk
ALTER TABLE "KnowledgeChunk" ADD COLUMN "revisadoEn" TIMESTAMP(3);

-- CreateIndex: index for pendientes de revisión
CREATE INDEX "KnowledgeChunk_revisadoEn_idx" ON "KnowledgeChunk"("revisadoEn");
