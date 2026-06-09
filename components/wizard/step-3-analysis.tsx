"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { ANALYSIS_MESSAGES } from "@/lib/constants"
import type { WizardStep1Data, WizardStep2Data, WizardStep3Data, AIQuestion, AIQuestionsResponse } from "@/lib/types"
import { SpinnerGap, Sparkle, ArrowLeft, ArrowRight, Check, ChatCircle, Brain, Lightbulb, Eye, TrendUp, Target } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface Step3Props {
  step1Data: WizardStep1Data
  step2Data: WizardStep2Data
  data: WizardStep3Data | null
  onComplete: (data: WizardStep3Data) => void
  onBack: () => void
}

type Phase = "analyzing" | "loading-questions" | "questions" | "loading-next" | "reflection" | "done"

interface AnsweredRound {
  questions: AIQuestion[]
  answers: { question: string; answer: string }[]
}

function getAnswerIcon(index: number) {
  const icons = [Target, Lightbulb, TrendUp]
  return icons[index % icons.length]
}

function getAnswerColor(index: number) {
  const colors = ["bg-accent/10 text-accent border-accent/20", "bg-primary/10 text-primary border-primary/20", "bg-emerald-50 text-emerald-700 border-emerald-200"]
  return colors[index % colors.length]
}

export function Step3Analysis({ step1Data, step2Data, data, onComplete, onBack }: Step3Props) {
  const [phase, setPhase] = useState<Phase>(data ? "questions" : "analyzing")
  const [analysisIndex, setAnalysisIndex] = useState(0)

  const [currentRound, setCurrentRound] = useState(1)
  const [completedRounds, setCompletedRounds] = useState<AnsweredRound[]>([])
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true)

  const [questions, setQuestions] = useState<AIQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [otherTexts, setOtherTexts] = useState<Record<number, string>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})
  const fetchedRoundRef = useRef(0)

  const fetchQuestions = useCallback(async (round: number, previousAnswers: { question: string; answer: string }[]) => {
    try {
      const res = await fetch("/api/ai/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step1: step1Data,
          step2: step2Data,
          round,
          previousAnswers,
        }),
      })
      const data: AIQuestionsResponse = await res.json()
      return data
    } catch {
      return null
    }
  }, [step1Data, step2Data])

  useEffect(() => {
    if (phase !== "analyzing") return
    if (analysisIndex >= ANALYSIS_MESSAGES.length) {
      const timer = setTimeout(() => setPhase("loading-questions"), 600)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => setAnalysisIndex((i) => i + 1), 1200)
    return () => clearTimeout(timer)
  }, [phase, analysisIndex])

  useEffect(() => {
    if (phase !== "loading-questions") return
    if (fetchedRoundRef.current >= currentRound) return
    fetchedRoundRef.current = currentRound

    fetchQuestions(currentRound, getAllPreviousAnswers()).then((result) => {
      if (result?.questions?.length) {
        setQuestions(result.questions)
        setHasMoreQuestions(result.hasMoreQuestions)
      } else {
        setPhase("done")
        setTimeout(() => onComplete({ respuestas_ia: [] }), 1500)
        return
      }
      setPhase("questions")
    })
  }, [phase, currentRound])

  function getAllPreviousAnswers(): { question: string; answer: string }[] {
    return completedRounds.flatMap((r) => r.answers)
  }

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

  function getCurrentRoundAnswers(): { question: string; answer: string }[] {
    return questions.map((q, i) => {
      let answerLabel: string
      if (answers[i] === "otro") {
        answerLabel = otherTexts[i]?.trim() ?? ""
      } else {
        const opt = q.options.find((o) => o.value === answers[i])
        answerLabel = opt?.label ?? answers[i] ?? ""
      }
      return { question: q.question, answer: answerLabel }
    })
  }

  async function handleContinue() {
    if (!validate()) return

    const roundAnswers = getCurrentRoundAnswers()
    const updatedRounds = [...completedRounds, { questions, answers: roundAnswers }]
    setCompletedRounds(updatedRounds)

    if (hasMoreQuestions && currentRound < 2) {
      setPhase("reflection")
      setAnswers({})
      setOtherTexts({})
      setErrors({})

      await new Promise((r) => setTimeout(r, 2000))

      setPhase("loading-next")
      const nextRound = currentRound + 1
      setCurrentRound(nextRound)
      fetchedRoundRef.current = nextRound

      const allPrevAnswers = updatedRounds.flatMap((r) => r.answers)
      const result = await fetchQuestions(nextRound, allPrevAnswers)

      if (result?.questions?.length) {
        setQuestions(result.questions)
        setHasMoreQuestions(result.hasMoreQuestions)
        setPhase("questions")
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        finishWithAnswers(allPrevAnswers)
      }
    } else {
      const allAnswers = updatedRounds.flatMap((r) => r.answers)
      finishWithAnswers(allAnswers)
    }
  }

  function finishWithAnswers(allAnswers: { question: string; answer: string }[]) {
    setPhase("done")
    const labels = allAnswers.map((a) => `${a.question}: ${a.answer}`)
    setTimeout(() => onComplete({ respuestas_ia: labels }), 1500)
  }

  // ─── Analyzing Phase ───
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
              animate={{ opacity: i <= analysisIndex ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                i < analysisIndex ? "bg-accent/10" : i === analysisIndex ? "bg-primary/10" : "bg-muted/30"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                i < analysisIndex ? "bg-accent text-accent-foreground" : i === analysisIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {i < analysisIndex ? <Check className="h-4 w-4" /> : i === analysisIndex ? <SpinnerGap className="h-4 w-4 animate-spin" /> : <span className="text-xs font-medium">{i + 1}</span>}
              </div>
              <span className={cn("text-sm font-medium", i <= analysisIndex ? "text-foreground" : "text-muted-foreground")}>
                {msg}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  // ─── Loading Questions Phase ───
  if (phase === "loading-questions" || phase === "loading-next") {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div className="relative mb-6" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <SpinnerGap className="h-12 w-12 text-primary" />
        </motion.div>
        <p className="text-lg font-semibold text-foreground">
          {phase === "loading-next" ? "Analizando tus respuestas para profundizar..." : "Preparando preguntas personalizadas..."}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Nuestra IA está adaptando las preguntas a tu caso específico
        </p>
      </motion.div>
    )
  }

  // ─── Reflection Phase (between rounds) ───
  if (phase === "reflection") {
    const lastRound = completedRounds[completedRounds.length - 1]
    return (
      <motion.div
        className="flex flex-col gap-6 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 mb-4">
            <Brain className="h-8 w-8 text-accent" weight="fill" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Analizando tus respuestas</h2>
          <p className="mt-2 text-muted-foreground">La IA está identificando los puntos clave para profundizar...</p>
        </div>

        <div className="max-w-lg mx-auto w-full space-y-3">
          {lastRound?.answers.map((a, i) => {
            const Icon = getAnswerIcon(i)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
                className={cn("flex items-start gap-3 rounded-xl border p-4", getAnswerColor(i))}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/80 shadow-sm">
                  <Icon className="h-4 w-4" weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5 line-clamp-2">{a.question}</p>
                  <p className="text-sm font-semibold text-foreground">{a.answer}</p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.3 + 0.4, type: "spring" }}
                  className="shrink-0"
                >
                  <Check className="h-5 w-5 text-emerald-500" weight="bold" />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <SpinnerGap className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Generando siguientes preguntas...</span>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // ─── Done Phase ───
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

  // ─── Questions Phase ───
  const totalAnswered = completedRounds.reduce((sum, r) => sum + r.answers.length, 0)

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center lg:text-left"
      >
        <div className="flex items-center justify-center gap-3 lg:justify-start mb-2">
          <h2 className="font-sans text-3xl font-bold text-foreground tracking-tight">
            {currentRound === 1 ? "Cuéntanos más sobre tu caso" : "Profundicemos un poco más"}
          </h2>
        </div>
        <p className="text-lg text-muted-foreground">
          {currentRound === 1
            ? "Selecciona la opción que mejor describa tu situación."
            : "Basándonos en tus respuestas anteriores, necesitamos algunos detalles más."}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 lg:justify-start">
          <span className="text-xs font-medium text-muted-foreground">
            Ronda {currentRound} de 2
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs font-medium text-accent">
            {totalAnswered + Object.keys(answers).length} respuestas recopiladas
          </span>
        </div>
      </motion.div>

      {/* Previous answers summary (round 2+) */}
      {completedRounds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-accent/20 bg-accent/5 p-4"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Eye className="h-3.5 w-3.5 text-accent" weight="fill" />
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider">Lo que ya sabemos</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {completedRounds.flatMap((r) => r.answers).map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-white border border-accent/20 px-2.5 py-1 text-[11px] text-foreground">
                <Check className="h-3 w-3 text-accent" weight="bold" />
                {a.answer}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Questions */}
      {questions.map((q, qIndex) => (
        <motion.fieldset
          key={`r${currentRound}-q${qIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: qIndex * 0.12 }}
          className="glass-card rounded-2xl p-6"
        >
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: questions.length * 0.12 + 0.1 }}
        className="flex flex-col gap-3 sm:flex-row sm:justify-between"
      >
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
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          {hasMoreQuestions ? "Continuar" : "Ver mi diagnóstico"}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </div>
  )
}
