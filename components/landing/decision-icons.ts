import type { Icon } from "@phosphor-icons/react"
import { Crosshair, MagnifyingGlass, Path, Quotes } from "@phosphor-icons/react/dist/ssr"
import type { DecisionLayerId } from "@/lib/landing-content"

/**
 * Icono de cada eslabón de la cadena del diagnóstico.
 *
 * Se comparte entre la vista previa del hero y la sección que explica cómo
 * piensa Brújula: ambas describen los mismos cuatro pasos, así que deben usar
 * la misma representación. El tipo `DecisionLayerId` obliga a mantener el mapa
 * completo si algún día se agrega un eslabón.
 */
export const DECISION_ICONS: Record<DecisionLayerId, Icon> = {
  evidencia: Quotes,
  hallazgo: MagnifyingGlass,
  capacidad: Crosshair,
  ruta: Path,
}
