"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Envelope, CheckCircle } from "@phosphor-icons/react"

interface ProposalError {
  message: string
  code?: string
  incidentId?: string
  providerStatus?: number
}

const PROPOSAL_ERROR_MESSAGES: Record<string, string> = {
  diagnosis_incomplete: "El diagnóstico aún no está completo para enviarse.",
  email_not_configured: "El correo no está configurado en este momento.",
  email_provider_rejected: "El proveedor de correo rechazó el envío. Verifica el remitente validado y la cuenta de Brevo.",
  email_provider_timeout: "El proveedor de correo tardó demasiado en responder. Intenta de nuevo.",
  email_provider_unavailable: "No fue posible conectarnos al proveedor de correo. Intenta de nuevo.",
}

interface Props {
  leadId: string
  email: string
  open: boolean
  onClose: () => void
}

export function EnviarPropuestaModal({ leadId, email, open, onClose }: Props) {
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState<ProposalError | null>(null)

  const handleSubmit = async () => {
    setEnviando(true)
    setError(null)

    try {
      const res = await fetch(`/api/leads/${leadId}/enviar-propuesta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const code = typeof data.code === "string" ? data.code : undefined
        setError({
          message: code ? PROPOSAL_ERROR_MESSAGES[code] ?? data.error : data.error || "No pudimos enviar la propuesta.",
          code,
          incidentId: typeof data.incidentId === "string" ? data.incidentId : undefined,
          providerStatus: typeof data.providerStatus === "number" ? data.providerStatus : undefined,
        })
        return
      }

      setExito(true)
    } catch {
      setError({
        message: "No pudimos conectar con el servicio. Revisa tu conexión e intenta de nuevo.",
      })
    } finally {
      setEnviando(false)
    }
  }

  const handleClose = () => {
    setEnviando(false)
    setExito(false)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        {exito ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" weight="fill" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">Propuesta enviada</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Revisa tu bandeja de entrada en <strong>{email}</strong>. Si no lo ves, revisa la carpeta de spam.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Envelope className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="mt-2">Recibir propuesta por email</DialogTitle>
              <DialogDescription>
                Te enviaremos el diagnóstico completo a <strong>{email}</strong> con todos los detalles, el plan de acción y las recomendaciones.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <p>{error.message}</p>
                {error.code && <p className="mt-1 text-xs">Código: <code>{error.code}</code>{error.providerStatus ? ` · Brevo HTTP ${error.providerStatus}` : ""}</p>}
                {error.incidentId && <p className="mt-1 text-xs">Incidencia: <code>{error.incidentId}</code></p>}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={enviando}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enviando ? "Enviando..." : "Enviar propuesta"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
