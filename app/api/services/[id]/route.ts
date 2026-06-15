import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await prisma.service.findUnique({ where: { id } })
    if (!service) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })
    }
    return NextResponse.json(service)
  } catch (error) {
    console.error("Error al obtener servicio:", error)
    return NextResponse.json({ error: "Error al obtener servicio" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        short_description: body.short_description,
        long_description: body.long_description || "",
        industries: body.industries || [],
        category: body.category,
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

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error al actualizar servicio:", error)
    return NextResponse.json({ error: "Error al actualizar servicio" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })
    }

    await prisma.service.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar servicio:", error)
    return NextResponse.json({ error: "Error al eliminar servicio" }, { status: 500 })
  }
}
