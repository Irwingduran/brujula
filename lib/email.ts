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

interface LlamadaRequestData {
  nombre: string
  email: string
  telefono: string
  industria: string
  preferencia_horaria: string
  id: string
  score_total?: number
}

interface PropuestaData {
  nombre: string
  email: string
  id: string
  industria: string
  tamano_empresa: string
  diagnostico_texto: string
  sintomas?: { sintomaId: string; score: number; evidencia: string }[]
  plan_accion?: { paso: string; descripcion: string; urgencia: string }[]
  score_texto?: string
  servicio_recomendado?: string
  servicio_titulo?: string
  rango_precio?: string
  roi_estimado?: string
  beneficios?: string[]
}

export async function sendSolicitudLlamadaNotification(lead: LlamadaRequestData) {
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
      <h2 style="color: #1E40AF;">📞 Solicitud de llamada</h2>
      <p style="color: #64748B;">${lead.nombre} quiere agendar una llamada.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; color: #94A3B8;">Nombre</td><td style="padding: 8px; font-weight: bold;">${lead.nombre}</td></tr>
        <tr><td style="padding: 8px; color: #94A3B8;">Email</td><td style="padding: 8px;">${lead.email}</td></tr>
        <tr><td style="padding: 8px; color: #94A3B8;">Teléfono</td><td style="padding: 8px;">${lead.telefono}</td></tr>
        <tr><td style="padding: 8px; color: #94A3B8;">Industria</td><td style="padding: 8px;">${lead.industria}</td></tr>
        ${lead.score_total ? `<tr><td style="padding: 8px; color: #94A3B8;">Score</td><td style="padding: 8px; font-weight: bold;">${lead.score_total}/100</td></tr>` : ""}
        <tr><td style="padding: 8px; color: #94A3B8;">Disponibilidad</td><td style="padding: 8px; font-style: italic;">${lead.preferencia_horaria}</td></tr>
      </table>
      <a href="${baseUrl}/admin" 
         style="display: inline-block; background: #1E40AF; color: white; padding: 14px 28px; 
                border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
        Ver en CRM →
      </a>
    </div>
  `

  await client.transactionalEmails.sendTransacEmail({
    subject: `📞 Solicitud de llamada — ${lead.nombre} — ${lead.industria}`,
    sender: { email: fromEmail, name: fromName },
    to: [{ email: process.env.ADMIN_NOTIFICATION_EMAIL }],
    htmlContent,
  })
}

export async function sendPropuestaEmail(lead: PropuestaData) {
  const client = getBrevoClient()
  if (!client) {
    console.warn("BREVO_API_KEY no configurada, saltando envío de propuesta")
    return
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const propuestaUrl = `${baseUrl}/resultado/${lead.id}`
  const fromEmail = process.env.FROM_EMAIL || "hola@brujula.digital"
  const fromName = process.env.FROM_NAME || "Brújula"

  const sintomasHtml = lead.sintomas?.length
    ? `
    <div style="margin: 16px 0;">
      <h3 style="color: #1E40AF; margin: 0 0 8px;">🔍 Síntomas detectados</h3>
      ${lead.sintomas.map((s) => `
        <div style="background: #F8FAFC; border-radius: 6px; padding: 12px; margin-bottom: 8px; border-left: 4px solid #3B82F6;">
          <p style="margin: 0; font-weight: bold; color: #1E293B;">${s.sintomaId}</p>
          <p style="margin: 4px 0 0; color: #64748B; font-size: 14px;">${s.evidencia}</p>
          <p style="margin: 4px 0 0; color: #94A3B8; font-size: 12px;">Severidad: ${s.score}/5</p>
        </div>
      `).join("")}
    </div>`
    : ""

  const planHtml = lead.plan_accion?.length
    ? `
    <div style="margin: 16px 0;">
      <h3 style="color: #1E40AF; margin: 0 0 8px;">📋 Tu plan de acción</h3>
      ${lead.plan_accion.map((a) => `
        <div style="background: #EFF6FF; border-radius: 6px; padding: 12px; margin-bottom: 8px;">
          <p style="margin: 0; font-weight: bold; color: #1E40AF;">${a.paso}</p>
          <p style="margin: 4px 0 0; color: #475569; font-size: 14px;">${a.descripcion}</p>
          <p style="margin: 4px 0 0; color: #94A3B8; font-size: 12px; text-transform: capitalize;">${a.urgencia}</p>
        </div>
      `).join("")}
    </div>`
    : ""

  const beneficiosHtml = lead.beneficios?.length
    ? `
    <div style="margin: 16px 0;">
      <h3 style="color: #1E40AF; margin: 0 0 8px;">✅ Beneficios clave</h3>
      ${lead.beneficios.map((b) => `
        <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
          <span style="color: #16A34A; font-size: 18px;">✓</span>
          <span style="color: #475569; font-size: 14px;">${b}</span>
        </div>
      `).join("")}
    </div>`
    : ""

  const servicioNombre = lead.servicio_recomendado || lead.servicio_titulo
  const servicioHtml = servicioNombre
    ? `
    <div style="background: #F0FDF4; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <h3 style="margin: 0 0 8px; color: #166534;">💼 Servicio recomendado</h3>
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #15803D;">${servicioNombre}</p>
      ${lead.rango_precio ? `<p style="margin: 8px 0 0; color: #475569;"><strong>Inversión:</strong> ${lead.rango_precio}</p>` : ""}
      ${lead.roi_estimado ? `<p style="margin: 4px 0 0; color: #475569;"><strong>ROI estimado:</strong> ${lead.roi_estimado}</p>` : ""}
    </div>`
    : ""

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
      <h2 style="color: #1E40AF;">Hola ${lead.nombre.split(" ")[0]},</h2>
      <p>Aquí está tu propuesta completa basada en el diagnóstico que completaste.</p>

      <div style="background: #EFF6FF; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.5;">${lead.diagnostico_texto}</p>
        ${lead.score_texto ? `<p style="margin: 8px 0 0; font-weight: bold; color: #1E40AF;">${lead.score_texto}</p>` : ""}
      </div>

      ${beneficiosHtml}
      ${sintomasHtml}
      ${planHtml}
      ${servicioHtml}

      <a href="${propuestaUrl}" 
         style="display: inline-block; background: #1E40AF; color: white; padding: 14px 28px; 
                border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
        Ver diagnóstico completo en línea →
      </a>

      <p style="color: #64748B; font-size: 14px;">
        ¿Prefieres hablar con un especialista? 
        <a href="${propuestaUrl}" style="color: #1E40AF;">Agenda una llamada gratuita</a> desde tu diagnóstico.
      </p>

      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
      <p style="color: #94A3B8; font-size: 12px;">
        Brújula · Transformación digital para PYMEs mexicanas<br/>
        Si tienes dudas, responde este correo.
      </p>
    </div>
  `

  await client.transactionalEmails.sendTransacEmail({
    subject: `Tu propuesta completa, ${lead.nombre.split(" ")[0]} — Brújula`,
    sender: { email: fromEmail, name: fromName },
    to: [{ email: lead.email, name: lead.nombre }],
    htmlContent,
  })
}

