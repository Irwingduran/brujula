"use client"

import { useState } from "react"
import { CheckCircle, RocketLaunch, Calendar, Envelope } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type Insight = {
  name: string
  value: string
}

interface DiagnosisSummaryProps {
  title: string
  subtitle: string
  readinessLabel: string
  readinessColor: string
  readinessDescription: string
  diagnosticExecutive: string
  priorities: string[]
  plan: string[]
  insights: Insight[]
  leadId?: string
  onScheduleSuccess?: () => void
}

export function DiagnosisSummary({
  title,
  subtitle,
  readinessLabel,
  readinessColor,
  readinessDescription,
  diagnosticExecutive,
  priorities,
  plan,
  insights,
  leadId,
  onScheduleSuccess,
}: DiagnosisSummaryProps) {
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleMessage, setScheduleMessage] = useState<string | null>(null)
  const [scheduleError, setScheduleError] = useState<string | null>(null)

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const handleScheduleCall = async () => {
    if (!leadId) {
      setScheduleError("No se puede agendar llamada: faltan datos de lead.")
      return
    }

    try {
      setIsScheduling(true)
      setScheduleMessage(null)
      setScheduleError(null)

      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado_pipeline: "llamada_agendada",
          llamada_agendada_at: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.error || "Error agendando llamada")
      }

      setScheduleMessage("Llamada agendada correctamente. Un asesor te contactará pronto.")
      onScheduleSuccess?.()
    } catch (error) {
      setScheduleError((error as Error).message || "No se pudo agendar llamada")
    } finally {
      setIsScheduling(false)
    }
  }

  const handleSendProposal = async () => {
    if (!leadId) {
      setScheduleError("No se puede enviar propuesta: faltan datos de lead.")
      return
    }

    try {
      setIsScheduling(true)
      setScheduleMessage(null)
      setScheduleError(null)

      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado_pipeline: "email_enviado",
          ultima_actividad_at: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.error || "Error al enviar propuesta")
      }

      setScheduleMessage("Propuesta registrada, te contactaremos pronto para seguimiento.")
      onScheduleSuccess?.()
    } catch (error) {
      setScheduleError((error as Error).message || "No se pudo enviar propuesta")
    } finally {
      setIsScheduling(false)
    }
  }

  return (
    <section className="glass-card rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <RocketLaunch className={cn("h-5 w-5", readinessColor)} weight="fill" />
            <h3 className={cn("text-xl font-bold", readinessColor)}>{readinessLabel}</h3>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{readinessDescription}</p>
        </div>

        <div className="rounded-xl border border-border bg-white/40 p-4 md:max-w-xs">
          <div className="text-xs font-semibold text-muted-foreground mb-2">{title}</div>
          <p className="text-sm text-foreground leading-relaxed">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs font-semibold text-muted-foreground">Diagnóstico ejecutivo</div>
          <p className="mt-1 text-sm text-foreground leading-relaxed">{diagnosticExecutive}</p>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted-foreground">3 prioridades inmediatas</div>
          <ol className="mt-1 space-y-2 text-sm text-foreground list-decimal list-inside">
            {priorities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6 grid gap-2">
        <div className="text-xs font-semibold text-muted-foreground">Plan 30/60/90</div>
        {plan.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-slate-50 p-3 text-xs text-foreground">
            {item}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {insights.map((item) => (
          <div key={item.name} className="rounded-xl border border-border bg-white/40 p-4">
            <div className="text-xs text-muted-foreground">{item.name}</div>
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle className="h-4 w-4 text-accent" weight="fill" />
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          <Calendar className="h-4 w-4" />
          Descargar informe (PDF)
        </button>
        <button
          type="button"
          onClick={handleScheduleCall}
          disabled={isScheduling}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <Calendar className="h-4 w-4" />
          {isScheduling ? "Agendando..." : "Agendar llamada con asesor"}
        </button>
        <button
          type="button"
          onClick={handleSendProposal}
          disabled={isScheduling}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <Envelope className="h-4 w-4" />
          {isScheduling ? "Registrando..." : "Enviar propuesta y marcar pipeline"}
        </button>
        <a
          href="mailto:ventas@nexodigital.com?subject=Solicitud de propuesta%20personalizada&body=Hola%2C%20me%20interesa%20recibir%20una%20propuesta%20detallada%20para%20mi%20diagn%C3%B3stico."
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Envelope className="h-4 w-4" />
          Solicitar propuesta por email
        </a>
      </div>
      {(scheduleMessage || scheduleError) && (
        <div className="mt-4 rounded-lg border border-border bg-white/70 p-3 text-sm">
          {scheduleMessage && <p className="text-foreground">{scheduleMessage}</p>}
          {scheduleError && <p className="text-red-600">{scheduleError}</p>}
        </div>
      )}
    </section>
  )
}
