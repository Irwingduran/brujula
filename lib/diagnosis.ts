import type { WizardData, DiagnosisResult, PainPoint, CompanySize, BudgetRange } from "./types"
import { getKnowledgePack, getFallbackByIndustry, getIndustryBenchmarks } from "./diagnostico/knowledge"

interface ServiceTemplate {
  titulo_servicio: string
  descripcion: string
  beneficios: string[]
}

const SERVICE_TEMPLATES: Record<PainPoint, ServiceTemplate> = {
  procesos_manuales: {
    titulo_servicio: "Automatizacion de Procesos",
    descripcion:
      "Implementacion de herramientas digitales para automatizar tareas repetitivas, reducir errores y liberar tiempo valioso de tu equipo.",
    beneficios: [
      "Reduccion de hasta 60% en tiempo de tareas manuales",
      "Eliminacion de errores humanos en procesos criticos",
      "Mayor productividad del equipo sin aumentar costos",
      "Dashboards en tiempo real para monitorear procesos",
    ],
  },
  falta_visibilidad: {
    titulo_servicio: "Dashboard de Inteligencia de Negocio",
    descripcion:
      "Sistema de reportes y metricas en tiempo real para que tomes decisiones basadas en datos, no en intuicion.",
    beneficios: [
      "Visibilidad completa de KPIs en tiempo real",
      "Reportes automaticos semanales y mensuales",
      "Alertas tempranas de problemas potenciales",
      "Mejores decisiones con datos, no intuicion",
    ],
  },
  ventas_estancadas: {
    titulo_servicio: "Aceleracion Digital de Ventas",
    descripcion:
      "Estrategia integral para digitalizar tu proceso comercial, captar mas clientes y cerrar mas ventas con herramientas modernas.",
    beneficios: [
      "Funnel de ventas digitalizado y optimizado",
      "Seguimiento automatico de prospectos",
      "Incremento estimado de 25-40% en conversion",
      "CRM configurado a la medida de tu negocio",
    ],
  },
  presencia_online: {
    titulo_servicio: "Presencia Digital Estrategica",
    descripcion:
      "Desarrollo de tu presencia online profesional: sitio web, redes sociales y estrategia de contenido para atraer clientes.",
    beneficios: [
      "Sitio web profesional optimizado para conversion",
      "Estrategia de redes sociales personalizada",
      "Posicionamiento en Google (SEO basico)",
      "Generacion de leads desde canales digitales",
    ],
  },
  sin_trazabilidad: {
    titulo_servicio: "Sistema de Trazabilidad Digital",
    descripcion:
      "Implementacion de herramientas para rastrear clientes, pedidos e inventario en tiempo real, desde cualquier dispositivo.",
    beneficios: [
      "Trazabilidad completa de pedidos y entregas",
      "Control de inventario en tiempo real",
      "Historial completo de interacciones con clientes",
      "Reduccion de perdidas y errores de seguimiento",
    ],
  },
  atencion_cliente: {
    titulo_servicio: "Plataforma de Atencion al Cliente",
    descripcion:
      "Sistema centralizado para gestionar la atencion al cliente por multiples canales, con respuestas rapidas y seguimiento automatico.",
    beneficios: [
      "Atencion centralizada en una sola plataforma",
      "Tiempo de respuesta reducido en 50%+",
      "Automatizacion de respuestas frecuentes",
      "Seguimiento y satisfaccion medidos automaticamente",
    ],
  },
  otro: {
    titulo_servicio: "Diagnostico Digital Integral",
    descripcion:
      "Solucion personalizada basada en las necesidades especificas de tu negocio.",
    beneficios: [
      "Identificacion de areas clave de mejora",
      "Plan de accion personalizado",
      "Recomendaciones de herramientas digitales",
    ],
  },
}

function mapToIndustryCode(industria: string): string {
  const map: Record<string, string> = {
    restaurante: "food",
    retail: "retail",
    servicios_profesionales: "servicios",
    salud: "salud",
    educacion: "educacion",
    inmobiliaria: "servicios",
    tecnologia: "servicios",
    manufactura: "manufactura",
    logistica: "manufactura",
  }
  return map[industria] ?? "otro"
}

function estimateROI(size: CompanySize, pain: PainPoint): string {
  const sizeMultiplier: Record<CompanySize, number> = {
    solo: 1,
    "2_5": 2,
    "6_15": 3.5,
    "16_50": 5,
    "50_plus": 8,
  }

  const baseROI: Record<PainPoint, { min: number; max: number }> = {
    procesos_manuales: { min: 800, max: 2500 },
    falta_visibilidad: { min: 600, max: 2000 },
    ventas_estancadas: { min: 1200, max: 4000 },
    presencia_online: { min: 500, max: 1800 },
    sin_trazabilidad: { min: 700, max: 2200 },
    atencion_cliente: { min: 600, max: 1800 },
    otro: { min: 500, max: 1500 },
  }

  const mult = sizeMultiplier[size] ?? 1
  const base = baseROI[pain] ?? { min: 500, max: 1500 }

  const min = Math.round((base.min * mult) / 100) * 100
  const max = Math.round((base.max * mult) / 100) * 100

  return `$${min.toLocaleString()} - $${max.toLocaleString()} USD/mes en ahorro o ingresos adicionales`
}

function estimatePricing(budget: BudgetRange, pain: PainPoint): string {
  const ranges: Record<BudgetRange, string> = {
    menos_500: "$350 - $500 USD/mes",
    "500_1500": "$500 - $1,200 USD/mes",
    "1500_3000": "$1,200 - $2,500 USD/mes",
    "3000_plus": "$2,500 - $4,000+ USD/mes",
    no_definido: "$500 - $1,500 USD/mes (rango sugerido)",
  }
  return ranges[budget] ?? "$500 - $1,500 USD/mes"
}

export function generateDiagnosis(data: WizardData): DiagnosisResult {
  if (!data.step1 || !data.step2) {
    return {
      patron_negocio: "Completa el diagnóstico para recibir tu análisis personalizado.",
      riesgo_principal: "",
      cambio_clave: "",
      plan_90_dias: { mes_1: "", mes_2: "", mes_3: "" },
    }
  }

  const industry = data.step1.industria
  const industryCode = mapToIndustryCode(industry)
  const knowledge = getKnowledgePack(industryCode)
  const fb = getFallbackByIndustry(industryCode)

  return {
    patron_negocio: fb?.texto ?? "Según tus respuestas, tu negocio depende de herramientas básicas y procesos manuales que consumen tiempo sin que tengas visibilidad clara del impacto en tu rentabilidad.",
    riesgo_principal: "Sin datos concretos sobre tu operación, cada decisión es una corazonada. El riesgo es seguir invirtiendo tiempo sin saber qué está funcionando.",
    cambio_clave: fb?.sugerencia ?? "Empieza por medir una métrica esta semana. Una sola. El dato te mostrará dónde está el verdadero cuello de botella.",
    plan_90_dias: fb?.plan
      ? { mes_1: fb.plan.dia_30, mes_2: fb.plan.dia_60, mes_3: fb.plan.dia_90 }
      : {
          mes_1: "Documenta el proceso que más tiempo te consume durante una semana. No cambies nada, solo mide.",
          mes_2: "Identifica el desperdicio con los datos del primer mes y haz un cambio concreto para reducirlo.",
          mes_3: "Repite el ciclo con el siguiente proceso prioritario y tendrás un mapa claro de tu operación.",
        },
  }
}
