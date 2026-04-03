import type { PainPoint, BranchConfig, CompanySize, BudgetRange, Urgency, CurrentTool } from "./types"

// ============================
// Industry options
// ============================

export const INDUSTRIES = [
  { value: "restaurante", label: "Restaurante / Alimentos" },
  { value: "retail", label: "Retail / Tienda" },
  { value: "servicios_profesionales", label: "Servicios Profesionales" },
  { value: "salud", label: "Salud / Bienestar" },
  { value: "educacion", label: "Educacion / Capacitacion" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "manufactura", label: "Manufactura / Produccion" },
  { value: "logistica", label: "Logistica / Transporte" },
  { value: "otra", label: "Otra" },
] as const

// ============================
// Company size options
// ============================

export const COMPANY_SIZES: { value: CompanySize; label: string }[] = [
  { value: "solo", label: "Solo yo" },
  { value: "2_5", label: "2-5 empleados" },
  { value: "6_15", label: "6-15 empleados" },
  { value: "16_50", label: "16-50 empleados" },
  { value: "50_plus", label: "50+ empleados" },
]

// ============================
// Pain point options
// ============================

export const PAIN_POINTS: { value: PainPoint; label: string; description: string }[] = [
  {
    value: "procesos_manuales",
    label: "Procesos manuales",
    description: "Tareas repetitivas que consumen tiempo",
  },
  {
    value: "falta_visibilidad",
    label: "Falta de visibilidad",
    description: "No sabes como va tu negocio en tiempo real",
  },
  {
    value: "ventas_estancadas",
    label: "Ventas estancadas",
    description: "Crecimiento plano o decreciente",
  },
  {
    value: "presencia_online",
    label: "Presencia online debil",
    description: "Poca presencia digital o sin estrategia",
  },
  {
    value: "sin_trazabilidad",
    label: "Sin trazabilidad",
    description: "No puedes rastrear clientes o pedidos",
  },
  {
    value: "atencion_cliente",
    label: "Atencion al cliente",
    description: "Dificultad para dar seguimiento y soporte",
  },
  {
    value: "otro",
    label: "Otro",
    description: "Tengo un desafío diferente a los anteriores",
  },
]

// Industry to recommended pain points
export const INDUSTRY_PAIN_SUGGESTIONS: Record<string, PainPoint[]> = {
  restaurante: ["sin_trazabilidad", "atencion_cliente", "ventas_estancadas", "presencia_online"],
  retail: ["sin_trazabilidad", "ventas_estancadas", "presencia_online", "falta_visibilidad"],
  servicios_profesionales: ["falta_visibilidad", "atencion_cliente", "presencia_online"],
  salud: ["atencion_cliente", "falta_visibilidad", "sin_trazabilidad"],
  educacion: ["falta_visibilidad", "ventas_estancadas", "presencia_online"],
  inmobiliaria: ["ventas_estancadas", "falta_visibilidad", "sin_trazabilidad"],
  tecnologia: ["procesos_manuales", "falta_visibilidad", "presencia_online"],
  manufactura: ["procesos_manuales", "sin_trazabilidad", "falta_visibilidad"],
  logistica: ["sin_trazabilidad", "procesos_manuales", "falta_visibilidad"],
  otra: [],
}

