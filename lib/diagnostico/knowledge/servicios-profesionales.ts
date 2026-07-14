import type { KnowledgePack, KnowledgeSymptom, KnowledgeAction } from "./types"

const symptoms: KnowledgeSymptom[] = [
  {
    id: "ps_sin_tracking_horas",
    nombre: "Sin registro de horas facturables",
    descripcion: "No rastrea el tiempo invertido por cliente/proyecto, factura sobre estimados o memoria.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "ps_propuestas_lentas",
    nombre: "Propuestas y cotizaciones lentas",
    descripcion: "Tarda días en preparar propuestas, no tiene plantillas ni procesos estandarizados.",
    categoria: "captacion",
    industryOnly: true,
  },
  {
    id: "ps_fuga_clientes",
    nombre: "Fuga de clientes sin seguimiento",
    descripcion: "No da seguimiento post-servicio, pierde clientes recurrentes por falta de contacto.",
    categoria: "retencion",
    industryOnly: true,
  },
  {
    id: "ps_pricing_inconsistente",
    nombre: "Precios inconsistentes",
    descripcion: "No tiene una estructura de precios clara, cada proyecto se cotiza distinto sin criterio.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "ps_sin_crm_profesional",
    nombre: "Sin CRM para seguimiento de leads",
    descripcion: "Los prospectos y clientes se gestionan en Excel, correo suelto o la memoria.",
    categoria: "captacion",
    industryOnly: true,
  },
  {
    id: "ps_facturacion_manual",
    nombre: "Facturación manual y desordenada",
    descripcion: "Facturas en Excel o Word, sin automatización, errores frecuentes en montos y fechas.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "ps_dependencia_referidos",
    nombre: "Dependencia total de referidos",
    descripcion: "Todos los clientes llegan por recomendación, sin canales de captación digital activos.",
    categoria: "captacion",
    industryOnly: true,
  },
  {
    id: "ps_sin_portafolio_digital",
    nombre: "Sin portafolio o casos de éxito visibles",
    descripcion: "No muestra su trabajo, resultados o testimonios en línea para atraer clientes.",
    categoria: "presencia_digital",
    industryOnly: true,
  },
  {
    id: "ps_sin_seguimiento_postventa",
    nombre: "Sin proceso de postventa",
    descripcion: "Entrega el trabajo y no vuelve a contactar al cliente hasta que élo necesita.",
    categoria: "retencion",
    industryOnly: true,
  },
  {
    id: "ps_capacidad_ociosa",
    nombre: "Capacidad ociosa sin identificar",
    descripcion: "No sabe cuántas horas productivas tiene disponibles para tomar más proyectos.",
    categoria: "operaciones",
    industryOnly: true,
  },
]

