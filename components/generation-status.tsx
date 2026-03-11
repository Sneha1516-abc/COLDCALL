"use client"

import type { GenerationState } from "./cold-call-generator"

interface GenerationStatusProps {
  state: GenerationState
  message: string
  error: string | null
}

export function GenerationStatus({ state, message, error }: GenerationStatusProps) {
  const getStatusConfig = () => {
    switch (state) {
      case "researching":
        return {
          icon: (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ),
          bgColor: "bg-blue-500/10",
          textColor: "text-blue-400",
          borderColor: "border-blue-500/30",
          label: "Researching",
        }
      case "generating":
        return {
          icon: (
            <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
          ),
          bgColor: "bg-cyan-500/10",
          textColor: "text-cyan-400",
          borderColor: "border-cyan-500/30",
          label: "Generating",
        }
      case "complete":
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgColor: "bg-emerald-500/10",
          textColor: "text-emerald-400",
          borderColor: "border-emerald-500/30",
          label: "Complete",
        }
      case "error":
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          ),
          bgColor: "bg-red-500/10",
          textColor: "text-red-400",
          borderColor: "border-red-500/30",
          label: "Error",
        }
      default:
        return {
          icon: null,
          bgColor: "bg-muted",
          textColor: "text-muted-foreground",
          borderColor: "border-border",
          label: "",
        }
    }
  }

  const config = getStatusConfig()

  if (state === "idle") return null

  return (
    <div 
      className={`
        flex items-center justify-center gap-3 p-4 rounded-xl border animate-fade-in
        ${config.bgColor} ${config.textColor} ${config.borderColor}
      `}
    >
      {config.icon}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="font-semibold text-sm">{config.label}</span>
        <span className="text-sm opacity-80">
          {error || message}
        </span>
      </div>
    </div>
  )
}
