import type { KnowledgePack, KnowledgeSymptom, KnowledgeAction } from "./types"

const symptoms: KnowledgeSymptom[] = [
  {
    id: "sa_agenda_manual",
    nombre: "Agenda de citas en papel o WhatsApp sin sistema",
    descripcion: "Las citas se registran manualmente, se duplican o se pierden, generando malos tiempos y clientes insatisfechos.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "sa_sin_historial_digital",
    nombre: "Sin historial clínico digital",
    descripcion: "Los expedientes están en papel o no existen, dificultando el seguimiento y la continuidad del tratamiento.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "sa_cobranza_inexacta",
    nombre: "Cobranza manual sin conciliación",
    descripcion: "Los pagos se registran en cuaderno, no hay conciliación automática con facturación ni reportes de ingresos.",
    categoria: "datos",
    industryOnly: true,
  },
  {
    id: "sa_sin_recordatorios",
    nombre: "Sin sistema de recordatorios de citas",
    descripcion: "No se envían recordatorios automáticos, alta tasa de no-shows que deja sillas vacías.",
    categoria: "retencion",
    industryOnly: true,
  },
  {
    id: "sa_dependencia_referidos",
    nombre: "Dependencia total de referidos",
    descripcion: "Todos los pacientes llegan por boca en boca, sin presencia digital activa para atraer nuevos.",
    categoria: "captacion",
    industryOnly: true,
  },
  {
    id: "sa_sin_telemedicina",
    nombre: "Sin opciones de teleconsulta",
    descripcion: "No ofrece consultas por videollamada, perdiendo pacientes que no pueden asistir presencialmente.",
    categoria: "ventas",
    industryOnly: true,
  },
  {
    id: "sa_inventario_descontrolado",
    nombre: "Inventario de insumos sin control",
    descripcion: "No se sabe cuántos insumos hay, cuándo reponer ni cuánto se gasta por tratamiento.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "sa_sin_feedback_paciente",
    nombre: "Sin encuesta de satisfacción",
    descripcion: "No mide la satisfacción del paciente, no detecta problemas de servicio ni oportunidades de mejora.",
    categoria: "retencion",
    industryOnly: true,
  },
  {
    id: "sa_redes_sin_contenido",
    nombre: "Redes sociales sin contenido educativo",
    descripcion: "No publica contenido de valor que posicione al profesional como referente en su especialidad.",
    categoria: "presencia_digital",
    industryOnly: true,
  },
]

