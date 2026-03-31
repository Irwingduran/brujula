"use client"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ArrowRight, Sparkles, Check, Zap, TrendingDown, Bot } from "lucide-react"
import { useRef } from "react"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const heroOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0])
  const heroScale = useTransform(smoothProgress, [0, 0.12], [1, 0.95])
  const aiDiffOpacity = useTransform(smoothProgress, [0.12, 0.20, 0.36, 0.42], [0, 1, 1, 0])
  const discoverOpacity = useTransform(smoothProgress, [0.42, 0.50, 0.56, 0.62], [0, 1, 1, 0])
  const step1Opacity = useTransform(smoothProgress, [0.62, 0.68, 0.74, 0.78], [0, 1, 1, 0])
  const step2Opacity = useTransform(smoothProgress, [0.78, 0.84, 0.90, 0.94], [0, 1, 1, 0])
  const ctaOpacity = useTransform(smoothProgress, [0.94, 1], [0, 1])

  const stats = [
    { icon: TrendingDown, value: "−60%", label: "vs agencia tradicional" },
    { icon: Zap, value: "24/7", label: "operación autónoma" },
    { icon: Bot, value: "100%", label: "decisiones respaldadas por datos" },
  ]

  return (
    <div ref={containerRef} className="relative" style={{ height: "650vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-background">

        {/* ✨ CAMBIO: fondo global con ruido de grano sutil — da profundidad sin distraer */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

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
              Tu negocio tiene 
              {/* ✨ CAMBIO: texto primario con gradiente en lugar de color plano */}
              <span className="block mt-2 bg-primary  to-primary/60 bg-clip-text text-transparent">
              potencial oculto
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-xl text-muted-foreground max-w-xl mx-auto"
            >
              Consultoría digital avanzada en tiempo real
              <br />
              <span className="text-foreground font-medium">Y es gratis</span>
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
          
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />
            <div className="absolute -right-32 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto w-full">
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                Por qué somos diferentes
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            </motion.div>

            <h2 className="text-center text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              La primera agencia{" "}
              <span className="relative inline-block">
             
                <span className="relative z-10 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  impulsada por IA
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
              {" "}en México
            </h2>

            <p className="text-center mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              ¿Por qué pagarle a un equipo de 10 personas cuando la tecnología hace el trabajo
              de forma continua? Así logramos cobrar{" "}
              <strong className="text-foreground">hasta 60% menos</strong>{" "}
              que una agencia tradicional. Y sí, los resultados son mejores.
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

        {/* ── DESCUBRE CÓMO ── */}
        <motion.section
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: discoverOpacity }}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[400px] w-[400px] rounded-full bg-primary/6 blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Así de simple
            </span>

            <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight">
              <span className="text-primary">3 pasos.</span> Sin complicaciones.
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Descubre cómo transformamos tu negocio en minutos, no en meses.
            </p>
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
            <div className="relative mb-2 flex justify-center">
              <span className="absolute -top-8 text-[10rem] font-black text-primary/5 leading-none select-none pointer-events-none">
                1
              </span>
              <span className="relative z-10 inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                Paso 1 de 3
              </span>
            </div>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold">
              {/* ✨ CAMBIO: primera palabra en color para peso visual */}
              <span className="text-primary">Respondes</span> una serie de preguntas
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Sobre tu negocio, tus clientes y tus objetivos.
            </p>

            {/* ✨ CAMBIO: ícono con fondo circular y sombra de color en lugar de emoji suelto */}
            <div className="mt-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_32px_-4px_hsl(var(--primary)/0.4)]">
                <Zap className="h-9 w-9 text-primary" />
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
            <div className="relative mb-2 flex justify-center">
              <span className="absolute -top-8 text-[10rem] font-black text-primary/5 leading-none select-none pointer-events-none">
                2
              </span>
              <span className="relative z-10 inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                Paso 2 de 3
              </span>
            </div>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold">
              <span className="text-primary">Brújula</span> genera tu plan
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Análisis personalizado con modelos de Inteligencia Artificial para acciones concretas.
            </p>

            <div className="mt-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_32px_-4px_hsl(var(--primary)/0.4)]">
                <Bot className="h-9 w-9 text-primary" />
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

          {/* ✨ CAMBIO: líneas decorativas horizontales arriba y abajo del contenido */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
            <div className="absolute -top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute -bottom-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
              <Sparkles className="h-4 w-4" />
              Último paso
            </span>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold">
              {/* ✨ CAMBIO: interrogación en gradiente para peso visual en el CTA */}
              ¿<span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Hablamos</span>?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              30 minutos gratis con un experto para el seguimiento de tu plan.
            </p>

            <div className="mt-10">
              {/* ✨ CAMBIO: botón con glow idéntico al del Hero para consistencia */}
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_40px_-4px_hsl(var(--primary)/0.7)]"
              >
                Quiero mi diagnóstico gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  )
}