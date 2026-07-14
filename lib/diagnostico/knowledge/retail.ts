import type { KnowledgePack, KnowledgeSymptom, KnowledgeAction } from "./types"

const symptoms: KnowledgeSymptom[] = [
  {
    id: "rt_inventario_manual",
    nombre: "Inventario llevado a mano o en papel",
    descripcion: "El conteo de stock se hace manualmente, sin sistema digital, lo que genera errores y faltantes.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "rt_sin_omnichannel",
    nombre: "Sin integración entre tienda física y online",
    descripcion: "Vende en local y en redes pero no hay conexión entre los canales, se duplican esfuerzos.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "rt_precios_inconsistentes",
    nombre: "Precios inconsistentes entre canales",
    descripcion: "El precio en tienda no coincide con redes o marketplaces, generando desconfianza.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "rt_sin_pos_digital",
    nombre: "Punto de venta tradicional sin digitalizar",
    descripcion: "Cobros en efectivo o terminal básica, sin registro digital de ventas ni inventario automático.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "rt_bajo_ticket_promedio",
    nombre: "Ticket promedio bajo sin estrategia de upselling",
    descripcion: "Clientes compran poco y no hay incentivos para aumentar el valor del carrito.",
    categoria: "ventas",
    industryOnly: true,
  },
  {
    id: "rt_sin_programa_lealtad",
    nombre: "Sin programa de fidelización",
    descripcion: "No hay sistema para incentivar la recompra ni identificar clientes frecuentes.",
    categoria: "retencion",
    industryOnly: true,
  },
  {
    id: "rt_sin_metricas_ventas",
    nombre: "No mide ventas por producto ni categoría",
    descripcion: "Sabe lo que vende en total pero no qué productos o categorías rinden más.",
    categoria: "datos",
    industryOnly: true,
  },
  {
    id: "rt_dependencia_transito",
    nombre: "Dependencia total del tráfico peatonal",
    descripcion: "No tiene canales digitales activos para atraer clientes cuando el local está tranquilo.",
    categoria: "captacion",
    industryOnly: true,
  },
]

