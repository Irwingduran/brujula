"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { Pause, Play } from "@phosphor-icons/react"
import { PREVIEW, PREVIEW_SLIDES, type PreviewSlide } from "@/lib/landing-content"
import { ChainSlide, RouteSlide, TraceabilitySlide } from "./preview-slides"

function SlideBody({ slide }: { slide: PreviewSlide }) {
  switch (slide.kind) {
    case "chain":
      return <ChainSlide slide={slide} />
    case "route":
      return <RouteSlide slide={slide} />
    case "traceability":
      return <TraceabilitySlide slide={slide} />
  }
}

/** El encabezado cambia de dato según la tarjeta, pero conserva su lugar y jerarquía. */
function SlideMeta({ slide }: { slide: PreviewSlide }) {
  if (slide.kind === "chain") {
    const { maturity } = slide
    return (
      <>
        <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">
          {maturity.label}
        </span>
        <span className="mt-1 flex items-center justify-end gap-2">
          <span
            className="flex gap-1"
            role="img"
            aria-label={`${maturity.label}: ${maturity.value} de ${maturity.max}`}
          >
            {Array.from({ length: maturity.max }, (_, index) => (
              <span
                key={index}
                className={`h-1.5 w-4 rounded-full ${index < maturity.value ? "bg-violet-600" : "bg-gray-100"}`}
              />
            ))}
          </span>
          <span className="text-xs font-semibold text-gray-900">
            {maturity.value}
            <span className="font-normal text-gray-400">/{maturity.max}</span>
          </span>
        </span>
      </>
    )
  }

  return (
    <>
      <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">
        {slide.meta.label}
      </span>
      <span className="mt-1 block text-xs font-semibold text-gray-900">{slide.meta.value}</span>
    </>
  )
}

/**
 * Carrusel de ejemplos del resultado.
 *
 * Decisiones de comportamiento:
 * - Las tarjetas se apilan en la misma celda de una retícula, así que la altura
 *   del contenedor es la de la tarjeta más alta y al rotar no hay salto de
 *   layout.
 * - La rotación automática se detiene con `prefers-reduced-motion`, al pasar el
 *   cursor, al mover el foco dentro del componente y con el botón de pausa. Ese
 *   botón existe porque el contenido se mueve solo: sin un control explícito
 *   para detenerlo, el patrón no cumple con el criterio de pausa de WCAG.
 * - Los puntos son botones reales con `aria-current`, y las flechas del teclado
 *   navegan entre ejemplos.
 */
export function DiagnosticPreview() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPausedByUser, setIsPausedByUser] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const total = PREVIEW_SLIDES.length
  const canAutoplay = !prefersReducedMotion
  const isAutoplayRunning = canAutoplay && !isPausedByUser && !isHovered && !isFocused

  useEffect(() => {
    if (!isAutoplayRunning) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total)
    }, PREVIEW.autoplayInterval)

    return () => window.clearInterval(timer)
    // `activeIndex` reinicia el temporizador tras un cambio manual, para que la
    // siguiente tarjeta no aparezca a mitad del intervalo.
  }, [isAutoplayRunning, total, activeIndex])

  function goTo(index: number) {
    setActiveIndex((index + total) % total)
  }

  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      {/*
        Resplandor decorativo. Se mantiene en `z-0` en lugar de un z-index
        negativo: con valores negativos quedaría detrás del fondo de la página y
        no se vería. La tarjeta se eleva con `z-10` para pintarse encima.
      */}
      <div className="absolute -inset-8 z-0 rounded-full bg-violet-300/20 blur-3xl" aria-hidden="true" />

      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label={PREVIEW.carouselLabel}
        className="relative z-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-violet-950/5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault()
            goTo(activeIndex + 1)
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault()
            goTo(activeIndex - 1)
          }
        }}
      >
        <div className="grid">
          {PREVIEW_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex

            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription={PREVIEW.slideRoleDescription}
                aria-label={`${index + 1} de ${total}: ${slide.title}`}
                aria-hidden={!isActive}
                /*
                  Cada tarjeta es una columna flexible que ocupa toda la celda
                  compartida. Así la más alta define la altura y las demás
                  reparten el espacio entre sus bloques, en lugar de dejar un
                  hueco al pie.
                */
                className={`col-start-1 row-start-1 flex flex-col motion-safe:transition-opacity motion-safe:duration-500 ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                      {PREVIEW.eyebrow}
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold text-gray-950">{slide.title}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <SlideMeta slide={slide} />
                  </span>
                </div>

                <SlideBody slide={slide} />
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-2.5">
          <p className="text-[11px] leading-relaxed text-gray-400">{PREVIEW.disclaimer}</p>

          <div className="flex shrink-0 items-center gap-2">
            <ul className="flex items-center gap-1.5">
              {PREVIEW_SLIDES.map((slide, index) => {
                const isActive = index === activeIndex

                return (
                  <li key={slide.id}>
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={isActive}
                      aria-label={`${PREVIEW.controls.goTo} ${index + 1}: ${slide.title}`}
                      className={`block h-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 ${
                        isActive ? "w-5 bg-violet-600" : "w-1.5 bg-gray-200 hover:bg-gray-300"
                      }`}
                    />
                  </li>
                )
              })}
            </ul>

            {canAutoplay && (
              <button
                type="button"
                onClick={() => setIsPausedByUser((paused) => !paused)}
                aria-label={isPausedByUser ? PREVIEW.controls.play : PREVIEW.controls.pause}
                className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
              >
                {isPausedByUser ? (
                  <Play className="h-3 w-3" weight="fill" aria-hidden="true" />
                ) : (
                  <Pause className="h-3 w-3" weight="fill" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
