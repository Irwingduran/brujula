import type { Lead, PipelineStage, LeadSegment, CompanySize, BudgetRange, Urgency, PainPoint, CurrentTool } from "./types"

// In-memory store — will be replaced by Prisma + PostgreSQL
const leads = new Map<string, Lead>()

function generateId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function createLead(data: Omit<Lead, "id" | "created_at" | "ultima_actividad_at">): Lead {
  const id = generateId()
  const now = new Date().toISOString()
  const lead: Lead = {
    id,
    created_at: now,
    ultima_actividad_at: now,
    ...data,
  }
  leads.set(id, lead)
  return lead
}

export function getLead(id: string): Lead | undefined {
  return leads.get(id)
}

export function listLeads(): Lead[] {
  return Array.from(leads.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function updateLead(id: string, patch: Partial<Lead>): Lead | undefined {
  const existing = leads.get(id)
  if (!existing) return undefined
  const updated: Lead = {
    ...existing,
    ...patch,
    id: existing.id,
    created_at: existing.created_at,
    ultima_actividad_at: new Date().toISOString(),
  }
  leads.set(id, updated)
  return updated
}

// ============================
// Seed demo data for admin panel
// ============================

function seedDemoLeads() {
  const demoLeads: Array<{
    nombre: string
    email: string
    telefono: string
    industria: string
    tamano_empresa: CompanySize
    dolores_principales: PainPoint[]
    herramientas_actuales: CurrentTool[]
    presupuesto: BudgetRange
    urgencia: Urgency
    segmento: LeadSegment
    estado_pipeline: PipelineStage
    score_total: number
  }> = [
    {
      nombre: "Maria Gonzalez",
      email: "maria@restauranteelbueno.com",
      telefono: "+52 55 1234 5678",
      industria: "restaurante",
      tamano_empresa: "6_15",
      dolores_principales: ["procesos_manuales", "falta_visibilidad"],
      herramientas_actuales: ["whatsapp", "excel"],
      presupuesto: "1500_3000",
      urgencia: "inmediata",
      segmento: "HOT",
      estado_pipeline: "llamada_agendada",
      score_total: 85,
    },
    {
      nombre: "Carlos Mendoza",
      email: "carlos@mendozalegal.co",
      telefono: "+57 311 987 6543",
      industria: "servicios_profesionales",
      tamano_empresa: "2_5",
      dolores_principales: ["ventas_estancadas", "presencia_online"],
      herramientas_actuales: ["email_manual", "whatsapp"],
      presupuesto: "500_1500",
      urgencia: "1_3_meses",
      segmento: "WARM",
      estado_pipeline: "email_enviado",
      score_total: 58,
    },
    {
      nombre: "Ana Lucia Torres",
      email: "ana@beautyspacemx.com",
      telefono: "+52 33 5555 1234",
      industria: "salud",
      tamano_empresa: "2_5",
      dolores_principales: ["atencion_cliente", "sin_trazabilidad"],
      herramientas_actuales: ["whatsapp", "redes_sociales"],
      presupuesto: "500_1500",
      urgencia: "inmediata",
      segmento: "HOT",
      estado_pipeline: "wizard_completado",
      score_total: 72,
    },
    {
      nombre: "Roberto Diaz",
      email: "roberto@logisticadiaz.com.ar",
      telefono: "+54 11 4567 8901",
      industria: "logistica",
      tamano_empresa: "16_50",
      dolores_principales: ["sin_trazabilidad", "procesos_manuales"],
      herramientas_actuales: ["excel", "crm_basico"],
      presupuesto: "3000_plus",
      urgencia: "1_3_meses",
      segmento: "HOT",
      estado_pipeline: "email_enviado",
      score_total: 78,
    },
    {
      nombre: "Valentina Rojas",
      email: "valen@rojasacademia.cl",
      telefono: "+56 9 8765 4321",
      industria: "educacion",
      tamano_empresa: "solo",
      dolores_principales: ["presencia_online"],
      herramientas_actuales: ["redes_sociales", "nada"],
      presupuesto: "menos_500",
      urgencia: "3_6_meses",
      segmento: "COLD",
      estado_pipeline: "wizard_completado",
      score_total: 28,
    },
    {
      nombre: "Fernando Castillo",
      email: "fernando@castimodaspe.com",
      telefono: "+51 999 123 456",
      industria: "retail",
      tamano_empresa: "6_15",
      dolores_principales: ["ventas_estancadas", "falta_visibilidad", "procesos_manuales"],
      herramientas_actuales: ["excel", "whatsapp"],
      presupuesto: "1500_3000",
      urgencia: "inmediata",
      segmento: "HOT",
      estado_pipeline: "llamada_agendada",
      score_total: 88,
    },
    {
      nombre: "Laura Bermudez",
      email: "laura@bermudezinmob.com.co",
      telefono: "+57 310 234 5678",
      industria: "inmobiliaria",
      tamano_empresa: "2_5",
      dolores_principales: ["ventas_estancadas", "atencion_cliente"],
      herramientas_actuales: ["whatsapp", "email_manual"],
      presupuesto: "no_definido",
      urgencia: "solo_explorando",
      segmento: "COLD",
      estado_pipeline: "archivado",
      score_total: 32,
    },
  ]

  for (const demo of demoLeads) {
    const daysAgo = Math.floor(Math.random() * 14) + 1
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString()

    const lead: Lead = {
      id: generateId(),
      created_at: createdAt,
      nombre: demo.nombre,
      email: demo.email,
      telefono: demo.telefono,
      industria: demo.industria,
      tamano_empresa: demo.tamano_empresa,
      dolores_principales: demo.dolores_principales,
      herramientas_actuales: demo.herramientas_actuales,
      descripcion_problema: "",
      presupuesto: demo.presupuesto,
      urgencia: demo.urgencia,
      respuestas_branch: {},
      respuestas_ia: [],
      diagnostico: null,
      score: {
        presupuesto: Math.round(demo.score_total * 0.3),
        urgencia: Math.round(demo.score_total * 0.25),
        tamano_empresa: Math.round(demo.score_total * 0.2),
        claridad_problema: Math.round(demo.score_total * 0.15),
        industria_fit: Math.round(demo.score_total * 0.1),
        total: demo.score_total,
        segmento: demo.segmento,
      },
      segmento: demo.segmento,
      estado_pipeline: demo.estado_pipeline,
      llamada_agendada_at: demo.estado_pipeline === "llamada_agendada"
        ? new Date(Date.now() + 3 * 86400000).toISOString()
        : null,
      ultima_actividad_at: new Date(Date.now() - (daysAgo - 1) * 86400000).toISOString(),
      notas_freelancer: "",
    }
    leads.set(lead.id, lead)
  }
}

// Seed on first import
seedDemoLeads()
