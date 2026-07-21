-- AlterTable: add leadId to KnowledgeChunk for provenance tracking
ALTER TABLE "KnowledgeChunk" ADD COLUMN "leadId" TEXT;

-- CreateIndex: for filtering chunks by source lead
CREATE INDEX "KnowledgeChunk_leadId_idx" ON "KnowledgeChunk"("leadId");
