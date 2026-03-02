"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ANALYSIS_MESSAGES, SIMULATED_QUESTIONS } from "@/lib/constants"
import type { WizardStep1Data, WizardStep2Data, WizardStep3Data } from "@/lib/types"
import { Loader2, Send, Bot, User, Sparkles, ArrowLeft, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step3Props {
  step1Data: WizardStep1Data
  step2Data: WizardStep2Data
  data: WizardStep3Data | null
  onComplete: (data: WizardStep3Data) => void
  onBack: () => void
}

type Phase = "analyzing" | "loading_questions" | "chat" | "done"

interface ChatMessage {
  role: "bot" | "user"
  text: string
}

const messageVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export function Step3Analysis({ step1Data, step2Data, data, onComplete, onBack }: Step3Props) {
  const [phase, setPhase] = useState<Phase>(data ? "chat" : "analyzing")
  const [analysisIndex, setAnalysisIndex] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(data?.respuestas_ia ?? [])
  const [questions, setQuestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Fetch AI-powered questions
  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step1: step1Data,
          step2: step2Data,
        }),
      })
      const data = await res.json()
      if (data.preguntas && data.preguntas.length > 0) {
        return data.preguntas
      }
    } catch (error) {
      console.error("Error fetching AI questions:", error)
    }
    return SIMULATED_QUESTIONS[step1Data.industria] ?? SIMULATED_QUESTIONS.otra
  }, [step1Data, step2Data])

  // Analysis animation
  useEffect(() => {
    if (phase !== "analyzing") return
    if (analysisIndex >= ANALYSIS_MESSAGES.length) {
      const timer = setTimeout(async () => {
        setPhase("loading_questions")
        const aiQuestions = await fetchQuestions()
        setQuestions(aiQuestions)
        setPhase("chat")
        setMessages([
          {
            role: "bot",
            text: "¡Excelente! Ya tengo una buena idea de tu situación. Necesito hacerte un par de preguntas más para afinar tu diagnóstico.",
          },
          {
            role: "bot",
            text: aiQuestions[0],
          },
        ])
      }, 600)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setAnalysisIndex((i) => i + 1)
    }, 1200)
    return () => clearTimeout(timer)
  }, [phase, analysisIndex, fetchQuestions])

  const handleSend = useCallback(() => {
    if (!currentInput.trim()) return

    const answer = currentInput.trim()
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: answer },
    ]

    const nextQ = questionIndex + 1
    if (nextQ < questions.length) {
      newMessages.push({ role: "bot", text: questions[nextQ] })
      setQuestionIndex(nextQ)
      setMessages(newMessages)
      setCurrentInput("")
    } else {
      newMessages.push({
        role: "bot",
        text: "¡Perfecto! Ya tengo toda la información que necesito. Estoy preparando tu diagnóstico personalizado...",
      })
      setMessages(newMessages)
      setCurrentInput("")
      setPhase("done")
      setTimeout(() => {
        onComplete({ respuestas_ia: newAnswers })
      }, 2000)
    }
  }, [currentInput, answers, messages, questionIndex, questions, onComplete])

  // Analyzing phase
  if (phase === "analyzing" || phase === "loading_questions") {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Animated Logo */}
        <motion.div
          className="relative mb-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-xl shadow-primary/30">
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </div>
        </motion.div>

        <h2 className="mb-2 text-2xl font-bold text-foreground">Analizando tu información</h2>
        <p className="mb-8 text-muted-foreground">Esto solo tomará unos segundos...</p>

        {/* Progress Steps */}
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
                  <Loader2 className="h-4 w-4 animate-spin" />
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

  // Chat phase
  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="text-center lg:text-left">
        <h2 className="font-sans text-3xl font-bold text-foreground tracking-tight">
          Análisis en curso
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Nuestro sistema tiene algunas preguntas adicionales para ti.
        </p>
      </div>

      {/* Chat Container */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-border/50 bg-primary/5 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Asistente Brújula</p>
            <p className="text-xs text-muted-foreground">Analizando tu negocio...</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-muted-foreground">En línea</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-4 p-5 max-h-[400px] overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={cn(
                  "flex items-end gap-3",
                  msg.role === "user" && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  msg.role === "bot" 
                    ? "bg-primary/10 text-primary" 
                    : "bg-accent text-accent-foreground"
                )}>
                  {msg.role === "bot" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "bot"
                    ? "bg-muted text-foreground rounded-bl-md"
                    : "bg-primary text-primary-foreground rounded-br-md"
                )}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {phase === "done" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-4 gap-3"
            >
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Generando tu diagnóstico personalizado...
              </span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {phase === "chat" && (
          <div className="border-t border-border/50 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu respuesta..."
                className="flex-1 rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
              <motion.button
                type="button"
                onClick={handleSend}
                disabled={!currentInput.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl disabled:opacity-50 disabled:shadow-none"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Enviar</span>
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Back button */}
      {phase === "chat" && (
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-2 self-start rounded-xl border-2 border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Atrás
        </motion.button>
      )}
    </motion.div>
  )
}
