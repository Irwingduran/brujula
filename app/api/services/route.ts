import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const service = await prisma.service.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        short_description: body.short_description,
        long_description: body.long_description || "",
        industries: body.industries || [],
        category: body.category || "general",
        pain_points: body.pain_points || [],
        tags: body.tags || [],
        price_monthly: body.price_monthly || null,
        price_setup: body.price_setup || null,
        timeline: body.timeline || null,
        deliverables: body.deliverables || [],
        roi_estimate: body.roi_estimate || null,
        case_study_title: body.case_study_title || null,
        case_study_text: body.case_study_text || null,
        active: body.active ?? true,
        featured: body.featured ?? false,
        sort_order: body.sort_order ?? 0,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Error al crear servicio:", error)
    return NextResponse.json({ error: "Error al crear servicio" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get("industry")
    const painPoint = searchParams.get("pain_point")
    const activeOnly = searchParams.get("active") !== "false"

    const where: Record<string, unknown> = {}
    if (activeOnly) where.active = true
    if (industry) where.industries = { has: industry }
    if (painPoint) where.pain_points = { has: painPoint }

    const services = await prisma.service.findMany({
      where,
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { leads: true } },
      },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error al obtener servicios:", error)
    return NextResponse.json({ error: "Error al obtener servicios" }, { status: 500 })
  }
}
