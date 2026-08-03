import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { COMPASS_POINTS, PROBLEM } from "@/lib/landing-content"
import { CompassRose, ErraticNeedle, SettledNeedle } from "./compass-art"
import { Reveal } from "./reveal"

const [north, east, south, west] = COMPASS_POINTS

/**
 * La brújula se representa de dos formas según el ancho disponible, pero la
 * metáfora no cambia en ninguna de las dos.
 *
 * - Desde `md`: cara de brújula. Los dos ejes se dibujan y cada tarjeta se
 *   apoya sobre el suyo, con la rosa como centro.
 * - Debajo de `md`: la brújula se lee como la ruta que marca. Un único eje
 *   vertical con la rosa como pivote y cada punto cardinal como hito sobre esa
 *   línea, en orden N → E → S → O.
 *
 * El orden del DOM ya es el orden de lectura, así que ninguna tarjeta necesita
 * utilidades `order-*`: no hay forma de desincronizar lo visual de lo semántico.
 */
const CARDINAL_LAYOUT = [
  {
    point: north,
    cardClassName: "md:col-start-2 md:row-start-1 md:text-center",
    badgeClassName: "md:mx-auto",
  },
  {
    point: east,
    cardClassName: "md:col-start-3 md:row-start-2",
    badgeClassName: "md:mr-auto",
  },
  {
    point: south,
    cardClassName: "md:col-start-2 md:row-start-3 md:text-center",
    badgeClassName: "md:mx-auto",
  },
  {
    point: west,
    cardClassName: "md:col-start-1 md:row-start-2 md:text-right",
    badgeClassName: "md:ml-auto",
  },
]

/** Letra cardinal. En móvil se asienta sobre el eje; en escritorio, dentro de la tarjeta. */
function CardinalBadge({ dir, className }: { dir: string; className?: string }) {
  return (
    <span
      className={`absolute -top-3.5 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-violet-200 bg-white text-[11px] font-bold text-violet-700 shadow-sm md:static md:h-8 md:w-8 md:translate-x-0 md:text-xs md:shadow-none ${className ?? ""}`}
    >
      {dir}
    </span>
  )
}

export function ProblemSection() {
  return (
    <section className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">{PROBLEM.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-gray-950 sm:text-5xl">
            {PROBLEM.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-500">{PROBLEM.description}</p>
        </Reveal>

        <Reveal className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-6 sm:gap-10">
          <p className="text-center">
            <ErraticNeedle />
            <span className="mt-2 block text-xs font-semibold text-violet-500">{PROBLEM.beforeLabel}</span>
          </p>
          <ArrowRight className="h-6 w-6 shrink-0 text-gray-300" aria-hidden="true" />
          <p className="text-center">
            <SettledNeedle />
            <span className="mt-2 block text-xs font-semibold text-emerald-700">{PROBLEM.afterLabel}</span>
          </p>
        </Reveal>

        <Reveal className="relative mx-auto mt-20 max-w-4xl">
          {/*
            Ejes de la brújula. Se declaran antes que las tarjetas para que éstas,
            al tener fondo propio, se pinten encima y la línea parezca pasar por
            debajo. Son decorativos: el mensaje ya está en las letras y el texto.
          */}
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-1/2 top-8 w-px -translate-x-1/2 bg-gradient-to-b from-violet-300 via-violet-200 to-emerald-300"
          />
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-emerald-300 via-violet-200 to-violet-300 md:block"
          />

          <div className="grid grid-cols-1 gap-y-10 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-x-12 md:gap-y-12">
            <div className="relative flex justify-center md:col-start-2 md:row-start-2">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 hidden h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-200 bg-gray-50 md:block"
              />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-50 md:hidden"
              />
              {/*
                Los círculos anteriores enmascaran los ejes detrás de la rosa. Al
                ser absolutos se pintan después del contenido en flujo, así que la
                rosa necesita posicionarse explícitamente para quedar encima; el
                orden del DOM no basta.
              */}
              <span className="relative z-10">
                <CompassRose />
              </span>
            </div>

            {CARDINAL_LAYOUT.map(({ point, cardClassName, badgeClassName }) => (
              <article
                key={point.dir}
                className={`relative rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-7 shadow-sm md:pt-5 ${cardClassName}`}
              >
                <CardinalBadge dir={point.dir} className={badgeClassName} />
                <h3 className="mt-1 text-base font-semibold text-gray-950 md:mt-3">{point.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{point.description}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
