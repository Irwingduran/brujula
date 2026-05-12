import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateScore } from "@/lib/scoring"
import { generateDiagnosis } from "@/lib/diagnosis"
import { sendDiagnosticoEmail, sendHotLeadNotification } from "@/lib/email"
import type { WizardData, DiagnosisResult, ScoreBreakdown } from "@/lib/types" 
 
// GET /api/leads 
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { created_at: "desc" },
    })
    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error al obtener leads:", error)
    return NextResponse.json({ error: "Error al obtener leads" }, { status: 500 })
  }
}

// POST /api/leads — Crear nuevo lead desde wizard
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const wizardData: WizardData = body.wizardData

    if (!wizardData?.step1 || !wizardData?.step2) {
      return NextResponse.json(
        { error: "Datos del wizard incompletos" },
        { status: 400 }
      )
    }

    const score = calculateScore(wizardData)
    const diagnosis = generateDiagnosis(wizardData)

    const lead = await prisma.lead.create({
      data: {
        nombre: wizardData.step2.nombre,
        email: wizardData.step2.email,
        telefono: wizardData.step2.telefono,
        industria: wizardData.step1.industria,
        tamano_empresa: wizardData.step1.tamano_empresa,
        dolores_principales: wizardData.step1.dolores_principales,
        herramientas_actuales: wizardData.step1.herramientas_actuales,
        descripcion_problema: Object.values(wizardData.step2.respuestas_branch).join(" | "),
        presupuesto: wizardData.step2.presupuesto,
        urgencia: wizardData.step2.urgencia,
        respuestas_branch: wizardData.step2.respuestas_branch ?? {},
        respuestas_ia: wizardData.step3?.respuestas_ia ?? [],
        score: score as object,
        diagnostico: diagnosis as object,
        segmento: score.segmento,
        estado_pipeline: "wizard_completado",
        url_sitio: wizardData.step1?.url_sitio ?? "",
        website_analisis: wizardData.websiteAnalysis as object ?? {},
      },
    })

    // Enviar emails (no bloquea la respuesta si falla)
    try {
      const diagnosisData = lead.diagnostico as unknown as DiagnosisResult
      const scoreData = lead.score as unknown as ScoreBreakdown

      // Siempre enviar diagnóstico al lead
      await sendDiagnosticoEmail({
        nombre: lead.nombre,
        email: lead.email,
        id: lead.id,
        diagnostico: diagnosisData,
        score: scoreData,
      })

      // Solo notificar al admin si es HOT
      if (lead.segmento === "HOT") {
        await sendHotLeadNotification({
          nombre: lead.nombre,
          email: lead.email,
          telefono: lead.telefono,
          id: lead.id,
          industria: lead.industria,
          score: scoreData,
          diagnostico: diagnosisData,
        })
      }
    } catch (emailError) {
      // No fallar el request si el email falla
      console.error("Error enviando email:", emailError)
    }

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error("Error creando lead:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
