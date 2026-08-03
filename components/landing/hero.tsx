import Link from "next/link"
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr"
import { DIAGNOSTIC_PATH, HERO, THINKING } from "@/lib/landing-content"
import { DiagnosticPreview } from "./diagnostic-preview"
import { Reveal } from "./reveal"

/**
 * Primera pantalla: qué es Brújula, qué recibes y cómo empezar.
 * Contiene el único `h1` de la página.
 *
 * Desde `lg` la sección ocupa exactamente una pantalla descontando el
 * encabezado fijo de 4rem, y su contenido queda centrado en ese espacio. Se usa
 * `svh` en lugar de `vh` para que la barra del navegador móvil no provoque un
 * salto de altura. Debajo de `lg` la altura es natural: forzar una pantalla
 * completa con las columnas apiladas obligaría a recortar contenido.
 */
export function Hero() {
  return (
    <section className="px-5 pb-20 pt-12 sm:px-6 lg:flex lg:min-h-[calc(100svh-4rem)] lg:items-center lg:pb-16 lg:pt-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            {HERO.badge}
          </p>

          <h1 className="mt-6 text-pretty text-4xl font-bold tracking-[-0.035em] text-gray-950 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            {HERO.headline.prefix}{" "}
            <span className="text-violet-700">{HERO.headline.highlight}</span>{" "}
            {HERO.headline.suffix}
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-gray-500">{HERO.subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={DIAGNOSTIC_PATH}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-900/15 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
            >
              {HERO.primaryCta}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <Link
              href={`#${THINKING.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-4 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
            >
              {HERO.secondaryCta}
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {HERO.trustPills.map((pill) => (
              <li key={pill} className="flex items-center gap-2 text-sm text-gray-500">
                <Check className="h-4 w-4 text-emerald-600" weight="bold" aria-hidden="true" />
                {pill}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <DiagnosticPreview />
        </Reveal>
      </div>
    </section>
  )
}
