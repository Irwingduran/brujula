import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [porIndustria, porTipo, porFuente, total, pendientes] = await Promise.all([
      prisma.$queryRawUnsafe<{ industria: string; total: bigint }[]>(
        `SELECT industria, COUNT(*) as total FROM "KnowledgeChunk" WHERE activo = true GROUP BY industria ORDER BY industria`
      ),
      prisma.$queryRawUnsafe<{ tipo: string; total: bigint }[]>(
        `SELECT tipo, COUNT(*) as total FROM "KnowledgeChunk" WHERE activo = true GROUP BY tipo ORDER BY tipo`
      ),
      prisma.$queryRawUnsafe<{ fuente: string; total: bigint }[]>(
        `SELECT fuente, COUNT(*) as total FROM "KnowledgeChunk" WHERE activo = true GROUP BY fuente ORDER BY fuente`
      ),
      prisma.$queryRawUnsafe<{ total: bigint }[]>(
        `SELECT COUNT(*) as total FROM "KnowledgeChunk" WHERE activo = true`
      ),
      prisma.$queryRawUnsafe<{ total: bigint }[]>(
        `SELECT COUNT(*) as total FROM "KnowledgeChunk" WHERE fuente = 'auto_generado' AND activo = true`
      ),
    ])

    return NextResponse.json({
      total: Number(total[0]?.total ?? 0),
      pendientesRevision: Number(pendientes[0]?.total ?? 0),
      porIndustria: porIndustria.map((r) => ({ industria: r.industria, total: Number(r.total) })),
      porTipo: porTipo.map((r) => ({ tipo: r.tipo, total: Number(r.total) })),
      porFuente: porFuente.map((r) => ({ fuente: r.fuente, total: Number(r.total) })),
    })
  } catch (error) {
    console.error("Error fetching coverage:", error)
    return NextResponse.json({ error: "Error al obtener cobertura" }, { status: 500 })
  }
}
