import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateScore } from "@/lib/scoring"
import { generateDiagnosis } from "@/lib/diagnosis"
import { sendDiagnosticoEmail, sendHotLeadNotification } from "@/lib/email"
import { assignSuggestedServices } from "@/lib/servicios/suggester"
import { WizardSubmissionSchema } from "@/lib/ai/contracts"
import { buildExternalContextSnapshot, buildWizardEvidence } from "@/lib/formulario/evidence"
import type { WizardData, ScoreBreakdown } from "@/lib/types"
 
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
    const parsedSubmission = WizardSubmissionSchema.safeParse(body.wizardData)

    if (!parsedSubmission.success) {
      return NextResponse.json({ error: "Datos del wizard inválidos" }, { status: 400 })
    }

    const { step1, step2, step3 } = parsedSubmission.data
    const wizardData: WizardData = {
      step1: step1 as WizardData["step1"],
      step2: step2 as WizardData["step2"],
      step3: step3 ?? null,
    }
    const evidence = buildWizardEvidence(wizardData)
    const externalContext = buildExternalContextSnapshot(wizardData)
    const score = calculateScore(wizardData)
    const diagnosis = generateDiagnosis(wizardData)

    const lead = await prisma.lead.create({
      data: {
        nombre: step2.nombre,
        email: step2.email,
        telefono: step2.telefono,
        industria: step1.industria,
        tamano_empresa: step1.tamano_empresa,
        dolores_principales: step1.dolores_principales,
        herramientas_actuales: step1.herramientas_actuales,
        descripcion_problema: Object.values(step2.respuestas_branch).join(" | "),
        presupuesto: step2.presupuesto,
        urgencia: step2.urgencia,
        respuestas_branch: step2.respuestas_branch,
        respuestas_ia: step3?.respuestas_ia ?? [],
        score: score as object,
        diagnostico: diagnosis as object,
        segmento: score.segmento,
        estado_pipeline: "wizard_completado",
        url_sitio: step1.url_sitio ?? "",
        website_analisis: (step1.website_analysis ?? {}) as object,
        industria_otra: step1.industria_otra,
        dolor_otro: step1.dolor_otro,
        herramienta_otra: step1.herramienta_otra,
        evidencia_json: evidence as object,
        formulario_version: "v2",
        contexto_externo_json: externalContext as object,
      },
    })

    // Sugerir servicios según su perfil (no bloquea)
    try {
      await assignSuggestedServices(
        lead.id,
        lead.industria,
        lead.dolores_principales,
        lead.urgencia,
        lead.presupuesto,
      )
    } catch (svcError) {
      console.error("Error asignando servicios sugeridos:", svcError)
    }

    // Enviar emails (no bloquea la respuesta si falla)
    try {
      const diagnosisData = lead.diagnostico as any
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