export const INDUSTRY_PAIN_HINTS: Record<string, string[]> = {
  restaurante: [
    "Pérdidas por pedidos mal rastreados y administración de inventario dispersa.",
    "Atención al cliente lenta en servicios de entrega y recogida.",
    "Ventas estancadas en horarios no pico por falta de fidelización."
  ],
  retail: [
    "Control de inventario manual con errores frecuentes.",
    "Dificultad para captar clientes online frente a competencia de marketplace.",
    "Falta de métricas claras para decidir reposición de stock."
  ],
  servicios_profesionales: [
    "Seguimiento de clientes puntual es inconsistente y manual.",
    "Falta de visibilidad sobre proyectos y tiempos facturables.",
    "Poca presencia digital para atraer leads de alta calidad."
  ],
  salud: [
    "No hay proceso claro para seguimiento de pacientes y citas.",
    "Dificultad para medir satisfacción y retención de pacientes.",
    "Operaciones dispersas sin trazabilidad de tratamientos."
  ],
  educacion: [
    "Estructura de marketing online débil y baja conversión de alumnos.",
    "Información de estudiantes en hojas de cálculo, sin seguimiento.",
    "Sin visibilidad de operaciones de cursos y pagos recurrentes."
  ],
  inmobiliaria: [
    "Reporte de leads y avisos no centralizado en un solo lugar.",
    "Poco seguimiento a clientes potenciales y ausente CRM.",
    "Falta de visibilidad en KPIs de ventas y comisiones."
  ],
  tecnologia: [
    "Procesos internos manuales y poca automatización de proyectos.",
    "Falta de visibilidad de indicadores de producto y retención.",
    "Presencia online que no refleja la capacidad de soluciones avanzadas."
  ],
  manufactura: [
    "Trazabilidad parcial de inventario y unidades en producción.",
    "Alto tiempo en procesos manuales de órdenes y logística.",
    "Desconocimiento del rendimiento de maquinaria y costos operativos."
  ],
  logistica: [
    "Sin visibilidad en tiempo real de entregas y rutas.",
    "Procesos manuales de seguimiento de paquetes y comunicación.",
    "Falta de métricas para mejorar tiempos de entrega y costos."
  ],
  otra: [
    "Identifica los principales cuellos de botella con datos claros.",
    "Mejora la atención al cliente y automatiza procesos repetitivos.",
    "Define métricas clave para convertir esfuerzos en resultados."
  ],
}

export const INDUSTRY_PAIN_OVERRIDES: Record<
  string,
  Partial<Record<PainPoint, { label: string; description: string }>>
