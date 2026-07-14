"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import type { DiagnosisResult, ScoreBreakdown, WizardData, AIDiagnosisResult } from "@/lib/types"
import { CheckCircle } from "@phosphor-icons/react"
import { DiagnosisSummary } from "@/components/diagnosis/diagnosis-summary"
import { ResultadoCTAs } from "@/components/diagnosis/resultado-ctas"

interface Step4Props {
  diagnosis: DiagnosisResult
  score: ScoreBreakdown
  nombre: string
  email: string
  telefono: string
  leadId: string | null
  wizardData: WizardData
}

function getReadinessLevel(total: number): { label: string; description: string; color: string; bgColor: string; percentage: number } {
  if (total >= 70) return {
    label: "Alto potencial de transformación",
    description: "Tu empresa está en una posición ideal para implementar soluciones digitales con impacto inmediato.",
    color: "text-emerald-700",
    bgColor: "from-emerald-500 to-teal-500",
    percentage: total,
  }
  if (total >= 40) return {
    label: "Buena oportunidad de mejora",
    description: "Hay áreas claras donde la digitalización puede generar resultados significativos para tu negocio.",
    color: "text-amber-700",
    bgColor: "from-amber-500 to-orange-500",
    percentage: total,
  }
  return {
    label: "Base para crecer",
    description: "Tienes espacio para construir una base digital sólida que impulse el crecimiento de tu negocio.",
    color: "text-blue-700",
    bgColor: "from-blue-500 to-indigo-500",
    percentage: total,
  }
}

function AnimatedProgressRing({ percentage, delay }: { percentage: number; delay: number }) {
  const [animated, setAnimated] = useState(false)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <svg width="140" height="140" viewBox="0 0 120 120" className="transform -rotate-90">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
      <motion.circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: animated ? offset : circumference }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function AnimatedNumber({ value, suffix }: { value: number; suffix?: string }) {
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

  return <span>{count}{suffix}</span>
}

export function Step4Results({ diagnosis, score, nombre, email, telefono, leadId, wizardData }: Step4Props) {
  const readiness = getReadinessLevel(score.total)
  const [aiDiagnosis, setAiDiagnosis] = useState<AIDiagnosisResult | null>(null)
  const [aiLoading, setAiLoading] = useState(true)
  const fetchedRef = useRef(false)

  // Use local diagnosis as immediate fallback while AI loads
  const displayDiagnosis = aiDiagnosis ?? diagnosis
  const displayBeneficios = aiDiagnosis?.beneficios ?? diagnosis.beneficios
  const displayPlan = aiDiagnosis?.plan_30_60_90
    ? [`30d: ${aiDiagnosis.plan_30_60_90.dia_30}`, `60d: ${aiDiagnosis.plan_30_60_90.dia_60}`, `90d: ${aiDiagnosis.plan_30_60_90.dia_90}`]
    : diagnosis.plan_30_60_90
      ? [`30d: ${diagnosis.plan_30_60_90.dia_30}`, `60d: ${diagnosis.plan_30_60_90.dia_60}`, `90d: ${diagnosis.plan_30_60_90.dia_90}`]
      : ["Identifica el proceso clave para empezar", "Implementa cambios priorizados", "Mide resultados y escala"]

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    fetch("/api/ai/diagnosis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wizardData }),
    })
      .then((res) => res.json())
      .then((data: AIDiagnosisResult) => {
        setAiDiagnosis(data)

        if (leadId && data?.diagnostico_texto) {
          fetch(`/api/leads/${leadId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ diagnostico_ia: data }),
          })
            .then(() => {
              fetch("/api/ai/briefing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId }),
              }).catch(() => {})
            })
            .catch(() => {})
        }
      })
      .catch(() => setAiDiagnosis(null))
      .finally(() => setAiLoading(false))
  }, [wizardData, leadId])

  return (
    <div className="flex flex-col gap-8">
      {/* Header with celebration */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-accent to-accent/70 shadow-xl shadow-accent/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
        >
          <CheckCircle className="h-10 w-10 text-white" weight="fill" />
        </motion.div>
        <h2 className="mt-6 font-sans text-3xl font-bold text-foreground tracking-tight">
          ¡{nombre}, tu diagnóstico está listo!
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Basado en tus respuestas, esto es lo que encontramos.
        </p>
      </motion.div>

      <DiagnosisSummary
        businessName={wizardData.websiteAnalysis?.titulo}
        readinessLabel={readiness.label}
        readinessColor={readiness.color}
        readinessDescription={readiness.description}
        diagnosticText={displayDiagnosis.diagnostico_texto || "Identificamos áreas específicas donde puedes mejorar tu operación. Revisa las recomendaciones abajo."}
        beneficios={displayBeneficios}
        plan={displayPlan}
        sugerenciaMejora={aiDiagnosis?.sugerencia_mejora}
        casoExito={aiDiagnosis?.caso_exito}
        isLoading={aiLoading && !displayDiagnosis.diagnostico_texto}
      />

      {/* CTAs */}
      {leadId && (
        <ResultadoCTAs
          leadId={leadId}
          email={email}
          telefono={telefono}
          nombre={nombre}
          segmento={score.segmento}
          ctaMessages={{
            HOT: "Tu negocio tiene oportunidades inmediatas. Un especialista puede ayudarte a priorizarlas.",
            WARM: "Hay puntos claros donde mejorar. Un especialista puede armar un plan contigo.",
            COLD: "Tienes una base sólida. Un especialista puede identificar oportunidades que la IA no alcanza a ver.",
          }}
        />
      )}
    </div>
  )
}
