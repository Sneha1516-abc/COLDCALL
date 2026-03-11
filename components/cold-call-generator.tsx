"use client"

import { useState } from "react"
import { LinkedInInput } from "./linkedin-input"
import { ScriptOutput } from "./script-output"
import { ResearchPanel } from "./research-panel"
import { GenerationStatus } from "./generation-status"

export type GenerationState = "idle" | "researching" | "generating" | "complete" | "error"

export interface PersonInfo {
  name: string
  jobTitle: string
  company: string
  industry?: string
  seniority?: string
  region?: string
  linkedinUrl?: string
}

export interface Research {
  company_overview: string
  tech_stack_signals: string[]
  pain_points: string[]
  recent_news: string[]
  why_condense_fits: string
  conversation_hooks: string[]
  confidence_score?: number
}

export interface GeneratedMessages {
  connection_note: string
  day0_message: string
  day3_followup: string
  day7_followup: string
  day14_followup: string
}

export function ColdCallGenerator() {
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [state, setState] = useState<GenerationState>("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [personInfo, setPersonInfo] = useState<PersonInfo | null>(null)
  const [research, setResearch] = useState<Research | null>(null)
  const [messages, setMessages] = useState<GeneratedMessages | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!linkedinUrl.trim()) return

    // Reset state
    setState("researching")
    setStatusMessage("Looking up LinkedIn profile...")
    setError(null)
    setPersonInfo(null)
    setResearch(null)
    setMessages(null)

    try {
      // Step 1: LinkedIn Lookup
      const profileRes = await fetch("/api/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl }),
      })

      if (!profileRes.ok) {
        throw new Error("Failed to lookup LinkedIn profile")
      }

      const profile = await profileRes.json()
      if (profile.error) throw new Error(profile.error)

      const person: PersonInfo = {
        name: profile.name || "Unknown",
        jobTitle: profile.jobTitle || "Unknown",
        company: profile.company || "Unknown",
        industry: profile.industry,
        seniority: profile.seniority,
        region: profile.region,
        linkedinUrl,
      }
      setPersonInfo(person)
      setStatusMessage(`Found ${person.name} at ${person.company}`)

      // Step 2: Deep Research
      setState("researching")
      setStatusMessage("Researching company and prospect...")

      const researchRes = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person }),
      })

      if (!researchRes.ok) {
        throw new Error("Failed to complete research")
      }

      const researchData = await researchRes.json()
      if (researchData.error) throw new Error(researchData.error)

      setResearch(researchData)
      setStatusMessage(`Found ${researchData.pain_points?.length || 0} pain points`)

      // Step 3: Generate Messages
      setState("generating")
      setStatusMessage("Crafting personalized messages...")

      const messagesRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, research: researchData }),
      })

      if (!messagesRes.ok) {
        throw new Error("Failed to generate messages")
      }

      const generatedMessages = await messagesRes.json()
      if (generatedMessages.error) throw new Error(generatedMessages.error)

      setMessages(generatedMessages)
      setState("complete")
      setStatusMessage("Your scripts are ready!")

    } catch (err) {
      console.error("Generation error:", err)
      setState("error")
      setError(err instanceof Error ? err.message : "Something went wrong")
      setStatusMessage("Generation failed")
    }
  }

  const handleReset = () => {
    setState("idle")
    setLinkedinUrl("")
    setPersonInfo(null)
    setResearch(null)
    setMessages(null)
    setError(null)
    setStatusMessage("")
  }

  return (
    <section id="generator" className="py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <LinkedInInput
            value={linkedinUrl}
            onChange={setLinkedinUrl}
            onGenerate={handleGenerate}
            isLoading={state === "researching" || state === "generating"}
            disabled={state === "researching" || state === "generating"}
          />
          
          {/* Status indicator */}
          {state !== "idle" && (
            <div className="mt-8">
              <GenerationStatus 
                state={state}
                message={statusMessage}
                error={error}
              />
            </div>
          )}
        </div>

        {/* Results Section */}
        {(personInfo || research || messages) && (
          <div className="space-y-8">
            {/* Person info card */}
            {personInfo && (
              <div className="p-5 rounded-2xl bg-card border border-border animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20">
                    {personInfo.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{personInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {personInfo.jobTitle} at {personInfo.company}
                    </p>
                    {personInfo.region && (
                      <p className="text-xs text-muted-foreground/70 mt-1">{personInfo.region}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Two column layout for research and output */}
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Research Panel */}
              {research && (
                <div className="lg:col-span-2">
                  <ResearchPanel research={research} />
                </div>
              )}

              {/* Script Output */}
              {messages && (
                <div className="lg:col-span-3">
                  <ScriptOutput 
                    messages={messages} 
                    personName={personInfo?.name || "Prospect"}
                  />
                </div>
              )}
            </div>

            {/* Reset button */}
            {state === "complete" && (
              <div className="text-center pt-6">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-ring/40 hover:bg-accent/50 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Generate for another prospect
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
