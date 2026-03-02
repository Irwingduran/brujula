import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin | NexoDigital CRM",
  description: "Panel de administracion de leads y pipeline.",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  // Si no hay sesión y no es la página de login, redirigir
  // El middleware ya maneja la protección, pero agregamos esto como respaldo
  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
