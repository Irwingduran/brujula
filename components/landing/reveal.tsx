"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Retardo en segundos, para escalonar elementos de una misma lista. */
  delay?: number
}

/**
 * Único punto de animación de la landing.
 *
 * Centralizarlo evita repetir variantes en cada sección y permite que las
 * secciones sigan siendo componentes de servidor: sólo este envoltorio
 * necesita ejecutarse en el cliente.
 *
 * Respeta `prefers-reduced-motion`: si el usuario pidió menos movimiento, el
 * contenido se renderiza visible y estático en lugar de desplazarse.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
