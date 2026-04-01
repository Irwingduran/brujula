"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ANALYSIS_MESSAGES, SIMULATED_QUESTIONS } from "@/lib/constants"
import type { SimulatedQuestionWithOptions } from "@/lib/constants"
import type { WizardStep1Data, WizardStep2Data, WizardStep3Data } from "@/lib/types"
import { SpinnerGap, Sparkle, ArrowLeft, ArrowRight, Check, ChatCircle } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface Step3Props {
  step1Data: WizardStep1Data
  step2Data: WizardStep2Data
  data: WizardStep3Data | null
  onComplete: (data: WizardStep3Data) => void
  onBack: () => void
}

type Phase = "analyzing" | "questions" | "done"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function Step3Analysis({ step1Data, step2Data, data, onComplete, onBack }: Step3Props) {
  const [phase, setPhase] = useState<Phase>(data ? "questions" : "analyzing")
  const [analysisIndex, setAnalysisIndex] = useState(0)
  const [questions, setQuestions] = useState<SimulatedQuestionWithOptions[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>(
    data?.respuestas_ia
      ? data.respuestas_ia.reduce((acc, val, i) => ({ ...acc, [i]: val }), {} as Record<number, string>)
      : {}
  )
  const [otherTexts, setOtherTexts] = useState<Record<number, string>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})

  // Load questions based on industry
  useEffect(() => {
    const industryQuestions = SIMULATED_QUESTIONS[step1Data.industria] ?? SIMULATED_QUESTIONS.otra
    setQuestions(industryQuestions)
  }, [step1Data.industria])

  // Analysis animation
  useEffect(() => {
    if (phase !== "analyzing") return
    if (analysisIndex >= ANALYSIS_MESSAGES.length) {
      const timer = setTimeout(() => {
        setPhase("questions")
      }, 600)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setAnalysisIndex((i) => i + 1)
    }, 1200)
    return () => clearTimeout(timer)
  }, [phase, analysisIndex])

  function selectAnswer(qIndex: number, value: string) {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }))
    if (value !== "otro") {
      setOtherTexts((prev) => {
        const next = { ...prev }
        delete next[qIndex]
        return next
      })
    }
    setErrors((prev) => {
      const next = { ...prev }
      delete next[qIndex]
      return next
    })
  }

  function updateOtherText(qIndex: number, text: string) {
    setOtherTexts((prev) => ({ ...prev, [qIndex]: text }))
  }

  function validate(): boolean {
    const e: Record<number, string> = {}
    questions.forEach((_, i) => {
      if (!answers[i]) {
        e[i] = "Selecciona una opción"
      } else if (answers[i] === "otro" && (!otherTexts[i] || !otherTexts[i].trim())) {
        e[i] = "Especifica tu respuesta"
      }
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setPhase("done")

    const finalAnswers = questions.map((q, i) => {
      if (answers[i] === "otro") {
        return otherTexts[i]?.trim() ?? ""
      }
      const opt = q.options.find((o) => o.value === answers[i])
      return opt?.label ?? answers[i] ?? ""
    })

    setTimeout(() => {
      onComplete({ respuestas_ia: finalAnswers })
    }, 1500)
  }

  // Analyzing phase
  if (phase === "analyzing") {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="relative mb-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-xl shadow-primary/30">
            <Sparkle className="h-10 w-10 text-primary-foreground" />
          </div>
        </motion.div>

        <h2 className="mb-2 text-2xl font-bold text-foreground">Analizando tu información</h2>
        <p className="mb-8 text-muted-foreground">Esto solo tomará unos segundos...</p>

        <div className="w-full max-w-sm space-y-3">
          {ANALYSIS_MESSAGES.map((msg, i) => (
            <motion.div
              key={msg}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: i <= analysisIndex ? 1 : 0.3,
                x: 0 
              }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                i < analysisIndex 
                  ? "bg-accent/10" 
                  : i === analysisIndex 
                    ? "bg-primary/10" 
                    : "bg-muted/30"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                i < analysisIndex 
                  ? "bg-accent text-accent-foreground" 
                  : i === analysisIndex 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
              )}>
                {i < analysisIndex ? (
                  <Check className="h-4 w-4" />
                ) : i === analysisIndex ? (
                  <SpinnerGap className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-xs font-medium">{i + 1}</span>
                )}
              </div>
              <span className={cn(
                "text-sm font-medium",
                i <= analysisIndex ? "text-foreground" : "text-muted-foreground"
              )}>
                {msg}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  // Done phase
  if (phase === "done") {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SpinnerGap className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg font-semibold text-foreground">Generando tu diagnóstico personalizado...</p>
      </motion.div>
    )
  }

  // Questions phase — selectable options
  return (
    <motion.div 
      className="flex flex-col gap-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center lg:text-left">
        <h2 className="font-sans text-3xl font-bold text-foreground tracking-tight">
          Últimas preguntas
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Selecciona la opción que mejor describa tu situación.
        </p>
      </motion.div>

      {/* Questions */}
      {questions.map((q, qIndex) => (
        <motion.fieldset key={qIndex} variants={itemVariants} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ChatCircle className="h-5 w-5" />
            </div>
            <legend className="text-base font-semibold text-foreground">
              {q.question}
            </legend>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {q.options.map((opt) => (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => selectAnswer(qIndex, opt.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "rounded-xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200",
                  answers[qIndex] === opt.value
                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "border-border bg-white text-foreground hover:border-primary/50 hover:shadow-md"
                )}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
          {answers[qIndex] === "otro" && (
            <motion.input
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              type="text"
              value={otherTexts[qIndex] ?? ""}
              onChange={(e) => updateOtherText(qIndex, e.target.value)}
              placeholder="Especifica tu respuesta..."
              className="mt-3 w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          )}
          {errors[qIndex] && <p className="mt-2 text-sm text-destructive font-medium">{errors[qIndex]}</p>}
        </motion.fieldset>
      ))}

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-2 rounded-xl border-2 border-border bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Atrás
        </motion.button>
        <motion.button
          type="button"
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          Ver mi diagnóstico
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
