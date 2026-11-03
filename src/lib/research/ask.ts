import { excludeDomains, PRIORITY_QUERY_HINT } from '@/lib/research/domains'
import { resolvePaperMetadata } from '@/lib/research/metadata'
import { isCoverageUrl, isExcludedUrl, isMirrorUrl, isRejectedResultUrl } from '@/lib/research/domains'
import { arxivIdFromUrl, cleanDoi, doiFromUrl, isPdfUrl, normalizeTitle, normalizeUrl, nullFindingSentence, plainSentence, pmidFromUrl, repairOpening, studyDirection, validateQuestion, workKey } from '@/lib/research/papers'
import { pinsForQuestion } from '@/lib/research/pins'
import {
  readSource,
  renumberCitations,
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
export const SIMILAR_CANDIDATES = 25

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
  'Every number, percent, and sample size in a sentence must appear in the cited excerpt or abstract.',
  'Summarize every relevant retrieved study, including both positive and null results. Do not report only the studies that found no effect. If an early time-restricted feeding trial reported a benefit and it was retrieved, include that result.',
  'Do not call a pooled study, meta-analysis, or systematic review an RCT unless the cited text itself calls it a randomized controlled trial or an RCT.',
  'When the cited text gives the number of studies or the sample size in a meta-analysis, state that count.',
  'State the population in every finding: sex, condition, and sample size when the source gives them.',
  'Name the study, its population, and the outcome in each sentence, and cite that study.',
  'Write 3 to 5 supported sentences when the sources allow it. Do not stop at one vague sentence.',
  'Label a subgroup, cumulative, or secondary result as such. Do not present it as the overall finding.',
  'When only one meta-analysis is cited, call it a meta-analysis.',
  'Name the outcome that was measured, such as clamp, HOMA-IR, OGTT, fasting glucose, or HbA1c, instead of saying only insulin sensitivity.',
  'Keep the source population wording. If the source says overweight or obesity, do not narrow it to obesity.',
  'If a total is not printed in the source, do not state a computed total. Quote the printed counts, such as 17 plus 3 participants.',
  'When the retrieved sources disagree, say that they disagree and cite both sides. Do not summarize only the majority.',
  'If a retrieved paper reports that the outcome did not change, include that null or mixed result in its own sentence.',
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
      status?: 'no-answer'
    } & ShapedResearch)

export function researchHttpStatus(result: { configured: boolean; error?: string }): number {
  if (!result.configured || !result.error || result.error === UNVERIFIED_ANSWER) return 200
  return 502
}

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
    numResults: SIMILAR_CANDIDATES,
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

export const UNVERIFIED_ANSWER = 'No answer could be backed by retrieved papers for this question.'

function restoreSources(shaped: ShapedResearch & { error?: string }, message: string): ShapedResearch & { error?: string } {
  const seen = new Set<string>()
  const citedKeys = new Set(shaped.citations.map((paper) => `${paper.doi || ''}|${paper.sourceUrl}`))
  const retrieved: ResearchPaper[] = []
  for (const paper of [...shaped.citations, ...shaped.retrieved]) {
    const key = `${paper.doi || ''}|${paper.sourceUrl}`
    if (seen.has(key)) continue
    seen.add(key)
    retrieved.push({
      ...paper,
      n: null,
      dropReason: citedKeys.has(key)
        ? 'The abstract check did not support the sentence that cited this paper.'
        : paper.dropReason || 'Not cited.',
    })
  }
  return { ...shaped, sentences: [], citations: [], retrieved, error: shaped.error || message }
}

function resolvablePaper(paper: { url: string; doi?: string | null; pmid?: string | null }): boolean {
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
        const excerpt = (paper?.excerpt || '').slice(0, 2800)
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
      return restoreSources(
        { ...shaped, sentences: [], citations: [] },
        'The abstract check did not finish, so those claims are not shown.',
      )
    }
    const supported = new Map(checks.map((check) => [check.n, check.supported]))
    const sentences: typeof shaped.sentences = []
    let previousKept = false
    shaped.sentences.forEach((sentence, index) => {
      if (supported.get(index + 1) !== true) {
        previousKept = false
        return
      }
      sentences.push({
        ...sentence,
        text: plainSentence(previousKept ? sentence.text : repairOpening(sentence.text)),
      })
      previousKept = true
    })
    if (sentences.length === 0) {
      return restoreSources(shaped, UNVERIFIED_ANSWER)
    }
    const used = new Set(sentences.flatMap((sentence) => sentence.cites))
    return renumberCitations({
      ...shaped,
      sentences,
      citations: shaped.citations.filter((paper) => paper.n != null && used.has(paper.n)),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'The abstract check did not finish, so those claims are not shown.'
    return restoreSources({ ...shaped, sentences: [], citations: [] }, redactSecrets(message))
  }
}

