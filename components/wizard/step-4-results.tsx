"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import type { DiagnosisResult, ScoreBreakdown, WizardData, AIDiagnosisResult } from "@/lib/types"
import { CheckCircle, Calendar, Envelope, TrendUp, ArrowRight, Sparkle, RocketLaunch, Lightning, ShieldCheck, ChartLineUp, Clock, ListChecks, Info, Users, Quotes } from "@phosphor-icons/react"
import { DiagnosisSummary } from "@/components/diagnosis/diagnosis-summary"
import { cn } from "@/lib/utils"

interface Step4Props {
  diagnosis: DiagnosisResult
  score: ScoreBreakdown
  nombre: string
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

export function Step4Results({ diagnosis, score, nombre, leadId, wizardData }: Step4Props) {
  const readiness = getReadinessLevel(score.total)
  const [aiDiagnosis, setAiDiagnosis] = useState<AIDiagnosisResult | null>(null)
  const [aiLoading, setAiLoading] = useState(true)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    fetch("/api/ai/diagnosis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wizardData }),
    })
      .then((res) => res.json())
      .then((data: AIDiagnosisResult) => setAiDiagnosis(data))
      .catch(() => setAiDiagnosis(null))
      .finally(() => setAiLoading(false))
  }, [wizardData])

  // Use AI content when available, static as fallback
  const d = {
    titulo_servicio: aiDiagnosis?.titulo_servicio ?? diagnosis.titulo_servicio,
    descripcion: aiDiagnosis?.descripcion ?? diagnosis.descripcion,
    diagnostico_texto: aiDiagnosis?.diagnostico_texto ?? diagnosis.diagnostico_texto,
    beneficios: aiDiagnosis?.beneficios ?? diagnosis.beneficios,
    siguiente_paso: aiDiagnosis?.siguiente_paso ?? diagnosis.siguiente_paso,
  }

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
        title="Resumen rápido"
        subtitle="Este es tu enfoque inmediato para avanzar con el plan digital"
        readinessLabel={readiness.label}
        readinessColor={readiness.color}
        readinessDescription={readiness.description}
        diagnosticExecutive="Basado en tu situación, el reto principal es el proceso manual de gestión de clientes y pedidos. Podemos mejorar control y visibilidad con automatización puntual."
        priorities={[
          "Digitalizar el control de pedidos y flujos operativos",
          "Establecer reportes semanales automatizados de ventas",
          "Estandarizar comunicación interna en un solo canal",
        ]}
        plan={[
          "30d: Diagnóstico y piloto de automatización",
          "60d: Implementación y Ajustes basados en datos",
          "90d: Escalado con medición de ROI y plan comercial",
        ]}
        insights={[
          { name: "Urgencia", value: score.urgencia >= 18 ? "Alta" : score.urgencia >= 10 ? "Media" : "Exploratoria" },
          { name: "Impacto esperado", value: score.total >= 70 ? "Muy alto" : score.total >= 40 ? "Alto" : "Moderado" },
          { name: "Claridad del reto", value: score.claridad_problema >= 12 ? "Muy clara" : score.claridad_problema >= 8 ? "Clara" : "A definir" },
        ]}
      />

      {/* Key insights */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Lightning,
              label: "Urgencia",
              value: score.urgencia >= 18 ? "Alta" : score.urgencia >= 10 ? "Media" : "Exploratoria",
              highlight: score.urgencia >= 18,
            },
            {
              icon: ChartLineUp,
              label: "Impacto esperado",
              value: score.total >= 70 ? "Muy alto" : score.total >= 40 ? "Alto" : "Moderado",
              highlight: score.total >= 40,
            },
            {
              icon: ShieldCheck,
              label: "Claridad del reto",
              value: score.claridad_problema >= 12 ? "Muy clara" : score.claridad_problema >= 8 ? "Clara" : "A definir",
              highlight: score.claridad_problema >= 8,
            },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-start gap-3 rounded-xl p-4 border",
                item.highlight
                  ? "bg-accent/5 border-accent/20"
                  : "bg-muted/30 border-border/50"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", item.highlight ? "text-accent" : "text-muted-foreground")} weight="fill" />
              <div>
                <div className="text-xs font-semibold text-muted-foreground">{item.label}</div>
                <div className={cn("text-sm font-semibold", item.highlight ? "text-foreground" : "text-muted-foreground")}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Diagnosis — Recommended solution */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkle className="h-6 w-6" weight="fill" />
          </div>
          <div className="flex-1">
            {aiLoading ? (
              <>
                <div className="h-6 w-48 animate-pulse rounded bg-muted/50 mb-1" />
                <div className="h-4 w-64 animate-pulse rounded bg-muted/50" />
              </>
            ) : (
              <>
                <h3 className="font-sans text-xl font-bold text-foreground">
                  {d.titulo_servicio}
                </h3>
                <p className="text-sm text-muted-foreground">Solución recomendada para tu negocio</p>
              </>
            )}
          </div>
        </div>
        {aiLoading ? (
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted/50" />
            <div className="mt-4 h-20 w-full animate-pulse rounded-xl bg-muted/50" />
          </div>
        ) : (
          <>
            <p className="text-base leading-relaxed text-muted-foreground">
              {d.diagnostico_texto}
            </p>
            <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm leading-relaxed text-foreground">
                {d.descripcion}
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="mb-5 font-sans text-lg font-bold text-foreground">
          Lo que puedes esperar
        </h3>
        {aiLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/50" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {d.beneficios.map((b, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-accent/5 p-4 border border-accent/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <CheckCircle className="h-4 w-4" weight="fill" />
                </div>
                <span className="text-sm font-medium text-foreground">{b}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* AI-Generated Personalized Insights */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Sparkle className="h-5 w-5" weight="fill" />
          </div>
          <h3 className="font-sans text-lg font-bold text-foreground">Tu análisis personalizado</h3>
        </div>

        {aiLoading ? (
          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted/50" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/50" />
              ))}
            </div>
          </div>
        ) : aiDiagnosis ? (
          <div className="space-y-5">
            {/* Resumen personalizado */}
            <p className="text-base leading-relaxed text-muted-foreground">
              {aiDiagnosis.resumen_personalizado}
            </p>

            {/* Tiempo ahorro + Dato industria */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-accent/5 p-4 border border-accent/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Clock className="h-5 w-5" weight="fill" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Tiempo que podrías ahorrar</div>
                  <div className="text-base font-bold text-foreground">{aiDiagnosis.tiempo_ahorro}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-4 border border-primary/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendUp className="h-5 w-5" weight="fill" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Dato de tu industria</div>
                  <div className="text-sm font-medium text-foreground leading-snug">{aiDiagnosis.dato_industria}</div>
                </div>
              </div>
            </div>

            {/* Pasos de acción */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="h-5 w-5 text-accent" weight="bold" />
                <span className="text-sm font-bold text-foreground">Próximos pasos recomendados</span>
              </div>
              <div className="space-y-2">
                {aiDiagnosis.pasos_accion.map((paso, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-muted/30 p-3 border border-border/50"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.15 }}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{paso}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl bg-muted/30 p-4 border border-border/50">
            <Info className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              No pudimos generar tu análisis personalizado en este momento. Agenda una llamada para recibirlo directamente de nuestro equipo.
            </p>
          </div>
        )}
      </motion.div>

      {/* Caso de éxito similar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.68 }}
        className="glass-card rounded-2xl p-6 border-l-4 border-l-accent"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Users className="h-5 w-5" weight="fill" />
          </div>
          <h3 className="font-sans text-lg font-bold text-foreground">Caso de éxito similar</h3>
        </div>

        {aiLoading ? (
          <div className="space-y-3">
            <div className="h-5 w-48 animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted/50" />
          </div>
        ) : aiDiagnosis?.caso_exito ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">{aiDiagnosis.caso_exito.empresa}</span>
              <span className="text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">{aiDiagnosis.caso_exito.industria}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-3 rounded-xl bg-red-50 p-3 border border-red-100">
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0 mt-0.5">Reto</span>
                <p className="text-sm text-foreground">{aiDiagnosis.caso_exito.problema}</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 border border-blue-100">
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full shrink-0 mt-0.5">Solución</span>
                <p className="text-sm text-foreground">{aiDiagnosis.caso_exito.solucion}</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-3 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 mt-0.5">Resultado</span>
                <p className="text-sm font-medium text-foreground">{aiDiagnosis.caso_exito.resultado}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Quotes className="h-4 w-4 text-muted-foreground/60" weight="fill" />
              <p className="text-xs text-muted-foreground italic">
                Caso representativo basado en resultados típicos de negocios similares.
              </p>
            </div>
          </div>
        ) : null}
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="flex flex-col gap-4"
      >
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
          <Envelope className="h-5 w-5 text-muted-foreground" />
          Recibir propuesta completa por email
        </motion.a>
      </motion.div>

      {/* Next step hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-sm text-muted-foreground px-4"
      >
        {d.siguiente_paso}
      </motion.p>
    </div>
  )
}
