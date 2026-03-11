"use client"

import { useState } from "react"
import type { Research } from "./cold-call-generator"

interface ResearchPanelProps {
  research: Research
}

export function ResearchPanel({ research }: ResearchPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden h-fit animate-fade-in">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between border-b border-border hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Research Insights</h3>
            <p className="text-sm text-muted-foreground">
              {research.pain_points?.length || 0} pain points identified
            </p>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-5 space-y-6">
          {/* Company Overview */}
          {research.company_overview && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Company Overview
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {research.company_overview}
              </p>
            </div>
          )}

          {/* Pain Points */}
          {research.pain_points && research.pain_points.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Pain Points
              </h4>
              <ul className="space-y-2">
                {research.pain_points.map((pain, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3 text-sm text-foreground p-3 rounded-lg bg-amber-500/5 border border-amber-500/10"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-medium text-amber-400 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{pain}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          {research.tech_stack_signals && research.tech_stack_signals.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Tech Signals
              </h4>
              <div className="flex flex-wrap gap-2">
                {research.tech_stack_signals.map((tech, index) => (
                  <span 
                    key={index}
                    className="inline-flex px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent News */}
          {research.recent_news && research.recent_news.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Recent News
              </h4>
              <ul className="space-y-2">
                {research.recent_news.map((news, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                    <span className="leading-relaxed">{news}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Why It Fits */}
          {research.why_condense_fits && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Why We Fit
              </h4>
              <p className="text-sm text-foreground leading-relaxed p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                {research.why_condense_fits}
              </p>
            </div>
          )}

          {/* Conversation Hooks */}
          {research.conversation_hooks && research.conversation_hooks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Conversation Starters
              </h4>
              <ul className="space-y-2">
                {research.conversation_hooks.map((hook, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                    <span className="leading-relaxed">{hook}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence Score */}
          {research.confidence_score !== undefined && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground font-medium">Research Confidence</span>
                <span className={`font-bold ${
                  research.confidence_score >= 70 ? "text-emerald-400" : 
                  research.confidence_score >= 40 ? "text-amber-400" : "text-red-400"
                }`}>
                  {research.confidence_score}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-accent overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    research.confidence_score >= 70 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : 
                    research.confidence_score >= 40 ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-red-500 to-red-400"
                  }`}
                  style={{ width: `${research.confidence_score}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
