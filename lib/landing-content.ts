import type { Icon } from "@phosphor-icons/react"
import {
  ChatDots,
  Brain,
  ListChecks,
  SealCheck,
  Crosshair,
  Storefront,
  ForkKnife,
  Wrench,
  Stethoscope,
  GraduationCap,
  Building,
} from "@phosphor-icons/react"

// ── HERO ──

export const HERO_BADGE = "Diagnóstico digital gratuito · PYMEs mexicanas"

export const HERO_HEADLINE = {
  prefix: "¿Tu negocio está perdiendo clientes por lo",
  highlight: "que no tiene",
  suffix: "en digital?",
}

export const HERO_SUBTITLE =
  "El 70% de las PYMEs mexicanas no sabe qué herramientas digitales necesita ni por dónde empezar. Brújula analiza tu operación y te dice exactamente qué priorizar, en qué orden y sin gastar de más."

export const HERO_CTA = "Comenzar diagnóstico gratis"

export const HERO_TRUST_PILLARS = ["Sin registro", "Sin pago", "Rápido"] as const

// ── PREVIEW (before / after) ──

export const PREVIEW_BADGE = "Ejemplo real"
export const PREVIEW_TITLE = "De estar perdido… a tener un plan claro"
export const PREVIEW_SUBTITLE = "Así es como Brújula transforma un negocio sin rumbo digital en uno con hoja de ruta."

export const BEFORE_AFTER = {
  business: {
    name: "Abarrotes Don Memo",
    meta: "Retail · 1–5 personas · CDMX",
  },
  before: {
    label: "Hoy",
    maturity: 2,
    scores: [
      { label: "Visibilidad", value: 1, max: 5 },
      { label: "Captación", value: 2, max: 5 },
      { label: "Operaciones", value: 3, max: 5 },
      { label: "Retención", value: 1, max: 5 },
    ],
    symptoms: [
      "Sin presencia en búsquedas locales",
      "Dependencia del boca a boca",
      "Sin seguimiento postventa",
    ],
    summary: "Sin presencia digital, sin captación estructurada y sin forma de retener clientes.",
  },
  after: {
    label: "Con Brújula",
    maturity: 4,
    scores: [
      { label: "Visibilidad", value: 4, max: 5 },
      { label: "Captación", value: 4, max: 5 },
      { label: "Operaciones", value: 4, max: 5 },
      { label: "Retención", value: 3, max: 5 },
    ],
    actions: [
      "Google Business optimizado con fotos y horarios",
      "WhatsApp Business con catálogo digital",
      "CRM básico para registrar clientes",
    ],
    summary: "Aparece en búsquedas locales, capta leads todos los días y da seguimiento sin perder clientes.",
  },
}

// ── BENEFITS ──

export const BENEFITS_BADGE = "Lo que recibes"
export const BENEFITS_TITLE = "Claridad para decidir, no más ruido"
export const BENEFITS_SUBTITLE = "Un diagnóstico útil incluso si decides implementarlo por tu cuenta."

export const BENEFITS: {
  icon: Icon
  title: string
  description: string
  highlight: string
}[] = [
  {
    icon: Crosshair,
    title: "Hallazgos explicados",
    description: "Conoce qué señales detectamos, qué impacto podrían tener y qué evidencia sostiene cada conclusión.",
    highlight: "Con contexto",
  },
  {
    icon: Brain,
    title: "Capacidades antes que software",
    description: "Primero definimos lo que tu negocio necesita poder hacer mejor; después tiene sentido hablar de herramientas.",
    highlight: "Neutral",
  },
  {
    icon: ListChecks,
    title: "Una ruta priorizada",
    description: "Distingue qué hacer ahora, qué puede esperar y qué sólo conviene cuando exista suficiente evidencia.",
    highlight: "Accionable",
  },
  {
    icon: SealCheck,
    title: "Métricas para avanzar",
    description: "Cada prioridad incluye una señal observable para que el cambio pueda medirse y no dependa de percepciones.",
    highlight: "Medible",
  },
]

// ── TESTIMONIALS ──

export const TESTIMONIALS_BADGE = "Lo que dicen otros dueños"
export const TESTIMONIALS_TITLE = "PYMEs como la tuya ya lo usaron"
export const TESTIMONIALS_SUBTITLE = "Dueños de negocio que descubrieron qué les faltaba y qué hacer."