export async function sendReunionLinkEmail(data: {
  nombre: string
  email: string
  enlace_reunion: string
  id: string
}) {
  const client = getBrevoClient()
  if (!client) {
    console.warn("BREVO_API_KEY no configurada, saltando envío de link de reunión")
    return
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const fromEmail = process.env.FROM_EMAIL || "hola@brujula.digital"
  const fromName = process.env.FROM_NAME || "Brújula"
  const resultadoUrl = `${baseUrl}/resultado/${data.id}`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
      <h2 style="color: #1E40AF;">Hola ${data.nombre.split(" ")[0]},</h2>
      <p>Tu reunión con nuestro equipo está confirmada.</p>

      <div style="background: #EFF6FF; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; border: 2px solid #BFDBFE;">
        <p style="margin: 0 0 8px; color: #64748B; font-size: 14px;">Enlace para conectarte a la reunión:</p>
        <a href="${data.enlace_reunion}"
           style="display: inline-block; background: #1E40AF; color: white; padding: 14px 32px;
                  border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 8px 0;">
          Entrar a la reunión →
        </a>
        <p style="margin: 12px 0 0; color: #94A3B8; font-size: 12px; word-break: break-all;">
          Si el botón no funciona, copia este enlace:<br/>
          <a href="${data.enlace_reunion}" style="color: #1E40AF; font-size: 12px;">${data.enlace_reunion}</a>
        </p>
      </div>

      <p style="color: #64748B; font-size: 14px;">
        Tips para tu reunión:<br/>
        • Conéctate 2 minutos antes<br/>
        • Ten a la mano tu diagnóstico<br/>
        • Prepara tus preguntas
      </p>

      <a href="${resultadoUrl}"
         style="display: inline-block; background: #F1F5F9; color: #475569; padding: 10px 20px;
                border-radius: 8px; text-decoration: none; font-size: 13px; margin-top: 16px;">
        Ver mi diagnóstico →
      </a>

      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
      <p style="color: #94A3B8; font-size: 12px;">
        Brújula · Transformación digital para PYMEs mexicanas<br/>
        ¿Problemas con el enlace? Responde este correo.
      </p>
    </div>
  `

  await client.transactionalEmails.sendTransacEmail({
    subject: `🔗 Tu reunión está lista, ${data.nombre.split(" ")[0]} — Brújula`,
    sender: { email: fromEmail, name: fromName },
    to: [{ email: data.email, name: data.nombre }],
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
