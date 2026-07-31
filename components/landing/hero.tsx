"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowDown,
  ArrowRight,
  Brain,
  ChartLineUp,
  Check,
  Compass,
  Crosshair,
  Eye,
  Gauge,
  Lightbulb,
  ListChecks,
  MagnifyingGlass,
  Path,
  Quotes,
  ShieldCheck,
  Sparkle,
  Target,
} from "@phosphor-icons/react"
import { Benefits } from "./benefits"
import { FAQSection } from "./faq"

const decisionLayers = [
  { icon: Quotes, eyebrow: "01 · Evidencia", title: "Lo que realmente pasa", description: "Tus respuestas, procesos y sitio web, cuando nos autorizas a analizarlo.", accent: "bg-violet-50 text-violet-700" },
  { icon: MagnifyingGlass, eyebrow: "02 · Hallazgo", title: "Lo que está frenando", description: "Señales conectadas con su impacto probable y nivel de confianza.", accent: "bg-amber-50 text-amber-700" },
  { icon: Crosshair, eyebrow: "03 · Capacidad", title: "Lo que necesitas poder hacer", description: "La capacidad de negocio antes de hablar de herramientas o proveedores.", accent: "bg-emerald-50 text-emerald-700" },
  { icon: Path, eyebrow: "04 · Ruta", title: "Qué hacer y en qué orden", description: "Un siguiente paso proporcional, con prerrequisitos y una forma de medirlo.", accent: "bg-violet-100 text-violet-800" },
]

const roadmap = [
  { label: "Ahora", title: "Ordena el cuello de botella", description: "Centraliza prospectos y define responsables antes de sumar complejidad.", meta: "Prioridad 01" },
  { label: "Después", title: "Implementa lo proporcional", description: "Adopta una solución ligera cuando el proceso ya tenga una base clara.", meta: "Prioridad 02" },
  { label: "Con evidencia", title: "Automatiza o incorpora IA", description: "Escala sólo cuando exista información suficiente para hacerlo con sentido.", meta: "Prioridad 03" },
]

const steps = [
  { icon: Quotes, number: "01", title: "Cuéntanos cómo opera tu negocio", description: "El formulario se adapta a tu giro, dolores y respuestas. Sin lenguaje técnico." },
  { icon: Brain, number: "02", title: "Conectamos las señales", description: "Brújula contrasta evidencia, detecta contradicciones y evita llenar vacíos con certezas." },
  { icon: ListChecks, number: "03", title: "Recibe una ruta explicada", description: "Entiende qué priorizar, por qué, qué todavía no conviene y cómo medir el avance." },
]

const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

function DiagnosticPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative mx-auto w-full max-w-[510px]"
    >
      <div className="absolute -inset-8 -z-10 rounded-full bg-violet-300/20 blur-3xl" />
      <div className="absolute -right-5 top-16 z-10 hidden rounded-xl border border-emerald-200 bg-white px-3 py-2 shadow-lg shadow-emerald-900/5 sm:block">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" weight="fill" /> Evidencia trazable
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-violet-200/80 bg-white shadow-2xl shadow-violet-950/10">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-700 text-white">
              <Compass className="h-4 w-4" weight="fill" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Tu diagnóstico</p>
              <p className="text-sm font-semibold text-gray-900">Panorama del negocio</p>
            </div>
          </div>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">Personalizado</span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400">Madurez digital actual</p>
              <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-bold tracking-tight text-gray-950">2</span><span className="pb-1 text-sm text-gray-400">/ 5</span></div>
            </div>
            <div className="flex gap-1.5" aria-label="Madurez digital: 2 de 5">
              {[0, 1, 2, 3, 4].map((item) => <span key={item} className={`h-2 w-8 rounded-full ${item < 2 ? "bg-violet-600" : "bg-gray-100"}`} />)}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Hallazgo prioritario</p>
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-gray-500">Confianza alta</span>
            </div>
            <p className="mt-2 font-semibold text-gray-950">El seguimiento comercial depende de la memoria.</p>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-500">Hay oportunidades que pueden perderse porque los prospectos viven en conversaciones aisladas.</p>
          </div>

          <div className="relative my-2 flex h-7 justify-center">
            <div className="absolute inset-y-0 w-px bg-violet-200" />
            <div className="relative mt-2 flex h-5 w-5 items-center justify-center rounded-full border border-violet-200 bg-white"><ArrowDown className="h-3 w-3 text-violet-600" /></div>
          </div>

          <div className="rounded-2xl bg-violet-950 p-4 text-white">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10"><Target className="h-5 w-5 text-violet-200" /></div>
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">Primera capacidad</p><p className="mt-1 text-sm font-semibold">Centralizar prospectos y controlar su seguimiento.</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-[11px] text-violet-200"><span>Métrica sugerida</span><span className="text-right font-medium text-white">Contactos atendidos en 24 h</span></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Hero() {
  return (
    <div className="overflow-hidden bg-background">
      <section className="relative px-5 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(circle at 72% 30%, oklch(0.93 0.08 308.2 / .65), transparent 30%), radial-gradient(circle at 8% 75%, oklch(0.95 0.08 160 / .35), transparent 24%)" }} />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
          <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-3.5 py-2 text-xs font-semibold text-violet-800 shadow-sm backdrop-blur">
              <Sparkle className="h-4 w-4 text-violet-600" weight="fill" /> Diagnóstico tecnológico para PYMEs mexicanas
            </div>
            <h1 className="mt-7 max-w-3xl text-[2.75rem] font-bold leading-[1.02] tracking-[-0.045em] text-gray-950 sm:text-6xl lg:text-[4.25rem]">
              No necesitas más tecnología. Necesitas saber <span className="text-violet-600">cuál sigue.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              Brújula convierte lo que pasa en tu negocio en un diagnóstico claro: qué te frena, por qué importa y qué conviene hacer primero.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/diagnostico" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-700/20 transition-all hover:-translate-y-0.5 hover:bg-violet-800">
                Descubrir mi siguiente paso <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#como-funciona" className="inline-flex items-center justify-center px-5 py-4 text-sm font-semibold text-gray-600 transition-colors hover:text-violet-700">Ver cómo funciona</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-gray-500">
              {["Gratuito", "Sin tarjeta", "Sin compromiso"].map((item) => <span key={item} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" weight="bold" />{item}</span>)}
            </div>
          </motion.div>
          <DiagnosticPreview />
        </div>
      </section>

      <section className="border-y border-violet-900/10 bg-violet-950 px-5 py-9 text-white sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-xl font-semibold leading-snug tracking-tight sm:text-2xl">No te damos una lista de software. Te ayudamos a tomar una decisión.</p>
          <div className="flex shrink-0 items-center gap-2 text-sm text-violet-200"><ShieldCheck className="h-5 w-5" /> Diagnosticar antes de vender</div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={reveal} transition={{ duration: 0.5 }} className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Cómo piensa Brújula</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-gray-950 sm:text-5xl">Del síntoma a una ruta que puedes entender.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-500">Cada conclusión sigue un camino visible. Si falta información, te lo decimos; no inventamos certeza para que una recomendación suene mejor.</p>
          </motion.div>

          <div className="relative mt-14 grid gap-4 lg:grid-cols-4">
            <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-violet-200 via-emerald-200 to-violet-200 lg:block" />
            {decisionLayers.map(({ icon: Icon, eyebrow, title, description, accent }, index) => (
              <motion.article key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ delay: index * 0.08 }} className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}><Icon className="h-6 w-6" /></div>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{eyebrow}</p>
                <h3 className="mt-2 text-lg font-semibold text-gray-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-5 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Una ruta, no una receta</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-gray-950 sm:text-5xl">No todo debe hacerse hoy.</h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-500">Tu resultado distingue lo urgente de lo prematuro. Porque una buena recomendación también sabe decirte qué puede esperar.</p>
            <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-5">
              <div className="flex gap-3"><Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" weight="fill" /><p className="text-sm leading-relaxed text-violet-900"><strong>Ejemplo ilustrativo:</strong> antes de recomendar automatización o IA, Brújula puede detectar que primero necesitas ordenar tus datos y medir el proceso.</p></div>
            </div>
          </motion.div>

          <div className="relative space-y-3 before:absolute before:bottom-10 before:left-[1.45rem] before:top-10 before:w-px before:bg-violet-200 sm:before:left-[2.45rem]">
            {roadmap.map((item, index) => (
              <motion.article key={item.label} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="relative flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:gap-6 sm:p-6">
                <div className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white text-sm font-bold sm:h-14 sm:w-14 ${index === 0 ? "bg-violet-700 text-white" : index === 1 ? "bg-violet-100 text-violet-800" : "bg-emerald-100 text-emerald-800"}`}>{index + 1}</div>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">{item.label}</p><span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{item.meta}</span></div><h3 className="mt-2 font-semibold text-gray-950 sm:text-lg">{item.title}</h3><p className="mt-1.5 text-sm leading-relaxed text-gray-500">{item.description}</p></div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Benefits />

      <section id="como-funciona" className="border-t border-gray-100 px-5 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Cómo funciona</p><h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-gray-950 sm:text-5xl">Unos minutos para dejar de adivinar.</h2></div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, description }, index) => (
              <motion.article key={number} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ delay: index * 0.1 }} className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-900/5">
                <div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon className="h-5 w-5" /></div><span className="font-mono text-xs text-gray-300">{number}</span></div><h3 className="mt-6 text-lg font-semibold text-gray-950">{title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 lg:pb-28">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-violet-950 lg:grid-cols-[1.15fr_.85fr]">
          <div className="p-7 text-white sm:p-10 lg:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Nuestro criterio</p>
            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.035em] sm:text-4xl">La siguiente tecnología correcta. No la más llamativa.</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-violet-200">Una hoja de cálculo ordenada puede ser más útil hoy que un agente de IA. Tu diagnóstico prioriza impacto, proporcionalidad y evidencia.</p>
          </div>
          <div className="grid grid-cols-2 border-t border-white/10 lg:border-l lg:border-t-0">
            {[{ icon: Eye, label: "Explicable", text: "Ves por qué llegamos a cada conclusión." }, { icon: Gauge, label: "Proporcional", text: "A tu tamaño, urgencia y madurez." }, { icon: ShieldCheck, label: "Neutral", text: "El diagnóstico existe antes que la venta." }, { icon: ChartLineUp, label: "Medible", text: "Cada prioridad propone qué observar." }].map(({ icon: Icon, label, text }) => <div key={label} className="border-b border-r border-white/10 p-5 text-white sm:p-7"><Icon className="h-6 w-6 text-emerald-300" /><p className="mt-4 text-sm font-semibold">{label}</p><p className="mt-1 text-xs leading-relaxed text-violet-300">{text}</p></div>)}
          </div>
        </div>
      </section>

      <FAQSection />

      <section className="relative overflow-hidden bg-violet-700 px-5 py-20 text-white sm:px-6">
        <div className="absolute -left-20 -top-40 h-80 w-80 rounded-full border border-white/10" /><div className="absolute -left-8 -top-28 h-56 w-56 rounded-full border border-white/10" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="relative mx-auto max-w-3xl text-center">
          <Compass className="mx-auto h-10 w-10 text-violet-200" weight="fill" />
          <h2 className="mt-5 text-3xl font-bold tracking-[-0.035em] sm:text-5xl">Tu negocio ya da señales. Vamos a leerlas.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-violet-100">Obtén una ruta clara para decidir qué mejorar primero y qué no necesitas todavía.</p>
          <Link href="/diagnostico" className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-semibold text-violet-800 shadow-xl transition-transform hover:-translate-y-0.5">Iniciar mi diagnóstico gratuito <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
        </motion.div>
      </section>
    </div>
  )
}
