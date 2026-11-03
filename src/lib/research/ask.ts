import { excludeDomains, PRIORITY_QUERY_HINT } from '@/lib/research/domains'
import { resolvePaperMetadata } from '@/lib/research/metadata'
import { isExcludedUrl, isMirrorUrl } from '@/lib/research/domains'
import { normalizeTitle, validateQuestion, workKey } from '@/lib/research/papers'
import {
  readSource,
  shapeResearchAnswer,
  type CoverageLink,
  type PaperMeta,
  type ResearchPaper,
  type ShapedResearch,
  type SourceFields,
} from '@/lib/research/shape'
import { ExaRequestError, exaPost, isExaConfigured } from '@/lib/sources/exa'

export const SEARCH_TIMEOUT_MS = 20_000
export const ANSWER_TIMEOUT_MS = 28_000
export const SIMILAR_TIMEOUT_MS = 20_000
export const SEARCH_RESULTS = 10
export const SIMILAR_RESULTS = 8

const CONTENTS = {
  text: { maxCharacters: 4000 },
  highlights: { maxCharacters: 2000 },
  summary: {
    query: 'Summarize only what this page itself states. Do not add findings from other sources.',
  },
} as const

export const ANSWER_SYSTEM = [
  'You answer questions for researchers.',
  'Every factual sentence must be supported by a source whose text, highlights, or summary you were given.',
  'Return JSON matching the schema.',
  'sentences[].text is one claim.',
  'sentences[].urls lists only the URLs that support that claim.',
  'The bracket number in a claim is the number in the source list below. [1] is the first source in that list.',
  'Cite a source only when its excerpt supports the sentence.',
  'State the population in every finding: sex, condition, and sample size when the source gives them.',
  'Label a subgroup, cumulative, or secondary result as such. Do not present it as the overall finding.',
  'When only one meta-analysis is cited, call it a meta-analysis.',
  'Name the outcome that was measured, such as clamp, HOMA-IR, OGTT, fasting glucose, or HbA1c, instead of saying only insulin sensitivity.',
  'If the question is about intermittent fasting in general and the sources only study time-restricted eating, say that the evidence is from time-restricted eating.',
  'If a sentence has no supporting source, omit it.',
  'Do not cite news, press releases, ResearchGate, Academia.edu, Wikipedia, or other excluded domains as evidence.',
  'Do not invent numbers, authors, methods, or findings.',
  'Preprints may be used. Do not describe a preprint as peer reviewed.',
].join(' ')

const ANSWER_SCHEMA = {
  type: 'object',
  description: 'Claims with the source URLs that support them.',
  additionalProperties: false,
  required: ['sentences'],
  properties: {
    sentences: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['text', 'urls'],
        properties: {
          text: { type: 'string' },
          urls: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
} as const

export type ExaPoster = (path: string, body: unknown, timeoutMs: number) => Promise<unknown>
export type MetaResolver = (fields: SourceFields) => Promise<PaperMeta>

export type AskResponse =
  | { configured: false }
  | ({
      configured: true
      question: string
      error?: string
    } & ShapedResearch)

export type SimilarResponse =
  | { configured: false }
  | {
      configured: true
      url: string
      papers: ResearchPaper[]
      coverage: CoverageLink[]
      retracted: ResearchPaper[]
      error?: string
    }

type Deps = {
  exaPost: ExaPoster
  resolve: MetaResolver
  now: Date
}

function depsFrom(partial?: Partial<Deps>): Deps {
  return {
    exaPost: partial?.exaPost ?? exaPost,
    resolve: partial?.resolve ?? ((fields) => resolvePaperMetadata(fields)),
    now: partial?.now ?? new Date(),
  }
}

export function redactSecrets(message: string): string {
  const key = process.env.EXA_API_KEY
  if (!key || key.length < 8) return message
  return message.split(key).join('[redacted]')
}

export function searchBody(question: string): Record<string, unknown> {
  return {
    query: `${question}\n\n${PRIORITY_QUERY_HINT}`,
    type: 'auto',
    category: 'research paper',
    numResults: SEARCH_RESULTS,
    excludeDomains: excludeDomains(),
    contents: CONTENTS,
  }
}

export function similarBody(url: string): Record<string, unknown> {
  return {
    url,
    category: 'research paper',
    numResults: SIMILAR_RESULTS,
    excludeDomains: excludeDomains(),
    contents: CONTENTS,
  }
}

function emptyShape(): ShapedResearch {
  return { sentences: [], uncited: [], citations: [], retrieved: [], coverage: [], retracted: [] }
}

function readResults(payload: unknown): SourceFields[] {
  const results = payload && typeof payload === 'object' ? (payload as { results?: unknown }).results : null
  if (!Array.isArray(results)) return []
  return results.map(readSource).filter((row): row is SourceFields => Boolean(row))
}

function readAnswer(payload: unknown): { answer: unknown; citations: SourceFields[] } {
  const row = payload && typeof payload === 'object' ? (payload as { answer?: unknown; citations?: unknown }) : {}
  const citations = Array.isArray(row.citations)
    ? row.citations.map(readSource).filter((item): item is SourceFields => Boolean(item))
    : []
  return { answer: row.answer, citations }
}

async function metaMap(papers: SourceFields[], resolve: MetaResolver): Promise<Record<string, PaperMeta>> {
  const rows = await Promise.all(papers.map(async (paper) => ({ paper, meta: await resolve(paper) })))
  const map: Record<string, PaperMeta> = {}
  for (const { paper, meta } of rows) {
    const doi = meta.doi ?? paper.doi ?? null
    const pmid = meta.pmid ?? paper.pmid ?? null
    const enriched = { ...paper, doi, pmid }
    map[workKey(enriched)] = meta
    map[workKey(paper)] = meta
    map[paper.url] = meta
    if (doi) map[`doi:${doi.toLowerCase()}`] = meta
    if (pmid) map[`pmid:${pmid}`] = meta
  }
  return map
}

function applyMeta(papers: SourceFields[], map: Record<string, PaperMeta>): SourceFields[] {
  return papers.map((paper) => {
    const meta = map[paper.url] ?? map[workKey(paper)] ?? {}
    return {
      ...paper,
      doi: meta.doi ?? paper.doi ?? null,
      pmid: meta.pmid ?? paper.pmid ?? null,
    }
  })
}

const CHECK_SCHEMA = {
  type: 'object',
  description: 'Whether each numbered sentence is supported by its cited excerpt.',
  additionalProperties: false,
  required: ['checks'],
  properties: {
    checks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['n', 'supported'],
        properties: {
          n: { type: 'integer' },
          supported: { type: 'boolean' },
        },
      },
    },
  },
} as const

