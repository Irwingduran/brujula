import { prisma } from "@/lib/prisma"
import { UsersTable } from "./users-table"

export const dynamic = "force-dynamic"

export default async function UsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      created_at: true,
      last_login_at: true,
    },
  })

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {users.length} usuario{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <UsersTable users={users} />
    </div>
  )
}
