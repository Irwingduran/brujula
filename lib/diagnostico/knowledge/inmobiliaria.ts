import type { KnowledgePack, KnowledgeSymptom, KnowledgeAction } from "./types"

const symptoms: KnowledgeSymptom[] = [
  {
    id: "im_sin_crm_leads",
    nombre: "Sin CRM para seguimiento de prospectos",
    descripcion: "Los leads se gestionan en Excel, WhatsApp suelto o la memoria, se pierden prospectos por falta de seguimiento.",
    categoria: "captacion",
    industryOnly: true,
  },
  {
    id: "im_listings_desactualizados",
    nombre: "Inventarios de propiedades desactualizados",
    descripcion: "Los avisos en portales no se actualizan, propiedades vendidas siguen publicadas, generando frustración.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "im_sin_fotos_profesionales",
    nombre: "Fotos de propiedades sin calidad profesional",
    descripcion: "Las fotos son con celular, sin iluminación ni composición, no transmiten el valor del inmueble.",
    categoria: "presencia_digital",
    industryOnly: true,
  },
  {
    id: "im_dependencia_portales",
    nombre: "Dependencia total de portales inmobiliarios",
    descripcion: "Todos los leads vienen de Inmuebles24 o Properati, sin canal propio ni estrategia de captación.",
    categoria: "captacion",
    industryOnly: true,
  },
  {
    id: "im_procesos_papel",
    nombre: "Documentos y contratos en papel",
    descripcion: "Contratos, avalúos y documentos se manejan físicamente, sin firma digital ni respaldo.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "im_sin_seguimiento_postventa",
    nombre: "Sin seguimiento post-venta",
    descripcion: "Una vez cerrada la venta no se contacta al cliente, se pierde la oportunidad de referidos y servicios adicionales.",
    categoria: "retencion",
    industryOnly: true,
  },
  {
    id: "im_precios_no_datados",
    nombre: "Precios de propiedades sin análisis de mercado",
    descripcion: "Los precios se ponen por instinto del agente, sin comparables ni datos de mercado actualizados.",
    categoria: "datos",
    industryOnly: true,
  },
  {
    id: "im_sin_tour_virtual",
    nombre: "Sin tours virtuales ni recorridos 3D",
    descripcion: "Los compradores remotos no pueden ver la propiedad sin visitarla, perdiendo prospectos de fuera de la ciudad.",
    categoria: "ventas",
    industryOnly: true,
  },
  {
    id: "im_financiamiento_sin_opciones",
    nombre: "Sin opciones de financiamiento",
    descripcion: "No ofrece alternativas de crédito o planes de pago, perdiendo compradores que no tienen efectivo.",
    categoria: "ventas",
    industryOnly: true,
  },
]

