import { cn } from "@/lib/utils"
import type React from "react"

interface OutlinedTextProps {
  children: React.ReactNode
  className?: string
  outlineColor?: string
  outlineWidth?: number
}

export function OutlinedText({ children, className, outlineColor = "black", outlineWidth = 1 }: OutlinedTextProps) {
  return (
    <span
      className={cn("relative inline-block", className)}
      style={{
        WebkitTextStroke: `${outlineWidth}px ${outlineColor}`,
        textShadow: "none",
        color: "transparent",
      }}
    >
      {children}
      <span className="absolute inset-0" aria-hidden="true">
        {children}
      </span>
    </span>
  )
}
