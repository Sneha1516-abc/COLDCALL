import { NextRequest, NextResponse } from "next/server"

interface Person {
  name: string
  jobTitle: string
  company: string
  linkedinUrl?: string
  industry?: string
  seniority?: string
  region?: string
}

export async function POST(request: NextRequest) {
  const API_KEY = process.env.GEMINI_API_KEY

  if (!API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured" },
      { status: 500 }
    )
  }

  try {
    const { person } = await request.json() as { person: Person }

    if (!person?.company) {
      return NextResponse.json(
        { error: "Person with company is required" },
        { status: 400 }
      )
    }

    const researchPrompt = `You are a B2B sales research agent.

Research this target prospect:
- Person: ${person.name} (${person.jobTitle})
- Company: ${person.company}
- LinkedIn: ${person.linkedinUrl || "not provided"}

Use web search to find:
1. What ${person.company} does and their tech stack (search for "${person.company} tech stack" and "${person.company} engineering blog")
2. Job postings mentioning Kafka, Spark, data pipelines, streaming (search "${person.company} data engineer jobs")
3. Recent news — funding, product launches, expansions (search "${person.company} news 2024 2025")
4. Any data/engineering challenges public (search "${person.company} engineering challenges")

After searching, respond with ONLY this JSON and nothing else:
{
  "company_overview": "2-3 sentence summary of what they do and their scale",
  "tech_stack_signals": ["signal 1", "signal 2", "signal 3"],
  "pain_points": ["specific pain 1", "specific pain 2", "specific pain 3", "specific pain 4"],
  "recent_news": ["news item 1", "news item 2"],
  "why_condense_fits": "2-3 sentence pitch specific to their situation",
  "conversation_hooks": ["specific hook 1", "specific hook 2"],
  "confidence_score": 80
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: researchPrompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { 
            maxOutputTokens: 2000, 
            temperature: 0.7,
            responseMimeType: "application/json"
          },
        }),
      }
    )

    const data = await response.json()

    // Extract text
    const parts = data?.candidates?.[0]?.content?.parts || []
    const text = parts.map((p: { text?: string }) => p.text || "").join("")

    // Clean and parse JSON
    let cleaned = text
      .replace(/<[^>]+>/g, "")
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim()

    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}")

    if (start === -1 || end === -1) {
      // Return fallback research
      return NextResponse.json({
        company_overview: `${person.company} is a company where ${person.name} works as ${person.jobTitle}.`,
        tech_stack_signals: ["Cloud infrastructure", "Data pipelines", "Microservices"],
        pain_points: [
          "Data infrastructure scalability",
          "Real-time processing requirements",
          "Integration complexity",
          "Operational overhead"
        ],
        recent_news: ["No recent news found"],
        why_condense_fits: "Our platform can help streamline data operations and reduce infrastructure complexity.",
        conversation_hooks: [
          `Your role as ${person.jobTitle} likely involves managing complex data workflows`,
          "Many teams in your position are looking for ways to simplify their data stack"
        ],
        confidence_score: 40
      })
    }

    const json = JSON.parse(cleaned.slice(start, end + 1))
    return NextResponse.json(json)

  } catch (error) {
    console.error("Research error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
