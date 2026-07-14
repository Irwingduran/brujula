import type { ClasificacionResult } from "./schemas"
import type { SintomaResult } from "./schemas"
import type { AccionResult } from "./schemas"
import { isValidSintomaId } from "./symptoms-catalog"
import { getAccionById } from "./actions-catalog"
import { getKnowledgePack } from "./knowledge"

interface CoherenciaError {
  valido: boolean
  errores: string[]
}

export function validarCoherencia(
  clasificacion: ClasificacionResult,
  sintomas: SintomaResult[],
  acciones: AccionResult[],
): CoherenciaError {
  const errores: string[] = []

  for (const s of sintomas) {
    if (!isValidSintomaId(s.sintomaId)) {
      const knowledge = getKnowledgePack(clasificacion.industryCode)
      const isIndustrySymptom = knowledge?.symptoms.some((ks) => ks.id === s.sintomaId)
      if (!isIndustrySymptom) {
        errores.push(`Síntoma "${s.sintomaId}" no existe en ningún catálogo`)
      }
    }
  }

  for (const a of acciones) {
    const accion = getAccionById(a.accionId)
    if (!accion) {
      const knowledge = getKnowledgePack(clasificacion.industryCode)
      const isIndustryAction = knowledge?.actions.some((ka) => ka.id === a.accionId)
      if (!isIndustryAction) {
        errores.push(`Acción "${a.accionId}" no existe en ningún catálogo`)
        continue
      }
    }

    if (accion && !accion.segmentosAplica.includes(clasificacion.segmento)) {
      errores.push(`Acción "${a.accionId}" no aplica al segmento "${clasificacion.segmento}"`)
    }
    if (accion && clasificacion.madurezDigital < accion.madurezMinima) {
      errores.push(
        `Acción "${a.accionId}" requiere madurez mínima ${accion.madurezMinima} (actual: ${clasificacion.madurezDigital})`,
      )
    }
    if (accion && clasificacion.madurezDigital > accion.madurezMaxima) {
      errores.push(
        `Acción "${a.accionId}" aplica hasta madurez ${accion.madurezMaxima} (actual: ${clasificacion.madurezDigital})`,
      )
    }
  }

  const prioridades = acciones.map((a) => a.prioridad)
  const unicas = new Set(prioridades)
  if (unicas.size !== acciones.length) {
    errores.push("Hay acciones con prioridades duplicadas")
  }

  if (clasificacion.perfilRiesgo === "alto") {
    const tieneAccionRapida = acciones.some((a) => {
      const accion = getAccionById(a.accionId)
      if (accion?.impacto === "rapido") return true
      const knowledge = getKnowledgePack(clasificacion.industryCode)
      return knowledge?.actions.some((ka) => ka.id === a.accionId && ka.impacto === "rapido") ?? false
    })
    if (!tieneAccionRapida) {
      errores.push("Perfil de riesgo alto requiere al menos una acción de impacto rápido")
    }
  }

  return { valido: errores.length === 0, errores }
}

const GENERIC_PATTERNS = [
  /pedidos? perdidos?/i,
  /inventario/i,
  /delivery/i,
  /productos? físic[oa]/i,
  /stock/i,
  /men[úu]/i,
]

const PROFESSIONAL_SERVICES_KEYWORDS = [
  "servicios_profesionales",
  "consultor",
  "contador",
  "abogado",
  "diseñador",
  "marketing",
  "desarrollador",
]

export function validarGenericity(
  clasificacion: ClasificacionResult,
  resumen: string,
  sintomasPrincipales: string[],
): CoherenciaError {
  const errores: string[] = []
  const textToCheck = [resumen, ...sintomasPrincipales].join(" ")

  const isProfessionalService =
    clasificacion.industryCode === "servicios" ||
    PROFESSIONAL_SERVICES_KEYWORDS.some((k) => textToCheck.toLowerCase().includes(k))

  for (const pattern of GENERIC_PATTERNS) {
    if (pattern.test(textToCheck)) {
      if (isProfessionalService) {
        errores.push(`El diagnóstico contiene términos de retail/comida ("${pattern.source}") que no aplican a servicios profesionales`)
      }
    }
  }

  return { valido: errores.length === 0, errores }
}
