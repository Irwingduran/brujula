import { prisma } from "@/lib/prisma"
import { sendHotLeadNotification } from "@/lib/email"
import { NextResponse } from "next/server"
import type { DiagnosisResult } from "@/lib/types"

// POST /api/leads/[id]/track — Registrar eventos de tracking
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { evento } = await request.json()
    // eventos posibles: "visita_propuesta" | "email_abierto"

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    }

    const updates: Record<string, unknown> = {
      ultima_actividad_at: new Date(),
      ultima_visita_at: new Date(),
    }

    if (evento === "visita_propuesta") {
      updates.visitas_propuesta = (lead.visitas_propuesta ?? 0) + 1
      updates.score_dinamico = (lead.score_dinamico ?? 0) + 15
    }
    if (evento === "email_abierto") {
      updates.emails_abiertos = (lead.emails_abiertos ?? 0) + 1
      updates.score_dinamico = (lead.score_dinamico ?? 0) + 10
    }

    // Re-clasificar si el score dinámico empuja al lead a HOT
    const scoreBase = (lead.score as { total: number } | null)?.total ?? 0
    const scoreTotal = scoreBase + (updates.score_dinamico as number)
    const wasNotHot = lead.segmento !== "HOT"

    if (scoreTotal >= 70 && wasNotHot) {
      updates.segmento = "HOT"
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: updates,
    })

    // Notificar al admin si el lead acaba de cambiar a HOT
    if (updates.segmento === "HOT" && wasNotHot) {
      try {
        await sendHotLeadNotification({
          nombre: lead.nombre,
          email: lead.email,
          telefono: lead.telefono,
          id: lead.id,
          industria: lead.industria,
          score: { total: scoreTotal },
          diagnostico: lead.diagnostico as unknown as DiagnosisResult,
        })
      } catch (e) {
        console.error("Error notificando lead HOT:", e)
      }
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error de tracking:", error)
    return NextResponse.json({ error: "Error de tracking" }, { status: 500 })
  }
}
