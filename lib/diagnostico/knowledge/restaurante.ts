import type { KnowledgePack, KnowledgeSymptom, KnowledgeAction } from "./types"

const symptoms: KnowledgeSymptom[] = [
  {
    id: "rs_control_mermas",
    nombre: "Sin control de mermas y desperdicio",
    descripcion: "No se mide cuánto se pierde en preparación, caducidad o sobrantes, lo que se come directo del margen.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "rs_pedido_manual",
    nombre: "Pedidos a proveedores por WhatsApp o teléfono",
    descripcion: "No hay sistema de compras, se pide por memoria o costumbre, generando excesos o faltantes.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "rs_sin_delivery_propio",
    nombre: "Dependencia total de apps de delivery",
    descripcion: "El 30-40% de cada venta se va en comisión de rappi/Uber Eats sin tener canal directo.",
    categoria: "ventas",
    industryOnly: true,
  },
  {
    id: "rs_menu_no_datado",
    nombre: "Menú sin análisis de rentabilidad",
    descripcion: "No sabe qué plato genera más margen ni cuál conviene promover, todo se decide por instinto.",
    categoria: "datos",
    industryOnly: true,
  },
  {
    id: "rs_sin_reservaciones",
    nombre: "Sin sistema de reservaciones o lista de espera",
    descripcion: "Se pierden mesas por no tener control de disponibilidad, o se hacen esperar clientes que ya confirmaron.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "rs_turnos_manuales",
    nombre: "Control de personal y turnos en papel",
    descripcion: "Horarios, incapacidades y prestaciones se manejan manualmente, generando errores y conflictos.",
    categoria: "operaciones",
    industryOnly: true,
  },
  {
    id: "rs_sin_programa_fidelidad",
    nombre: "Sin programa de fidelización",
    descripcion: "Los clientes recurrentes no se identifican ni recompensan, no hay incentivo para volver.",
    categoria: "retencion",
    industryOnly: true,
  },
  {
    id: "rs_redes_inactivas",
    nombre: "Redes sociales sin contenido consistente",
    descripcion: "Publica esporádico, sin fotos de calidad ni estrategia, no genera interacción ni tráfico al local.",
    categoria: "presencia_digital",
    industryOnly: true,
  },
  {
    id: "rs_horas_pico_desaprovechadas",
    nombre: "Horas pico sin estrategia de maximización",
    descripcion: "Cuando hay saturación no se optimiza la mesa ni se ofrecen upsells, se pierde revenue.",
    categoria: "ventas",
    industryOnly: true,
  },
]

