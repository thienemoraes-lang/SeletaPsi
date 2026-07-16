import React from "react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary flex-shrink-0"
        style={{ transform: "rotate(-90deg)" }}
      >
        <path 
          d="M16 28C16 28 4 20 4 11.5C4 7.35786 7.35786 4 11.5 4C13.9845 4 16 6 16 6C16 6 18.0155 4 20.5 4C24.6421 4 28 7.35786 28 11.5C28 20 16 28 16 28Z" 
          fill="currentColor"
        />
        {/* Abstract lines inside to suggest fingers/fists interlocking */}
        <path 
          d="M11 12C11 12 14 16 16 16C18 16 21 12 21 12" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M9 16C9 16 13.5 20.5 16 20.5C18.5 20.5 23 16 23 16" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-bold text-xl tracking-tight text-secondary" style={{ letterSpacing: "-0.03em" }}>
        Seletapsi
      </span>
    </div>
  )
}
