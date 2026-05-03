-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "url_sitio" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "website_analisis" JSONB;
