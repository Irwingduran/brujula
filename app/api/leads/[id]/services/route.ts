import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
    }

    const services = await prisma.leadService.findMany({
      where: { lead_id: id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
            short_description: true,
            long_description: true,
            category: true,
            price_monthly: true,
            price_setup: true,
            timeline: true,
            deliverables: true,
            roi_estimate: true,
            featured: true,
          },
        },
      },
      orderBy: { assigned_at: "desc" },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error al obtener servicios del lead:", error)
    return NextResponse.json(
      { error: "Error al obtener servicios" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { service_ids, assigned_by } = body

    if (!service_ids || !Array.isArray(service_ids) || service_ids.length === 0) {
      return NextResponse.json(
        { error: "Se requiere al menos un service_id" },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
    }

    const result = await prisma.$transaction(
      service_ids.map((service_id: string) =>
        prisma.leadService.upsert({
          where: {
            lead_id_service_id: { lead_id: id, service_id },
          },
          update: {
            assigned_by: assigned_by || "admin",
            status: "suggested",
          },
          create: {
            lead_id: id,
            service_id,
            assigned_by: assigned_by || "admin",
            status: "suggested",
          },
        })
      )
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error al asignar servicios al lead:", error)
    return NextResponse.json(
      { error: "Error al asignar servicios" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { service_id, status, notes } = body

    if (!service_id) {
      return NextResponse.json(
        { error: "Se requiere service_id" },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No hay campos para actualizar" },
        { status: 400 }
      )
    }

    const leadService = await prisma.leadService.update({
      where: {
        lead_id_service_id: { lead_id: id, service_id },
      },
      data: updateData,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            price_monthly: true,
            timeline: true,
          },
        },
      },
    })

    return NextResponse.json(leadService)
  } catch (error) {
    console.error("Error al actualizar servicio del lead:", error)
    return NextResponse.json(
      { error: "Error al actualizar servicio" },
      { status: 500 }
    )
  }
}
