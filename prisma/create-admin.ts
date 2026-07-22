import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4] || "Admin"

  if (!email || !password) {
    console.error("Uso: npx tsx prisma/create-admin.ts <email> <password> [nombre]")
    console.error("Ejemplo: npx tsx prisma/create-admin.ts admin@brujula.digital MiClav3Segura!")
    process.exit(1)
  }

  if (password.length < 8) {
    console.error("La contraseña debe tener al menos 8 caracteres.")
    process.exit(1)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.error(`Ya existe un usuario con el email: ${email}`)
    process.exit(1)
  }

  const password_hash = await hash(password, 12)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
      role: "superadmin",
      active: true,
    },
  })

  console.log(`\n  ✓ Admin creado: ${email}`)
  console.log(`    Rol: superadmin`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
