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
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Message Sequence</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              5-touch outreach for {personName}
            </p>
          </div>
          <button
            onClick={() => handleCopy(activeTab)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${copiedKey === activeTab 
                ? "bg-emerald-500/10 text-emerald-500" 
                : "bg-secondary text-foreground hover:bg-muted"
              }
            `}
          >
            {copiedKey === activeTab ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border scrollbar-none">
        {MESSAGE_CONFIG.map((config) => (
          <button
            key={config.key}
            onClick={() => setActiveTab(config.key)}
            className={`
              flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === config.key 
                ? "border-foreground text-foreground" 
                : "border-transparent text-muted-foreground hover:text-foreground"
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-xs text-muted-foreground mb-4">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {activeConfig.timing}
          </div>
        )}

        {/* Message text */}
        <div className="prose prose-sm prose-invert max-w-none">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {activeMessage}
          </p>
        </div>

        {/* Character count */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>{activeMessage.length} characters</span>
          <span>
            {activeTab === "connection_note" && activeMessage.length > 300 && (
              <span className="text-amber-500">Over 300 char limit for connection notes</span>
            )}
          </span>
        </div>
      </div>

      {/* Quick copy all section */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex flex-wrap gap-2">
          {MESSAGE_CONFIG.map((config) => (
            <button
              key={config.key}
              onClick={() => handleCopy(config.key)}
              className={`
                inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors
                ${copiedKey === config.key 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : "bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }
              `}
            >
              {copiedKey === config.key ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