> = {
  restaurante: {
    procesos_manuales: {
      label: "Manos envueltas en procesos manuales",
      description: "Mucho tiempo en facturación, inventario y coordinación de entregas manuales.",
    },
    falta_visibilidad: {
      label: "Falta de visibilidad en operaciones y pedidos",
      description: "No tienes datos actualizados de ventas y estado de pedidos en tiempo real.",
    },
    ventas_estancadas: {
      label: "Ventas estancadas en horarios clave",
      description: "Dificultad para activar promociones y retener clientes recurrentes.",
    },
    presencia_online: {
      label: "Presencia online ineficiente",
      description: "La oferta digital no traslada las ventajas del restaurante a canales web o delivery.",
    },
    sin_trazabilidad: {
      label: "Problemas de trazabilidad de pedidos",
      description: "Pérdida y errores en pedidos, devoluciones y control de stock.",
    },
    atencion_cliente: {
      label: "Atención a cliente lenta y reactiva",
      description: "No puedes responder rápidamente a quejas, cambios y consultas de pedidos.",
    },
  },
  retail: {
    procesos_manuales: {
      label: "Procesos de inventario y reposición manuales",
      description: "Altos retrasos y errores en el recuento y movimiento de stock.",
    },
    falta_visibilidad: {
      label: "Visibilidad limitada de stock y ventas",
      description: "No observas en tiempo real qué productos se venden mejor.",
    },
    ventas_estancadas: {
      label: "Ventas planas frente a competencia online",
      description: "No logras aumentar ticket promedio ni recurrencia de clientes.",
    },
    presencia_online: {
      label: "Presencia digital débil",
      description: "Tu tienda tiene baja conversión en canales web y redes.",
    },
    sin_trazabilidad:
      {
        label: "Trazabilidad inconsistente de pedidos y clientes",
        description: "No sabes de dónde vienen los mejores clientes ni qué productos más se repiten.",
      },
    atencion_cliente:
      {
        label: "Seguimiento al cliente fragmentado",
        description: "No hay un historial de interacción unificado para mejorar fidelización.",
      },
  },
  servicios_profesionales: {
    procesos_manuales: {
      label: "Tareas administrativas repetitivas",
      description: "Mucho tiempo invertido en cotizaciones, facturas y seguimiento personal.",
    },
    falta_visibilidad: {
      label: "Falta de claridad en métricas de proyectos",
      description: "No puedes medir horas trabajadas ni estado real de clientes fácilmente.",
    },
    ventas_estancadas: {
      label: "Crecimiento de clientes lento",
      description: "Dificultad para convertir consultas en contratos regulares.",
    },
    presencia_online: {
      label: "Presencia digital que no vende",
      description: "Tu posicionamiento profesional no se traduce en leads cualificados.",
    },
    sin_trazabilidad: {
      label: "Sin registro de interacciones",
      description: "No se tiene trazabilidad de entregables y atención conjunta con el cliente.",
    },
    atencion_cliente: {
      label: "No hay seguimiento de casos",
      description: "No puedes mantener piezas de comunicación centralizada con cada cliente.",
    },
  },
  salud: {
    procesos_manuales: {
      label: "Tareas de agenda y expedientes manuales",
      description: "Gran carga en administración de citas y recetas físicas.",
    },
    falta_visibilidad: {
      label: "Visibilidad insuficiente de pacientes",
      description: "No ves rápidamente historial, citas y estado de atención.",
    },
    ventas_estancadas: {
      label: "Crecimiento de pacientes lento",
      description: "No atraes nuevos pacientes ni retienes los existentes de forma consistente.",
    },
    presencia_online: {
      label: "Presencia online poco clara",
      description: "No se comunica correctamente la propuesta de valor médica.",
    },
    sin_trazabilidad: {
      label: "Falta de trazabilidad de tratamientos",
      description: "Dificultad para rastrear procesos, remedios y resultados por paciente.",
    },
    atencion_cliente: {
      label: "Atención al paciente lenta",
      description: "No responde a urgencias, consultas y seguimientos con celeridad.",
    },
  },
  educacion: {
    procesos_manuales: {
      label: "Inscripciones y control con hojas de cálculo",
      description: "Demasiado tiempo en manejar listas, cobros y rotación de cursos.",
    },
    falta_visibilidad: {
      label: "Falta de datos de rendimiento académico",
      description: "No mides participación, tasas de aprobación ni abandono con claridad.",
    },
    ventas_estancadas: {
      label: "Estancamiento de matrículas",
      description: "No crece el número de estudiantes ni se retiene a los actuales.",
    },
    presencia_online: {
      label: "Marketing digital limitado",
      description: "Tu oferta educativa no llega con fuerza a nuevos segmentos.",
    },
    sin_trazabilidad:
      {
        label: "Falta de seguimiento en el ciclo estudiantil",
        description: "No puedes rastrear avances desde intento hasta certificación.",
      },
    atencion_cliente:
      {
        label: "Atención estudiantil dispersa",
        description: "Los canales de apoyos son desordenados y con respuestas lentas.",
      },
  },
  inmobiliaria: {
    procesos_manuales: {
      label: "Gestión de propiedades y clientes en excel",
      description: "Tiempo perdido en actualizar listados y status de visitas.",
    },
    falta_visibilidad: {
      label: "Sin métricas de cierre y pipeline",
      description: "No sabes qué etapa tiene cada prospecto ni qué propiedades rotan.",
    },
    ventas_estancadas: {
      label: "Cierre de ventas lento",
      description: "No alcanzás la velocidad de conversión necesaria en el ciclo.",
    },
    presencia_online: {
      label: "Presencia digital poco atractiva",
      description: "Los inmuebles no reciben visitas cualificadas en línea.",
    },
    sin_trazabilidad: {
      label: "No rastreas la comunicación con clientes",
      description: "Pierdes contexto entre corredores y managers en cada lead.",
    },
    atencion_cliente: {
      label: "Seguimiento de interesados deficiente",
      description: "No hay protocolos de seguimiento ni recordatorios automáticos.",
    },
  },
  tecnologia: {
    procesos_manuales: {
      label: "Manejo manual de proyectos y tareas",
      description: "Tiempo excesivo en actualizaciones manuales de avances.",
    },
    falta_visibilidad: {
      label: "Sin métricas de performance de producto",
      description: "Dificultad para monitorear adopción, churn y velocidad de desarrollo.",
    },
    ventas_estancadas: {
      label: "Ventastecnológicas estancadas",
      description: "Falta una estrategia para convertir pruebas en suscripciones.",
    },
    presencia_online: {
      label: "Posicionamiento digital subutilizado",
      description: "No explota bien el contenido técnico ni los casos de éxito.",
    },
    sin_trazabilidad: {
      label: "Sin rastreo en el ciclo de life del cliente",
      description: "No conoces los puntos de fragilidad desde onboard hasta soporte.",
    },
    atencion_cliente: {
      label: "Soporte descoordinado",
      description: "No hay flujo claro entre incidencia, triage y resolución.",
    },
  },
  manufactura: {
    procesos_manuales: {
      label: "Procesos productivos manuales",
      description: "Operaciones y control de calidad dependen de hojas y controles manuales.",
    },
    falta_visibilidad: {
      label: "Visibilidad de planta reducida",
      description: "No tienes dashboards en tiempo real de eficiencia y desperdicio.",
    },
    ventas_estancadas: {
      label: "Crecimiento de clientes industriales lento",
      description: "No hay rutas claras para escalar producción con nuevos contratos.",
    },
    presencia_online: {
      label: "Comercial digital poco usado",
      description: "No capitalizas el canal para calidad y certificaciones en la oferta.",
    },
    sin_trazabilidad: {
      label: "Trazabilidad de inventarios débil",
      description: "No registras control completo de materias primas y stock final.",
    },
    atencion_cliente: {
      label: "Relación con compradores improductiva",
      description: "Seguimiento de pedidos y feedback carece de automatización.",
    },
  },
  logistica: {
    procesos_manuales: {
      label: "Procesos manuales de rutas y entregas",
      description: "No hay optimización automatizada de asignación ni rutas.",
    },
    falta_visibilidad: {
      label: "Visibilidad en tiempo real inexistente",
      description: "No se pueden monitorear entregas ni status de envíos facilmente.",
    },
    ventas_estancadas: {
      label: "Crecimiento de contratos logísticos lento",
      description: "No logras escalar capacidad con seguridad ni trazabilidad.",
    },
    presencia_online: {
      label: "Oferta digital poco clara",
      description: "Tu servicio no se diferencia como solución integral online.",
    },
    sin_trazabilidad: {
      label: "Trazabilidad de paquetes y rutas deficiente",
      description: "Flujo de datos fragmentado entre clientes y transporte.",
    },
    atencion_cliente: {
      label: "Respuestas lentas a clientes",
      description: "No tienes alerta rápida sobre problemas de entrega o seguimiento.",
    },
  },
  otra: {},
}