export function answerQuery(question: string, papers: SourceFields[], metaByKey: Record<string, PaperMeta> = {}): string {
  const notes = papers.map((paper) => {
    const meta = metaByKey[paper.url] ?? metaByKey[workKey(paper)] ?? {}
    return studyDirection(meta.abstract || paper.summary || paper.text || '')
  })
  const bothSides = notes.includes('benefit') && notes.includes('no-effect')
  const lines = papers.map((paper, index) => {
    const meta = metaByKey[paper.url] ?? metaByKey[workKey(paper)] ?? {}
    const excerpt = (meta.abstract || paper.summary || paper.highlights?.join('\n') || paper.text || '').slice(0, 1200)
    const direction = notes[index]
    const tag = direction === 'benefit' ? 'Reports a benefit.' : direction === 'no-effect' ? 'Reports no effect.' : ''
    return `[${index + 1}] ${paper.title ?? 'Untitled'}\nURL: ${paper.url}\n${tag}\nExcerpt: ${excerpt}`.trim()
  })
  return [
    `Question: ${question}`,
    '',
    'Use only these retrieved sources, and only when the excerpt supports the claim. Copy the source URL into sentences[].urls.',
    bothSides
      ? 'The retrieved studies disagree. Say that they disagree and cite both sides. Do not summarize only the majority. Cite at least one reported benefit and one reported no effect, including a positive early time-restricted feeding trial when it is in this list.'
      : '',
    '',
    lines.join('\n\n'),
  ].filter((line) => line !== undefined).join('\n')
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

function knownDoi(paper: SourceFields): string | null {
  return (cleanDoi(paper.doi) || doiFromUrl(paper.url) || '').toLowerCase() || null
}

/** DOI lookup for pins search missed. No abstract means the pin is not added. */
async function injectMissingPins(question: string, found: SourceFields[], resolve: MetaResolver): Promise<SourceFields[]> {
  const present = new Set(found.map(knownDoi).filter((doi): doi is string => Boolean(doi)))
  const missing = pinsForQuestion(question).filter((doi) => !present.has(doi))
  const loaded = await Promise.all(
    missing.map(async (doi) => {
      const url = `https://doi.org/${doi}`
      const meta = await resolve({ url, doi })
      const abstract = meta.abstract?.trim()
      if (!abstract) return null
      const resolvedDoi = (cleanDoi(meta.doi) || doi).toLowerCase()
      const paper: SourceFields = {
        url,
        doi: resolvedDoi,
        pmid: meta.pmid ?? null,
        title: meta.title ?? null,
        author: meta.authors && meta.authors.length > 0 ? meta.authors.slice(0, 3).join(', ') : null,
        publishedDate: meta.year ?? null,
        text: abstract,
      }
      return paper
    }),
  )
  const pins = loaded.filter((paper): paper is SourceFields => Boolean(paper))
  return [...pins, ...found]
}

/** When the model cites only benefits, keep a null sentence copied from a retrieved abstract. */
function addMissingNulls(shaped: ShapedResearch): ShapedResearch {
  const hasBenefit = [...shaped.citations, ...shaped.sentences].some((item) =>
    studyDirection('text' in item ? item.text : item.excerpt || '') === 'benefit',
  )
  const hasNull = [...shaped.citations, ...shaped.sentences].some((item) =>
    studyDirection('text' in item ? item.text : item.excerpt || '') === 'no-effect',
  )
  if (!hasBenefit || hasNull || shaped.sentences.length === 0) return shaped
  const extras: { paper: ShapedResearch['retrieved'][number]; sentence: string }[] = []
  for (const paper of shaped.retrieved) {
    const sentence = nullFindingSentence(paper.excerpt || '')
    if (!sentence || studyDirection(sentence) !== 'no-effect') continue
    extras.push({ paper, sentence: plainSentence(sentence) })
    if (extras.length >= 2) break
  }
  if (extras.length === 0) return shaped
  let nextN = shaped.citations.reduce((max, paper) => Math.max(max, paper.n || 0), 0)
  const citations = [...shaped.citations]
  const sentences = [...shaped.sentences]
  const added = new Set(extras.map((extra) => extra.paper))
  for (const extra of extras) {
    nextN += 1
    citations.push({ ...extra.paper, n: nextN, dropReason: null })
    sentences.push({ text: `${extra.sentence} [${nextN}]`, cites: [nextN] })
  }
  return renumberCitations({
    ...shaped,
    citations,
    sentences,
    retrieved: shaped.retrieved.filter((paper) => !added.has(paper)),
  })
}

export async function askResearch(question: string, partial?: Partial<Deps>): Promise<AskResponse> {
  if (!isExaConfigured()) return { configured: false }
  const deps = depsFrom(partial)
  let found: SourceFields[] = []
  try {
    const searched = await deps.exaPost('/search', searchBody(question), SEARCH_TIMEOUT_MS)
    found = await injectMissingPins(question, readResults(searched).slice(0, SEARCH_RESULTS), deps.resolve)
  } catch (err) {
    const message = err instanceof ExaRequestError ? err.message : err instanceof Error ? err.message : 'Exa request failed.'
    return { configured: true, question, error: redactSecrets(message), ...emptyShape() }
  }
  try {
    const foundMeta = await metaMap(found, deps.resolve)
    const answered = await deps.exaPost(
      '/answer',
      {
        query: answerQuery(question, found, foundMeta),
        stream: false,
        text: true,
        model: 'exa',
        systemPrompt: ANSWER_SYSTEM,
        outputSchema: ANSWER_SCHEMA,
      },
      ANSWER_TIMEOUT_MS,
    )
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
    if (checked.sentences.length === 0) {
      const restored = restoreSources(checked, UNVERIFIED_ANSWER)
      return {
        configured: true,
        question,
        ...(restored.error === UNVERIFIED_ANSWER ? { status: 'no-answer' as const } : {}),
        ...restored,
      }
    }
    return { configured: true, question, ...addMissingNulls(checked) }
  } catch (err) {
    const message = err instanceof ExaRequestError ? err.message : err instanceof Error ? err.message : 'Exa request failed.'
    const shaped = shapeResearchAnswer({ retrieved: found, answer: null, now: deps.now })
    return { configured: true, question, error: redactSecrets(message), ...shaped, sentences: [], uncited: [] }
  }
}

function sameAsSeed(
  paper: { url: string; title?: string | null; doi?: string | null },
  seedUrl: string,
  seed: PaperMeta,
): boolean {
  if (normalizeUrl(paper.url) === normalizeUrl(seedUrl)) return true
  const doi = (paper.doi || '').toLowerCase()
  const seedDoi = (seed.doi || '').toLowerCase()
  if (doi && seedDoi && doi === seedDoi) return true
  const seedTitle = normalizeTitle(seed.title || '')
  if (seedTitle.length >= 24 && paper.title && normalizeTitle(paper.title) === seedTitle) return true
  return false
}

function keptSimilar(paper: SourceFields, seedUrl: string, seed: PaperMeta): boolean {
  if (sameAsSeed(paper, seedUrl, seed)) return false
  if (isExcludedUrl(paper.url) || isCoverageUrl(paper.url) || isRejectedResultUrl(paper.url)) return false
  if (isMirrorUrl(paper.url) && !resolvablePaper(paper)) return false
  if (/sciencedirect\.com/i.test(paper.url) && !resolvablePaper(paper)) return false
  if (isPdfUrl(paper.url)) return false
  return resolvablePaper(paper)
}

function keptSimilarView(paper: ResearchPaper, seedUrl: string, seed: PaperMeta): boolean {
  if (sameAsSeed({ url: paper.sourceUrl, title: paper.title, doi: paper.doi }, seedUrl, seed)) return false
  if (paper.title === 'Title unavailable' || paper.status === 'unverified') return false
  const href = paper.href || ''
  const identified = Boolean(paper.doi || pmidFromUrl(paper.sourceUrl) || pmidFromUrl(href) || arxivIdFromUrl(paper.sourceUrl) || arxivIdFromUrl(href))
  if (!identified) return false
  if (isPdfUrl(paper.sourceUrl) || isRejectedResultUrl(paper.sourceUrl)) return false
  if (/sciencedirect\.com/i.test(paper.sourceUrl) && !paper.doi) return false
  return true
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
    })
    const metaByKey = await metaMap(found, deps.resolve)
    const withIds = applyMeta(found, metaByKey).filter((paper) => keptSimilar(paper, url, seedMeta)).slice(0, SIMILAR_RESULTS)
    const shaped = shapeResearchAnswer({
      retrieved: withIds,
      answer: null,
      metaByKey,
      now: deps.now,
    })
    const papers = shaped.retrieved.filter((paper) => keptSimilarView(paper, url, seedMeta))
    return {
      configured: true,
      url,
      papers,
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
