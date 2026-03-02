"use client"

import { motion } from "framer-motion"
import { Cog, BarChart3, TrendingUp, Globe, Search, Headphones, AlertTriangle } from "lucide-react"

const PAINS = [
  {
    icon: Cog,
    title: "Procesos manuales",
    description: "Gastas horas en tareas repetitivas que podrían automatizarse fácilmente.",
    stat: "15h/semana",
    statLabel: "promedio perdidas",
    size: "large",
  },
  {
    icon: BarChart3,
    title: "Sin visibilidad",
    description: "Tomas decisiones a ciegas porque no tienes datos claros de tu negocio.",
    stat: "73%",
    statLabel: "sin métricas",
    size: "small",
  },
  {
    icon: TrendingUp,
    title: "Ventas estancadas",
    description: "Tus ventas no crecen y no sabes qué palancas mover para cambiar eso.",
    stat: "2 de 3",
    statLabel: "negocios afectados",
    size: "small",
  },
  {
    icon: Globe,
    title: "Presencia online débil",
    description: "Tus clientes están en internet pero tu negocio no los está alcanzando.",
    stat: "60%",
    statLabel: "clientes online",
    size: "medium",
  },
  {
    icon: Search,
    title: "Sin trazabilidad",
    description: "No puedes rastrear pedidos, clientes o inventario de forma confiable.",
    stat: "5h",
    statLabel: "buscando datos",
    size: "medium",
  },
  {
    icon: Headphones,
    title: "Atención al cliente",
    description: "Responder a clientes toma demasiado tiempo y pierdes oportunidades.",
    stat: "48h",
    statLabel: "tiempo de respuesta",
    size: "large",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

export function PainPoints() {
  return (
    <section className="relative px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive">
            <AlertTriangle className="h-4 w-4" />
            ¿Te identificas?
          </span>
          <h2 className="mt-4 text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Problemas que frenan tu crecimiento
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-pretty text-muted-foreground md:text-lg">
            Estos son los desafíos más comunes que enfrentan negocios como el tuyo. 
            ¿Cuántos reconoces?
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-12 grid gap-4 md:grid-cols-6 md:grid-rows-2"
        >
          {PAINS.map((pain, i) => (
            <motion.div
              key={pain.title}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-destructive/30 hover:shadow-lg ${
                pain.size === "large" ? "md:col-span-2 md:row-span-1" : 
                pain.size === "medium" ? "md:col-span-2" : "md:col-span-2"
              }`}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative">
                {/* Icon + Stat row */}
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-transform duration-300 group-hover:scale-110">
                    <pain.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{pain.stat}</div>
                    <div className="text-xs text-muted-foreground">{pain.statLabel}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-4 font-sans text-lg font-semibold text-foreground">
                  {pain.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pain.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-foreground">
                La buena noticia
              </div>
              <div className="text-sm text-muted-foreground">
                Todos estos problemas tienen solución. Descúbrela en tu diagnóstico.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