const actions: KnowledgeAction[] = [
  {
    id: "im_implementar_crm",
    titulo: "Implementar CRM inmobiliario",
    descripcion: "Usar CRM con pipeline de leads, recordatorios de seguimiento y etiquetas de interesados por propiedad.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "im_sincronizar_portales",
    titulo: "Sincronizar inventario en portales",
    descripcion: "Conectar listings con sistema central para actualizar automáticamente en todos los portales.",
    presupuestoRequerido: "medio",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "im_fotos_profesionales",
    titulo: "Invertir en fotografía profesional",
    descripcion: "Sesión fotográfica profesional para las propiedades destacadas, incluyendo drone si aplica.",
    presupuestoRequerido: "medio",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "im_tour_virtual",
    titulo: "Crear tours virtuales 3D",
    descripcion: "Usar Matterport o similar para recorridos virtuales que atraigan compradores remotos.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "im_web_con_listings",
    titulo: "Crear sitio web con listings propios",
    descripcion: "Sitio web con propiedades, filtros, búsqueda y formulario de contacto para captar leads propios.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "im_google_business",
    titulo: "Activar Google Business para la agencia",
    descripcion: "Registrar la agencia, horarios, reseñas de clientes y fotos de propiedades vendidas.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "im_seguimiento_automatico",
    titulo: "Automatizar seguimiento de leads",
    descripcion: "Configurar emails o WhatsApp automáticos de seguimiento a prospectos interesados en propiedades.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "im_firma_digital",
    titulo: "Implementar firma digital de contratos",
    descripcion: "Usar herramienta de firma electrónica para agilizar cierres sin necesidad de reuniones presenciales.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "im_analisis_mercado",
    titulo: "Crear reporte de análisis de mercado",
    descripcion: "Generar reportes automáticos con precios por zona, tendencias y comparables para fijar precios.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
]

export const INMOBILIARIA_PACK: KnowledgePack = {
  industryCode: "inmobiliaria",
  industryLabel: "Inmobiliaria",

  subsectors: {
    venta_residencial: "Venta residencial",
    renta_vacacional: "Renta vacacional / Airbnb",
    desarrollo: "Desarrollo inmobiliario",
    asesoria: "Asesoría inmobiliaria",
    administracion: "Administración de propiedades",
    comercial: "Bienes raíces comerciales",
    otro: "Otro sector inmobiliario",
  },

  diagnosticFocus: [
    "Gestión de leads y pipeline de ventas",
    "Inventario de propiedades y portales",
    "Marketing digital y presencia online",
    "Procesos de cierre y documentación",
    "Seguimiento post-venta y referidos",
    "Análisis de mercado y pricing",
  ],

  promptGuidance: `Este negocio es de INMOBILIARIA (venta, renta, desarrollo, administración de propiedades).
NO trates este negocio como un restaurante, tienda o consultoría. NO menciones "menú", "inventario de productos para venta", "pedidos" ni "delivery".

DATOS DISPONIBLES en respuestas_branch (úsalos para personalizar):
- tipo_operacion: tipo de operación (venta, renta, desarrollo, administración)
- como_generas_leads: cómo genera leads (portales, redes, referidos, web propia)
- tienes_crm: si tiene CRM o gestiona en Excel/WhatsApp
- portales_donde_publicas: en qué portales publica (Inmuebles24, Properati, etc.)
- como_manesja_documentos: cómo maneja contratos y documentos (papel, firma_digital, mixto)
- Si ofrece tours virtuales
- Si tiene análisis de mercado para fijar precios
- Canal principal de venta (presencial, digital, mixto)

Enfócate en:
- Cómo captan y siguen leads (usa como_generas_leads, tienes_crm)
- Gestión de inventario de propiedades y portales (usa portales_donde_publicas)
- Procesos de cierre y documentación (usa como_manesja_documentos)
- Marketing digital: fotos, tours virtuales, presencia online
- Análisis de mercado y pricing de propiedades
- Seguimiento post-venta y generación de referidos`,

  maturityDimensions: [
    {
      nombre: "Gestión de leads",
      descripcion: "Captación y seguimiento de prospectos",
      niveles: [
        "Sin CRM, leads en WhatsApp o Excel",
        "Excel estructurado con seguimiento manual",
        "CRM básico con pipeline de ventas",
        "CRM con automatización de seguimiento",
        "Sistema completo con lead scoring y métricas",
      ],
    },
    {
      nombre: "Presencia digital",
      descripcion: "Marketing y visibilidad online",
      niveles: [
        "Solo portales inmobiliarios",
        "Portales + Google Business",
        "Portales + web propia + redes sociales",
        "Contenido profesional + tours virtuales",
        "Embudo digital completo con captación propia",
      ],
    },
    {
      nombre: "Procesos de cierre",
      descripcion: "Documentación y transacción",
      niveles: [
        "Todo en papel, reuniones presenciales",
        "Documentos escaneados, firma manual",
        "Firma digital, documentos en la nube",
        "Proceso semi-automatizado con checklists",
        "Cierre digital completo con seguimiento post-venta",
      ],
    },
  ],

  benchmarks: [
    {
      metrica: "Tiempo promedio de cierre",
      valor: "30-90 días",
      descripcion: "Días promedio desde el primer contacto hasta el cierre de una venta residencial PYME",
    },
    {
      metrica: "Tasa de conversión de leads",
      valor: "2-5%",
      descripcion: "Porcentaje de leads que se convierten en ventas en agencias PYME",
    },
    {
      metrica: "Costo por lead",
      valor: "$8-25 USD",
      descripcion: "Costo promedio por lead calificado en portales inmobiliarios",
    },
    {
      metrica: "Comisión promedio",
      valor: "3-5%",
      descripcion: "Porcentaje de comisión sobre el valor de la propiedad",
    },
    {
      metrica: "Referidos de clientes",
      valor: "20-35%",
      descripcion: "Porcentaje de ventas que vienen de referidos de clientes anteriores",
    },
  ],

  successStories: [
    {
      empresa: "Grupo Hogar",
      problema: "Perdían 40% de leads por falta de seguimiento estructurado, todos en WhatsApp sin orden.",
      solucion: "Implementaron CRM con pipeline automatizado y recordatorios de seguimiento a los 3, 7 y 15 días.",
      resultado: "Aumentaron tasa de conversión del 3% al 7% y redujeron tiempo promedio de cierre en 20 días.",
    },
    {
      empresa: "Inmobiliaria Valle",
      problema: "El 80% de sus ventas dependían de un solo portal inmobiliario, sin canal propio.",
      solucion: "Crearon sitio web con listings propios, activaron Google Business y empezaron a generar leads propios.",
      resultado: "Reducieron dependencia de portales al 40% y aumentaron ingresos por comisiones un 35%.",
    },
  ],

  symptoms,
  actions,

  fallbackDiagnosis: {
    texto:
      "Tu inmobiliaria tiene oportunidades para mejorar la captación de leads, profesionalizar sus listados y cerrar más ventas con procesos más eficientes. Con herramientas digitales puedes reducir la dependencia de portales y aumentar tu margen.",
    beneficios: [
      "Capta leads propios sin depender de portales",
      "Cierra más ventas con seguimiento automatizado",
      "Profesionaliza tu imagen con fotos y tours virtuales",
    ],
    sugerencia:
      "Empieza por crear un Google Business optimizado y subir fotos profesionales de tus 5 propiedades más atractivas. Eso solo puede aumentar tus consultas un 30%.",
    plan: {
      dia_30: "Activa Google Business y crea sitio web con tus listings principales",
      dia_60: "Implementa CRM con pipeline de leads y automatización de seguimiento",
      dia_90: "Invierte en tours virtuales y crea programa de referidos para clientes",
    },
  },
}
