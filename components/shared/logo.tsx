import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, variant = "dark" }: { className?: string; variant?: "dark" | "light" }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/logo.svg"
        alt="Brújula"
        width={200}
        height={54}
        className="h-20 w-auto max-w-[100px] object-contain"
        priority
      />
    </div>
  )
}