export const TESTIMONIALS: {
  avatar: string
  name: string
  business: string
  quote: string
  result: string
  icon: Icon
}[] = [
  {
    avatar: "MG",
    name: "María Gutiérrez",
    business: "Taquería El Fogón · Gdl",
    quote:
      "Sabía que me faltaba algo en digital, pero no tenía idea por dónde empezar. Brújula me dijo exactamente qué hacer y en una semana ya tenía Google Business funcionando. Llegaron clientes que ni sabía que estaban buscándome.",
    result: "+40% clientes nuevos en el primer mes",
    icon: ForkKnife,
  },
  {
    avatar: "CL",
    name: "Carlos López",
    business: "Taller Mecánico Express · CDMX",
    quote:
      "Creía que con el boca a boca bastaba. El diagnóstico me mostró que estaba perdiendo clientes por no tener WhatsApp Business ni registro de los que me buscaban. Implementé lo que me recomendaron y ahora tengo clientes que repiten.",
    result: "30% más de recompra en 60 días",
    icon: Wrench,
  },
  {
    avatar: "AR",
    name: "Ana Ramírez",
    business: "Clínica Dental · Monterrey",
    quote:
      "Llevaba años queriendo digitalizarme pero siempre terminaba abrumada. Brújula me dio solo 3 prioridades. Las ejecuté en orden y en dos meses ya siento que tengo control de mi consultorio.",
    result: "Consultas agendadas por WhatsApp",
    icon: Stethoscope,
  },
]

// ── INDUSTRY CASES ──

export const INDUSTRY_BADGE = "Para tu industria"
export const INDUSTRY_TITLE = "Esto es lo que Brújula detecta en cada giro"
export const INDUSTRY_SUBTITLE = "Selecciona tu industria y ve un adelanto del diagnóstico que recibirías."

export const INDUSTRY_ICONS: Record<string, Icon> = {
  restaurante: ForkKnife,
  retail: Storefront,
  servicios: Wrench,
  salud: Stethoscope,
  educacion: GraduationCap,
  inmobiliaria: Building,
}

export const INDUSTRY_CASES: {
  id: string
  label: string
  summary: string
  symptoms: string[]
  actions: string[]
}[] = [
  {
    id: "restaurante",
    label: "Restaurante",
    summary: "Dueños que dependen del delivery por app, pierden comisión y no tienen relación directa con el comensal.",
    symptoms: [
      "Sin presencia en Google Maps ni Google Business",
      "Dependencia total de apps de delivery (sin base de clientes propia)",
      "Sin control de inventario ni trazabilidad de pedidos",
    ],
    actions: [
      "Google Business Profile con menú y fotos profesionales",
      "WhatsApp Business para pedidos directos (sin comisión)",
      "Sistema de inventario básico para reducir merma",
    ],
  },
  {
    id: "retail",
    label: "Retail / Tienda",
    summary: "Negocios que solo venden en local y no tienen cómo captar clientes fuera de su cuadra.",
    symptoms: [
      "Sin catálogo digital ni presencia en redes con tienda",
      "Pérdida de ventas por no tener seguimiento de clientes",
      "Stock manejado en libretas o Excel sin control",
    ],
    actions: [
      "Catálogo digital en WhatsApp Business y redes sociales",
      "Registro básico de clientes con historial de compras",
      "Control de inventario digital con alertas de reposición",
    ],
  },
  {
    id: "servicios",
    label: "Servicios Profesionales",
    summary: "Profesionistas que dependen del referido y no tienen canal de captación digital.",
    symptoms: [
      "Captación de clientes 100% por referidos (sin crecimiento escalable)",
      "Sin presencia digital que genere confianza antes del primer contacto",
      "Seguimiento manual de proyectos y cotizaciones",
    ],
    actions: [
      "Perfil profesional en Google con reseñas y portafolio",
      "CRM básico para automatizar seguimiento de leads",
      "Landing page con servicio y formulario de contacto",
    ],
  },
  {
    id: "salud",
    label: "Salud / Bienestar",
    summary: "Consultorios y clínicas que pierden pacientes por falta de agenda digital y seguimiento.",
    symptoms: [
      "Agenda de citas manual con alto índice de no-show",
      "Sin historial digital de pacientes ni recordatorios",
      "Poca presencia online que genera desconfianza en nuevos pacientes",
    ],
    actions: [
      "Sistema de agendamiento digital con recordatorios automáticos",
      "Expediente digital básico por paciente",
      "Google Business Profile con servicios y opiniones",
    ],
  },
  {
    id: "educacion",
    label: "Educación / Capacitación",
    summary: "Instructores y academias que no logran llenar grupos por falta de canal de inscripción digital.",
    symptoms: [
      "Inscripciones manuales que frenan la conversión de alumnos",
      "Sin embudo de captación para nuevos estudiantes",
      "Comunicación dispersa con alumnos y padres",
    ],
    actions: [
      "Página de inscripción con formulario y pago en línea",
      "CRM para seguimiento de leads y comunicación automatizada",
      "Calendario de cursos visible en web y redes sociales",
    ],
  },
  {
    id: "inmobiliaria",
    label: "Inmobiliaria",
    summary: "Asesores que pierden leads porque no tienen sistema para dar seguimiento organizado.",
    symptoms: [
      "Leads sin seguimiento estructurado (se enfrían en días)",
      "Propiedades publicadas sin fotos profesionales ni tour virtual",
      "Sin métricas de conversión por asesor ni por propiedad",
    ],
    actions: [
      "CRM inmobiliario con automatización de seguimiento",
      "Catálogo digital de propiedades con fotos y video tour",
      "Dashboard de métricas de conversión por asesor",
    ],
  },
]

