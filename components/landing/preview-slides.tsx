import { Prohibit, Question } from "@phosphor-icons/react/dist/ssr"
import { PREVIEW, type PreviewSlide } from "@/lib/landing-content"
import { DECISION_ICONS } from "./decision-icons"

type SlideOf<K extends PreviewSlide["kind"]> = Extract<PreviewSlide, { kind: K }>

/**
 * Cuerpos de las tarjetas de la vista previa.
 *
 * Las tres comparten paleta y radios con el resto de la landing, pero cada una
 * usa una estructura distinta para que la rotación aporte información y no sólo
 * movimiento: cadena vertical, ruta por horizontes y trazabilidad por fuente.
 */

const STEP_TONES = {
  primary: {
    marker: "border-violet-100 bg-violet-50 text-violet-700",
    tag: "bg-violet-50 text-violet-700",
  },
  accent: {
    marker: "border-emerald-100 bg-emerald-50 text-emerald-700",
    tag: "bg-emerald-50 text-emerald-700",
  },
} as const

/** Tarjeta 1: la cadena completa, evidencia → primer paso. */
export function ChainSlide({ slide }: { slide: SlideOf<"chain"> }) {
  const lastIndex = slide.steps.length - 1

  return (
    <ol className="relative flex flex-1 flex-col justify-between gap-4 px-5 py-5">
      {/*
        Eje de la cadena, con la misma progresión violeta → verde que el eje de
        la brújula. Es decorativo: el orden lo comunican la lista y el texto.
      */}
      <span
        aria-hidden="true"
        className="absolute bottom-8 left-[2.375rem] top-8 w-px bg-gradient-to-b from-violet-200 via-violet-200 to-emerald-300"
      />

      {slide.steps.map((step, index) => {
        const StepIcon = DECISION_ICONS[step.id]
        const tone = index === lastIndex ? STEP_TONES.accent : STEP_TONES.primary

        return (
          <li key={step.id} className="relative flex gap-4">
            <span
              className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${tone.marker}`}
            >
              <StepIcon className="h-4 w-4" aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1 pt-0.5">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  {step.eyebrow}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tone.tag}`}>{step.tag}</span>
              </span>

              <span className="mt-1.5 block text-sm leading-relaxed text-gray-900">{step.text}</span>

              {"metric" in step && (
                <span className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-xl bg-gray-50 px-3 py-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    {PREVIEW.metricLabel}
                  </span>
                  <span className="text-xs font-medium text-gray-700">{step.metric}</span>
                </span>
              )}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

const STOP_STYLES = {
  now: {
    rail: "bg-violet-600",
    pill: "bg-violet-600 text-white",
    card: "border-violet-200 bg-violet-50/40",
  },
  later: {
    rail: "bg-violet-300",
    pill: "bg-violet-100 text-violet-700",
    card: "border-gray-200 bg-white",
  },
  evidence: {
    rail: "bg-gray-200",
    pill: "bg-gray-100 text-gray-500",
    card: "border-dashed border-gray-200 bg-white",
  },
} as const

/** Tarjeta 2: la ruta por horizontes, incluido lo que todavía no conviene hacer. */
export function RouteSlide({ slide }: { slide: SlideOf<"route"> }) {
  return (
    <div className="flex flex-1 flex-col px-5 py-5">
      {/* Riel de horizontes: da la forma de ruta antes de leer el detalle. */}
      <div className="flex gap-1.5" aria-hidden="true">
        {slide.stops.map((stop) => (
          <span key={stop.horizon} className={`h-1.5 flex-1 rounded-full ${STOP_STYLES[stop.state].rail}`} />
        ))}
      </div>

      <ol className="mt-4 flex flex-1 flex-col justify-between gap-2.5">
        {slide.stops.map((stop, index) => {
          const style = STOP_STYLES[stop.state]

          return (
            <li key={stop.horizon} className={`rounded-xl border p-3 ${style.card}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.pill}`}>
                  {stop.horizon}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">
                  Paso {index + 1}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-900">{stop.text}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                <span className="font-medium text-gray-600">Antes de avanzar:</span> {stop.prerequisite}
              </p>
            </li>
          )
        })}
      </ol>

      <div className="mt-3 flex gap-3 rounded-xl bg-gray-50 p-3">
        <Prohibit className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-gray-500">
          <span className="font-semibold uppercase tracking-[0.12em] text-gray-400">{slide.notYet.label}</span>
          <span className="mt-1 block">{slide.notYet.text}</span>
        </p>
      </div>
    </div>
  )
}

const RELIABILITY_TONES: Record<string, string> = {
  Declarado: "bg-violet-50 text-violet-700",
  Observado: "bg-emerald-50 text-emerald-700",
}

/** Tarjeta 3: de dónde viene cada conclusión y qué falta por saber. */
export function TraceabilitySlide({ slide }: { slide: SlideOf<"traceability"> }) {
  const activeLevel = slide.confidence.levels.indexOf(slide.confidence.value)

  return (
    <div className="flex flex-1 flex-col px-5 py-5">
      <ul className="flex flex-1 flex-col justify-between gap-2.5">
        {slide.sources.map((source) => (
          <li
            key={source.label}
            className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 p-3"
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium text-gray-900">{source.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">{source.detail}</span>
            </span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                RELIABILITY_TONES[source.reliability] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {source.reliability}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-xl bg-gray-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            {slide.confidence.label}
          </span>
          <span className="text-xs font-semibold text-gray-900">{slide.confidence.value}</span>
        </div>
        {/* Escala cualitativa, sin porcentajes: es la misma que usa el diagnóstico. */}
        <div
          className="mt-2 flex gap-1.5"
          role="img"
          aria-label={`${slide.confidence.label}: ${slide.confidence.value}`}
        >
          {slide.confidence.levels.map((level, index) => (
            <span
              key={level}
              className={`h-1.5 flex-1 rounded-full ${index <= activeLevel ? "bg-violet-500" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-3 rounded-xl border border-dashed border-gray-200 p-3">
        <Question className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            {slide.missing.label}
          </p>
          <ul className="mt-1.5 space-y-1">
            {slide.missing.items.map((item) => (
              <li key={item} className="text-xs leading-relaxed text-gray-600">
                · {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
