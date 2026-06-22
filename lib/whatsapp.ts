interface WhatsAppConfig {
  phoneNumberId: string
  accessToken: string
  from: string // ej: "521234567890"
}

interface SendTextParams {
  to: string
  body: string
  previewUrl?: boolean
}

interface SendTemplateParams {
  to: string
  templateName: string
  languageCode?: string
  components?: Record<string, unknown>[]
}

function getConfig(): WhatsAppConfig | null {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  const from = process.env.WHATSAPP_FROM

  if (!phoneNumberId || !accessToken || !from) {
    return null
  }

  return { phoneNumberId, accessToken, from }
}

async function sendToMeta(payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  const config = getConfig()
  if (!config) {
    return { ok: false, error: "WhatsApp no configurado. Define WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN y WHATSAPP_FROM en .env" }
  }

  const url = `https://graph.facebook.com/v22.0/${config.phoneNumberId}/messages`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        ...payload,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return { ok: false, error: data.error?.message || `Error HTTP ${res.status}` }
    }

    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error de red al enviar WhatsApp" }
  }
}

export async function sendTextMessage({ to, body, previewUrl = false }: SendTextParams) {
  return sendToMeta({
    to: to.startsWith("+") ? to.slice(1) : to,
    type: "text",
    text: { preview_url: previewUrl, body },
  })
}

export async function sendTemplateMessage({
  to,
  templateName,
  languageCode = "es_MX",
  components,
}: SendTemplateParams) {
  const payload: Record<string, unknown> = {
    to: to.startsWith("+") ? to.slice(1) : to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
    },
  }

  if (components?.length) {
    payload.template = { ...payload.template as Record<string, unknown>, components }
  }

  return sendToMeta(payload)
}

export async function sendDiagnosisViaWhatsApp(lead: {
  nombre: string
  telefono: string
  diagnostico_texto: string
  score_total: number
  segmento: string
  url_resultado: string
}) {
  const phone = lead.telefono.startsWith("+") ? lead.telefono : `+52${lead.telefono}`
  const nombre = lead.nombre.split(" ")[0]

  const message = `Hola ${nombre} 👋

Soy el equipo de Brújula. Así como lo conversamos, ya tenemos listo tu diagnóstico digital.

📊 *Score:* ${lead.score_total}/100 — ${lead.segmento === "HOT" ? "🔴 Alto potencial" : lead.segmento === "WARM" ? "🟡 Buenas señales" : "🟢 En análisis"}

${lead.diagnostico_texto.slice(0, 300)}${lead.diagnostico_texto.length > 300 ? "..." : ""}

👉 Puedes ver tu diagnóstico completo aquí:
${lead.url_resultado}

¿Te gustaría agendar una llamada con nuestro equipo para revisarlo juntos? Solo responde este mensaje y te coordinamos.`

  return sendTextMessage({ to: phone, body: message })
}
