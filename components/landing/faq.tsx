"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { CaretDown } from "@phosphor-icons/react"
import { FAQ_BADGE, FAQ_TITLE, FAQ_SUBTITLE, FAQ } from "@/lib/landing-content"

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
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-0 py-4 text-left"
      >
        <span className="text-sm font-medium text-gray-900">{question}</span>
        <CaretDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-sm leading-relaxed text-gray-500">{answer}</p>
      </motion.div>
    </div>
  )
}

export function FAQSection() {
  return (
    <section className="border-t border-gray-100 bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-600">
            {FAQ_BADGE}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-950">{FAQ_TITLE}</h2>
          <p className="mt-2 text-gray-500">{FAQ_SUBTITLE}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white px-6"
        >
          {FAQ.map((item, i) => (
            <AccordionItem key={i} {...item} defaultOpen={i === 0} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
