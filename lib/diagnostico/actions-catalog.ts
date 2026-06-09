export interface CatalogoAccion {
  id: string
  titulo: string
  descripcion: string
  segmentosAplica: string[]
  madurezMinima: number
  madurezMaxima: number
  presupuestoRequerido: "bajo" | "medio" | "alto"
  impacto: "rapido" | "mediano_plazo" | "largo_plazo"
}

export const ACTIONS_CATALOG: CatalogoAccion[] = [
  {
    id: "crear_google_business",
    titulo: "Crear perfil de Google Business",
    descripcion: "Registrar y verificar el negocio en Google Maps y búsqueda local.",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "micro_educacion", "micro_otro", "pequena_retail", "pequena_servicios", "pequena_food", "pequena_salud"],
    madurezMinima: 1,
    madurezMaxima: 2,
    presupuestoRequerido: "bajo",
    impacto: "rapido",
  },
  {
    id: "optimizar_google_business",
    titulo: "Optimizar perfil de Google Business",
    descripcion: "Actualizar fotos, horarios, servicios y responder reseñas en Google Business.",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail"],
    madurezMinima: 2,
    madurezMaxima: 3,
    presupuestoRequerido: "bajo",
    impacto: "rapido",
  },
  {
    id: "crear_sitio_web_basico",
    titulo: "Crear sitio web básico",
    descripcion: "Desarrollar sitio web informativo con servicios, contacto y ubicación.",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "micro_otro", "pequena_retail", "pequena_servicios", "pequena_food", "pequena_salud", "pequena_otro"],
    madurezMinima: 1,
    madurezMaxima: 3,
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
  },
  {
    id: "implementar_whatsapp_business",
    titulo: "Implementar WhatsApp Business",
    descripcion: "Separar la comunicación personal de la profesional con catálogo y respuestas rápidas.",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "micro_otro", "pequena_retail", "pequena_servicios", "pequena_food", "pequena_salud", "pequena_otro"],
    madurezMinima: 1,
    madurezMaxima: 3,
    presupuestoRequerido: "bajo",
    impacto: "rapido",
  },
  {
    id: "configurar_catalogo_digital",
    titulo: "Configurar catálogo digital",
    descripcion: "Crear catálogo de productos o servicios accesible por WhatsApp o web.",
    segmentosAplica: ["micro_retail", "micro_food", "pequena_retail", "pequena_food", "mediana_retail"],
    madurezMinima: 2,
    madurezMaxima: 3,
    presupuestoRequerido: "bajo",
    impacto: "rapido",
  },
  {
    id: "implementar_crm_basico",
    titulo: "Implementar CRM básico",
    descripcion: "Registrar clientes, historial de compras y automatizar seguimiento de leads.",
    segmentosAplica: ["pequena_retail", "pequena_servicios", "pequena_food", "pequena_salud", "pequena_otro", "mediana_retail", "mediana_servicios"],
    madurezMinima: 2,
    madurezMaxima: 4,
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
  },
  {
    id: "crear_estrategia_redes",
    titulo: "Crear estrategia de redes sociales",
    descripcion: "Definir calendario de contenido, tono de marca y frecuencias de publicación.",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail", "mediana_servicios"],
    madurezMinima: 2,
    madurezMaxima: 3,
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
  },
  {
    id: "campana_google_ads_local",
    titulo: "Crear campaña de Google Ads local",
    descripcion: "Configurar anuncios dirigidos a clientes locales con presupuesto controlado.",
    segmentosAplica: ["pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail", "mediana_servicios"],
    madurezMinima: 3,
    madurezMaxima: 4,
    presupuestoRequerido: "medio",
    impacto: "rapido",
  },
  {
    id: "implementar_email_marketing",
    titulo: "Implementar email marketing",
    descripcion: "Crear lista de contactos y campañas de correo para captación y fidelización.",
    segmentosAplica: ["pequena_servicios", "pequena_retail", "mediana_servicios", "mediana_retail", "pequena_otro"],
    madurezMinima: 3,
    madurezMaxima: 4,
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
  },
  {
    id: "automatizar_seguimiento",
    titulo: "Automatizar seguimiento de clientes",
    descripcion: "Configurar recordatorios automáticos de postventa, cumpleaños y recompra.",
    segmentosAplica: ["pequena_servicios", "pequena_retail", "pequena_salud", "mediana_servicios", "mediana_retail"],
    madurezMinima: 3,
    madurezMaxima: 5,
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
  },
  {
    id: "implementar_programa_lealtad",
    titulo: "Implementar programa de lealtad",
    descripcion: "Diseñar sistema de puntos, descuentos o beneficios para clientes recurrentes.",
    segmentosAplica: ["pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail", "mediana_servicios", "mediana_food"],
    madurezMinima: 3,
    madurezMaxima: 5,
    presupuestoRequerido: "medio",
    impacto: "largo_plazo",
  },
  {
    id: "configurar_analytics",
    titulo: "Configurar medición de resultados",
    descripcion: "Instalar Google Analytics, Meta Pixel o similar para medir tráfico y conversiones.",
    segmentosAplica: ["pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail", "mediana_servicios", "pequena_otro"],
    madurezMinima: 2,
    madurezMaxima: 4,
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
  },
  {
    id: "crear_embudo_ventas",
    titulo: "Crear embudo de ventas",
    descripcion: "Definir etapas de captación, seguimiento y cierre con procesos claros.",
    segmentosAplica: ["pequena_servicios", "pequena_retail", "mediana_servicios", "mediana_retail", "pequena_otro"],
    madurezMinima: 2,
    madurezMaxima: 4,
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
  },
  {
    id: "solicitar_resenas_activamente",
    titulo: "Solicitar reseñas activamente",
    descripcion: "Pedir reseñas a clientes satisfechos después de cada venta o servicio.",
    segmentosAplica: ["micro_retail", "micro_servicios", "micro_food", "micro_salud", "pequena_retail", "pequena_servicios", "pequena_food", "pequena_salud"],
    madurezMinima: 1,
    madurezMaxima: 3,
    presupuestoRequerido: "bajo",
    impacto: "rapido",
  },
  {
    id: "crear_contenido_educativo",
    titulo: "Crear contenido educativo",
    descripcion: "Publicar contenido útil para clientes potenciales en redes o blog.",
    segmentosAplica: ["pequena_servicios", "mediana_servicios", "pequena_retail", "mediana_retail", "pequena_otro"],
    madurezMinima: 3,
    madurezMaxima: 5,
    presupuestoRequerido: "bajo",
    impacto: "largo_plazo",
  },
  {
    id: "implementar_ecommerce",
    titulo: "Implementar tienda en línea",
    descripcion: "Crear tienda virtual con catálogo, carrito de compras y métodos de pago.",
    segmentosAplica: ["pequena_retail", "mediana_retail", "pequena_food", "mediana_food", "pequena_otro"],
    madurezMinima: 3,
    madurezMaxima: 5,
    presupuestoRequerido: "alto",
    impacto: "largo_plazo",
  },
  {
    id: "capacitacion_equipo_digital",
    titulo: "Capacitar al equipo en herramientas digitales",
    descripcion: "Entrenar al personal en el uso de las herramientas digitales implementadas.",
    segmentosAplica: ["pequena_retail", "pequena_servicios", "pequena_food", "pequena_salud", "pequena_otro", "mediana_retail", "mediana_servicios"],
    madurezMinima: 1,
    madurezMaxima: 3,
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
  },
  {
    id: "auditoria_procesos",
    titulo: "Auditar procesos internos",
    descripcion: "Identificar cuellos de botella y tareas manuales que se pueden automatizar.",
    segmentosAplica: ["micro_servicios", "micro_otro", "pequena_servicios", "pequena_otro", "mediana_servicios"],
    madurezMinima: 1,
    madurezMaxima: 2,
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
  },
  {
    id: "implementar_pos_digital",
    titulo: "Implementar punto de venta digital",
    descripcion: "Sistema de cobro digital con registro de ventas, inventario y clientes.",
    segmentosAplica: ["micro_retail", "micro_food", "pequena_retail", "pequena_food", "mediana_retail", "mediana_food"],
    madurezMinima: 1,
    madurezMaxima: 3,
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
  },
  {
    id: "crear_pagina_ventas_producto",
    titulo: "Crear página de ventas por producto",
    descripcion: "Página web enfocada en convertir visitantes en clientes para un producto o servicio específico.",
    segmentosAplica: ["pequena_retail", "pequena_servicios", "pequena_food", "mediana_retail", "mediana_servicios"],
    madurezMinima: 2,
    madurezMaxima: 4,
    presupuestoRequerido: "bajo",
    impacto: "rapido",
  },
]

export function getAccionesBySegmento(segmento: string): CatalogoAccion[] {
  return ACTIONS_CATALOG.filter((a) => a.segmentosAplica.includes(segmento))
}

export function getAccionById(id: string): CatalogoAccion | undefined {
  return ACTIONS_CATALOG.find((a) => a.id === id)
}

export function isValidAccionId(id: string): boolean {
  return ACTIONS_CATALOG.some((a) => a.id === id)
}
