import { prisma } from "@/lib/prisma"
import { sendDiagnosticoEmail } from "@/lib/email"
import type { DiagnosticoResult } from "@/lib/diagnostico/schemas"

export type DiagnosticoEmailDelivery = "sent" | "not_configured" | "already_sent" | "lead_not_found"

/**
 * Entrega el diagnóstico final una sola vez. `estado_pipeline = email_enviado`
 * funciona como reclamación persistente para impedir que las rutas stream y no-stream
 * envíen el mismo correo en paralelo.
 */
export async function sendDiagnosticoEmailOnce(
  leadId: string,
  diagnostico: DiagnosticoResult,
): Promise<DiagnosticoEmailDelivery> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { nombre: true, email: true, estado_pipeline: true },
  })

  if (!lead) return "lead_not_found"
  if (lead.estado_pipeline === "email_enviado") return "already_sent"

  const claim = await prisma.lead.updateMany({
    where: { id: leadId, estado_pipeline: lead.estado_pipeline },
    data: { estado_pipeline: "email_enviado" },
  })

  if (claim.count !== 1) return "already_sent"

  try {
    const status = await sendDiagnosticoEmail({
      id: leadId,
      nombre: lead.nombre,
      email: lead.email,
      diagnostico,
    })

    if (status === "sent") return "sent"

    await prisma.lead.updateMany({
      where: { id: leadId, estado_pipeline: "email_enviado" },
      data: { estado_pipeline: lead.estado_pipeline },
    })
    return "not_configured"
  } catch (error) {
    await prisma.lead.updateMany({
      where: { id: leadId, estado_pipeline: "email_enviado" },
      data: { estado_pipeline: lead.estado_pipeline },
    })
    throw error
  }
}
