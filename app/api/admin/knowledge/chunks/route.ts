import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { embed, toPgVectorLiteral } from "@/lib/rag/embeddings"

const PAGE_SIZE = 20

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const search = searchParams.get("search") || ""
    const industria = searchParams.get("industria") || ""
    const tipo = searchParams.get("tipo") || ""
    const fuente = searchParams.get("fuente") || ""

    const where: string[] = ["1=1"]
    const params: any[] = []
    let paramIdx = 1

    if (search) {
      where.push(`"contenido" ILIKE $${paramIdx}`)
      params.push(`%${search}%`)
      paramIdx++
    }
    if (industria) {
      where.push(`"industria" = $${paramIdx}`)
      params.push(industria)
      paramIdx++
    }
    if (tipo) {
      where.push(`"tipo" = $${paramIdx}`)
      params.push(tipo)
      paramIdx++
    }
    if (fuente) {
      where.push(`"fuente" = $${paramIdx}`)
      params.push(fuente)
      paramIdx++
    }

    const whereClause = where.join(" AND ")
    const offset = (page - 1) * PAGE_SIZE

    const [rows, countResult] = await Promise.all([
      prisma.$queryRawUnsafe<{ id: string; contenido: string; industria: string; segmento: string | null; tipo: string; fuente: string; activo: boolean; creadoEn: Date }[]>(
        `SELECT "id", "contenido", "industria", "segmento", "tipo", "fuente", "activo", "creadoEn"
         FROM "KnowledgeChunk"
         WHERE ${whereClause}
         ORDER BY "creadoEn" DESC
         LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        ...params,
        PAGE_SIZE,
        offset
      ),
      prisma.$queryRawUnsafe<{ total: bigint }[]>(
        `SELECT COUNT(*) as total FROM "KnowledgeChunk" WHERE ${whereClause}`,
        ...params
      ),
    ])

    return NextResponse.json({
      chunks: rows.map((r) => ({ ...r, creadoEn: r.creadoEn.toISOString() })),
      total: Number(countResult[0]?.total ?? 0),
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(Number(countResult[0]?.total ?? 0) / PAGE_SIZE),
    })
  } catch (error) {
    console.error("Error fetching chunks:", error)
    return NextResponse.json({ error: "Error al obtener chunks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contenido, industria, segmento, tipo } = body

    if (!contenido || !industria || !tipo) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: contenido, industria, tipo" },
        { status: 400 }
      )
    }

    const vector = await embed(contenido)
    const literal = toPgVectorLiteral(vector)

    const result = await prisma.$executeRawUnsafe(
      `INSERT INTO "KnowledgeChunk"
        ("id", "contenido", "embedding", "industria", "segmento", "tipo", "fuente", "activo")
       VALUES
        (gen_random_uuid()::text, $1, $2::vector, $3, $4, $5, 'manual', true)
       RETURNING "id"`,
      contenido,
      literal,
      industria,
      segmento || null,
      tipo
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating chunk:", error)
    return NextResponse.json({ error: "Error al crear chunk" }, { status: 500 })
  }
}
