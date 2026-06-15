-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "long_description" TEXT NOT NULL DEFAULT '',
    "industries" TEXT[],
    "category" TEXT NOT NULL,
    "pain_points" TEXT[],
    "tags" TEXT[],
    "price_monthly" TEXT,
    "price_setup" TEXT,
    "timeline" TEXT,
    "deliverables" TEXT[],
    "roi_estimate" TEXT,
    "case_study_title" TEXT,
    "case_study_text" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadService" (
    "lead_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" TEXT NOT NULL DEFAULT 'pipeline',
    "status" TEXT NOT NULL DEFAULT 'suggested',
    "notes" TEXT,

    CONSTRAINT "LeadService_pkey" PRIMARY KEY ("lead_id","service_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- AddForeignKey
ALTER TABLE "LeadService" ADD CONSTRAINT "LeadService_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadService" ADD CONSTRAINT "LeadService_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
