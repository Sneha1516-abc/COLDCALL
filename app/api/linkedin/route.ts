import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const API_KEY = process.env.GEMINI_API_KEY

  if (!API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured" },
      { status: 500 }
    )
  }

  try {
    const { linkedinUrl } = await request.json()

    if (!linkedinUrl) {
      return NextResponse.json(
        { error: "linkedinUrl is required" },
        { status: 400 }
      )
    }

    const slug = linkedinUrl
      .replace(/https?:\/\/(www\.)?linkedin\.com\/in\//i, "")
      .replace(/\//g, "")
      .trim()

    const prompt = `Search for the LinkedIn profile of this person: ${linkedinUrl}
Search query: "${slug} linkedin profile job title company"

Find their current job title, company, full name, industry, seniority level, and country/region.

Return ONLY this JSON object with no other text:
{"name":"Full Name","jobTitle":"Their exact job title","company":"Company name","industry":"Industry","seniority":"Engineer or Manager or VP or CTO or Head etc","region":"Country or City Country","confidence":80}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.3 },
        }),
      }
    )

    const data = await response.json()

    // Extract text from all parts
    const parts = data?.candidates?.[0]?.content?.parts || []
    const text = parts.map((p: { text?: string }) => p.text || "").join("")

    // Extract JSON from response
    let cleaned = text
      .replace(/<[^>]+>/g, "")
      .replace(/\*\*[^*]+\*\*/g, "")
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim()

    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}")

    if (start === -1 || end === -1) {
      return NextResponse.json(
        { error: "Could not extract profile info" },
        { status: 422 }
      )
    }

    const json = JSON.parse(cleaned.slice(start, end + 1))
    return NextResponse.json(json)

  } catch (error) {
    console.error("LinkedIn lookup error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
