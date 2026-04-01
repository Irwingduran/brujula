"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { DiagnosisResult, ScoreBreakdown } from "@/lib/types"
import { CheckCircle, Calendar, Envelope, TrendUp, CurrencyDollar, ArrowRight, Sparkle, Trophy, Target } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface Step4Props {
  diagnosis: DiagnosisResult
  score: ScoreBreakdown
  nombre: string
  leadId: string | null
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

function AnimatedScoreBar({ label, value, max, delay }: { label: string; value: number; max: number; delay: number }) {
  const [animated, setAnimated] = useState(false)
  const pct = Math.round((value / max) * 100)
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-bold text-primary">{value}/{max}</span>
      </div>
      <div className="h-3 rounded-full bg-muted/50 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
          initial={{ width: 0 }}
          animate={{ width: animated ? `${pct}%` : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

function AnimatedScore({ value }: { value: number }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return <span>{count}</span>
}

export function Step4Results({ diagnosis, score, nombre, leadId }: Step4Props) {
  const segmentConfig = {
    HOT: { 
      bg: "bg-gradient-to-br from-red-500 to-orange-500", 
      text: "text-white",
      icon: Trophy,
      label: "Alta prioridad"
    },
    WARM: { 
      bg: "bg-gradient-to-br from-amber-500 to-yellow-500", 
      text: "text-white",
      icon: Target,
      label: "Buena oportunidad"
    },
    COLD: { 
      bg: "bg-gradient-to-br from-blue-500 to-cyan-500", 
      text: "text-white",
      icon: Sparkle,
      label: "Para nutrir"
    },
  }

  const segment = segmentConfig[score.segmento]
  const SegmentIcon = segment.icon

  return (
    <motion.div 
      className="flex flex-col gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with celebration */}
      <motion.div variants={itemVariants} className="text-center">
        <motion.div 
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/70 shadow-xl shadow-accent/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
        >
          <CheckCircle className="h-10 w-10 text-white" />
        </motion.div>
        <h2 className="mt-6 font-sans text-3xl font-bold text-foreground tracking-tight">
          ¡{nombre}, tu diagnóstico está listo!
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Basado en tus respuestas, esto es lo que encontramos.
        </p>
      </motion.div>

      {/* Score Card */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl overflow-hidden">
        {/* Score Header */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Score de calificación</div>
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-6xl font-bold text-foreground">
                  <AnimatedScore value={score.total} />
                </span>
                <span className="text-2xl font-medium text-muted-foreground">/100</span>
              </div>
            </div>
            <motion.div 
              className={cn("flex flex-col items-center gap-2 rounded-2xl px-5 py-4", segment.bg)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <SegmentIcon className={cn("h-6 w-6", segment.text)} />
              <span className={cn("text-sm font-bold", segment.text)}>{score.segmento}</span>
              <span className={cn("text-xs opacity-90", segment.text)}>{segment.label}</span>
            </motion.div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="p-6 space-y-4">
          <AnimatedScoreBar label="Presupuesto" value={score.presupuesto} max={30} delay={300} />
          <AnimatedScoreBar label="Urgencia" value={score.urgencia} max={25} delay={450} />
          <AnimatedScoreBar label="Tamaño de empresa" value={score.tamano_empresa} max={20} delay={600} />
          <AnimatedScoreBar label="Claridad del problema" value={score.claridad_problema} max={15} delay={750} />
          <AnimatedScoreBar label="Fit de industria" value={score.industria_fit} max={10} delay={900} />
        </div>
      </motion.div>

      {/* Diagnosis */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-sans text-xl font-bold text-foreground">
              {diagnosis.titulo_servicio}
            </h3>
            <p className="text-sm text-muted-foreground">Solución recomendada</p>
          </div>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground">
          {diagnosis.diagnostico_texto}
        </p>
        <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm leading-relaxed text-foreground">
            {diagnosis.descripcion}
          </p>
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
        <h3 className="mb-5 font-sans text-lg font-bold text-foreground">
          Lo que puedes esperar
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {diagnosis.beneficios.map((b, i) => (
            <motion.div 
              key={b} 
              className="flex items-start gap-3 rounded-xl bg-accent/5 p-4 border border-accent/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground">{b}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ROI & Pricing */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <TrendUp className="h-5 w-5" />
            </div>
            <span className="font-medium">ROI estimado</span>
          </div>
          <p className="text-lg font-bold text-foreground">{diagnosis.roi_estimado}</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CurrencyDollar className="h-5 w-5" />
            </div>
            <span className="font-medium">Inversión estimada</span>
          </div>
          <p className="text-lg font-bold text-foreground">{diagnosis.precio_rango}</p>
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <motion.a
          href="#"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-base font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/40"
        >
          <Calendar className="h-5 w-5" />
          Agendar llamada gratuita de 30 min
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </motion.a>
        <motion.a
          href={leadId ? `/resultado/${leadId}` : "#"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-border bg-white px-8 py-4 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:shadow-lg"
        >
          <Mail className="h-5 w-5 text-muted-foreground" />
          Recibir propuesta completa por email
        </motion.a>
      </motion.div>

      {/* Next step hint */}
      <motion.p 
        variants={itemVariants}
        className="text-center text-sm text-muted-foreground px-4"
      >
        {diagnosis.siguiente_paso}
      </motion.p>
    </motion.div>
  )
}
