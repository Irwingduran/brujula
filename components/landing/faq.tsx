"use client"

import { useId, useState } from "react"
import { CaretDown } from "@phosphor-icons/react"
import { FAQ, FAQ_BADGE, FAQ_SUBTITLE, FAQ_TITLE } from "@/lib/landing-content"
import { Reveal } from "./reveal"

function AccordionItem({
  question,
  answer,
  defaultOpen,
}: {
  question: string
  answer: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  const panelId = useId()

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
        >
          <span className="text-sm font-medium text-gray-900">{question}</span>
          <CaretDown
            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </h3>

      {/*
        El panel se desmonta al cerrarse en lugar de ocultarse con altura cero:
        así el contenido colapsado queda fuera del orden de lectura y de foco.
      */}
      {open && (
        <p id={panelId} className="pb-4 text-sm leading-relaxed text-gray-500">
          {answer}
        </p>
      )}
    </div>
  )
}

export function FAQSection() {
  return (
    <section className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Reveal className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-600">{FAQ_BADGE}</p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-950">{FAQ_TITLE}</h2>
          <p className="mt-2 text-gray-500">{FAQ_SUBTITLE}</p>
        </Reveal>

        <Reveal delay={0.1} className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white px-6">
          {FAQ.map((item) => (
            <AccordionItem key={item.question} {...item} defaultOpen={item === FAQ[0]} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
