"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check, Star } from "@phosphor-icons/react"
import {
  HERO_BADGE,
  HERO_HEADLINE,
  HERO_SUBTITLE,
  HERO_CTA,
  HERO_FEATURES,
  HERO_TRUST_PILLARS,
  PREVIEW_BADGE,
  PREVIEW_TITLE,
  PREVIEW_SUBTITLE,
  BEFORE_AFTER,
  HOW_BADGE,
  HOW_TITLE,
  HOW_SUBTITLE,
  STEPS,
  CTA_TITLE,
  CTA_SUBTITLE,
  CTA_LABEL,
} from "@/lib/landing-content"
import { Benefits } from "./benefits"
import { FAQSection } from "./faq"

function StarRating({ value, muted }: { value: number; muted?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < value ? (muted ? "fill-gray-300 text-gray-300" : "fill-amber-400 text-amber-400") : "text-gray-200"}`}
        />
      ))}
    </div>
  )
}

function ScoreBars({
  scores,
  muted,
}: {
  scores: { label: string; value: number; max: number }[]
  muted?: boolean
}) {
  return (
    <div className="mt-5 space-y-2.5">
      {scores.map(({ label, value, max }) => {
        const pct = (value / max) * 100
        return (
          <div key={label} className="flex items-center gap-2.5">
            <span className="w-20 shrink-0 text-xs text-gray-400">{label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${muted ? "bg-gray-300" : "bg-violet-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span
              className={`w-8 text-right text-xs font-medium ${muted ? "text-gray-400" : "text-gray-700"}`}
            >
              {value}/{max}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function PanelHeader({
  label,
  maturity,
  businessName,
  businessMeta,
  accent,
}: {
  label: string
  maturity: number
  businessName: string
  businessMeta: string
  accent: "gray" | "violet"
}) {
  const tagBg = accent === "violet" ? "bg-violet-50 text-violet-700" : "bg-gray-100 text-gray-500"
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-800">{businessName}</p>
          <p className="text-xs text-gray-400">{businessMeta}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tagBg}`}>
            {maturity}/5
          </span>
          <StarRating value={maturity} muted={accent === "gray"} />
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-medium text-violet-700">
            {HERO_BADGE}
          </span>

          <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight text-gray-950 md:text-6xl">
            {HERO_HEADLINE.prefix}{" "}
            <span className="text-violet-600">{HERO_HEADLINE.highlight}</span>{" "}
            {HERO_HEADLINE.suffix}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
            {HERO_SUBTITLE}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              href="/diagnostico"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-violet-700 sm:w-auto"
            >
              {HERO_CTA}
              <ArrowRight className="h-5 w-5" />
            </Link>

            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-400">
              {HERO_FEATURES.map(({ icon: Icon, label }, i) => (
                <span key={label} className="flex items-center gap-1">
                  <Icon className="h-4 w-4 text-violet-400" />
                  {label}
                  {i < HERO_FEATURES.length - 1 && (
                    <span className="ml-3 text-gray-300">·</span>
                  )}
                </span>
              ))}
            </p>

            <div className="flex gap-5 text-sm text-gray-400">
              {HERO_TRUST_PILLARS.map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-violet-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-600">
              {PREVIEW_BADGE}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-950">
              {PREVIEW_TITLE}
            </h2>
            <p className="mt-2 text-gray-500">{PREVIEW_SUBTITLE}</p>
          </motion.div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
            {/* ── Before ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm"
            >
              <PanelHeader
                label={BEFORE_AFTER.before.label}
                maturity={BEFORE_AFTER.before.maturity}
                businessName={BEFORE_AFTER.business.name}
                businessMeta={BEFORE_AFTER.business.meta}
                accent="gray"
              />
              <ScoreBars scores={BEFORE_AFTER.before.scores} muted />
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-400">
                  Síntomas
                </p>
                <ul className="space-y-1.5">
                  {BEFORE_AFTER.before.symptoms.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="mt-0.5 text-red-300">✕</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* ── Arrow ── */}
            <div className="flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 md:h-12 md:w-12">
                <ArrowRight className="h-5 w-5 text-violet-600 md:h-6 md:w-6" />
              </div>
            </div>

            {/* ── After ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border-2 border-violet-200 bg-white p-6 shadow-md shadow-violet-100"
            >
              <PanelHeader
                label={BEFORE_AFTER.after.label}
                maturity={BEFORE_AFTER.after.maturity}
                businessName={BEFORE_AFTER.business.name}
                businessMeta={BEFORE_AFTER.business.meta}
                accent="violet"
              />
              <ScoreBars scores={BEFORE_AFTER.after.scores} />
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-green-500">
                  Plan de acción
                </p>
                <ul className="space-y-1.5">
                  {BEFORE_AFTER.after.actions.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 text-green-400">✓</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-8 max-w-lg text-center text-xs leading-relaxed text-gray-400"
          >
            {BEFORE_AFTER.before.summary}
            <span className="text-violet-500"> → </span>
            {BEFORE_AFTER.after.summary}
          </motion.p>
        </div>
      </section>

      <Benefits />

      {/* ── CÓMO FUNCIONA ── */}
      <section className="border-t border-gray-100 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-600">
              {HOW_BADGE}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-950">{HOW_TITLE}</h2>
            <p className="mt-2 text-gray-500">{HOW_SUBTITLE}</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, step, title, description }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-300">{step}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                    <Icon className="h-5 w-5 text-violet-600" />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* ── CTA FINAL ── */}
      <section className="border-t border-gray-100 bg-violet-600 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {CTA_TITLE}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-violet-200">{CTA_SUBTITLE}</p>
          <div className="mt-8">
            <Link
              href="/diagnostico"
              className="group inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white px-8 py-4 text-base font-semibold text-violet-700 shadow-sm transition-all duration-200 hover:bg-white/95"
            >
              {CTA_LABEL}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
