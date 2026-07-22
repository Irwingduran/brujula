import { PrismaClient } from "@prisma/client"
import { SERVICES_CATALOG } from "../lib/servicios/catalog"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding services...")

  for (const svc of SERVICES_CATALOG) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {
        name: svc.name,
        short_description: svc.short_description,
        long_description: svc.long_description,
        industries: svc.industries,
        category: svc.category,
        pain_points: svc.pain_points,
        tags: svc.tags,
        price_monthly: svc.price_monthly,
        price_setup: svc.price_setup,
        timeline: svc.timeline,
        deliverables: svc.deliverables,
        roi_estimate: svc.roi_estimate,
        case_study_title: svc.case_study_title,
        case_study_text: svc.case_study_text,
        featured: svc.featured,
        sort_order: svc.sort_order,
      },
      create: {
        slug: svc.slug,
        name: svc.name,
        short_description: svc.short_description,
        long_description: svc.long_description,
        industries: svc.industries,
        category: svc.category,
        pain_points: svc.pain_points,
        tags: svc.tags,
        price_monthly: svc.price_monthly,
        price_setup: svc.price_setup,
        timeline: svc.timeline,
        deliverables: svc.deliverables,
        roi_estimate: svc.roi_estimate,
        case_study_title: svc.case_study_title,
        case_study_text: svc.case_study_text,
        featured: svc.featured,
        sort_order: svc.sort_order,
      },
    })

    console.log(`  ✓ ${svc.slug}`)
  }

  console.log(`\nSeeded ${SERVICES_CATALOG.length} services successfully.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
