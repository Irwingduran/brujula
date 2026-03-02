import { BrevoClient } from "@getbrevo/brevo"

// Inicializar cliente solo si la API key está disponible
function getBrevoClient() {
  if (!process.env.BREVO_API_KEY) {
    return null
  }
  return new BrevoClient({ apiKey: process.env.BREVO_API_KEY })
}

interface LeadEmailData {
  nombre: string
  email: string
  id: string
  diagnostico: {
    titulo_servicio: string
    descripcion: string
    roi_estimado: string
    precio_rango: string
  }
  score: { total: number; segmento: string }
}

interface HotLeadData {
  nombre: string
  email: string
  telefono: string
  id: string
  industria: string
  score: { total: number }
  diagnostico: { titulo_servicio: string }
}

export async function sendDiagnosticoEmail(lead: LeadEmailData) {
  const client = getBrevoClient()
  if (!client) {
    console.warn("BREVO_API_KEY no configurada, saltando envío de email")
    return
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const propuestaUrl = `${baseUrl}/resultado/${lead.id}`
  const fromEmail = process.env.FROM_EMAIL || "hola@brujula.digital"
  const fromName = process.env.FROM_NAME || "Brújula"

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
      <h2 style="color: #1E40AF;">Hola ${lead.nombre.split(" ")[0]},</h2>
      <p>Analizamos tu caso y armamos tu diagnóstico personalizado.</p>
      
      <div style="background: #DBEAFE; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 8px; color: #1E40AF;">Tu solución recomendada</h3>
        <p style="margin: 0; font-size: 18px; font-weight: bold;">${lead.diagnostico.titulo_servicio}</p>
        <p style="margin: 8px 0 0; color: #475569;">${lead.diagnostico.descripcion}</p>
      </div>

      <p><strong>ROI estimado:</strong> ${lead.diagnostico.roi_estimado}</p>
      <p><strong>Inversión aproximada:</strong> ${lead.diagnostico.precio_rango}</p>

      <a href="${propuestaUrl}" 
         style="display: inline-block; background: #1E40AF; color: white; padding: 14px 28px; 
                border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
        Ver propuesta completa →
      </a>

      <p style="color: #94A3B8; font-size: 14px; margin-top: 32px;">
        ¿Prefieres hablar con un experto? Responde este email o agenda una llamada desde la propuesta.
      </p>
    </div>
  `

  await client.transactionalEmails.sendTransacEmail({
    subject: `Tu diagnóstico digital está listo, ${lead.nombre.split(" ")[0]}`,
    sender: { email: fromEmail, name: fromName },
    to: [{ email: lead.email, name: lead.nombre }],
    htmlContent,
  })
}

export async function sendHotLeadNotification(lead: HotLeadData) {
  const client = getBrevoClient()
  if (!client || !process.env.ADMIN_NOTIFICATION_EMAIL) {
    console.warn("BREVO_API_KEY o ADMIN_NOTIFICATION_EMAIL no configurada, saltando notificación")
    return
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const fromEmail = process.env.FROM_EMAIL || "hola@brujula.digital"
  const fromName = process.env.FROM_NAME || "Brújula"

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #DC2626;">🔴 Nuevo lead HOT</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; color: #94A3B8;">Nombre</td><td style="padding: 8px; font-weight: bold;">${lead.nombre}</td></tr>
        <tr><td style="padding: 8px; color: #94A3B8;">Email</td><td style="padding: 8px;">${lead.email}</td></tr>
        <tr><td style="padding: 8px; color: #94A3B8;">Teléfono</td><td style="padding: 8px;">${lead.telefono}</td></tr>
        <tr><td style="padding: 8px; color: #94A3B8;">Industria</td><td style="padding: 8px;">${lead.industria}</td></tr>
        <tr><td style="padding: 8px; color: #94A3B8;">Score</td><td style="padding: 8px; font-weight: bold; color: #DC2626;">${lead.score.total}/100</td></tr>
        <tr><td style="padding: 8px; color: #94A3B8;">Servicio sugerido</td><td style="padding: 8px;">${lead.diagnostico.titulo_servicio}</td></tr>
      </table>
      <a href="${baseUrl}/admin" 
         style="display: inline-block; background: #DC2626; color: white; padding: 14px 28px; 
                border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
        Ver en CRM →
      </a>
    </div>
  `

  await client.transactionalEmails.sendTransacEmail({
    subject: `🔴 Lead HOT — ${lead.nombre} (Score: ${lead.score.total})`,
    sender: { email: fromEmail, name: fromName },
    to: [{ email: process.env.ADMIN_NOTIFICATION_EMAIL }],
    htmlContent,
  })
}
