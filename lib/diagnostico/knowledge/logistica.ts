import type { KnowledgePack, KnowledgeSymptom, KnowledgeAction } from "./types"

const symptoms: KnowledgeSymptom[] = [
  {
    id: "lg_sin_rastreo_envios",
    nombre: "Sin rastreo de envíos en tiempo real",
    descripcion: "Los clientes preguntan por su paquete por teléfono, no hay tracking visible ni notificaciones automáticas.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "lg_rutas_manuales",
    nombre: "Rutas de entrega sin optimización",
    descripcion: "Los repartidores siguen rutas por costumbre, sin cálculo de la ruta más eficiente, desperdiciando tiempo y gasolina.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "lg_inventario_almacen",
    nombre: "Inventario de almacén sin sistema digital",
    descripcion: "El conteo de mercancía se hace manual, sin visibilidad en tiempo real de stock ni ubicación de productos.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "lg_pedidos_whatsapp",
    nombre: "Pedidos por WhatsApp sin estructura",
    descripcion: "Los clientes envían pedidos por WhatsApp, se pierden mensajes, se cometen errores en cantidades y direcciones.",
    categoria: "captacion",
    industryOnly: true,
  },
  {
    id: "lg_sin_metricas_entrega",
    nombre: "Sin métricas de desempeño de entrega",
    descripcion: "No se mide tiempo promedio de entrega, tasa de devoluciones ni satisfacción del cliente final.",
    categoria: "datos",
    industryOnly: true,
  },
  {
    id: "lg_devoluciones_sin_proceso",
    nombre: "Devoluciones y reclamaciones sin proceso",
    descripcion: "Las devoluciones se manejan caso por caso, sin proceso estandarizado ni registro para análisis.",
    categoria: "retencion",
    industryOnly: true,
  },
  {
    id: "lg_dependencia_un_solo_cliente",
    nombre: "Dependencia de un solo cliente o contrato",
    descripcion: "La mayoría del revenue viene de un solo cliente, alto riesgo si se pierde el contrato.",
    categoria: "ventas",
    industryOnly: true,
  },
  {
    id: "lg_sin_digitalizacion_docs",
    nombre: "Documentos de carga en papel",
    descripcion: "Facturas de carga, Guías de remisión y bitácoras se manejan físicamente, sin respaldo digital.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "lg_flotilla_sin_mantenimiento",
    nombre: "Flotilla sin sistema de mantenimiento preventivo",
    descripcion: "Los vehículos se reparan cuando se descomponen, sin programación de mantenimiento, generando paros costosos.",
    categoria: "operaciones",
    industryOnly: true,
  },
]

const actions: KnowledgeAction[] = [
  {
    id: "lg_implementar_tms",
    titulo: "Implementar sistema de gestión de transportes (TMS)",
    descripcion: "Software para optimizar rutas, gestionar entregas y dar tracking a clientes en tiempo real.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "lg_rastreo_envios",
    titulo: "Implementar tracking de envíos",
    descripcion: "Portal o app donde el cliente pueda ver el estado de su paquete con notificaciones automáticas.",
    presupuestoRequerido: "medio",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "lg_almacen_digital",
    titulo: "Digitalizar gestión de almacén",
    descripcion: "Sistema WMS con control de stock por ubicación, picking y packing optimizado.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "lg_pedidos_digitales",
    titulo: "Canal digital de pedidos",
    descripcion: "Portal o WhatsApp Business con catálogo para que los clientes hagan pedidos estructurados.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "lg_metricas_entrega",
    titulo: "Implementar dashboard de métricas",
    descripcion: "Panel con KPIs: tiempo de entrega, tasa de éxito, devoluciones y satisfacción del cliente.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "lg_mantenimiento_flotilla",
    titulo: "Programar mantenimiento preventivo",
    descripcion: "Calendario de mantenimiento por vehículo con alertas automáticas basadas en kilometraje.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "lg_google_business",
    titulo: "Activar Google Business",
    descripcion: "Registrar la empresa con servicios, horarios, fotos de operaciones y reseñas de clientes.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "lg_docs_digitales",
    titulo: "Digitalizar documentos de carga",
    descripcion: "Guías de remisión, facturas y bitácoras en formato digital con firma electrónica.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "lg_diversificar_clientes",
    titulo: "Diversificar cartera de clientes",
    descripcion: "Estrategia activa de prospección para reducir dependencia de un solo cliente o contrato.",
    presupuestoRequerido: "bajo",
    impacto: "largo_plazo",
    industryOnly: true,
  },
]

