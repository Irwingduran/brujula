/**
 * Copy de la landing pública.
 *
 * Reglas de este archivo:
 * - Sólo datos serializables: sin JSX, sin componentes y sin iconos.
 *   Cada sección resuelve su propio icono a partir del `id`.
 * - Ninguna afirmación puede exceder lo que el diagnóstico entrega hoy.
 *   No se prometen cifras de retorno, resultados garantizados ni
 *   automatizaciones que todavía son manuales.
 */

// ── HERO ──

export const HERO = {
  badge: "Diagnóstico digital gratuito · PyMEs en México",
  headline: {
    prefix: "Descubre qué mejorar primero en tu negocio,",
    highlight: "antes de gastar",
    suffix: "en tecnología",
  },
  subtitle:
    "Brújula revisa cómo vendes, atiendes y operas hoy. Al terminar recibes tus hallazgos principales con la evidencia que los sostiene, la capacidad que conviene desarrollar y una ruta priorizada con una forma de medirla.",
  primaryCta: "Iniciar mi diagnóstico gratuito",
  secondaryCta: "Ver cómo piensa Brújula",
  trustPills: ["Sin tarjeta", "Resultado en minutos", "100% Gratis"],
} as const

// ── VISTA PREVIA DEL DIAGNÓSTICO ──
// Refleja la estructura real del resultado: madurez, hallazgo con
// confianza, capacidad prioritaria y métrica sugerida.

export const PREVIEW = {
  eyebrow: "Ejemplo de resultado",
  metricLabel: "Métrica",
  /** El diagnóstico es real; este caso es una muestra, no un cliente. */
  disclaimer: "Ejemplo ilustrativo con la estructura real del resultado.",
  carouselLabel: "Ejemplos de lo que incluye el diagnóstico",
  slideRoleDescription: "diapositiva",
  autoplayInterval: 7000,
  controls: {
    pause: "Pausar la rotación de ejemplos",
    play: "Reanudar la rotación de ejemplos",
    goTo: "Ver ejemplo",
  },
} as const

/**
 * Tarjetas de la vista previa del hero.
 *
 * Cada una muestra una faceta distinta del resultado y usa vocabulario real
 * del contrato del diagnóstico: confiabilidad `Declarado`/`Observado`, horizonte
 * `ahora`/`después`/`cuando haya evidencia`, confianza cualitativa, línea base
 * `por medir` y lo que todavía no conviene recomendar.
 *
 * `kind` discrimina la forma de cada tarjeta, así que agregar una variante
 * obliga a resolver su render en el componente.
 */
export const PREVIEW_SLIDES = [
  {
    kind: "chain",
    id: "cadena",
    title: "Así se ve tu diagnóstico",
    maturity: { label: "Madurez digital", value: 2, max: 5 },
    /** Los `id` son los eslabones de `DECISION_LAYERS`, en el orden de la cadena. */
    steps: [
      {
        id: "evidencia",
        eyebrow: "Evidencia",
        text: "“Los prospectos me escriben por WhatsApp y ahí se queda todo.”",
        tag: "Declarado",
      },
      {
        id: "hallazgo",
        eyebrow: "Hallazgo",
        text: "El seguimiento comercial depende de la memoria.",
        tag: "Confianza alta",
      },
      {
        id: "capacidad",
        eyebrow: "Capacidad",
        text: "Centralizar prospectos y controlar su seguimiento.",
        tag: "Prioridad 1",
      },
      {
        id: "ruta",
        eyebrow: "Primer paso",
        text: "Registrar cada prospecto y definir su siguiente contacto.",
        metric: "Contactos atendidos en 24 h",
        tag: "Por medir",
      },
    ],
  },
  {
    kind: "route",
    id: "ruta",
    title: "Qué hacer y qué puede esperar",
    meta: { label: "Revisión", value: "90 días" },
    stops: [
      {
        horizon: "Ahora",
        state: "now",
        text: "Registrar cada prospecto y definir su siguiente contacto.",
        prerequisite: "Acordar quién da seguimiento.",
      },
      {
        horizon: "Después",
        state: "later",
        text: "Automatizar recordatorios de seguimiento.",
        prerequisite: "Que el registro ya esté en uso.",
      },
      {
        horizon: "Cuando haya evidencia",
        state: "evidence",
        text: "Invertir en anuncios para atraer más prospectos.",
        prerequisite: "Saber cuántos contactos terminan en venta.",
      },
    ],
    notYet: {
      label: "Todavía no",
      text: "Un CRM con automatizaciones avanzadas: hoy sumaría costo sin resolver el seguimiento básico.",
    },
  },
  {
    kind: "traceability",
    id: "trazabilidad",
    title: "De dónde sale cada conclusión",
    meta: { label: "Señales usadas", value: "3" },
    confidence: { label: "Confianza", value: "Media", levels: ["Baja", "Media", "Alta"] },
    sources: [
      { label: "Cuestionario", detail: "Cómo llegan tus clientes hoy", reliability: "Declarado" },
      { label: "Pregunta de seguimiento", detail: "Qué pasa tras el primer contacto", reliability: "Declarado" },
      { label: "Tu sitio web", detail: "Sin forma de dejar datos de contacto", reliability: "Observado" },
    ],
    missing: {
      label: "Para confirmarlo conviene conocer",
      items: ["Cuántos prospectos recibes por semana", "Cuántos terminan en venta"],
    },
  },
] as const

