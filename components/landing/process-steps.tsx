"use client"

import { motion } from "framer-motion"
import { ClipboardCheck, Lightbulb, CalendarCheck, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

const STEPS = [
  {
    icon: ClipboardCheck,
    number: "01",
    title: "Completa el diagnóstico",
    description: "Responde preguntas inteligentes sobre tu negocio. Nuestro sistema se adapta a tus respuestas para entender tu situación única.",
    features: ["4 secciones interactivas", "Menos de 3 minutos", "100% gratuito"],
    color: "primary",
  },
  {
    icon: Lightbulb,
    number: "02",
    title: "Recibe tu plan estratégico",
    description: "Nuestro sistema analiza tus datos y genera un diagnóstico completo con recomendaciones priorizadas y ROI estimado.",
    features: ["Análisis con IA", "Roadmap personalizado", "Métricas claras"],
    color: "accent",
  },
  {
    icon: CalendarCheck,
    number: "03",
    title: "Agenda tu llamada",
    description: "Conversamos 30 minutos gratis para revisar tu plan, resolver dudas y definir los próximos pasos concretos.",
    features: ["Sesión personalizada", "Sin compromiso", "Experto dedicado"],
    color: "primary",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export function ProcessSteps() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-background px-4 py-20 md:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-3/4 left-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Proceso simple
          </span>
          <h2 className="mt-4 text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            ¿Cómo funciona?
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-pretty text-muted-foreground md:text-lg">
            Un proceso diseñado para darte claridad en minutos, no semanas.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="group relative"
            >
              {/* Connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="absolute top-14 left-[calc(50%+3rem)] hidden h-0.5 w-[calc(100%-6rem)] md:block">
                  <div className="h-full w-full bg-gradient-to-r from-border via-primary/30 to-border" />
                  <ArrowRight className="absolute -right-3 -top-2 h-5 w-5 text-primary/40" />
                </div>
              )}

              {/* Card */}
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 md:p-8">
                {/* Step number badge */}
                <div className="absolute -top-4 left-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary/80 px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg">
                  PASO {step.number}
                </div>

                {/* Icon */}
                <div className={`mt-2 flex h-14 w-14 items-center justify-center rounded-2xl ${
                  step.color === "primary" 
                    ? "bg-primary/10 text-primary" 
                    : "bg-accent/10 text-accent"
                } transition-transform duration-300 group-hover:scale-110`}>
                  <step.icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="mt-5 font-sans text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {/* Features list */}
                <ul className="mt-5 space-y-2">
                  {step.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        step.color === "primary" ? "bg-primary/10" : "bg-accent/10"
                      }`}>
                        <Check className={`h-3 w-3 ${
                          step.color === "primary" ? "text-primary" : "text-accent"
                        }`} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/diagnostico"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-primary/5 px-6 py-3 text-base font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            Comenzar ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Sin tarjeta de crédito • Sin compromiso
          </p>
        </motion.div>
      </div>
    </section>
  )
}