// ============================
// Current tools

// ============================
// Current tools
// ============================

export const CURRENT_TOOLS: { value: CurrentTool; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "excel", label: "Excel / Hojas de calculo" },
  { value: "crm_basico", label: "CRM basico" },
  { value: "redes_sociales", label: "Redes sociales" },
  { value: "email_manual", label: "Email manual" },
  { value: "nada", label: "Nada / Todo manual" },
  { value: "otro", label: "Otro" },
]

// ============================
// Budget ranges
// ============================

export const BUDGET_RANGES: { value: BudgetRange; label: string }[] = [
  { value: "menos_500", label: "Menos de $500 USD/mes" },
  { value: "500_1500", label: "$500 - $1,500 USD/mes" },
  { value: "1500_3000", label: "$1,500 - $3,000 USD/mes" },
  { value: "3000_plus", label: "Mas de $3,000 USD/mes" },
  { value: "no_definido", label: "Aun no lo he definido" },
]

// ============================
// Urgency options
// ============================

export const URGENCY_OPTIONS: { value: Urgency; label: string }[] = [
  { value: "inmediata", label: "Lo necesito ya" },
  { value: "1_3_meses", label: "En 1-3 meses" },
  { value: "3_6_meses", label: "En 3-6 meses" },
  { value: "solo_explorando", label: "Solo estoy explorando" },
]

// ============================
// Branching questions per pain point (Step 2)
// ============================

