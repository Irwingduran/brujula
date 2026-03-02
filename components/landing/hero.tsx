"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Sparkles, Zap, Target, TrendingUp } from "lucide-react"

const TRUST_ITEMS = [
  { text: "100% gratuito", icon: Sparkles },
  { text: "Resultados en 3 minutos", icon: Zap },
  { text: "Sin compromiso", icon: CheckCircle2 },
]

const FEATURES = [
  { icon: Target, label: "Plan personalizado" },
  { icon: TrendingUp, label: "ROI estimado" },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0">
        <div className="absolute -top-[40%] -right-[20%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-accent/15 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 md:pb-32 md:pt-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 backdrop-blur-sm px-5 py-2 shadow-lg shadow-primary/5"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="text-sm font-medium text-foreground">Diagnóstico Digital Gratuito</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="max-w-4xl text-balance font-sans text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl xl:text-7xl"
          >
            Tu brújula hacia el{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                éxito digital
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-primary/20 to-accent/20 blur-sm" />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Descubre exactamente qué necesita tu negocio para crecer. 
            Responde algunas preguntas y recibe un <strong className="text-foreground">plan estratégico personalizado</strong> con 
            recomendaciones accionables.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/diagnostico"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              <span className="relative z-10">Iniciar diagnóstico gratuito</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {FEATURES.map((feature) => (
                <span key={feature.label} className="flex items-center gap-1.5">
                  <feature.icon className="h-4 w-4 text-primary" />
                  {feature.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-6"
          >
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-sm px-4 py-2 shadow-sm"
              >
                <item.icon className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute top-20 right-[10%] hidden lg:block"
        >
          <div className="glass-card rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Incremento promedio</div>
                <div className="text-lg font-bold text-foreground">+40% ventas</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-32 left-[5%] hidden lg:block"
        >
          <div className="glass-card rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Negocios ayudados</div>
                <div className="text-lg font-bold text-foreground">150+</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