export const LOGISTICA_PACK: KnowledgePack = {
  industryCode: "logistica",
  industryLabel: "Logística / Transporte",

  subsectors: {
    paqueteria: "Paquetería / Mensajería",
    last_mile: "Last mile / Última milla",
    almacenamiento: "Almacenamiento / Centros de distribución",
    flotilla: "Flotilla / Transporte de carga",
    cross_docking: "Cross-docking",
    ecommerce_logistica: "Logística para e-commerce",
    otro: "Otro servicio logístico",
  },

  diagnosticFocus: [
    "Gestión de envíos y rastreo",
    "Optimización de rutas y entregas",
    "Gestión de almacén e inventario",
    "Métricas de desempeño y satisfacción",
    "Mantenimiento de flotilla",
    "Diversificación de clientes",
  ],

  promptGuidance: `Este negocio es de LOGÍSTICA / TRANSPORTE (paquetería, last mile, almacenamiento, flotilla, etc.).
NO trates este negocio como un restaurante, tienda o consultoría. NO menciones "menú", "clientes que visitan el local", "productos para venta directa" ni "servicios profesionales por hora".

DATOS DISPONIBLES en respuestas_branch (úsalos para personalizar):
- tipo_servicio: tipo de servicio (paqueteria, last_mile, almacenamiento, flotilla, cross_docking)
- como_gestionas_envios: cómo gestiona envíos (manual, sistema_basico, tms_completo)
- tienes_tracking: si ofrece tracking a clientes
- como_optimizas_rutas: cómo optimiza rutas (por_costumbre, app_basica, tms_optimizado)
- tienes_almacen: si tiene almacén y cómo lo gestiona
- cuantos_vehiculos: tamaño de flotilla
- porcentaje_ingreso_por_cliente_principal: dependencia de un solo cliente
- Si tiene métricas de desempeño de entrega
- Si digitalizó documentos de carga

Enfócate en:
- Cómo gestiona envíos y rastreo (usa como_gestionas_envios, tienes_tracking)
- Optimización de rutas y eficiencia de entrega (usa como_optimizas_rutas)
- Gestión de almacén e inventario (usa tienes_almacen)
- Métricas: tiempo de entrega, devoluciones, satisfacción
- Mantenimiento de flotilla (usa cuantos_vehiculos)
- Diversificación de clientes y reducción de dependencia`,

  maturityDimensions: [
    {
      nombre: "Gestión de envíos",
      descripcion: "Control y rastreo de entregas",
      niveles: [
        "Envíos manuales sin tracking",
        "Registro en Excel con llamadas de seguimiento",
        "Sistema básico con estados de envío",
        "TMS con tracking en tiempo real",
        "Sistema completo con notificaciones automáticas y portal de cliente",
      ],
    },
    {
      nombre: "Optimización de operaciones",
      descripcion: "Rutas, almacén y flotilla",
      niveles: [
        "Rutas por costumbre, almacén manual",
        "App de rutas básica (Google Maps)",
        "Software de optimización de rutas",
        "TMS integrado con WMS y mantenimiento de flotilla",
        "Operación fully digital con IA predictiva",
      ],
    },
    {
      nombre: "Métricas y mejora",
      descripcion: "Datos para tomar decisiones",
      niveles: [
        "Sin métricas, todo por sensación",
        "Reportes manuales mensuales",
        "Dashboard con KPIs básicos",
        "Métricas en tiempo real con alertas",
        "Analytics predictivo y optimización continua",
      ],
    },
  ],

  benchmarks: [
    {
      metrica: "Tasa de entrega exitosa",
      valor: "92-97%",
      descripcion: "Porcentaje de envíos entregados sin devolución en operaciones logísticas PYME",
    },
    {
      metrica: "Tiempo promedio de entrega",
      valor: "24-72 horas",
      descripcion: "Horas promedio desde recepción hasta entrega en last mile urbano",
    },
    {
      metrica: "Costo por entrega",
      valor: "$3-12 USD",
      descripcion: "Costo promedio por entrega en operaciones de last mile PYME",
    },
    {
      metrica: "Utilización de flotilla",
      valor: "65-80%",
      descripcion: "Porcentaje de capacidad de la flotilla que se utiliza diariamente",
    },
    {
      metrica: "Tasa de devoluciones",
      valor: "3-8%",
      descripcion: "Porcentaje de envíos que se devuelven por various razones",
    },
  ],


  symptoms,
  actions,

  fallbackDiagnosis: {
    texto:
      "Tu empresa de logística tiene oportunidades para optimizar entregas, reducir costos operativos y mejorar la experiencia del cliente con tracking y métricas. Con herramientas digitales puedes ser más eficiente y diversificar tu cartera.",
    beneficios: [
      "Optimiza rutas y reduce costos de combustible",
      "Mejora la experiencia del cliente con tracking",
      "Toma decisiones basadas en métricas reales",
    ],
    sugerencia:
      "Empieza por medir tu tasa de entrega exitosa y tiempo promedio de entrega durante una semana. Esos dos datos te darán claridad sobre dónde están las mayores pérdidas.",
    plan: {
      dia_30: "Implementa tracking de envíos y activa Google Business",
      dia_60: "Optimiza rutas con app de navegación y crea dashboard de métricas básico",
      dia_90: "Digitaliza documentos de carga y programa mantenimiento preventivo de flotilla",
    },
  },
}
