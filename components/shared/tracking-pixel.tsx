"use client"

import { useEffect, useRef } from "react"

interface TrackingPixelProps {
  leadId: string
}

export function TrackingPixel({ leadId }: TrackingPixelProps) {
  const tracked = useRef(false)

  useEffect(() => {
    // Solo trackear una vez por carga de página
    if (tracked.current) return
    tracked.current = true

    // Registrar visita sin bloquear el render
    fetch(`/api/leads/${leadId}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evento: "visita_propuesta" }),
    }).catch(() => {}) // Silenciar errores de red
  }, [leadId])

  // Componente invisible
  return null
}
