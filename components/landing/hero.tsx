"use client"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ArrowRight, Check, ChatDots, TrendDown, Compass, UsersThree, ShieldCheck } from "@phosphor-icons/react"
import { useRef } from "react"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(smoothProgress, [0, 0.15], [1, 0.95])
  const aiDiffOpacity = useTransform(smoothProgress, [0.15, 0.22, 0.38, 0.44], [0, 1, 1, 0])
  const step1Opacity = useTransform(smoothProgress, [0.44, 0.50, 0.58, 0.64], [0, 1, 1, 0])
  const step2Opacity = useTransform(smoothProgress, [0.64, 0.72, 0.82, 0.88], [0, 1, 1, 0])
  const ctaOpacity = useTransform(smoothProgress, [0.88, 0.95], [0, 1])

  const stats = [
    { icon: TrendDown, value: "5 minutos", label: "para obtener tu diagnóstico completo" },
    { icon: UsersThree, value: "Análisis con IA", label: "personalizado a tu industria y situación" },
    { icon: ShieldCheck, value: "0 riesgo", label: "diagnóstico 100% gratuito" },
  ]

  return (
    <div ref={containerRef} className="relative" style={{ height: "550vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-background">

        {/* ── HERO PRINCIPAL ── */}
        <motion.section
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          {/* ✨ CAMBIO: gradiente radial centrado detrás del texto — efecto "glow" de foco */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
          </div>

          {/* ✨ CAMBIO: grid de puntos de fondo para dar textura al espacio vacío */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
         

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
            >
              ¿Hacia dónde va <span className="bg-primary to-primary/60 bg-clip-text text-transparent">tu negocio</span>?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-xl text-muted-foreground max-w-xl mx-auto"
            >
              Brújula te muestra el camino con un diagnóstico digital
              <br />
              <span className="text-foreground font-medium">gratuito e impulsado por IA.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10"
            >
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_36px_-4px_hsl(var(--primary)/0.7)]"
              >
                Comenzar diagnóstico
                <ArrowRight className="h-5 w-5" />
              </Link>

              <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Check className="h-4 w-4" /> Sin registro</span>
                <span className="flex items-center gap-1"><Check className="h-4 w-4" /> Sin pago</span>
                <span className="flex items-center gap-1"><Check className="h-4 w-4" /> Sin compromiso</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ── SECCIÓN DIFERENCIADORA ── */}
        <motion.section
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: aiDiffOpacity }}
        >

          <div className="relative z-10 max-w-4xl mx-auto w-full">
            <h2 className="text-center text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              Descubre qué{" "}
              <span className="relative inline-block">
             
                <span className="relative z-10 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  necesita tu negocio
                </span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6 Q75 2 150 5 Q225 8 298 3"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="text-primary/40"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-center mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              Responde unas preguntas, nuestra IA analiza tu situación y te entrega
              un plan de acción personalizado. Si quieres ir más lejos,{" "}
              <strong className="text-foreground">te conectamos con un especialista.</strong>
            </p>

            {/* ✨ CAMBIO: cards con borde gradiente animado + hover lift */}
            <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6">
              {stats.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="group relative flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-4 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 hover:bg-card/80"
                >
                 
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
                    <div className="absolute inset-0 rounded-full bg-primary/0 blur-md transition-all duration-300 group-hover:bg-primary/15" />
                    <Icon className="relative h-5 w-5 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-foreground">{value}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── PASO 1 ── */}
        <motion.section
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: step1Opacity }}
        >
          {/* ✨ CAMBIO: glow posicionado arriba-derecha para variar composición entre pasos */}
          <div className="pointer-events-none absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/6 blur-[80px]" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            {/* ✨ CAMBIO: badge de paso con borde de color + número grande como fondo decorativo */}
            <h2 className="text-4xl md:text-5xl font-bold">
              {/* ✨ CAMBIO: primera palabra en color para peso visual */}
              <span className="text-primary">Cuéntanos</span> sobre tu negocio
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Responde unas preguntas sobre tu operación, tus herramientas y tus objetivos.
            </p>

            {/* ✨ CAMBIO: ícono con fondo circular y sombra de color en lugar de emoji suelto */}
            <div className="mt-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_32px_-4px_hsl(var(--primary)/0.4)]">
                <ChatDots className="h-9 w-9 text-primary" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── PASO 2 ── */}
        <motion.section
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: step2Opacity }}
        >
          {/* ✨ CAMBIO: glow opuesto al paso 1 — glow abajo-izquierda */}
          <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/6 blur-[80px]" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-primary">Brújula</span> hace el análisis
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Nuestra IA cruza tus respuestas y te entrega un plan con acciones priorizadas.
            </p>

            <div className="mt-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_32px_-4px_hsl(var(--primary)/0.4)]">
                <Compass className="h-9 w-9 text-primary" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── CTA FINAL ── */}
        <motion.section
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: ctaOpacity }}
        >
          {/* ✨ CAMBIO: glow central grande — efecto "escenario iluminado" para el CTA */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[500px] w-[700px] rounded-full bg-primary/8 blur-[140px]" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold">
              ¿Quieres ir{" "}<span className="bg-primary bg-clip-text text-transparent">más lejos</span>?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Agenda una sesión gratis con un experto que ya conoce tu caso.
            </p>

            <div className="mt-10">
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_40px_-4px_hsl(var(--primary)/0.7)]"
              >
                Comenzar ahora
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  )
}