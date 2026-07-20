"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import type { DiagnosisResult, ScoreBreakdown, WizardData, AIDiagnosisResult } from "@/lib/types"
import type { DiagnosticoResult } from "@/lib/diagnostico/schemas"
import { CheckCircle } from "@phosphor-icons/react"
import { DiagnosisSummary } from "@/components/diagnosis/diagnosis-summary"
import { V2DiagnosisSummary } from "@/components/diagnosis/v2-diagnosis-summary"
import { ResultadoCTAs } from "@/components/diagnosis/resultado-ctas"

interface Step4Props {
  diagnosis: DiagnosisResult
  score: ScoreBreakdown
  nombre: string
  email: string
  telefono: string
  leadId: string | null
  wizardData: WizardData
  v2Diagnosis?: DiagnosticoResult | null
  v2Loading?: boolean
  v2Progress?: { paso: number; total: number; descripcion: string } | null
}

function getPlanArray(d: DiagnosisResult | AIDiagnosisResult): string[] {
  if ("plan_90_dias" in d && d.plan_90_dias) {
    return [d.plan_90_dias.mes_1, d.plan_90_dias.mes_2, d.plan_90_dias.mes_3]
  }
  return ["", "", ""]
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

export function Step4Results({ diagnosis, score, nombre, email, telefono, leadId, wizardData, v2Diagnosis, v2Loading, v2Progress }: Step4Props) {
  const readiness = getReadinessLevel(score.total)
  const [aiDiagnosis, setAiDiagnosis] = useState<AIDiagnosisResult | null>(null)
  const [aiLoading, setAiLoading] = useState(true)
  const fetchedRef = useRef(false)

  // Use v2 if available, else AI diagnosis, else static
  const hasV2 = !!v2Diagnosis
  const displayDiagnosis = hasV2 ? null : (aiDiagnosis ?? diagnosis)
  const displayPlan = hasV2 ? [] : getPlanArray(displayDiagnosis!)

  useEffect(() => {
    if (hasV2 || fetchedRef.current) return
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
  }, [wizardData, leadId, hasV2])

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

      {/* Diagnosis Summary — v2 or v1 */}
      {hasV2 ? (
        <V2DiagnosisSummary diagnostico={v2Diagnosis!} />
      ) : v2Loading ? (
        <section className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Analizando tu negocio...</span>
            </div>
            {v2Progress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{v2Progress.descripcion}</span>
                  <span>{v2Progress.paso}/{v2Progress.total}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div
                    className="h-full gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(v2Progress.paso / v2Progress.total) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
            {!v2Progress && (
              <p className="text-sm text-muted-foreground">Preparando tu diagnóstico personalizado...</p>
            )}
          </div>
        </section>
      ) : (
        <DiagnosisSummary
          patronNegocio={displayDiagnosis!.patron_negocio || "Revisa las recomendaciones abajo para entender el patrón de tu negocio."}
          riesgoPrincipal={displayDiagnosis!.riesgo_principal || ""}
          cambioClave={displayDiagnosis!.cambio_clave || ""}
          plan={displayPlan}
          casoExito={aiDiagnosis?.caso_exito}
          isLoading={aiLoading && !displayDiagnosis!.patron_negocio}
        />
      )}

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
