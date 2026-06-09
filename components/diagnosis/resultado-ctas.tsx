"use client"

import { useState } from "react"
import { Calendar, Envelope, ArrowRight, UserCircle } from "@phosphor-icons/react"
import { SolicitarLlamadaModal } from "./solicitar-llamada-modal"
import { EnviarPropuestaModal } from "./enviar-propuesta-modal"

interface Props {
  leadId: string
  email: string
  telefono: string
  nombre: string
  segmento: string
  ctaMessages: Record<string, string>
}

export function ResultadoCTAs({ leadId, email, telefono, nombre, segmento, ctaMessages }: Props) {
  const [llamadaOpen, setLlamadaOpen] = useState(false)
  const [propuestaOpen, setPropuestaOpen] = useState(false)

  return (
    <>
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <UserCircle className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-4 sm:mt-0">
            <h3 className="font-sans text-lg font-bold text-foreground">
              ¿Quieres ayuda para implementar esto?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {ctaMessages[segmento] || ctaMessages.COLD}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sin compromiso · Respuesta en menos de 24h
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setLlamadaOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                <Calendar className="h-4 w-4" />
                Agendar llamada gratuita de 30 min
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPropuestaOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary/30 bg-white px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                <Envelope className="h-4 w-4" />
                Recibir propuesta completa por email
              </button>
            </div>
          </div>
        </div>
      </div>

      <SolicitarLlamadaModal
        leadId={leadId}
        telefono={telefono}
        open={llamadaOpen}
        onClose={() => setLlamadaOpen(false)}
      />

      <EnviarPropuestaModal
        leadId={leadId}
        email={email}
        open={propuestaOpen}
        onClose={() => setPropuestaOpen(false)}
      />
    </>
  )
}