const actions: KnowledgeAction[] = [
  {
    id: "ps_implementar_tracking_horas",
    titulo: "Implementar registro de horas",
    descripcion: "Usar herramienta como Toggl, Harvest o Clockify para rastrear tiempo por cliente y proyecto.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "ps_crear_plantillas_propuestas",
    titulo: "Crear plantillas de propuestas",
    descripcion: "Estandarizar propuestas con precios, alcance y entregables para responder en horas no en días.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "ps_automatizar_facturacion",
    titulo: "Automatizar facturación recurrente",
    descripcion: "Configurar facturación automática mensual para clientes recurrentes con Stripe, Deel o similar.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "ps_implementar_crm",
    titulo: "Implementar CRM profesional",
    descripcion: "Usar CRM (HubSpot, Pipedrive, Less Annoying CRM) para pipeline de leads y seguimiento.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "ps_crear_casos_exito",
    titulo: "Documentar casos de éxito",
    descripcion: "Crear 3 casos de éxito con resultados medibles para usar en web, propuestas y redes.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "ps_automatizar_seguimiento_clientes",
    titulo: "Automatizar seguimiento de clientes",
    descripcion: "Configurar recordatorios automáticos para check-ins trimestrales, cumpleaños o renovaciones.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "ps_crear_sistema_precios",
    titulo: "Definir estructura de precios",
    descripcion: "Crear una matriz de precios por tipo de servicio, hora, paquete y retainer mensual.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "ps_linkedin_estrategia",
    titulo: "Activar presencia en LinkedIn",
    descripcion: "Publicar contenido semanal, conectar con prospectos ideales y optimizar perfil profesional.",
    presupuestoRequerido: "bajo",
    impacto: "largo_plazo",
    industryOnly: true,
  },
  {
    id: "ps_portafolio_web",
    titulo: "Crear portafolio web profesional",
    descripcion: "Sitio web con servicios, casos de éxito, testimonios y formulario de contacto.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "ps_referidos_estructurados",
    titulo: "Estructurar programa de referidos",
    descripcion: "Crear un sistema formal de referidos con incentivos para que clientes actuales recomienden.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
]

export const SERVICIOS_PROFESIONALES_PACK: KnowledgePack = {
  industryCode: "servicios",
  industryLabel: "Servicios Profesionales",

  subsectors: {
    consultoria: "Consultoría / Coach",
    contabilidad: "Contabilidad / Finanzas",
    legal: "Legal / Abogacía",
    marketing: "Marketing / Publicidad",
    diseno: "Diseño / Creativo",
    desarrollo: "Desarrollo web / Tecnología",
    rrhh: "Consultoría de RRHH",
    otro: "Otro servicio profesional",
  },

  diagnosticFocus: [
    "Seguimiento de horas y productividad",
    "Captación de clientes y pipeline de ventas",
    "Estructura de precios y rentabilidad",
    "Facturación y administración",
    "Retención y postventa",
    "Presencia digital profesional",
  ],

  promptGuidance: `Este negocio es de SERVICIOS PROFESIONALES (consultoría, contabilidad, legal, marketing, diseño, etc.).
NO trates este negocio como un comercio o restaurante. NO menciones "pedidos", "inventario", "delivery" ni "stock".
Enfócate en:
- Cómo captan y retienen clientes
- Cómo cotizan y facturan sus servicios
- Cómo rastrean horas y miden rentabilidad
- Cómo dan seguimiento post-servicio
- Su presencia digital profesional (LinkedIn, portafolio, casos de éxito)
- La consistencia de sus precios y propuestas`,

  maturityDimensions: [
    {
      nombre: "Captación de clientes",
      descripcion: "Canales y procesos para atraer nuevos clientes",
      niveles: [
        "Solo referidos, sin captación activa",
        "Redes sociales sin estrategia",
        "LinkedIn activo + web profesional",
        "Pipeline de ventas con CRM",
        "Múltiples canales con métricas de conversión",
      ],
    },
    {
      nombre: "Administración y facturación",
      descripcion: "Gestión financiera y operativa",
      niveles: [
        "Facturación manual en Excel/Word",
        "Facturación con plantillas semiautomáticas",
        "Software de facturación básico",
        "Facturación automatizada + cobranza digital",
        "Sistema integrado con métricas de rentabilidad",
      ],
    },
    {
      nombre: "Seguimiento y retención",
      descripcion: "Gestión de la relación con clientes existentes",
      niveles: [
        "Sin seguimiento post-servicio",
        "Contacto esporádico sin proceso",
        "Check-ins programados manualmente",
        "CRM con automatización de seguimiento",
        "Programa de retención con métricas y referidos",
      ],
    },
  ],

  benchmarks: [
    {
      metrica: "Tasa de utilización",
      valor: "60-70%",
      descripcion: "Porcentaje de horas facturables vs disponibles en consultorías profesionales",
    },
    {
      metrica: "Tasa de cierre de propuestas",
      valor: "30-40%",
      descripcion: "Porcentaje de propuestas que se convierten en proyectos cerrados",
    },
    {
      metrica: "Tiempo promedio de propuesta",
      valor: "2-5 días",
      descripcion: "Tiempo que toma preparar y enviar una propuesta comercial",
    },
    {
      metrica: "Clientes recurrentes",
      valor: "40-60%",
      descripcion: "Porcentaje de ingresos que vienen de clientes recurrentes o retainers",
    },
    {
      metrica: "Horas administrativas",
      valor: "15-25%",
      descripcion: "Porcentaje de tiempo dedicado a tareas administrativas no facturables",
    },
  ],

  successStories: [
    {
      empresa: "ConsulTI",
      problema: "Perdían 12 horas semanales en facturación manual y cotizaciones desde cero.",
      solucion: "Automatizaron facturación recurrente y crearon 5 plantillas de propuestas estándar.",
      resultado: "Redujeron tiempo administrativo en un 70% y aumentaron su capacidad de clientes en un 40%.",
    },
    {
      empresa: "LexAsesores",
      problema: "El 80% de sus leads se enfriaban por falta de seguimiento estructurado.",
      solucion: "Implementaron un CRM simple con automatización de emails de seguimiento.",
      resultado: "Aumentaron su tasa de cierre de propuestas del 20% al 45% en 3 meses.",
    },
  ],

  symptoms,
  actions,

  fallbackDiagnosis: {
    texto:
      "Tu servicio profesional tiene potencial de crecimiento, pero hay procesos administrativos y de captación que pueden estar frenándote. La buena noticia es que con cambios pequeños puedes liberar horas facturables y atraer mejores clientes.",
    beneficios: [
      "Recupera horas facturables perdidas en administración",
      "Consigue clientes de forma consistente sin depender solo de referidos",
      "Aumenta la rentabilidad de cada proyecto con precios estructurados",
    ],
    sugerencia:
      "Empieza por registrar tu tiempo durante una semana para entender exactamente a dónde se van tus horas. Ese dato solo ya te dará claridad sobre qué procesos automatizar primero.",
    plan: {
      dia_30: "Implementa registro de horas y crea 3 plantillas de propuestas",
      dia_60: "Automatiza facturación y configura seguimiento post-servicio",
      dia_90: "Activa tu portafolio web y programa de referidos estructurado",
    },
  },
}
