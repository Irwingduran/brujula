"use client"

import { INDUSTRIES, COMPANY_SIZES, PAIN_POINTS, CURRENT_TOOLS, INDUSTRY_PAIN_SUGGESTIONS, INDUSTRY_PAIN_HINTS, INDUSTRY_PAIN_OVERRIDES } from "@/lib/constants"
import type { WizardStep1Data, PainPoint, CompanySize, CurrentTool } from "@/lib/types"
import { useState } from "react"
import { motion } from "framer-motion"
import { Check, CaretDown, Buildings, UsersThree, Warning, Wrench, ArrowRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface Step1Props {
  data: WizardStep1Data | null
  onComplete: (data: WizardStep1Data) => void
}

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

export function Step1Business({ data, onComplete }: Step1Props) {
  const [industria, setIndustria] = useState(data?.industria ?? "")
  const [industriaOtra, setIndustriaOtra] = useState(data?.industria_otra ?? "")
  const [tamano, setTamano] = useState<CompanySize | "">(data?.tamano_empresa ?? "")
  const [dolores, setDolores] = useState<PainPoint[]>(data?.dolores_principales ?? [])
  const [dolorOtro, setDolorOtro] = useState(data?.dolor_otro ?? "")
  const [herramientas, setHerramientas] = useState<CurrentTool[]>(data?.herramientas_actuales ?? [])
  const [herramientaOtra, setHerramientaOtra] = useState(data?.herramienta_otra ?? "")

  const [errors, setErrors] = useState<Record<string, string>>({})

  const suggestedPainPoints = industria ? INDUSTRY_PAIN_SUGGESTIONS[industria] ?? [] : []
  const suggestedPainHints = industria ? INDUSTRY_PAIN_HINTS[industria] ?? [] : []
  const painOverrides = industria ? INDUSTRY_PAIN_OVERRIDES[industria] ?? {} : {}
  const industriaLabel = INDUSTRIES.find((i) => i.value === industria)?.label

  function togglePain(pain: PainPoint) {
    setDolores((prev) =>
      prev.includes(pain) ? prev.filter((p) => p !== pain) : [...prev, pain]
    )
  }

  function toggleTool(tool: CurrentTool) {
    setHerramientas((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    )
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!industria) e.industria = "Selecciona tu industria"
    if (industria === "otra" && !industriaOtra.trim()) e.industriaOtra = "Especifica tu industria"
    if (!tamano) e.tamano = "Selecciona el tamaño de tu empresa"
    if (dolores.length === 0) e.dolores = "Selecciona al menos un problema"
    if (dolores.includes("otro") && !dolorOtro.trim()) e.dolorOtro = "Describe tu desafío"
    if (herramientas.length === 0) e.herramientas = "Selecciona al menos una herramienta"
    if (herramientas.includes("otro") && !herramientaOtra.trim()) e.herramientaOtra = "Especifica tu herramienta"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onComplete({
      industria: industria === "otra" ? "otra" : industria,
      industria_otra: industria === "otra" ? industriaOtra : undefined,
      tamano_empresa: tamano as CompanySize,
      dolores_principales: dolores,
      dolor_otro: dolores.includes("otro") ? dolorOtro : undefined,
      herramientas_actuales: herramientas,
      herramienta_otra: herramientas.includes("otro") ? herramientaOtra : undefined,
    })
  }

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
          Cuéntanos sobre tu negocio
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Esta información nos ayuda a personalizar tu diagnóstico.
        </p>
      </motion.div>

      {/* Industry */}
      <motion.fieldset variants={itemVariants} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Buildings className="h-5 w-5" />
          </div>
          <legend className="text-base font-semibold text-foreground">
            ¿En qué industria opera tu negocio?
          </legend>
        </div>
        <div className="relative">
          <select
            value={industria}
            onChange={(e) => setIndustria(e.target.value)}
            className="w-full appearance-none rounded-xl border-2 border-border bg-white px-4 py-3.5 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          >
            <option value="">Selecciona una opción</option>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
          <CaretDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        {industria === "otra" && (
          <motion.input
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            type="text"
            value={industriaOtra}
            onChange={(e) => setIndustriaOtra(e.target.value)}
            placeholder="Especifica tu industria"
            className="mt-3 w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        )}
        {errors.industria && <p className="mt-2 text-sm text-destructive font-medium">{errors.industria}</p>}
        {errors.industriaOtra && <p className="mt-2 text-sm text-destructive font-medium">{errors.industriaOtra}</p>}
      </motion.fieldset>

      {/* Company Size */}
      <motion.fieldset variants={itemVariants} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UsersThree className="h-5 w-5" />
          </div>
          <legend className="text-base font-semibold text-foreground">
            ¿Cuántas personas trabajan en tu empresa?
          </legend>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {COMPANY_SIZES.map((s) => (
            <motion.button
              key={s.value}
              type="button"
              onClick={() => setTamano(s.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200",
                tamano === s.value
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "border-border bg-white text-foreground hover:border-primary/50 hover:shadow-md"
              )}
            >
              {s.label}
            </motion.button>
          ))}
        </div>
        {errors.tamano && <p className="mt-2 text-sm text-destructive font-medium">{errors.tamano}</p>}
      </motion.fieldset>

      {/* Pain Points */}
      <motion.fieldset variants={itemVariants} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Warning className="h-5 w-5" />
          </div>
          <div>
            <legend className="text-base font-semibold text-foreground">
              ¿Cuáles son tus principales desafíos?
            </legend>
            <p className="text-sm text-muted-foreground">
              Selecciona todos los que apliquen. {industria ? `A continuación tienes los problemas más comunes en ${industriaLabel}.` : ""}
            </p>
            {industria && suggestedPainPoints.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {suggestedPainPoints.map((pain) => {
                    const label = PAIN_POINTS.find((p) => p.value === pain)?.label
                    return (
                      <span key={pain} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {label ?? pain}
                      </span>
                    )
                  })}
                </div>
                <ul className="ml-4 list-disc text-sm text-muted-foreground">
                  {suggestedPainHints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {PAIN_POINTS.map((p) => (
            <motion.button
              key={p.value}
              type="button"
              onClick={() => togglePain(p.value)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              data-selected={dolores.includes(p.value)}
              className={cn(
                "flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                dolores.includes(p.value)
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-white hover:border-primary/40 hover:shadow-sm"
              )}
            >
              <div className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200",
                dolores.includes(p.value)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white"
              )}>
                {dolores.includes(p.value) && <Check className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                {(() => {
                  const override = painOverrides[p.value]
                  const label = override?.label ?? p.label
                  const description = override?.description ?? p.description
                  return (
                    <>
                      <div className="text-sm font-semibold text-foreground">{label}</div>
                      <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</div>
                    </>
                  )
                })()}
              </div>
            </motion.button>
          ))}
        </div>
        {dolores.includes("otro") && (
          <motion.textarea
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            rows={2}
            value={dolorOtro}
            onChange={(e) => setDolorOtro(e.target.value)}
            placeholder="Describe tu desafío..."
            className="mt-3 w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 resize-none"
          />
        )}
        {errors.dolorOtro && <p className="mt-2 text-sm text-destructive font-medium">{errors.dolorOtro}</p>}
        {errors.dolores && <p className="mt-2 text-sm text-destructive font-medium">{errors.dolores}</p>}
      </motion.fieldset>

      {/* Current Tools */}
      <motion.fieldset variants={itemVariants} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wrench className="h-5 w-5" />
          </div>
          <legend className="text-base font-semibold text-foreground">
            ¿Qué herramientas usas actualmente?
          </legend>
        </div>
        <div className="flex flex-wrap gap-2">
          {CURRENT_TOOLS.map((t) => (
            <motion.button
              key={t.value}
              type="button"
              onClick={() => toggleTool(t.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-full border-2 px-5 py-2 text-sm font-semibold transition-all duration-200",
                herramientas.includes(t.value)
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "border-border bg-white text-foreground hover:border-primary/50 hover:shadow-md"
              )}
            >
              {t.label}
            </motion.button>
          ))}
        </div>
        {herramientas.includes("otro") && (
          <motion.input
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            type="text"
            value={herramientaOtra}
            onChange={(e) => setHerramientaOtra(e.target.value)}
            placeholder="Especifica tu herramienta..."
            className="mt-3 w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        )}
        {errors.herramientaOtra && <p className="mt-2 text-sm text-destructive font-medium">{errors.herramientaOtra}</p>}
        {errors.herramientas && <p className="mt-2 text-sm text-destructive font-medium">{errors.herramientas}</p>}
      </motion.fieldset>

      {/* Submit */}
      <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
        <motion.button
          type="button"
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          Continuar
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