const actions: KnowledgeAction[] = [
  {
    id: "rt_implementar_pos",
    titulo: "Implementar punto de venta digital",
    descripcion: "Sistema POS con registro de ventas, control de inventario y clientes en tiempo real.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "rt_inventario_digital",
    titulo: "Digitalizar control de inventario",
    descripcion: "Usar herramienta como Zoho Inventory, DEAR o incluso un Excel sincronizado para tracking.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "rt_sincronizar_canales",
    titulo: "Sincronizar precios y stock entre canales",
    descripcion: "Unificar precios e inventario entre tienda física, redes y marketplaces.",
    presupuestoRequerido: "medio",
    impacto: "largo_plazo",
    industryOnly: true,
  },
  {
    id: "rt_crear_programa_lealtad",
    titulo: "Crear programa de lealtad simple",
    descripcion: "Tarjeta de puntos digital o física que incentive la recompra y registre preferencias.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "rt_estrategia_upselling",
    titulo: "Implementar estrategia de upselling",
    descripcion: "Capacitar al equipo para ofrecer complementos y productos relacionados en cada venta.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "rt_activar_google_business",
    titulo: "Activar y optimizar Google Business",
    descripcion: "Registrar el negocio en Google Maps, subir fotos, horarios y responder reseñas.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "rt_reportes_semanales",
    titulo: "Implementar reportes semanales de ventas",
    descripcion: "Reporte automático semanal con ventas por producto, categoría y margen.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
]

export const RETAIL_PACK: KnowledgePack = {
  industryCode: "retail",
  industryLabel: "Retail / Tienda",

  subsectors: {
    ropa: "Ropa y accesorios",
    calzado: "Calzado",
    electronica: "Electrónica y gadgets",
    hogar: "Hogar y decoración",
    abarrotes: "Abarrotes y conveniencia",
    especializado: "Tienda especializada",
    otro: "Otro retail",
  },

  diagnosticFocus: [
    "Control de inventario y reposición",
    "Integración de canales de venta",
    "Experiencia en tienda física",
    "Captación de tráfico local y digital",
    "Fidelización y recompra",
    "Márgenes y rentabilidad por producto",
  ],

  promptGuidance: `Este negocio es de RETAIL / TIENDA (ropa, electrónica, hogar, abarrotes, etc.).
Enfócate en:
- Cómo manejan el inventario y la reposición de stock
- Cómo integran su tienda física con canales digitales
- Su estrategia de precios y promociones
- Cómo atraen tráfico (peatonal y digital)
- La experiencia de compra y la fidelización de clientes
- Métricas de ventas: ticket promedio, rotación de inventario, margen por producto
NO trates este negocio como una consultoría o servicio profesional.`,

  maturityDimensions: [
    {
      nombre: "Gestión de inventario",
      descripcion: "Control y visibilidad del stock",
      niveles: [
        "Inventario mental o en papel",
        "Registro en Excel básico",
        "Software de inventario básico",
        "Sistema POS con inventario en tiempo real",
        "Inventario automatizado con alertas de reposición",
      ],
    },
    {
      nombre: "Canales de venta",
      descripcion: "Presencia y venta en múltiples canales",
      niveles: [
        "Solo tienda física",
        "Tienda física + WhatsApp",
        "Tienda física + redes sociales",
        "Tienda física + tienda online",
        "Omnicanal integrado con inventario unificado",
      ],
    },
    {
      nombre: "Captación de clientes",
      descripcion: "Estrategias para atraer nuevo tráfico",
      niveles: [
        "Dependencia total del tráfico peatonal",
        "Redes sociales sin inversión",
        "Google Business activo + redes",
        "Publicidad digital segmentada",
        "Múltiples canales con embudo de captación",
      ],
    },
  ],

  benchmarks: [
    {
      metrica: "Margen bruto promedio",
      valor: "35-55%",
      descripcion: "Margen bruto típico en retail PYME latinoamericano",
    },
    {
      metrica: "Ticket promedio",
      valor: "$15-45 USD",
      descripcion: "Gasto promedio por transacción en tiendas PYME",
    },
    {
      metrica: "Rotación de inventario",
      valor: "4-6 veces/año",
      descripcion: "Veces que se renueva el inventario en un año",
    },
    {
      metrica: "Tasa de conversión en tienda",
      valor: "20-35%",
      descripcion: "Porcentaje de visitantes que compran",
    },
    {
      metrica: "Clientes recurrentes",
      valor: "20-35%",
      descripcion: "Porcentaje de clientes que repiten compra en 3 meses",
    },
  ],

  successStories: [
    {
      empresa: "Moda Express",
      problema: "Perdían 8 horas semanales haciendo inventario manual y tenían diferencias de stock del 15%.",
      solucion: "Implementaron un POS digital con control de inventario en tiempo real.",
      resultado: "Eliminaron los errores de stock, redujeron mermas en un 40% y duplicaron la velocidad de atención.",
    },
    {
      empresa: "TecnoShop",
      problema: "El 70% de sus clientes preguntaban precios por WhatsApp pero no llegaban a comprar.",
      solucion: "Sincronizaron catálogo de WhatsApp con inventario real y activaron Google Business.",
      resultado: "Aumentaron las ventas en un 35% y redujeron consultas repetitivas en un 60%.",
    },
  ],

  symptoms,
  actions,

  fallbackDiagnosis: {
    texto:
      "Tu tienda tiene oportunidades claras para mejorar el control de inventario, aumentar el ticket promedio y atraer más clientes. Con herramientas digitales básicas puedes reducir pérdidas y vender más sin necesidad de una gran inversión.",
    beneficios: [
      "Reduce pérdidas por inventario descontrolado",
      "Aumenta el ticket promedio con ventas guiadas",
      "Atrae más clientes sin depender solo del local",
    ],
    sugerencia:
      "Empieza por registrar todas tus ventas en un sistema digital durante una semana. Eso solo te dará visibilidad de qué productos se venden más, a qué hora y a qué precio.",
    plan: {
      dia_30: "Digitaliza tu inventario en una herramienta básica",
      dia_60: "Activa Google Business y catálogo en WhatsApp",
      dia_90: "Implementa reportes de ventas y programa de lealtad simple",
    },
  },
}
