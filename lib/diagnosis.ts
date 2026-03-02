import type { WizardData, DiagnosisResult, PainPoint, CompanySize, BudgetRange } from "./types"

interface ServiceTemplate {
  titulo_servicio: string
  descripcion: string
  beneficios: string[]
}

// Service templates mapped by primary pain point
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
}

// ROI estimation based on company size and pain
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
  }

  const mult = sizeMultiplier[size] ?? 1
  const base = baseROI[pain] ?? { min: 500, max: 1500 }

  const min = Math.round((base.min * mult) / 100) * 100
  const max = Math.round((base.max * mult) / 100) * 100

  return `$${min.toLocaleString()} - $${max.toLocaleString()} USD/mes en ahorro o ingresos adicionales`
}

// Pricing estimation based on budget and scope
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

// Generate industry-specific diagnostic text
function generateDiagnosticText(data: WizardData): string {
  if (!data.step1 || !data.step2) return ""

  const industry = data.step1.industria
  const pains = data.step1.dolores_principales
  const size = data.step1.tamano_empresa
  const tools = data.step1.herramientas_actuales

  const painLabels: Record<PainPoint, string> = {
    procesos_manuales: "procesos manuales que consumen tiempo",
    falta_visibilidad: "falta de visibilidad sobre metricas clave",
    ventas_estancadas: "ventas estancadas o en declive",
    presencia_online: "presencia online debil",
    sin_trazabilidad: "falta de trazabilidad en operaciones",
    atencion_cliente: "dificultades en la atencion al cliente",
  }

  const painList = pains.map((p) => painLabels[p] || p).join(", ")

  const hasBasicTools = tools.includes("nada") || tools.includes("excel") || tools.includes("whatsapp")
  const toolNote = hasBasicTools
    ? "Actualmente dependes de herramientas basicas que limitan tu crecimiento."
    : "Ya cuentas con algunas herramientas, pero hay oportunidad de optimizarlas significativamente."

  return `Basado en nuestro analisis de tu negocio en el sector ${industry} con un equipo de tamano ${size}, hemos identificado areas criticas de mejora: ${painList}. ${toolNote} Tu diagnostico indica una oportunidad clara de transformacion digital que puede generar resultados medibles en las primeras semanas de implementacion.`
}

// Main diagnosis function
export function generateDiagnosis(data: WizardData): DiagnosisResult {
  if (!data.step1 || !data.step2) {
    return {
      titulo_servicio: "Diagnostico Digital",
      descripcion: "Completa el diagnostico para recibir tu plan personalizado.",
      diagnostico_texto: "",
      roi_estimado: "",
      precio_rango: "",
      beneficios: [],
      siguiente_paso: "Agenda una llamada gratuita para discutir tu plan personalizado.",
    }
  }

  const primaryPain = data.step1.dolores_principales[0] || "procesos_manuales"
  const template = SERVICE_TEMPLATES[primaryPain]

  return {
    titulo_servicio: template.titulo_servicio,
    descripcion: template.descripcion,
    diagnostico_texto: generateDiagnosticText(data),
    roi_estimado: estimateROI(data.step1.tamano_empresa, primaryPain),
    precio_rango: estimatePricing(data.step2.presupuesto, primaryPain),
    beneficios: template.beneficios,
    siguiente_paso:
      "Agenda tu llamada gratuita de 30 minutos para revisar este diagnostico juntos y definir los proximos pasos concretos.",
  }
}
