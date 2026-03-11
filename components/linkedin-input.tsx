"use client"

import { useState } from "react"

interface LinkedInInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  isLoading: boolean
  disabled: boolean
}

export function LinkedInInput({ 
  value, 
  onChange, 
  onGenerate, 
  isLoading, 
  disabled 
}: LinkedInInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const isValidUrl = value.includes("linkedin.com/in/")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidUrl && !disabled) {
      onGenerate()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        {/* Main input container */}
        <div 
          className={`
            relative flex items-center gap-2 p-2 rounded-2xl border bg-card transition-all duration-200
            ${isFocused ? "border-muted-foreground/40 shadow-lg shadow-background" : "border-border"}
            ${disabled ? "opacity-70" : ""}
          `}
        >
          {/* LinkedIn icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0A66C2] flex items-center justify-center ml-1">
            <svg 
              className="w-5 h-5 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>

          {/* Input field */}
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Paste LinkedIn profile URL..."
            disabled={disabled}
            className="flex-1 h-10 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm sm:text-base px-2"
          />

          {/* Generate button */}
          <button
            type="submit"
            disabled={!isValidUrl || disabled}
            className={`
              flex-shrink-0 h-10 px-5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2
              ${isValidUrl && !disabled 
                ? "bg-foreground text-background hover:bg-foreground/90" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
              }
            `}
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="hidden sm:inline">Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="hidden sm:inline">Generate Script</span>
              </>
            )}
          </button>
        </div>

        {/* Helper text */}
        <p className="mt-3 text-xs text-center text-muted-foreground">
          Enter a LinkedIn URL like{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-[11px]">
            linkedin.com/in/johndoe
          </code>
        </p>
      </div>
    </form>
  )
}
