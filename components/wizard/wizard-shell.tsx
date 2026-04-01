"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/shared/logo"
import { Step1Business } from "./step-1-business"
import { Step2Situation } from "./step-2-situation"
import { Step3Analysis } from "./step-3-analysis"
import { Step4Results } from "./step-4-results"
import { calculateScore } from "@/lib/scoring"
import { generateDiagnosis } from "@/lib/diagnosis"
import type {
  WizardData,
  WizardStep1Data,
  WizardStep2Data,
  WizardStep3Data,
  DiagnosisResult,
  ScoreBreakdown,
} from "@/lib/types"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Check, Sparkle, Buildings, ChatCircle, ChartBar } from "@phosphor-icons/react"

const STEPS = [
  { label: "Tu negocio", icon: Buildings, description: "Cuéntanos sobre tu negocio" },
  { label: "Tu situación", icon: ChatCircle, description: "Entendemos tus necesidades" },
  { label: "Análisis", icon: Sparkle, description: "Analizamos tu información" },
  { label: "Resultados", icon: ChartBar, description: "Tu diagnóstico personalizado" },
]

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
}

export function WizardShell() {
  const [currentStep, setCurrentStep] = useState(0)
  const [wizardData, setWizardData] = useState<WizardData>({
    step1: null,
    step2: null,
    step3: null,
  })
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [score, setScore] = useState<ScoreBreakdown | null>(null)
  const [leadId, setLeadId] = useState<string | null>(null)

  const handleStep1Complete = useCallback((data: WizardStep1Data) => {
    setWizardData((prev) => ({ ...prev, step1: data }))
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleStep2Complete = useCallback((data: WizardStep2Data) => {
    setWizardData((prev) => ({ ...prev, step2: data }))
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleStep3Complete = useCallback(async (data: WizardStep3Data) => {
    const updatedData: WizardData = { ...wizardData, step3: data }
    setWizardData(updatedData)

    const s = calculateScore(updatedData)
    const d = generateDiagnosis(updatedData)
    setScore(s)
    setDiagnosis(d)
    setCurrentStep(3)
    window.scrollTo({ top: 0, behavior: "smooth" })

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizardData: updatedData }),
      })
      if (res.ok) {
        const lead = await res.json()
        setLeadId(lead.id)
      }
    } catch {
      // Silent fail
    }
  }, [wizardData])

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const progressPercent = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header Mobile */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Link>
          <Logo />
          <div className="w-16" />
        </div>
        {/* Mobile Progress Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Paso {currentStep + 1} de {STEPS.length}
            </span>
            <span className="text-xs font-semibold text-primary">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              className="h-full gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </header>

      <div className="lg:flex lg:min-h-screen">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:border-r lg:border-border/50 lg:bg-white/70 lg:backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border/50">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Logo />
          </div>

          {/* Steps */}
          <nav className="flex-1 px-4 py-8">
            <div className="space-y-1">
              {STEPS.map((step, i) => {
                const isCompleted = i < currentStep
                const isActive = i === currentStep
                const Icon = step.icon

                return (
                  <motion.div
                    key={step.label}
                    initial={false}
                    animate={{
                      backgroundColor: isActive ? "rgba(var(--primary), 0.08)" : "transparent",
                    }}
                    className={cn(
                      "relative flex items-start gap-4 rounded-xl p-4 transition-colors",
                      isActive && "bg-primary/5"
                    )}
                  >
                    {/* Step Line Connector */}
                    {i < STEPS.length - 1 && (
                      <div className="absolute left-[1.875rem] top-[3.5rem] w-0.5 h-8">
                        <div 
                          className={cn(
                            "w-full h-full rounded-full transition-colors duration-300",
                            isCompleted ? "bg-accent" : "bg-border"
                          )}
                        />
                      </div>
                    )}

                    {/* Step Icon */}
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted 
                          ? "var(--accent)" 
                          : isActive 
                            ? "var(--primary)" 
                            : "var(--muted)",
                      }}
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                        isCompleted 
                          ? "text-accent-foreground" 
                          : isActive 
                            ? "text-primary-foreground shadow-lg shadow-primary/30" 
                            : "text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </motion.div>

                    {/* Step Text */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-semibold transition-colors",
                        isActive ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </p>
                      <p className={cn(
                        "text-sm mt-0.5 transition-colors",
                        isActive ? "text-muted-foreground" : "text-muted-foreground/60"
                      )}>
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="px-6 py-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              100% gratuito • Sin compromiso
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80">
          <div className="mx-auto max-w-2xl px-4 py-8 lg:py-12 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                {currentStep === 0 && (
                  <Step1Business data={wizardData.step1} onComplete={handleStep1Complete} />
                )}
                {currentStep === 1 && wizardData.step1 && (
                  <Step2Situation
                    step1Data={wizardData.step1}
                    data={wizardData.step2}
                    onComplete={handleStep2Complete}
                    onBack={goBack}
                  />
                )}
                {currentStep === 2 && wizardData.step1 && wizardData.step2 && (
                  <Step3Analysis
                    step1Data={wizardData.step1}
                    step2Data={wizardData.step2}
                    data={wizardData.step3}
                    onComplete={handleStep3Complete}
                    onBack={goBack}
                  />
                )}
                {currentStep === 3 && diagnosis && score && wizardData.step2 && (
                  <Step4Results
                    diagnosis={diagnosis}
                    score={score}
                    nombre={wizardData.step2.nombre}
                    leadId={leadId}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
