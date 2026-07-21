-- Preserve free-form wizard inputs and store normalized evidence alongside legacy projections.
ALTER TABLE "Lead"
  ADD COLUMN "industria_otra" TEXT,
  ADD COLUMN "dolor_otro" TEXT,
  ADD COLUMN "herramienta_otra" TEXT,
  ADD COLUMN "evidencia_json" JSONB,
  ADD COLUMN "formulario_version" TEXT,
  ADD COLUMN "contexto_externo_json" JSONB;
