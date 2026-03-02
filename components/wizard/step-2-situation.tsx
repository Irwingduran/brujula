"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { getBranchesForPains } from "@/lib/branching"
import { BUDGET_RANGES, URGENCY_OPTIONS } from "@/lib/constants"
import type { WizardStep1Data, WizardStep2Data, BudgetRange, Urgency } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ChevronDown, DollarSign, Clock, User, Mail, Phone, ArrowLeft, ArrowRight, Shield } from "lucide-react"

interface Step2Props {
  step1Data: WizardStep1Data
  data: WizardStep2Data | null
  onComplete: (data: WizardStep2Data) => void
  onBack: () => void
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

export function Step2Situation({ step1Data, data, onComplete, onBack }: Step2Props) {
  const branches = getBranchesForPains(step1Data.dolores_principales)

  const [branchAnswers, setBranchAnswers] = useState<Record<string, string>>(
    data?.respuestas_branch ?? {}
  )
  const [presupuesto, setPresupuesto] = useState<BudgetRange | "">(data?.presupuesto ?? "")
  const [urgencia, setUrgencia] = useState<Urgency | "">(data?.urgencia ?? "")
  const [nombre, setNombre] = useState(data?.nombre ?? "")
  const [email, setEmail] = useState(data?.email ?? "")
  const [telefono, setTelefono] = useState(data?.telefono ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateBranch(fieldId: string, value: string) {
    setBranchAnswers((prev) => ({ ...prev, [fieldId]: value }))
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!presupuesto) e.presupuesto = "Selecciona un rango de presupuesto"
    if (!urgencia) e.urgencia = "Selecciona tu nivel de urgencia"
    if (!nombre.trim()) e.nombre = "Ingresa tu nombre"
    if (!email.trim() || !email.includes("@")) e.email = "Ingresa un email válido"
    if (!telefono.trim()) e.telefono = "Ingresa tu teléfono"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onComplete({
      respuestas_branch: branchAnswers,
      presupuesto: presupuesto as BudgetRange,
      urgencia: urgencia as Urgency,
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
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
          Profundicemos un poco más
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Estas preguntas nos ayudan a generar un diagnóstico más preciso.
        </p>
      </motion.div>

      {/* Dynamic branch questions */}
      {branches.map((branch, index) => (
        <motion.div 
          key={branch.pain} 
          variants={itemVariants}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent text-sm font-bold">
              {index + 1}
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {branch.title}
            </h3>
          </div>
          <div className="flex flex-col gap-5">
            {branch.fields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="mb-2 block text-sm font-medium text-foreground">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <div className="relative">
                    <select
                      id={field.id}
                      value={branchAnswers[field.id] ?? ""}
                      onChange={(e) => updateBranch(field.id, e.target.value)}
                      className="w-full appearance-none rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    >
                      <option value="">Selecciona una opción</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    rows={3}
                    value={branchAnswers[field.id] ?? ""}
                    onChange={(e) => updateBranch(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 resize-none"
                  />
                ) : (
                  <input
                    id={field.id}
                    type="text"
                    value={branchAnswers[field.id] ?? ""}
                    onChange={(e) => updateBranch(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Budget */}
      <motion.fieldset variants={itemVariants} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <DollarSign className="h-5 w-5" />
          </div>
          <legend className="text-base font-semibold text-foreground">
            ¿Cuál es tu presupuesto mensual estimado?
          </legend>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BUDGET_RANGES.map((b) => (
            <motion.button
              key={b.value}
              type="button"
              onClick={() => setPresupuesto(b.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "rounded-xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200",
                presupuesto === b.value
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "border-border bg-white text-foreground hover:border-primary/50 hover:shadow-md"
              )}
            >
              {b.label}
            </motion.button>
          ))}
        </div>
        {errors.presupuesto && <p className="mt-2 text-sm text-destructive font-medium">{errors.presupuesto}</p>}
      </motion.fieldset>

      {/* Urgency */}
      <motion.fieldset variants={itemVariants} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <legend className="text-base font-semibold text-foreground">
            ¿Qué tan urgente es para ti resolver esto?
          </legend>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {URGENCY_OPTIONS.map((u) => (
            <motion.button
              key={u.value}
              type="button"
              onClick={() => setUrgencia(u.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200",
                urgencia === u.value
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "border-border bg-white text-foreground hover:border-primary/50 hover:shadow-md"
              )}
            >
              {u.label}
            </motion.button>
          ))}
        </div>
        {errors.urgencia && <p className="mt-2 text-sm text-destructive font-medium">{errors.urgencia}</p>}
      </motion.fieldset>

      {/* Contact info */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Tus datos de contacto
            </h3>
            <p className="text-sm text-muted-foreground">Para enviarte el diagnóstico</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="nombre" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="h-4 w-4 text-muted-foreground" />
              Nombre completo
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
            {errors.nombre && <p className="mt-1 text-sm text-destructive font-medium">{errors.nombre}</p>}
          </div>
          <div>
            <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.com"
              className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
            {errors.email && <p className="mt-1 text-sm text-destructive font-medium">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="telefono" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Teléfono (WhatsApp)
            </label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+52 55 1234 5678"
              className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
            {errors.telefono && <p className="mt-1 text-sm text-destructive font-medium">{errors.telefono}</p>}
          </div>
        </div>
      </motion.div>

      {/* Privacy notice */}
      <motion.div variants={itemVariants} className="flex items-start gap-3 px-2">
        <Shield className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Tus datos están protegidos y solo se usarán para enviarte tu diagnóstico personalizado.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Atrás
        </motion.button>
        <motion.button
          type="button"
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          Continuar
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
