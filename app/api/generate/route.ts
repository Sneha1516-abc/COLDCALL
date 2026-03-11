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

interface Research {
  company_overview: string
  tech_stack_signals: string[]
  pain_points: string[]
  recent_news: string[]
  why_condense_fits: string
  conversation_hooks: string[]
  confidence_score?: number
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
    const { person, research } = await request.json() as { person: Person; research: Research }

    if (!person || !research) {
      return NextResponse.json(
        { error: "Person and research data are required" },
        { status: 400 }
      )
    }

    const prompt = `You are crafting personalized LinkedIn sales messages.

TARGET PROSPECT:
Name: ${person.name}
Role: ${person.jobTitle}
Company: ${person.company}
LinkedIn: ${person.linkedinUrl || "not provided"}
Seniority: ${person.seniority || "infer from title"}
Region: ${person.region || "Unknown"}

RESEARCH-BACKED CONTEXT:
Company Overview: ${research.company_overview}
Tech Stack Signals: ${(research.tech_stack_signals || []).join(", ")}
Pain Points Identified: ${(research.pain_points || []).join(" | ")}
Recent News: ${(research.recent_news || []).join(" | ")}
Why Our Solution Fits: ${research.why_condense_fits}
Conversation Hooks: ${(research.conversation_hooks || []).join(" | ")}

INSTRUCTIONS:
Create a 5-message outreach sequence. Each message should be:
- Personalized with specific details from the research
- Professional but warm in tone
- Focused on their specific challenges
- Include a clear call-to-action

1. connection_note: MAX 300 chars. Warm, curiosity-driven. Reference 1 specific thing about their role/company. No pitch yet.
2. day0_message: 80-120 words. Open with a conversation hook. Name their specific pain. One clear CTA: schedule a 30 min call.
3. day3_followup: 50-80 words. Different angle. Reference a tech signal or news item. Keep door open.
4. day7_followup: 30-50 words. Softer. Just ask for 30 mins or their email. No hard sell.
5. day14_followup: 20-35 words. Final gentle nudge. Keep door open.

Return ONLY this JSON:
{
  "connection_note": "...",
  "day0_message": "...",
  "day3_followup": "...",
  "day7_followup": "...",
  "day14_followup": "..."
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { 
            maxOutputTokens: 1500, 
            temperature: 0.8,
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
      // Return fallback messages
      return NextResponse.json({
        connection_note: `Hi ${person.name}, I came across your profile while researching ${person.company}. Would love to connect and learn more about your work in ${person.jobTitle}.`,
        day0_message: `Hi ${person.name}, thanks for connecting! I noticed ${person.company} is doing interesting work. Given your role as ${person.jobTitle}, I thought you might be interested in how we help teams like yours streamline their data operations. Would you be open to a quick 30-minute call to explore potential synergies?`,
        day3_followup: `Hi ${person.name}, just circling back on my previous message. I'd love to share some insights on how companies similar to ${person.company} are tackling data challenges. Let me know if you'd be interested in a brief chat.`,
        day7_followup: `Hi ${person.name}, I know you're busy - just wanted to check if you'd have 30 minutes this week or next to connect? Happy to work around your schedule.`,
        day14_followup: `Hi ${person.name}, last note from me - would love to connect when timing works better for you. Feel free to reach out anytime.`
      })
    }

    const json = JSON.parse(cleaned.slice(start, end + 1))
    return NextResponse.json(json)

  } catch (error) {
    console.error("Generate error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