export const BRANCH_CONFIGS: BranchConfig[] = [
  {
    pain: "procesos_manuales",
    title: "Procesos manuales",
    fields: [
      {
        id: "proceso_mas_lento",
        label: "Cual es el proceso que mas tiempo te consume?",
        type: "select",
        options: [
          { value: "facturacion", label: "Facturación" },
          { value: "inventario", label: "Inventario" },
          { value: "seguimiento_pedidos", label: "Seguimiento de pedidos" },
          { value: "nomina_rrhh", label: "Nómina / Recursos humanos" },
          { value: "reportes", label: "Reportes / Contabilidad" },
          { value: "comunicacion", label: "Comunicación interna" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        id: "horas_semana",
        label: "Cuantas horas a la semana dedicas a tareas repetitivas?",
        type: "select",
        options: [
          { value: "menos_5", label: "Menos de 5 horas" },
          { value: "5_15", label: "5-15 horas" },
          { value: "15_30", label: "15-30 horas" },
          { value: "mas_30", label: "Mas de 30 horas" },
        ],
      },
    ],
  },
  {
    pain: "falta_visibilidad",
    title: "Falta de visibilidad",
    fields: [
      {
        id: "metricas_actuales",
        label: "Que metricas monitoreas actualmente?",
        type: "select",
        options: [
          { value: "ventas", label: "Ventas mensuales" },
          { value: "inventario", label: "Inventario" },
          { value: "satisfaccion", label: "Satisfacción del cliente" },
          { value: "gastos", label: "Gastos / Costos" },
          { value: "ninguna", label: "Ninguna" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        id: "decisiones_datos",
        label: "Como tomas decisiones hoy?",
        type: "select",
        options: [
          { value: "intuicion", label: "Por intuicion" },
          { value: "datos_basicos", label: "Con datos basicos (Excel)" },
          { value: "reportes", label: "Con reportes estructurados" },
          { value: "otro", label: "Otro" },
        ],
      },
    ],
  },
  {
    pain: "ventas_estancadas",
    title: "Ventas estancadas",
    fields: [
      {
        id: "canal_principal",
        label: "Cual es tu canal principal de ventas?",
        type: "select",
        options: [
          { value: "tienda_fisica", label: "Tienda fisica" },
          { value: "online", label: "Tienda online" },
          { value: "redes", label: "Redes sociales" },
          { value: "referidos", label: "Referidos / Boca a boca" },
          { value: "mixto", label: "Mixto" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        id: "problema_ventas",
        label: "Cual crees que es el principal freno de tus ventas?",
        type: "select",
        options: [
          { value: "pocos_leads", label: "Pocos leads / prospectos" },
          { value: "mal_seguimiento", label: "Mal seguimiento de clientes" },
          { value: "competencia_precios", label: "Competencia de precios" },
          { value: "falta_marketing", label: "Falta de marketing" },
          { value: "proceso_largo", label: "Proceso de venta largo" },
          { value: "otro", label: "Otro" },
        ],
      },
    ],
  },
  {
    pain: "presencia_online",
    title: "Presencia online debil",
    fields: [
      {
        id: "presencia_actual",
        label: "Que presencia online tienes actualmente?",
        type: "select",
        options: [
          { value: "nada", label: "Ninguna" },
          { value: "redes_basicas", label: "Redes sociales basicas" },
          { value: "web_basica", label: "Web basica / landing" },
          { value: "web_completa", label: "Web completa + redes" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        id: "objetivo_online",
        label: "Que te gustaria lograr con tu presencia online?",
        type: "select",
        options: [
          { value: "mas_clientes", label: "Conseguir más clientes" },
          { value: "mejor_imagen", label: "Mejorar imagen de marca" },
          { value: "vender_online", label: "Vender online" },
          { value: "generar_confianza", label: "Generar confianza" },
          { value: "automatizar", label: "Automatizar captación de leads" },
          { value: "otro", label: "Otro" },
        ],
      },
    ],
  },
  {
    pain: "sin_trazabilidad",
    title: "Sin trazabilidad",
    fields: [
      {
        id: "que_rastrear",
        label: "Que es lo mas importante que necesitas rastrear?",
        type: "select",
        options: [
          { value: "clientes", label: "Clientes y contactos" },
          { value: "pedidos", label: "Pedidos y entregas" },
          { value: "inventario", label: "Inventario" },
          { value: "todo", label: "Todo lo anterior" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        id: "perdida_trazabilidad",
        label: "Que problemas te ha causado no tener trazabilidad?",
        type: "select",
        options: [
          { value: "pedidos_perdidos", label: "Pedidos perdidos" },
          { value: "clientes_insatisfechos", label: "Clientes insatisfechos" },
          { value: "retrasos", label: "Retrasos en entregas" },
          { value: "perdida_inventario", label: "Pérdida de inventario" },
          { value: "sin_seguimiento", label: "Falta de seguimiento postventa" },
          { value: "otro", label: "Otro" },
        ],
      },
    ],
  },
  {
    pain: "atencion_cliente",
    title: "Atencion al cliente",
    fields: [
      {
        id: "canales_atencion",
        label: "Por que canales atiendes a tus clientes?",
        type: "select",
        options: [
          { value: "whatsapp_solo", label: "Solo WhatsApp" },
          { value: "telefono", label: "Telefono" },
          { value: "email", label: "Email" },
          { value: "varios", label: "Varios canales sin centralizar" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        id: "problema_atencion",
        label: "Cual es tu mayor desafio con la atencion al cliente?",
        type: "select",
        options: [
          { value: "tiempo_respuesta", label: "Tiempo de respuesta lento" },
          { value: "falta_seguimiento", label: "Falta de seguimiento" },
          { value: "alto_volumen", label: "Alto volumen de consultas" },
          { value: "canales_desorganizados", label: "Canales desorganizados" },
          { value: "clientes_insatisfechos", label: "Clientes insatisfechos" },
          { value: "otro", label: "Otro" },
        ],
      },
    ],
  },
]

// ============================
// Analysis animation messages (Step 3)
// ============================

export const ANALYSIS_MESSAGES = [
  "Analizando tu industria y mercado...",
  "Evaluando tus procesos actuales...",
  "Calculando impacto potencial...",
  "Identificando oportunidades de mejora...",
  "Preparando tu diagnostico personalizado...",
]

// ============================
// Simulated follow-up questions per industry (Step 3)
// ============================

export interface SimulatedQuestionWithOptions {
  question: string
  options: { value: string; label: string }[]
}

export const SIMULATED_QUESTIONS: Record<string, SimulatedQuestionWithOptions[]> = {
  restaurante: [
    {
      question: "¿Cuántos pedidos manejan en promedio por día?",
      options: [
        { value: "menos_20", label: "Menos de 20" },
        { value: "20_50", label: "20-50" },
        { value: "50_100", label: "50-100" },
        { value: "mas_100", label: "Más de 100" },
      ],
    },
    {
      question: "¿Tienen un sistema de reservas o delivery propio?",
      options: [
        { value: "ambos", label: "Sí, ambos" },
        { value: "solo_reservas", label: "Solo reservas" },
        { value: "solo_delivery", label: "Solo delivery" },
        { value: "no", label: "No tenemos" },
        { value: "otro", label: "Otro" },
      ],
    },
  ],
  retail: [
    {
      question: "¿Cuántos productos o SKUs manejas aproximadamente?",
      options: [
        { value: "menos_50", label: "Menos de 50" },
        { value: "50_200", label: "50-200" },
        { value: "200_1000", label: "200-1,000" },
        { value: "mas_1000", label: "Más de 1,000" },
      ],
    },
    {
      question: "¿Vendes por algún canal online actualmente?",
      options: [
        { value: "tienda_propia", label: "Sí, tienda propia" },
        { value: "marketplace", label: "Marketplace (Amazon, MercadoLibre, etc.)" },
        { value: "redes", label: "Redes sociales" },
        { value: "no", label: "No vendo online" },
        { value: "otro", label: "Otro" },
      ],
    },
  ],
  servicios_profesionales: [
    {
      question: "¿Cuántos clientes activos tienes al mes?",
      options: [
        { value: "menos_10", label: "Menos de 10" },
        { value: "10_30", label: "10-30" },
        { value: "30_50", label: "30-50" },
        { value: "mas_50", label: "Más de 50" },
      ],
    },
    {
      question: "¿Cómo gestionas tus citas y seguimiento actualmente?",
      options: [
        { value: "manual", label: "Manual (papel / correo)" },
        { value: "calendario", label: "Calendario digital (Google, Outlook)" },
        { value: "software", label: "Software especializado" },
        { value: "no_gestiono", label: "No lo gestiono" },
        { value: "otro", label: "Otro" },
      ],
    },
  ],
  salud: [
    {
      question: "¿Cuántos pacientes atiendes por semana?",
      options: [
        { value: "menos_20", label: "Menos de 20" },
        { value: "20_50", label: "20-50" },
        { value: "50_100", label: "50-100" },
        { value: "mas_100", label: "Más de 100" },
      ],
    },
    {
      question: "¿Tienes un sistema de agendamiento digital?",
      options: [
        { value: "si", label: "Sí, lo uso activamente" },
        { value: "basico", label: "Tengo uno básico" },
        { value: "no", label: "No tengo" },
        { value: "otro", label: "Otro" },
      ],
    },
  ],
  educacion: [
    {
      question: "¿Cuántos alumnos o participantes tienes activos?",
      options: [
        { value: "menos_20", label: "Menos de 20" },
        { value: "20_50", label: "20-50" },
        { value: "50_200", label: "50-200" },
        { value: "mas_200", label: "Más de 200" },
      ],
    },
    {
      question: "¿Ofreces cursos online o presenciales?",
      options: [
        { value: "online", label: "Solo online" },
        { value: "presencial", label: "Solo presenciales" },
        { value: "ambos", label: "Ambos" },
        { value: "planeando", label: "Estoy planeando" },
        { value: "otro", label: "Otro" },
      ],
    },
  ],
  inmobiliaria: [
    {
      question: "¿Cuántas propiedades manejas actualmente?",
      options: [
        { value: "menos_10", label: "Menos de 10" },
        { value: "10_30", label: "10-30" },
        { value: "30_100", label: "30-100" },
        { value: "mas_100", label: "Más de 100" },
      ],
    },
    {
      question: "¿Cómo gestionas el seguimiento con prospectos?",
      options: [
        { value: "manual", label: "Manual (Excel / papel)" },
        { value: "crm", label: "CRM" },
        { value: "whatsapp", label: "WhatsApp" },
        { value: "no_gestiono", label: "No lo gestiono" },
        { value: "otro", label: "Otro" },
      ],
    },
  ],
  tecnologia: [
    {
      question: "¿Qué tipo de clientes atienden (B2B o B2C)?",
      options: [
        { value: "b2b", label: "B2B (empresas)" },
        { value: "b2c", label: "B2C (consumidores)" },
        { value: "ambos", label: "Ambos" },
        { value: "otro", label: "Otro" },
      ],
    },
    {
      question: "¿Cuántos proyectos activos manejan al mismo tiempo?",
      options: [
        { value: "menos_5", label: "Menos de 5" },
        { value: "5_10", label: "5-10" },
        { value: "10_20", label: "10-20" },
        { value: "mas_20", label: "Más de 20" },
      ],
    },
  ],
  manufactura: [
    {
      question: "¿Cuántas líneas de producción manejas?",
      options: [
        { value: "una", label: "1 línea" },
        { value: "2_5", label: "2-5 líneas" },
        { value: "mas_5", label: "Más de 5 líneas" },
        { value: "otro", label: "Otro" },
      ],
    },
    {
      question: "¿Tienes control de inventario digitalizado?",
      options: [
        { value: "si", label: "Sí, completamente" },
        { value: "parcial", label: "Parcialmente" },
        { value: "no", label: "No, todo manual" },
        { value: "otro", label: "Otro" },
      ],
    },
  ],
  logistica: [
    {
      question: "¿Cuántos envíos manejas por semana?",
      options: [
        { value: "menos_50", label: "Menos de 50" },
        { value: "50_200", label: "50-200" },
        { value: "200_500", label: "200-500" },
        { value: "mas_500", label: "Más de 500" },
      ],
    },
    {
      question: "¿Tienen sistema de rastreo para sus clientes?",
      options: [
        { value: "si", label: "Sí, completo" },
        { value: "basico", label: "Básico" },
        { value: "no", label: "No tenemos" },
        { value: "otro", label: "Otro" },
      ],
    },
  ],
  otra: [
    {
      question: "¿Cuántas personas interactúan con tus clientes diariamente?",
      options: [
        { value: "1_2", label: "1-2 personas" },
        { value: "3_5", label: "3-5 personas" },
        { value: "6_10", label: "6-10 personas" },
        { value: "mas_10", label: "Más de 10" },
      ],
    },
    {
      question: "¿Qué porcentaje de tus procesos están digitalizados?",
      options: [
        { value: "nada", label: "0% — Todo manual" },
        { value: "poco", label: "1-25%" },
        { value: "medio", label: "26-50%" },
        { value: "bastante", label: "51-75%" },
        { value: "mucho", label: "76-100%" },
      ],
    },
  ],
}

// ============================
// Pipeline stages
// ============================

export const PIPELINE_STAGES = [
  { value: "wizard_completado" as const, label: "Wizard Completado", color: "bg-blue-100 text-blue-800" },
  { value: "email_enviado" as const, label: "Email Enviado", color: "bg-amber-100 text-amber-800" },
  { value: "llamada_agendada" as const, label: "Llamada Agendada", color: "bg-emerald-100 text-emerald-800" },
  { value: "cerrado" as const, label: "Cerrado", color: "bg-green-100 text-green-800" },
  { value: "archivado" as const, label: "Archivado", color: "bg-zinc-100 text-zinc-600" },
]