const actions: KnowledgeAction[] = [
  {
    id: "sa_implementar_agenda_digital",
    titulo: "Implementar agenda digital con recordatorios",
    descripcion: "Usar sistema de citas con recordatorios automáticos por SMS/WhatsApp para reducir no-shows.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "sa_crear_historial_digital",
    titulo: "Digitalizar historial clínico",
    descripcion: "Migrar expedientes a sistema digital con acceso rápido, respaldo y cumplimiento normativo.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "sa_automatizar_cobros",
    titulo: "Automatizar facturación y cobros",
    descripcion: "Configurar facturación automática, pagos con terminal digital y conciliación bancaria.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "sa_activar_google_business",
    titulo: "Activar y optimizar Google Business",
    descripcion: "Registrar el consultorio, subir fotos, horarios, responder reseñas y publicar novedades.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "sa_encuesta_satisfaccion",
    titulo: "Implementar encuesta de satisfacción",
    descripcion: "Enviar encuesta automática post-consulta para medir experiencia y detectar mejoras.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "sa_contenido_educativo",
    titulo: "Crear contenido educativo en redes",
    descripcion: "Publicar consejos, mitos y tips de salud relevantes para posicionar al profesional como referente.",
    presupuestoRequerido: "bajo",
    impacto: "largo_plazo",
    industryOnly: true,
  },
  {
    id: "sa_inventario_insumos",
    titulo: "Digitalizar control de insumos",
    descripcion: "Sistema de inventario con alertas de stock mínimo y seguimiento de gasto por tratamiento.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "sa_teleconsulta_opcion",
    titulo: "Ofrecer teleconsulta como canal",
    descripcion: "Implementar videollamadas para consultas de seguimiento, reduciendo barreras de acceso.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
]

export const SALUD_PACK: KnowledgePack = {
  industryCode: "salud",
  industryLabel: "Salud / Bienestar",

  subsectors: {
    dental: "Clínica dental",
    medico: "Consultorio médico",
    psicologia: "Psicología / Terapia",
    nutricion: "Nutrición / Dietética",
    estetica: "Estética / Dermatología",
    fisioterapia: "Fisioterapia / Rehabilitación",
    farmacia: "Farmacia",
    otro: "Otro servicio de salud",
  },

  diagnosticFocus: [
    "Gestión de citas y agenda",
    "Historial clínico y continuidad de tratamiento",
    "Facturación y cobranza",
    "Retención de pacientes y recordatorios",
    "Presencia digital y captación de nuevos pacientes",
    "Control de insumos y materiales",
  ],

  promptGuidance: `Este negocio es de SALUD / BIENESTAR (consultorio médico, dental, psicología, nutrición, estética, fisioterapia, etc.).
NO trates este negocio como un restaurante, tienda o consultoría. NO menciones "menú", "inventario de productos", "pedidos" ni "delivery".

DATOS DISPONIBLES en respuestas_branch (úsalos para personalizar):
- tipo_practica: tipo de práctica (dental, médico, psicología, nutrición, estética, fisioterapia)
- como_gestionas_citas: cómo gestiona citas (agenda_papel, whatsapp, sistema_digital)
- tienes_teleconsulta: si ofrece teleconsulta
- como_cobras: cómo cobra (efectivo, terminal, plataforma, mixto)
- como_atraes_pacientes: cómo atrae nuevos pacientes (referidos, redes, google, publicidad)
- Porcentaje de no-shows (si lo conoce)
- Si tiene sistema de recordatorios automáticos
- Si digitalizó historiales clínicos

Enfócate en:
- Cómo gestiona agenda y citas (usa como_gestionas_citas)
- Si tiene historial clínico digital y continuidad de tratamiento
- Cómo cobra y factura (usa como_cobras)
- Retención: recordatorios, seguimiento, satisfacción
- Presencia digital y captación de pacientes (usa como_atraes_pacientes)
- Control de insumos y materiales clínicos`,

  maturityDimensions: [
    {
      nombre: "Gestión de citas",
      descripcion: "Agenda, recordatorios y seguimiento",
      niveles: [
        "Agenda en papel o WhatsApp sin estructura",
        "Agenda digital sin recordatorios",
        "Sistema de citas con recordatorios automáticos",
        "Agenda integrada con historia clínica",
        "Sistema completo con teleconsulta y métricas",
      ],
    },
    {
      nombre: "Historial clínico",
      descripcion: "Expediente y continuidad del tratamiento",
      niveles: [
        "Expediente en papel sin respaldo digital",
        "Fotos o escaneos sin organización",
        "Software de expediente clínico básico",
        "Historial digital con búsqueda y alertas",
        "Sistema integrado con imágenes, labs y evolución",
      ],
    },
    {
      nombre: "Captación de pacientes",
      descripcion: "Canales para atraer nuevos pacientes",
      niveles: [
        "Solo referidos y boca en boca",
        "Google Business activo sin estrategia",
        "Redes sociales con contenido regular",
        "Contenido educativo + encuestas de satisfacción",
        "Embudo digital completo con teleconsulta",
      ],
    },
  ],

  benchmarks: [
    {
      metrica: "Tasa de no-shows",
      valor: "15-25%",
      descripcion: "Porcentaje de citas que el paciente no cancela ni asiste en consultorios PYME",
    },
    {
      metrica: "Costo por adquisición de paciente",
      valor: "$15-40 USD",
      descripcion: "Costo promedio para atraer un nuevo paciente vía digital",
    },
    {
      metrica: "Pacientes recurrentes",
      valor: "40-60%",
      descripcion: "Porcentaje de pacientes que regresan en 6 meses",
    },
    {
      metrica: "Ticket promedio por consulta",
      valor: "$25-80 USD",
      descripcion: "Ingreso promedio por consulta en servicios de salud PYME",
    },
    {
      metrica: "Ocupación de agenda",
      valor: "60-75%",
      descripcion: "Porcentaje de citas disponibles que se llenan en un mes típico",
    },
  ],

  successStories: [
    {
      empresa: "DentalSonrisa",
      problema: "Tenían 25% de no-shows y perdían 10 horas semanales en llamadas de confirmación.",
      solucion: "Implementaron agenda digital con recordatorios automáticos por WhatsApp 48h y 2h antes.",
      resultado: "Redujeron no-shows al 8% y liberaron 8 horas semanales para atender más pacientes.",
    },
    {
      empresa: "NutriVida",
      problema: "El 90% de pacientes llegaba por referido, sin canal digital para atraer nuevos.",
      solucion: "Activaron Google Business, crearon contenido educativo en Instagram y habilitaron teleconsulta.",
      resultado: "Aumentaron pacientes nuevos un 50% en 4 meses y la teleconsulta generó 15% de ingresos adicionales.",
    },
  ],

  symptoms,
  actions,

  fallbackDiagnosis: {
    texto:
      "Tu consultorio tiene oportunidades claras para mejorar la gestión de citas, reducir no-shows y atraer más pacientes con presencia digital. Con herramientas básicas puedes optimizar tu tiempo y aumentar ingresos.",
    beneficios: [
      "Reduce no-shows con recordatorios automáticos",
      "Atrae más pacientes sin depender solo de referidos",
      "Optimiza tu tiempo con agenda digital",
    ],
    sugerencia:
      "Empieza por implementar recordatorios automáticos por WhatsApp 48 horas antes de cada cita. Eso solo puede reducir tus no-shows a la mitad.",
    plan: {
      dia_30: "Implementa agenda digital con recordatorios automáticos",
      dia_60: "Activa Google Business y empieza a publicar contenido educativo",
      dia_90: "Digitaliza historiales clínicos y lanza encuesta de satisfacción",
    },
  },
}
