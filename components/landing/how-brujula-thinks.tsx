import { Lightbulb } from "@phosphor-icons/react/dist/ssr"
import { DECISION_LAYERS, THINKING } from "@/lib/landing-content"
import { DECISION_ICONS } from "./decision-icons"
import { Reveal } from "./reveal"

const TONE_STYLES = {
  primary: "bg-violet-50 text-violet-700",
  accent: "bg-emerald-50 text-emerald-700",
} as const

/**
 * Explica la cadena evidencia → hallazgo → capacidad → ruta,
 * que es la misma que produce el pipeline del diagnóstico.
 */
export function HowBrujulaThinks() {
  return (
    <section id={THINKING.id} className="scroll-mt-20 px-5 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">{THINKING.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-gray-950 sm:text-5xl">
            {THINKING.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-500">{THINKING.description}</p>
        </Reveal>

        <div className="relative mt-14 grid gap-4 lg:grid-cols-4">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-violet-300 via-violet-200 to-emerald-300 lg:block"
            aria-hidden="true"
          />

          {DECISION_LAYERS.map((layer, index) => {
            const LayerIcon = DECISION_ICONS[layer.id]
            return (
              <Reveal key={layer.id} delay={index * 0.08}>
                <article className="relative h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <span
                    className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${TONE_STYLES[layer.tone]}`}
                  >
                    <LayerIcon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                    {layer.eyebrow}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-gray-950">{layer.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{layer.description}</p>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-10 rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:p-6">
          <p className="flex gap-3 text-sm leading-relaxed text-violet-900">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" weight="fill" aria-hidden="true" />
            {THINKING.note}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
