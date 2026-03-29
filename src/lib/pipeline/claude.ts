import Anthropic from '@anthropic-ai/sdk'
import { RawArticle, ExtractedProblem } from './types'

const SYSTEM_PROMPT = `You are a problem extraction specialist for optimism.fun, a platform inspired by David Deutsch's critical rationalism applied to economics and entrepreneurship.

Your job: identify real-world problems from news articles and research that represent entrepreneurial opportunities for humanity.

Core principles (David Deutsch):
- All problems are soluble given the right knowledge
- Problems are inevitable  - they never stop coming
- If physics doesn't forbid it, it's achievable with the right knowledge
- Progress comes from good explanations and error correction

For each article that describes a genuine problem, extract:
- title: A clear, canonical problem statement (NOT the article headline). Use a consistent naming convention so the same problem from different sources gets the same title.
- description: 2-3 sentences explaining the problem, its scale, and why it matters
- category: EXACTLY one of: Health, Climate, Education, Technology, Governance, Economy, Energy, Food, Water, Infrastructure, Space, Biology
- severity_score (1-10): How severe is this problem right now? 10 = existential/catastrophic
- opportunity_score (1-10): How much market/entrepreneurial opportunity does solving it represent? 10 = trillion-dollar market
- solvability_score (1-10): How solvable with current or near-future technology? (Deutsch: if physics doesn't forbid it, it's achievable  - but some problems need more knowledge creation than others)
- affected_population: Who is affected, be specific (e.g., "2 billion people in South Asia", "all internet users")
- location: Where (e.g., "Global", "Sub-Saharan Africa", "United States")

SKIP articles that are:
- Pure opinion without a concrete problem
- Celebrity news or entertainment
- Already-solved problems being celebrated
- Too vague to be actionable

Return ONLY a JSON array of extracted problems. If no articles contain valid problems, return an empty array [].`

export async function extractProblems(articles: RawArticle[]): Promise<ExtractedProblem[]> {
  if (articles.length === 0) return []

  const client = new Anthropic()
  const allProblems: ExtractedProblem[] = []

  // Process in batches of 8 articles
  const batchSize = 8
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize)

    const articlesText = batch
      .map((a, idx) => `--- Article ${idx + 1} ---\nTitle: ${a.title}\nSource: ${a.source_name}\nURL: ${a.url}\n\n${a.description}`)
      .join('\n\n')

    try {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Extract problems from these ${batch.length} articles:\n\n${articlesText}`,
          },
        ],
      })

      const textBlock = response.content.find(b => b.type === 'text')
      if (!textBlock || textBlock.type !== 'text') continue

      // Parse JSON from response  - handle markdown code blocks
      let jsonStr = textBlock.text.trim()
      const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim()
      }

      const parsed = JSON.parse(jsonStr)
      if (!Array.isArray(parsed)) continue

      for (const p of parsed) {
        // Validate required fields and score ranges
        if (
          !p.title || !p.description || !p.category ||
          typeof p.severity_score !== 'number' ||
          typeof p.opportunity_score !== 'number' ||
          typeof p.solvability_score !== 'number'
        ) continue

        allProblems.push({
          title: String(p.title).slice(0, 500),
          description: String(p.description).slice(0, 2000),
          category: String(p.category),
          severity_score: Math.min(10, Math.max(1, Math.round(p.severity_score))),
          opportunity_score: Math.min(10, Math.max(1, Math.round(p.opportunity_score))),
          solvability_score: Math.min(10, Math.max(1, Math.round(p.solvability_score))),
          affected_population: String(p.affected_population || 'Unknown').slice(0, 200),
          location: String(p.location || 'Global').slice(0, 200),
          source_url: batch[0]?.url || '',
          source_name: batch[0]?.source_name || 'Unknown',
        })
      }
    } catch (err) {
      console.error(`Claude extraction error for batch starting at ${i}:`, err)
    }
  }

  return allProblems
}
