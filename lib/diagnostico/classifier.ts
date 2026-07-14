import type { FormularioCampos, ClasificacionResult } from "./schemas"
import { detectSubsector } from "./knowledge"

const INDUSTRY_MAP: Record<string, string> = {
  restaurante: "food",
  comida: "food",
  food: "food",
  retail: "retail",
  tienda: "retail",
  ropa: "retail",
  servicios_profesionales: "servicios",
  consultoria: "servicios",
  servicios: "servicios",
  salud: "salud",
  medicina: "salud",
  educacion: "educacion",
  escuela: "educacion",
  logistica: "manufactura",
  manufactura: "manufactura",
  fabrica: "manufactura",
  inmobiliaria: "servicios",
  bienes_raices: "servicios",
  tecnologia: "servicios",
  software: "servicios",
}

function mapIndustria(industria: string): string {
  const key = industria.toLowerCase().replace(/\s+/g, "_")
  return INDUSTRY_MAP[key] ?? "otro"
}

function mapTamano(tamano: string): "micro" | "pequena" | "mediana" {
  switch (tamano) {
    case "solo":
    case "2_5":
      return "micro"
    case "6_15":
      return "pequena"
    case "16_50":
    case "50_plus":
      return "mediana"
    default:
      return "micro"
  }
}

function calcularMadurez(herramientas: string[]): number {
  if (!herramientas || herramientas.length === 0) return 1
  if (herramientas.includes("nada")) return 1

  const soloRedes = herramientas.every((h) => ["redes_sociales", "whatsapp"].includes(h))
  if (soloRedes) return 2

  const tieneCRM = herramientas.includes("crm_basico")
  const tieneExcel = herramientas.includes("excel")
  const tieneEmail = herramientas.includes("email_manual")
  if (tieneCRM || (tieneExcel && tieneEmail)) return 3

  if (herramientas.length >= 3 && tieneCRM) return 4

  return 5
}

function calcularPerfilRiesgo(urgencia: string, presupuesto: string): "alto" | "medio" | "bajo" {
  if (urgencia === "inmediata" && (presupuesto === "menos_500" || presupuesto === "no_definido")) {
    return "alto"
  }
  if (urgencia === "inmediata" || urgencia === "1_3_meses") {
    return "medio"
  }
  return "bajo"
}

export function clasificarNegocio(campos: FormularioCampos): ClasificacionResult {
  const industryCode = mapIndustria(campos.industria)
  const tamano = mapTamano(campos.tamano_empresa)
  const segmento = `${tamano}_${industryCode}`
  const madurezDigital = calcularMadurez(campos.herramientas_actuales)
  const perfilRiesgo = calcularPerfilRiesgo(campos.urgencia, campos.presupuesto)

  const subsector = detectSubsector(industryCode, {
    industria_otra: campos.industria_otra,
    dolores_principales: campos.dolores_principales,
    respuestas_branch: campos.respuestas_branch,
  })

  return {
    segmento,
    madurezDigital,
    perfilRiesgo,
    industryCode,
    industryLabel: getIndustryLabel(campos.industria),
    subsector,
  }
}

function getIndustryLabel(industria: string): string {
  const labels: Record<string, string> = {
    restaurante: "Restaurante / Alimentos",
    retail: "Retail / Tienda",
    servicios_profesionales: "Servicios Profesionales",
    salud: "Salud / Bienestar",
    educacion: "Educación / Capacitación",
    inmobiliaria: "Inmobiliaria",
    tecnologia: "Tecnología",
    manufactura: "Manufactura / Producción",
    logistica: "Logística / Transporte",
    otra: "Otra",
  }
  return labels[industria] ?? industria
}
