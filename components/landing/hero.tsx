"use client"

import Link from "next/link"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ArrowRight, Sparkles, Clock, Check } from "lucide-react"
import { useRef } from "react"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Solo 3 secciones, transiciones simples
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0])
  const step1Opacity = useTransform(smoothProgress, [0.3, 0.5, 0.6], [0, 1, 0])
  const step2Opacity = useTransform(smoothProgress, [0.6, 0.8, 0.9], [0, 1, 0])
  const ctaOpacity = useTransform(smoothProgress, [0.9, 1], [0, 1])

  return (
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
      
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        
        {/* Mensaje principal - Simple y directo */}
        <motion.section 
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: heroOpacity }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tight"
            >
              Tu negocio tiene
              <span className="block text-primary mt-2">potencial oculto</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-muted-foreground"
            >
              Descúbrelo en 3 minutos. Gratis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10"
            >
              <Link 
                href="/diagnostico" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-all hover:scale-105"
              >
                Comenzar diagnóstico
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 3 min</span>
                <span className="flex items-center gap-1"><Check className="h-4 w-4" /> Sin registro</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Paso 1 - Diagnóstico */}
        <motion.section 
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: step1Opacity }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-sm font-medium text-muted-foreground tracking-wider">PASO 1/3</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold">Respondes 10 preguntas</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Sobre tu negocio, tus clientes y tus objetivos.
            </p>
            <div className="mt-8 text-6xl font-light text-primary">⚡</div>
          </div>
        </motion.section>

        {/* Paso 2 - IA genera plan */}
        <motion.section 
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: step2Opacity }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-sm font-medium text-muted-foreground tracking-wider">PASO 2/3</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold">IA genera tu plan</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Análisis personalizado con acciones concretas.
            </p>
            <div className="mt-8 text-6xl font-light text-primary">📋</div>
          </div>
        </motion.section>

        {/* CTA Final - Un paso más */}
        <motion.section 
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: ctaOpacity }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Último paso
            </span>
            
            <h2 className="mt-6 text-4xl md:text-5xl font-bold">
              ¿Hablamos?
            </h2>
            
            <p className="mt-4 text-xl text-muted-foreground">
              30 minutos gratis con un experto para revisar tu plan.
            </p>

            <div className="mt-10">
              <Link 
                href="/diagnostico" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-all"
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