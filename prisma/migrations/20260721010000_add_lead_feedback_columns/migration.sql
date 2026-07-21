-- Synchronize feedback fields already declared in the Prisma Lead model.
ALTER TABLE "Lead"
  ADD COLUMN IF NOT EXISTS "feedback_diagnostico" TEXT,
  ADD COLUMN IF NOT EXISTS "feedback_diagnostico_at" TIMESTAMP(3);
