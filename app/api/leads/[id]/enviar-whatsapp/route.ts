import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendDiagnosisViaWhatsApp } from "@/lib/whatsapp"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
    }

    if (!lead.telefono) {
      return NextResponse.json({ error: "El lead no tiene teléfono registrado" }, { status: 400 })
    }

    const isV2 = lead.pipeline_version === "v2"
    let diagnostico_texto = ""

    if (isV2 && lead.diagnostico_v2) {
      const v2 = lead.diagnostico_v2 as { redaccion: { resumen: string } }
      diagnostico_texto = v2.redaccion?.resumen || ""
    } else {
      const legacy = lead.diagnostico as { diagnostico_texto?: string; descripcion?: string } | null
      const legacyIA = lead.diagnostico_ia as { diagnostico_texto?: string } | null
      diagnostico_texto = legacyIA?.diagnostico_texto ?? legacy?.diagnostico_texto ?? legacy?.descripcion ?? ""
    }

    const scoreData = lead.score as { total: number } | null
    const score_total = scoreData?.total ?? 0

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    const result = await sendDiagnosisViaWhatsApp({
      nombre: lead.nombre,
      telefono: lead.telefono,
      diagnostico_texto,
      score_total,
      segmento: lead.segmento,
      url_resultado: `${baseUrl}/resultado/${lead.id}`,
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error || "Error al enviar WhatsApp" }, { status: 500 })
    }

    const ahora = new Date()
    await prisma.lead.update({
      where: { id },
      data: { propuesta_enviada_at: ahora },
    })

    return NextResponse.json({
      success: true,
      enviado_at: ahora.toISOString(),
      telefono: lead.telefono,
    })
  } catch (error) {
    console.error("Error en enviar-whatsapp:", error)
    return NextResponse.json(
      { error: "No pudimos enviar el mensaje. Intenta de nuevo." },
      { status: 500 },
    )
  }
}
