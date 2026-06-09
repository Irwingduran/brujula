import type { ClasificacionResult } from "./schemas"
import type { SintomaResult } from "./schemas"
import type { AccionResult } from "./schemas"
import { isValidSintomaId } from "./symptoms-catalog"
import { getAccionById } from "./actions-catalog"

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
      errores.push(`Síntoma "${s.sintomaId}" no existe en el catálogo`)
    }
  }

  for (const a of acciones) {
    const accion = getAccionById(a.accionId)
    if (!accion) {
      errores.push(`Acción "${a.accionId}" no existe en el catálogo`)
      continue
    }
    if (!accion.segmentosAplica.includes(clasificacion.segmento)) {
      errores.push(`Acción "${a.accionId}" no aplica al segmento "${clasificacion.segmento}"`)
    }
    if (clasificacion.madurezDigital < accion.madurezMinima) {
      errores.push(
        `Acción "${a.accionId}" requiere madurez mínima ${accion.madurezMinima} (actual: ${clasificacion.madurezDigital})`,
      )
    }
    if (clasificacion.madurezDigital > accion.madurezMaxima) {
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
      return accion?.impacto === "rapido"
    })
    if (!tieneAccionRapida) {
      errores.push("Perfil de riesgo alto requiere al menos una acción de impacto rápido")
    }
  }

  return { valido: errores.length === 0, errores }
}
