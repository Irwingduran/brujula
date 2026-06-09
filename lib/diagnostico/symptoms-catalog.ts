export interface CatalogoSintoma {
  id: string
  nombre: string
  descripcion: string
  categoria: "presencia_digital" | "captacion" | "operaciones" | "retencion" | "datos" | "reputacion"
  segmentosAplica: string[]
}

export const SYMPTOMS_CATALOG: CatalogoSintoma[] = [
  {
    id: "sin_presencia_digital",
    nombre: "Ausencia de presencia digital",
    descripcion: "El negocio no tiene sitio web ni Google Business Profile. No aparece en búsquedas.",
    categoria: "presencia_digital",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "micro_educacion", "micro_otro", "pequena_retail", "pequena_servicios", "pequena_food", "pequena_salud", "pequena_educacion", "pequena_otro"],
  },
  {
    id: "presencia_desactualizada",
    nombre: "Presencia digital desactualizada",
    descripcion: "Tiene sitio web o redes pero sin contenido reciente ni actualizaciones.",
    categoria: "presencia_digital",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail", "mediana_servicios"],
  },
  {
    id: "sin_google_business",
    nombre: "No aparece en búsquedas locales",
    descripcion: "No tiene perfil de Google Business o no está verificado.",
    categoria: "presencia_digital",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "pequena_retail", "pequena_servicios", "pequena_food"],
  },
  {
    id: "dependencia_boca_a_boca",
    nombre: "Dependencia total de referidos",
    descripcion: "El 100% de los clientes llegan por recomendación, sin canales digitales de captación.",
    categoria: "captacion",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "micro_educacion", "micro_otro", "pequena_servicios", "pequena_salud"],
  },
  {
    id: "sin_embudo_ventas",
    nombre: "Sin proceso de ventas definido",
    descripcion: "No hay seguimiento estructurado de prospectos ni etapas de conversión.",
    categoria: "captacion",
    segmentosAplica: ["micro_servicios", "pequena_servicios", "pequena_retail", "mediana_servicios", "mediana_retail", "micro_otro", "pequena_otro"],
  },
  {
    id: "publicidad_sin_medicion",
    nombre: "Inversión en ads sin medición",
    descripcion: "Gasta en publicidad digital pero no mide conversiones ni retorno.",
    categoria: "captacion",
    segmentosAplica: ["pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail", "mediana_servicios"],
  },
  {
    id: "procesos_manuales",
    nombre: "Procesos operativos manuales",
    descripcion: "Cotizaciones, inventario, pagos o agenda se manejan en papel, Excel o WhatsApp.",
    categoria: "operaciones",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "micro_otro", "pequena_retail", "pequena_servicios", "pequena_food", "pequena_salud", "pequena_otro", "mediana_retail", "mediana_servicios"],
  },
  {
    id: "sin_crm",
    nombre: "Sin registro de clientes",
    descripcion: "No hay base de datos de clientes ni historial de compras o interacciones.",
    categoria: "operaciones",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "micro_otro", "pequena_retail", "pequena_servicios", "pequena_food", "pequena_salud", "pequena_otro", "mediana_retail", "mediana_servicios"],
  },
  {
    id: "comunicacion_fragmentada",
    nombre: "Comunicación fragmentada con clientes",
    descripcion: "Usa WhatsApp personal para clientes, se mezclan mensajes personales con laborales.",
    categoria: "operaciones",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "micro_otro", "pequena_retail", "pequena_servicios", "pequena_food"],
  },
  {
    id: "sin_programa_fidelidad",
    nombre: "Sin estrategia de fidelidad",
    descripcion: "No hay mecanismo para incentivar la recompra o lealtad del cliente.",
    categoria: "retencion",
    segmentosAplica: ["pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail", "mediana_servicios", "mediana_food"],
  },
  {
    id: "sin_seguimiento_postventa",
    nombre: "Sin seguimiento postventa",
    descripcion: "No hay contacto con el cliente después de la venta o servicio.",
    categoria: "retencion",
    segmentosAplica: ["micro_servicios", "pequena_servicios", "pequena_retail", "mediana_servicios", "mediana_retail"],
  },
  {
    id: "sin_metricas",
    nombre: "No mide resultados clave",
    descripcion: "No lleva registro de ventas, visitas, conversiones ni ninguna métrica del negocio.",
    categoria: "datos",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "micro_otro", "pequena_retail", "pequena_servicios", "pequena_food", "pequena_salud", "pequena_otro"],
  },
  {
    id: "decision_por_intuicion",
    nombre: "Decisiones basadas en intuición",
    descripcion: "Decisiones de precio, producto o inversión sin datos ni análisis.",
    categoria: "datos",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_otro", "pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail", "mediana_servicios"],
  },
  {
    id: "sin_resenas",
    nombre: "Sin reseñas en línea",
    descripcion: "No tiene reseñas en Google, Facebook ni plataformas del sector.",
    categoria: "reputacion",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "pequena_retail", "pequena_servicios", "pequena_food"],
  },
  {
    id: "reputacion_no_gestionada",
    nombre: "Reputación en línea sin gestión",
    descripcion: "Tiene reseñas pero no las responde ni gestiona activamente.",
    categoria: "reputacion",
    segmentosAplica: ["pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail", "mediana_servicios"],
  },
]

export function getSintomasBySegmento(segmento: string): CatalogoSintoma[] {
  return SYMPTOMS_CATALOG.filter((s) => s.segmentosAplica.includes(segmento))
}

export function getSintomaById(id: string): CatalogoSintoma | undefined {
  return SYMPTOMS_CATALOG.find((s) => s.id === id)
}

export function isValidSintomaId(id: string): boolean {
  return SYMPTOMS_CATALOG.some((s) => s.id === id)
}
