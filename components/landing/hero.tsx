"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check, ChatDots, Compass, ClipboardText, Timer, ShieldCheck, ListChecks } from "@phosphor-icons/react"

const stats = [
  { icon: Timer, value: "5 min", label: "para tu diagnóstico completo" },
  { icon: ShieldCheck, value: "100%", label: "gratuito, sin trampas" },
  { icon: ListChecks, value: "3", label: "acciones concretas priorizadas" },
]

const STEPS = [
  {
    icon: ChatDots,
    title: "Cuéntanos sobre tu negocio",
    description: "Responde preguntas sobre tu operación, tus herramientas actuales y tus objetivos.",
  },
  {
    icon: Compass,
    title: "Brújula hace el análisis",
    description: "Brújula detecta los síntomas digitales de tu negocio — visibilidad, captación, operaciones — y los prioriza por impacto real y presupuesto disponible.",
  },
  {
    icon: ClipboardText,
    title: "Recibe tu plan personalizado",
    description: "Recibes entre 2 y 5 recomendaciones ordenadas: qué hacer esta semana, qué dejar para después y qué no vale la pena en tu caso.",
  },
]

export function Hero() {
  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4">
        {/* Glow background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-bold leading-tight tracking-tight md:text-7xl"
          >
            ¿Qué tan digitalizada está{" "}
            <span className="bg-primary bg-clip-text text-transparent to-primary/60">tu PYME</span>?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-xl text-muted-foreground"
          >
            La mayoría de las PYMEs pierden clientes sin saber qué digital les falta.
            <br />
            Brújula te dice{" "}
            <span className="font-medium text-foreground">exactamente qué arreglar, en qué orden,</span>
            {" "}sin gastar de más.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10"
          >
            <Link
              href="/diagnostico"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)] transition-all hover:scale-105 hover:shadow-[0_0_36px_-4px_hsl(var(--primary)/0.7)] sm:w-auto"
            >
              Comenzar diagnóstico
              <ArrowRight className="h-5 w-5" />
            </Link>

            <p className="mt-4 text-sm text-muted-foreground">
              Recibirás: un score de madurez digital · tus 3 síntomas principales · un plan de acción con pasos ordenados por impacto
            </p>

            <div className="mt-6 flex justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Check className="h-4 w-4" /> Sin registro</span>
              <span className="flex items-center gap-1"><Check className="h-4 w-4" /> Sin pago</span>
              <span className="flex items-center gap-1"><Check className="h-4 w-4" /> Sin compromiso</span>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 md:gap-6">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-4 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
              >
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
                  <div className="absolute inset-0 rounded-full bg-primary/0 blur-md transition-all duration-300 group-hover:bg-primary/15" />
                  <Icon className="relative h-5 w-5 text-primary" />
                </div>
                <span className="text-3xl font-bold text-foreground">{value}</span>
                <span className="text-xs leading-tight text-muted-foreground">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE: CÓMO FUNCIONA ── */}
      <section className="relative px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold tracking-tight md:text-4xl"
          >
            Cómo funciona
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-3 text-center text-lg text-muted-foreground"
          >
            Sin consultores, sin reuniones, sin esperar.
          </motion.p>

          <div className="relative mt-16">
            {/* Horizontal line (desktop) */}
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-border md:block" />
            {/* Vertical line (mobile) */}
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border md:hidden" />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative flex flex-row items-start gap-4 text-left md:flex-col md:items-center md:text-center"
                >
                  {/* Circle */}
                  <div className="relative z-10 mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background md:mt-0 md:h-16 md:w-16">
                    <span className="text-sm font-bold text-primary md:text-lg">{i + 1}</span>
                  </div>

                  {/* Content card */}
                  <div className="flex w-full flex-1 flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md md:p-6">
                    <div className="mb-3 flex items-center gap-3 md:mb-4 md:justify-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 md:h-10 md:w-10">
                        <step.icon className="h-4 w-4 text-primary md:h-5 md:w-5" />
                      </div>
                      <h3 className="text-lg font-bold md:text-xl">{step.title}</h3>
                    </div>
                    <p className="flex-1 text-sm text-muted-foreground md:text-base">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden px-4 py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
        <div className="absolute inset-0">
          <div className="absolute -top-[50%] -right-[25%] h-[600px] w-[600px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-[50%] -left-[25%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <h2 className="mt-6 text-balance font-sans text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-4xl">
            Tu diagnóstico es el primer paso.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/80">
            Empieza ahora — después podrás agendar una sesión con alguien que ya conoce tu caso.
          </p>
          <div className="mt-8">
            <Link
              href="/diagnostico"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Comenzar diagnóstico gratis
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
