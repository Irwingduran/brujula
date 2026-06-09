-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "acciones_json" JSONB,
ADD COLUMN     "diagnostico_v2" JSONB,
ADD COLUMN     "madurez_digital" INTEGER,
ADD COLUMN     "perfil_riesgo" TEXT,
ADD COLUMN     "pipeline_duration_ms" INTEGER,
ADD COLUMN     "pipeline_version" TEXT,
ADD COLUMN     "segmento_diagnostico" TEXT,
ADD COLUMN     "sintomas_json" JSONB;
