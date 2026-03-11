"use client"

import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                />
              </svg>
            </div>
            <span className="font-bold text-lg text-foreground">ColdCall AI</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link 
              href="#generator" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Generator
            </Link>
            <Link 
              href="#features" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Features
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex h-10 items-center justify-center rounded-xl border border-border bg-transparent px-5 text-sm font-medium text-foreground hover:bg-accent hover:border-ring/30 transition-all">
              Sign In
            </button>
            <button className="h-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 text-sm font-medium text-white hover:opacity-90 transition-opacity inline-flex shadow-lg shadow-blue-500/20">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