// ── FAQ ──

export const FAQ_BADGE = "Preguntas frecuentes"
export const FAQ_TITLE = "Antes de comenzar"
export const FAQ_SUBTITLE = "Lo importante, sin letra pequeña."

export const FAQ: {
  question: string
  answer: string
}[] = [
  {
    question: "¿El diagnóstico realmente es gratuito?",
    answer:
      "Sí. No pedimos tarjeta ni existe un periodo de prueba. El diagnóstico es útil por sí mismo y tú decides si quieres ejecutar la ruta por tu cuenta o conversar con nuestro equipo.",
  },
  {
    question: "¿Necesito saber de tecnología?",
    answer:
      "No. Las preguntas hablan de cómo vendes, atiendes y operas tu negocio. El resultado traduce las señales a lenguaje claro, sin esperar que conozcas herramientas o términos técnicos.",
  },
  {
    question: "¿Funciona para mi tipo de negocio?",
    answer:
      "Brújula adapta las preguntas a tu industria, tamaño, problemas y herramientas actuales. Si la información no es suficiente para sostener una conclusión, el diagnóstico debe mostrar esa limitación en lugar de inventar una respuesta.",
  },
  {
    question: "¿Cuánto tiempo toma?",
    answer:
      "El formulario se responde en pocos minutos. No necesitas preparar documentos: basta con conocer cómo funciona hoy tu negocio y responder con honestidad.",
  },
  {
    question: "¿Qué obtengo al final?",
    answer:
      "Recibes tu nivel de madurez, los principales hallazgos con su evidencia y confianza, las capacidades que conviene desarrollar y una ruta priorizada con métricas sugeridas. También verás qué no recomendamos todavía.",
  },
  {
    question: "¿El resultado intenta venderme algo?",
    answer:
      "No condicionamos el diagnóstico al catálogo de Brújula. Primero identificamos la necesidad y la ruta neutral. Después puedes ejecutarla por tu cuenta o explorar opciones de implementación si existe una compatible.",
  },
  {
    question: "¿Qué pasa con mis datos?",
    answer:
      "Los usamos para generar tu diagnóstico y, únicamente con tu autorización, para ayudarte con los siguientes pasos. No vendemos tu información. Consulta el aviso de privacidad para conocer el tratamiento completo.",
  },
]

// ── HOW IT WORKS ──

export const HOW_BADGE = "Cómo funciona"
export const HOW_TITLE = "Tres pasos, un plan claro"
export const HOW_SUBTITLE = "Sin consultores, sin jerga técnica, sin esperar"

export const STEPS: {
  icon: Icon
  step: string
  title: string
  description: string
}[] = [
  {
    icon: ChatDots,
    step: "01",
    title: "Cuéntanos sobre tu negocio",
    description:
      "Industria, herramientas que usas, tus mayores dolores y cuánto puedes invertir. Solo toma unos minutos.",
  },
  {
    icon: Brain,
    step: "02",
    title: "Brújula analiza tu caso",
    description:
      "La IA cruza tus respuestas con patrones reales de PYMEs mexicanas y detecta qué está fallando y por qué.",
  },
  {
    icon: ListChecks,
    step: "03",
    title: "Recibes tu plan priorizado",
    description:
      "Qué hacer esta semana, qué esperar y qué no vale la pena en tu caso — con presupuesto y tiempo estimado.",
  },
]

// ── FINAL CTA ──

export const CTA_TITLE = "Tu diagnóstico es solo el comienzo"
export const CTA_SUBTITLE =
  "Responde el diagnóstico hoy y recibe tu plan en minutos. Después, si quieres, agendamos una llamada para profundizar."
export const CTA_LABEL = "Comenzar diagnóstico gratis"
