"use client"

import { useState } from "react"
import type { GeneratedMessages } from "./cold-call-generator"

interface ScriptOutputProps {
  messages: GeneratedMessages
  personName: string
}

type MessageKey = keyof GeneratedMessages

const MESSAGE_CONFIG: { key: MessageKey; label: string; timing: string }[] = [
  { key: "connection_note", label: "Connection Note", timing: "Send when connecting" },
  { key: "day0_message", label: "First Message", timing: "After they accept" },
  { key: "day3_followup", label: "Follow-up #1", timing: "Day 3" },
  { key: "day7_followup", label: "Follow-up #2", timing: "Day 7" },
  { key: "day14_followup", label: "Follow-up #3", timing: "Day 14" },
]

export function ScriptOutput({ messages, personName }: ScriptOutputProps) {
  const [activeTab, setActiveTab] = useState<MessageKey>("connection_note")
  const [copiedKey, setCopiedKey] = useState<MessageKey | null>(null)

  const handleCopy = async (key: MessageKey) => {
    const text = messages[key]
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const activeMessage = messages[activeTab]
  const activeConfig = MESSAGE_CONFIG.find(c => c.key === activeTab)

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-5 border-b border-border bg-accent/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Message Sequence</h3>
            <p className="text-sm text-muted-foreground mt-1">
              5-touch outreach for {personName}
            </p>
          </div>
          <button
            onClick={() => handleCopy(activeTab)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${copiedKey === activeTab 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                : "bg-accent border border-border text-foreground hover:border-ring/40"
              }
            `}
          >
            {copiedKey === activeTab ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border scrollbar-none bg-card">
        {MESSAGE_CONFIG.map((config) => (
          <button
            key={config.key}
            onClick={() => setActiveTab(config.key)}
            className={`
              flex-shrink-0 px-5 py-3.5 text-sm font-medium border-b-2 transition-all duration-200
              ${activeTab === config.key 
                ? "border-blue-500 text-foreground bg-accent/50" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/30"
              }
            `}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Timing badge */}
        {activeConfig && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-border text-xs font-medium text-muted-foreground mb-5">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {activeConfig.timing}
          </div>
        )}

        {/* Message text */}
        <div className="prose prose-sm prose-invert max-w-none">
          <p className="text-foreground leading-7 whitespace-pre-wrap text-base">
            {activeMessage}
          </p>
        </div>

        {/* Character count */}
        <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium">{activeMessage.length} characters</span>
          <span>
            {activeTab === "connection_note" && activeMessage.length > 300 && (
              <span className="text-amber-400 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Over 300 char limit
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Quick copy all section */}
      <div className="p-4 border-t border-border bg-accent/20">
        <p className="text-xs text-muted-foreground mb-3 font-medium">Quick copy all messages:</p>
        <div className="flex flex-wrap gap-2">
          {MESSAGE_CONFIG.map((config) => (
            <button
              key={config.key}
              onClick={() => handleCopy(config.key)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                ${copiedKey === config.key 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-ring/40"
                }
              `}
            >
              {copiedKey === config.key ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              {config.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
