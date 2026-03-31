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
        type: "textarea",
        placeholder: "Ej: Facturacion, inventario, seguimiento de pedidos...",
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
        type: "textarea",
        placeholder: "Ej: Ventas mensuales, inventario, satisfaccion del cliente...",
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
        type: "textarea",
        placeholder: "Ej: Pocos leads, mal seguimiento, competencia de precios...",
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
        type: "textarea",
        placeholder: "Ej: Mas clientes, mejor imagen, vender online...",
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
        type: "textarea",
        placeholder: "Ej: Pedidos perdidos, clientes insatisfechos...",
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
        type: "textarea",
        placeholder: "Ej: Tiempo de respuesta, seguimiento, volumen...",
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

export const SIMULATED_QUESTIONS: Record<string, string[]> = {
  restaurante: [
    "Cuantos pedidos manejan en promedio por dia?",
    "Tienen un sistema de reservas o delivery propio?",
  ],
  retail: [
    "Cuantos productos o SKUs manejas aproximadamente?",
    "Vendes por algun canal online actualmente?",
  ],
  servicios_profesionales: [
    "Cuantos clientes activos tienes al mes?",
    "Como gestionas tus citas y seguimiento actualmente?",
  ],
  salud: [
    "Cuantos pacientes atiendes por semana?",
    "Tienes un sistema de agendamiento digital?",
  ],
  educacion: [
    "Cuantos alumnos o participantes tienes activos?",
    "Ofreces cursos online o presenciales?",
  ],
  inmobiliaria: [
    "Cuantas propiedades manejas actualmente?",
    "Como gestionas el seguimiento con prospectos?",
  ],
  tecnologia: [
    "Que tipo de clientes atienden (B2B o B2C)?",
    "Cuantos proyectos activos manejan al mismo tiempo?",
  ],
  manufactura: [
    "Cuantas lineas de produccion manejas?",
    "Tienes control de inventario digitalizado?",
  ],
  logistica: [
    "Cuantos envios manejas por semana?",
    "Tienen sistema de rastreo para sus clientes?",
  ],
  otra: [
    "Cuantas personas interactuan con tus clientes diariamente?",
    "Que porcentaje de tus procesos estan digitalizados?",
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
