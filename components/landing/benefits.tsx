"use client"
import { motion } from "framer-motion"
import {
  BENEFITS_BADGE,
  BENEFITS_TITLE,
  BENEFITS_SUBTITLE,
  BENEFITS,
} from "@/lib/landing-content"

export function Benefits() {
  return (
    <section className="border-t border-gray-100 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-600">
            {BENEFITS_BADGE}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-950">{BENEFITS_TITLE}</h2>
          <p className="mt-2 text-gray-500">{BENEFITS_SUBTITLE}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, description, highlight }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                <Icon className="h-5 w-5 text-violet-600" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                    {highlight}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