const actions: KnowledgeAction[] = [
  {
    id: "rs_implementar_pos",
    titulo: "Implementar POS restaurantero",
    descripcion: "Sistema POS con menú digital, control de inventario y reportes de ventas por plato y turno.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "rs_control_mermas_digit",
    titulo: "Digitalizar control de mermas",
    descripcion: "Registrar salidas de almacén por preparación y comparar con ventas reales para detectar pérdidas.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "rs_canal_directo_delivery",
    titulo: "Crear canal directo de delivery",
    descripcion: "Sitio web con pedido en línea o WhatsApp Business con catálogo, para reducir comisiones de apps.",
    presupuestoRequerido: "medio",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "rs_analizar_menu_rentab",
    titulo: "Analizar rentabilidad del menú",
    descripcion: "Calcular costo real de cada plato y clasificar por margen para decidir qué promover y qué quitar.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "rs_activar_google_business",
    titulo: "Activar y optimizar Google Business",
    descripcion: "Registrar el restaurante, subir fotos del menú y local, horarios, y responder reseñas activamente.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
  {
    id: "rs_crear_programa_lealtad",
    titulo: "Crear programa de lealtad simple",
    descripcion: "Tarjeta de puntos o app como Stocard que incentive la recompra y registre preferencias del cliente.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "rs_automatizar_compras",
    titulo: "Automatizar pedidos a proveedores",
    descripcion: "Configurar pedidos recurrentes con alertas de stock mínimo para evitar faltantes y excesos.",
    presupuestoRequerido: "bajo",
    impacto: "mediano_plazo",
    industryOnly: true,
  },
  {
    id: "rs_contenido_redes",
    titulo: "Crear estrategia de contenido en redes",
    descripcion: "Calendario semanal con fotos de platos, behind the scenes y promociones para generar interacción.",
    presupuestoRequerido: "bajo",
    impacto: "largo_plazo",
    industryOnly: true,
  },
  {
    id: "rs_reportes_diarios",
    titulo: "Implementar reportes diarios de ventas",
    descripcion: "Reporte automático con ventas por turno, plato y margen para tomar decisiones basadas en datos.",
    presupuestoRequerido: "bajo",
    impacto: "rapido",
    industryOnly: true,
  },
]

export const RESTAURANTE_PACK: KnowledgePack = {
  industryCode: "restaurante",
  industryLabel: "Restaurante / Alimentos",

  subsectors: {
    comida_rapida: "Comida rápida / Fast food",
    casual_dining: "Restaurante casual",
    cafeteria: "Cafetería / Café",
    food_truck: "Food truck",
    catering: "Catering / Eventos",
    reposteria: "Repostería / Panadería",
    bar: "Bar / Cantina",
    otro: "Otro restaurante",
  },

  diagnosticFocus: [
    "Control de mermas y costos de alimentos",
    "Gestión de inventario y compras a proveedores",
    "Rentabilidad por plato y estrategia de menú",
    "Canales de venta: local, delivery, eventos",
    "Experiencia del cliente y fidelización",
    "Gestión de personal y turnos",
  ],

  promptGuidance: `Este negocio es de RESTAURANTE / ALIMENTOS (restaurante, cafetería, food truck, catering, etc.).
NO trates este negocio como una consultoría, tienda o servicio profesional. NO menciones "horas facturables", "propuestas", "inventario de productos para venta" ni "portafolio".

DATOS DISPONIBLES en respuestas_branch (úsalos para personalizar):
- tipo_local: tipo de restaurante (comida_rapida, casual, cafeteria, food_truck, catering)
- como_tomas_pedidos: cómo toma pedidos (mesero, app, barra, telefono)
- que_platos_mas_venden: qué platos o categorías son los más vendidos
- tienes_delivery: si tiene delivery propio o solo apps
- como_manajas_proveedores: cómo gestiona compras (whatsapp, sistema, pedido_directo)
- Controla mermas y desperdicio de alimentos
- Analiza rentabilidad por plato
- Tiene canal de delivery propio o depende de apps

Enfócate en:
- Cómo controla costos de alimentos y mermas (usa que_platos_mas_venden)
- Cómo maneja inventario y compras a proveedores (usa como_manajas_proveedores)
- Su estrategia de menú y precios (rentabilidad por plato)
- Canales de venta: local, delivery, eventos (usa tienes_delivery, como_tomas_pedidos)
- Experiencia del cliente: reservaciones, servicio, fidelización
- Gestión de personal y turnos`,

  maturityDimensions: [
    {
      nombre: "Gestión de costos",
      descripcion: "Control de inventario, mermas y compras",
      niveles: [
        "Sin control, todo por instinto",
        "Registro manual en cuaderno o Excel",
        "Software de inventario básico",
        "POS con control de mermas y compras",
        "Sistema integrado con alertas y reportes automáticos",
      ],
    },
    {
      nombre: "Canales de venta",
      descripcion: "Venta en local, delivery y eventos",
      niveles: [
        "Solo venta en local",
        "Local + apps de delivery (Rappi, Uber Eats)",
        "Local + delivery propio (WhatsApp/web)",
        "Múltiples canales con menú unificado",
        "Omnicanal con pedidos en línea y eventos",
      ],
    },
    {
      nombre: "Experiencia del cliente",
      descripcion: "Atención, fidelización y presencia digital",
      niveles: [
        "Sin programa de fidelización ni presencia digital",
        "Google Business activo sin estrategia",
        "Redes sociales con contenido regular",
        "Programa de lealtad + reservaciones digitales",
        "Experiencia completa con datos y personalización",
      ],
    },
  ],

  benchmarks: [
    {
      metrica: "Costo de alimentos",
      valor: "28-35%",
      descripcion: "Porcentaje del ingreso que se va en ingredientes en un restaurante PYME",
    },
    {
      metrica: "Merma promedio",
      valor: "5-10%",
      descripcion: "Porcentaje de alimentos que se pierden en preparación y caducidad",
    },
    {
      metrica: "Ticket promedio",
      valor: "$12-30 USD",
      descripcion: "Gasto promedio por cliente en restaurantes PYME",
    },
    {
      metrica: "Tasa de ocupación",
      valor: "55-75%",
      descripcion: "Porcentaje de mesas ocupadas en horario pico",
    },
    {
      metrica: "Margen neto",
      valor: "8-15%",
      descripcion: "Margen neto típico en restaurantes PYME latinoamericanos",
    },
  ],


  symptoms,
  actions,

  fallbackDiagnosis: {
    texto:
      "Tu restaurante tiene oportunidades claras para mejorar el control de costos, reducir mermas y aumentar la rentabilidad por plato. Con herramientas digitales básicas puedes recuperar margen y atraer más clientes sin una gran inversión.",
    beneficios: [
      "Reduce mermas y desperdicio de alimentos",
      "Aumenta el margen con menú basado en datos",
      "Recupera revenue con canal de delivery propio",
    ],
    sugerencia:
      "Empieza por calcular el costo real de tus 5 platos más vendidos durante una semana. Ese dato solo te dará claridad sobre qué promover y qué ajustar.",
    plan: {
      dia_30: "Analiza rentabilidad de tu menú y activa Google Business",
      dia_60: "Implementa control de mermas y crea canal directo de delivery",
      dia_90: "Automatiza pedidos a proveedores y lanza programa de lealtad simple",
    },
  },
}