export function readSupportChecks(payload: unknown): { n: number; supported: boolean }[] | null {
  const answer = payload && typeof payload === 'object' && 'answer' in (payload as object)
    ? (payload as { answer: unknown }).answer
    : payload
  const checks = answer && typeof answer === 'object' ? (answer as { checks?: unknown }).checks : null
  if (!Array.isArray(checks)) return null
  const out: { n: number; supported: boolean }[] = []
  for (const row of checks) {
    if (!row || typeof row !== 'object') continue
    const n = (row as { n?: unknown }).n
    const supported = (row as { supported?: unknown }).supported
    if (typeof n === 'number' && typeof supported === 'boolean') out.push({ n, supported })
  }
  return out
}

function resolvablePaper(paper: { url: string; doi?: string | null; pmid?: string | null; text?: string | null; summary?: string | null }): boolean {
  return workKey(paper).startsWith('doi:') || workKey(paper).startsWith('pmid:') || workKey(paper).startsWith('arxiv:')
}

async function verifyShaped(
  question: string,
  shaped: ShapedResearch,
  exaPost: ExaPoster,
): Promise<ShapedResearch & { error?: string }> {
  if (shaped.sentences.length === 0) return shaped
  const lines = shaped.sentences.map((sentence, index) => {
    const excerpts = sentence.cites
      .map((n) => {
        const paper = shaped.citations.find((item) => item.n === n)
        const excerpt = (paper?.excerpt || '').slice(0, 1200)
        return excerpt ? `Source [${n}] excerpt: ${excerpt}` : `Source [${n}] has no excerpt.`
      })
      .join('\n')
    return `Sentence ${index + 1}: ${sentence.text}\n${excerpts}`
  })
  try {
    const payload = await exaPost(
      '/answer',
      {
        query: `Question: ${question}\n\nCheck each sentence against only the excerpt of the source it cites.\n\n${lines.join('\n\n')}`,
        stream: false,
        text: false,
        model: 'exa',
        systemPrompt:
          'You check claims against the cited excerpt. supported is true only when that excerpt states the finding for the population and the named outcome. Do not add claims. Return JSON matching the schema.',
        outputSchema: CHECK_SCHEMA,
      },
      ANSWER_TIMEOUT_MS,
    )
    const checks = readSupportChecks(payload)
    if (!checks) {
      return {
        ...shaped,
        sentences: [],
        citations: [],
        error: 'The abstract check did not finish, so those claims are not shown.',
      }
    }
    const supported = new Map(checks.map((check) => [check.n, check.supported]))
    const sentences = shaped.sentences.filter((_, index) => supported.get(index + 1) === true)
    const used = new Set(sentences.flatMap((sentence) => sentence.cites))
    return {
      ...shaped,
      sentences,
      citations: shaped.citations.filter((paper) => paper.n != null && used.has(paper.n)),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'The abstract check did not finish, so those claims are not shown.'
    return { ...shaped, sentences: [], citations: [], error: redactSecrets(message) }
  }
}

function answerQuery(question: string, papers: SourceFields[]): string {
  const lines = papers.slice(0, SEARCH_RESULTS).map((paper, index) => {
    const excerpt = (paper.summary || paper.highlights?.join('\n') || paper.text || '').slice(0, 1200)
    return `[${index + 1}] ${paper.title ?? 'Untitled'}\nURL: ${paper.url}\nExcerpt: ${excerpt}`
  })
  return [
    `Question: ${question}`,
    '',
    'Use only these retrieved sources, and only when the excerpt supports the claim. Copy the source URL into sentences[].urls.',
    '',
    lines.join('\n\n'),
  ].join('\n')
}

export function parsePaperUrl(raw: unknown): { ok: true; url: string } | { ok: false; error: string } {
  if (typeof raw !== 'string') return { ok: false, error: 'Paste a paper URL.' }
  const trimmed = raw.trim()
  if (!trimmed || trimmed.length > 2048) return { ok: false, error: 'Paste a paper URL up to 2048 characters.' }
  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return { ok: false, error: 'That is not a valid paper URL.' }
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: 'Paper URL must start with http or https.' }
  }
  if (isExcludedUrl(url.toString())) {
    return { ok: false, error: 'That domain is excluded and cannot be used as a paper source.' }
  }
  return { ok: true, url: url.toString() }
}

