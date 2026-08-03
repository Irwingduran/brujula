import Link from "next/link"
import { ArrowRight, Compass } from "@phosphor-icons/react/dist/ssr"
import { DIAGNOSTIC_PATH, FINAL_CTA } from "@/lib/landing-content"
import { Reveal } from "./reveal"

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-violet-700 px-5 py-20 text-white sm:px-6">
      <div className="absolute -left-20 -top-40 h-80 w-80 rounded-full border border-white/10" aria-hidden="true" />
      <div className="absolute -left-8 -top-28 h-56 w-56 rounded-full border border-white/10" aria-hidden="true" />

      <Reveal className="relative mx-auto max-w-3xl text-center">
        <Compass className="mx-auto h-10 w-10 text-violet-200" weight="fill" aria-hidden="true" />
        <h2 className="mt-5 text-3xl font-bold tracking-[-0.035em] sm:text-5xl">{FINAL_CTA.title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-violet-100">{FINAL_CTA.subtitle}</p>
        <Link
          href={DIAGNOSTIC_PATH}
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-semibold text-violet-800 shadow-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {FINAL_CTA.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  )
}