export type PreviewSlide = (typeof PREVIEW_SLIDES)[number]

// ── ANTES DE BRÚJULA ──

export const PROBLEM = {
  eyebrow: "Antes de Brújula",
  title: "A la mayoría de las PyMEs no les faltan ganas. Les falta un mapa.",
  description:
    "Sin un diagnóstico claro, cada decisión tecnológica es una apuesta: un CRM porque lo recomendó un conocido, anuncios pagados sin saber si el problema es de marketing o de seguimiento.",
  beforeLabel: "Sin dirección clara",
  afterLabel: "Con una ruta clara",
} as const

/**
 * Puntos cardinales de la rosa de los vientos.
 * El orden del arreglo es el orden de lectura: N, E, S, O.
 */
export const COMPASS_POINTS = [
  {
    dir: "N",
    title: "Gratis, sin tarjeta",
    description: "Sólo te pedimos un correo para enviarte el resultado.",
  },
  {
    dir: "E",
    title: "Minutos, no semanas",
    description: "Tu diagnóstico se genera al terminar el cuestionario.",
  },
  {
    dir: "S",
    title: "Tu evidencia, no una plantilla",
    description: "Cada conclusión se sostiene en lo que tú respondiste.",
  },
  {
    dir: "O",
    title: "Tú decides el siguiente paso",
    description:
      "Puedes ejecutar la ruta por tu cuenta o pedirnos una conversación de 20 minutos.",
  },
] as const

// ── CÓMO PIENSA BRÚJULA ──

export const THINKING = {
  id: "como-piensa",
  eyebrow: "Cómo piensa Brújula",
  title: "No es una IA que adivina. Es una aguja que se calibra.",
  description:
    "Una brújula real no apunta al norte por instinto: su aguja se estabiliza filtrando interferencia hasta alinearse con el campo real. Brújula hace lo mismo con tu negocio — no responde con una plantilla genérica, valida cada conclusión contra lo que tú realmente dijiste.",
  note: "Si falta información, te lo decimos — no inventamos certeza para que una recomendación suene mejor. Y no todo tiene que resolverse hoy: tu ruta distingue lo urgente de lo prematuro, igual que una brújula te dice hacia dónde ir sin fingir que ya llegaste.",
} as const

/** `id` resuelve el icono en el componente; `tone` marca el cierre de la cadena. */
export const DECISION_LAYERS = [
  {
    id: "evidencia",
    eyebrow: "01 · Evidencia",
    title: "Lo que realmente pasa",
    description:
      "Tus respuestas, procesos y sitio web, cuando nos autorizas a analizarlo.",
    tone: "primary",
  },
  {
    id: "hallazgo",
    eyebrow: "02 · Hallazgo",
    title: "Lo que está frenando",
    description: "Señales conectadas con su impacto probable y nivel de confianza.",
    tone: "primary",
  },
  {
    id: "capacidad",
    eyebrow: "03 · Capacidad",
    title: "Lo que necesitas poder hacer",
    description:
      "La capacidad de negocio antes de hablar de herramientas o proveedores.",
    tone: "primary",
  },
  {
    id: "ruta",
    eyebrow: "04 · Ruta",
    title: "Qué hacer y en qué orden",
    description:
      "Un siguiente paso proporcional, con prerrequisitos y una forma de medirlo.",
    tone: "accent",
  },
] as const

export type DecisionLayerId = (typeof DECISION_LAYERS)[number]["id"]

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
      "Sí. No pedimos tarjeta ni existe un periodo de prueba. Sólo necesitamos un correo para enviarte el resultado. El diagnóstico es útil por sí mismo y tú decides si quieres ejecutar la ruta por tu cuenta o conversar con nuestro equipo.",
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

// ── CTA FINAL ──

export const FINAL_CTA = {
  title: "Tu negocio ya da señales. Vamos a leerlas.",
  subtitle:
    "Obtén una ruta clara para decidir qué mejorar primero y qué no necesitas todavía.",
  cta: "Iniciar mi diagnóstico gratuito",
} as const

// ── RUTAS ──

export const DIAGNOSTIC_PATH = "/diagnostico"