export async function askResearch(question: string, partial?: Partial<Deps>): Promise<AskResponse> {
  if (!isExaConfigured()) return { configured: false }
  const deps = depsFrom(partial)
  let found: SourceFields[] = []
  try {
    const searched = await deps.exaPost('/search', searchBody(question), SEARCH_TIMEOUT_MS)
    found = readResults(searched).slice(0, SEARCH_RESULTS)
  } catch (err) {
    const message = err instanceof ExaRequestError ? err.message : err instanceof Error ? err.message : 'Exa request failed.'
    return { configured: true, question, error: redactSecrets(message), ...emptyShape() }
  }
  try {
    const [answered, foundMeta] = await Promise.all([
      deps.exaPost(
        '/answer',
        {
          query: answerQuery(question, found),
          stream: false,
          text: true,
          model: 'exa',
          systemPrompt: ANSWER_SYSTEM,
          outputSchema: ANSWER_SCHEMA,
        },
        ANSWER_TIMEOUT_MS,
      ),
      metaMap(found, deps.resolve),
    ])
    const answer = readAnswer(answered)
    const novel = answer.citations.filter((citation) => !foundMeta[citation.url] && !foundMeta[workKey(citation)])
    const extraMeta = novel.length ? await metaMap(novel, deps.resolve) : {}
    const metaByKey = { ...foundMeta, ...extraMeta }
    const shaped = shapeResearchAnswer({
      retrieved: applyMeta(found, metaByKey),
      answer: answer.answer,
      answerCitations: applyMeta(answer.citations, metaByKey),
      numberedSources: applyMeta(found, metaByKey),
      metaByKey,
      now: deps.now,
    })
    const checked = await verifyShaped(question, shaped, deps.exaPost)
    return { configured: true, question, ...checked }
  } catch (err) {
    const message = err instanceof ExaRequestError ? err.message : err instanceof Error ? err.message : 'Exa request failed.'
    const shaped = shapeResearchAnswer({ retrieved: found, answer: null, now: deps.now })
    return { configured: true, question, error: redactSecrets(message), ...shaped, sentences: [], uncited: [] }
  }
}

export async function similarResearch(url: string, partial?: Partial<Deps>): Promise<SimilarResponse> {
  if (!isExaConfigured()) return { configured: false }
  const deps = depsFrom(partial)
  try {
    const payload = await deps.exaPost('/findSimilar', similarBody(url), SIMILAR_TIMEOUT_MS)
    const seedMeta = await deps.resolve({ url })
    const seedTitle = normalizeTitle(seedMeta.title || '')
    const seedDoi = (seedMeta.doi || '').toLowerCase()
    const found = readResults(payload).filter((paper) => {
      const sameDoi = seedDoi && ((paper.doi || '').toLowerCase() === seedDoi || workKey(paper) === `doi:${seedDoi}`)
      const sameTitle = seedTitle.length >= 24 && paper.title && normalizeTitle(paper.title) === seedTitle
      const sameUrl = paper.url === url || workKey(paper) === workKey({ url, doi: seedMeta.doi, pmid: seedMeta.pmid })
      if (sameUrl || sameDoi || sameTitle) return false
      if (isMirrorUrl(paper.url) && !resolvablePaper(paper)) return false
      return true
    }).slice(0, SIMILAR_RESULTS)
    const metaByKey = await metaMap(found, deps.resolve)
    const shaped = shapeResearchAnswer({
      retrieved: applyMeta(found, metaByKey),
      answer: null,
      metaByKey,
      now: deps.now,
    })
    return {
      configured: true,
      url,
      papers: shaped.retrieved,
      coverage: shaped.coverage,
      retracted: shaped.retracted,
    }
  } catch (err) {
    const message = err instanceof ExaRequestError ? err.message : err instanceof Error ? err.message : 'Exa request failed.'
    return {
      configured: true,
      url,
      papers: [],
      coverage: [],
      retracted: [],
      error: redactSecrets(message),
    }
  }
}

export { validateQuestion }
