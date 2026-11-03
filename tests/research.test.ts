import { afterEach, describe, expect, it } from 'vitest'
import { ExaRequestError } from '@/lib/sources/exa'
import { excludeDomains, isCoverageUrl, isExcludedUrl } from '@/lib/research/domains'
import {
  citationLink,
  formatAuthors,
  formatCitationCount,
  paperStatus,
} from '@/lib/research/papers'
import { allowCitation, shapeResearchAnswer, type SourceFields } from '@/lib/research/shape'
import { mergePaperMeta, readCrossref, readOpenAlex, readSemanticScholar, resolvePaperMetadata } from '@/lib/research/metadata'
import { askResearch, searchBody, similarBody, similarResearch } from '@/lib/research/ask'
import { takeResearchSlot } from '@/lib/research/limit'

const AS_OF = new Date(Date.UTC(2026, 10, 3))
const NATURE = 'https://www.nature.com/articles/s41586-020-2649-2'
const ARXIV_PDF = 'https://arxiv.org/pdf/2401.00001.pdf'
const UNRETRIEVED = 'https://example.com/blog/not-in-the-corpus'
const RESEARCHGATE = 'https://www.researchgate.net/publication/999'
const REUTERS = 'https://www.reuters.com/business/healthcare/story'
const NATURE_NEWS = 'https://www.nature.com/news/a-press-writeup'

const nature: SourceFields = {
  url: NATURE,
  title: 'Heat and mortality',
  author: 'Ada Lovelace',
  publishedDate: '2024-05-01',
  text: 'Mortality among older adults rose during extreme heat.',
  doi: '10.1038/s41586-020-2649-2',
}

const arxiv: SourceFields = {
  url: ARXIV_PDF,
  title: 'A preprint on heat',
  author: 'Grace Hopper',
  summary: 'This preprint estimates heat mortality.',
}

function restoreKey(previous: string | undefined) {
  if (previous === undefined) delete process.env.EXA_API_KEY
  else process.env.EXA_API_KEY = previous
}

describe('citation filtering', () => {
  it('drops a citation whose content was not retrieved', () => {
    expect(allowCitation({ url: UNRETRIEVED, text: '   ' })).toBe('no-content')
    const shaped = shapeResearchAnswer({
      retrieved: [nature],
      answer: 'A blog claimed the opposite [2]. Mortality rose [1].',
      answerCitations: [
        nature,
        { url: UNRETRIEVED, title: 'Unsourced blog' },
      ],
      now: AS_OF,
    })
    expect(shaped.citations.map((paper) => paper.sourceUrl)).toEqual([NATURE])
    expect(shaped.sentences.map((sentence) => sentence.cites)).toEqual([[1]])
    expect(shaped.uncited.map((sentence) => sentence.reason)).toContain('dropped-citation')
    expect(shaped.uncited.some((sentence) => sentence.text.includes('blog'))).toBe(true)
  })

  it('drops excluded domains even when Exa returned their text', () => {
    expect(allowCitation({ url: RESEARCHGATE, text: 'A full paper on the site.' })).toBe('excluded')
    expect(isExcludedUrl('https://sci-hub.se/10.1038/abc')).toBe(true)
    expect(isExcludedUrl('https://scholar.google.co.uk/scholar?q=heat')).toBe(true)
    const shaped = shapeResearchAnswer({
      retrieved: [{ ...nature }, { url: RESEARCHGATE, title: 'Gate', text: 'Copied text.' }],
      answer: 'ResearchGate confirms it [1].',
      answerCitations: [{ url: RESEARCHGATE, title: 'Gate', text: 'Copied text.' }],
      now: AS_OF,
    })
    expect(shaped.citations).toEqual([])
    expect(shaped.uncited).toEqual([
      { text: 'ResearchGate confirms it.', reason: 'dropped-citation' },
    ])
    expect(shaped.retrieved.map((paper) => paper.sourceUrl)).toEqual([NATURE])
  })

  it('keeps news only as coverage, never as evidence', () => {
    expect(isCoverageUrl(REUTERS)).toBe(true)
    expect(isCoverageUrl(NATURE_NEWS)).toBe(true)
    expect(isCoverageUrl(NATURE)).toBe(false)
    const shaped = shapeResearchAnswer({
      retrieved: [
        nature,
        { url: REUTERS, title: 'Wire story', text: 'A news report of the paper.' },
        { url: NATURE_NEWS, title: 'Nature news', text: 'A news writeup.' },
      ],
      answer: {
        sentences: [
          { text: 'The wire said mortality rose.', urls: [REUTERS] },
          { text: 'Mortality rose in the paper.', urls: [NATURE] },
        ],
      },
      now: AS_OF,
    })
    expect(shaped.coverage.map((link) => link.url).sort()).toEqual([NATURE_NEWS, REUTERS].sort())
    expect(shaped.coverage.every((link) => link.label === 'Coverage')).toBe(true)
    expect(shaped.citations.map((paper) => paper.sourceUrl)).toEqual([NATURE])
    expect(shaped.uncited.map((sentence) => sentence.text)).toContain('The wire said mortality rose.')
  })

  it('never uses a retracted paper as support', () => {
    const shaped = shapeResearchAnswer({
      retrieved: [nature],
      answer: { sentences: [{ text: 'Mortality rose.', urls: [NATURE] }] },
      metaByKey: { [NATURE]: { retracted: true, doi: nature.doi } },
      now: AS_OF,
    })
    expect(shaped.citations).toEqual([])
    expect(shaped.sentences).toEqual([])
    expect(shaped.uncited).toEqual([{ text: 'Mortality rose.', reason: 'retracted-only' }])
    expect(shaped.retracted[0]?.status).toBe('retracted')
    expect(shaped.retracted[0]?.statusLabel).toBe('Retracted')
  })

  it('labels a sentence with no source as uncited', () => {
    const shaped = shapeResearchAnswer({
      retrieved: [nature],
      answer: 'This sentence cites nothing. Mortality rose [1].',
      answerCitations: [nature],
      now: AS_OF,
    })
    expect(shaped.uncited.map((sentence) => sentence.reason)).toContain('no-source')
    expect(shaped.sentences).toHaveLength(1)
  })
})

describe('citation display', () => {
  it('formats authors, the reader link, and the OpenAlex count', () => {
    expect(formatAuthors(['Ada Lovelace', 'Grace Hopper', 'Alan Turing'])).toBe(
      'Ada Lovelace, Grace Hopper, and Alan Turing',
    )
    expect(formatAuthors(['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'John von Neumann'])).toBe(
      'Ada Lovelace et al.',
    )
    expect(formatCitationCount(412, AS_OF)).toBe('cited 412 times (OpenAlex, Nov 3, 2026)')
    expect(citationLink({ url: ARXIV_PDF, doi: '10.1038/s41586-020-2649-2' })).toEqual({
      href: 'https://doi.org/10.1038/s41586-020-2649-2',
      kind: 'doi',
      label: 'https://doi.org/10.1038/s41586-020-2649-2',
    })
    expect(citationLink({ url: ARXIV_PDF }).href).toBe('https://arxiv.org/abs/2401.00001')
    expect(citationLink({ url: 'https://pubmed.ncbi.nlm.nih.gov/12345678/' }).href).toBe(
      'https://pubmed.ncbi.nlm.nih.gov/12345678/',
    )
    expect(citationLink({ url: 'https://example.com/files/paper.pdf' }).href).toBeNull()
  })

  it('does not guess peer review, and does label a preprint from its host', () => {
    expect(paperStatus({ url: 'https://example.edu/paper', retracted: null, corrected: null })).toBe('unknown')
    expect(paperStatus({ url: ARXIV_PDF })).toBe('preprint')
    expect(paperStatus({ url: NATURE })).toBe('peer-reviewed')
    expect(paperStatus({ url: NATURE, corrected: true })).toBe('corrected')
    const shaped = shapeResearchAnswer({
      retrieved: [arxiv, nature],
      answer: null,
      now: AS_OF,
    })
    const preprint = shaped.retrieved.find((paper) => paper.sourceUrl === ARXIV_PDF)
    const journal = shaped.retrieved.find((paper) => paper.sourceUrl === NATURE)
    expect(preprint?.statusLabel).toBe('Preprint')
    expect(preprint?.href).toBe('https://arxiv.org/abs/2401.00001')
    expect(journal?.statusLabel).toBe('Peer-reviewed')
    expect(shaped.retrieved[0]?.sourceUrl).toBe(NATURE)
  })
})

describe('metadata resolvers', () => {
  it('reads retraction, correction, and an OpenAlex count', () => {
    const openAlex = readOpenAlex({
      doi: 'https://doi.org/10.1038/s41586-020-2649-2',
      publication_year: 2024,
      is_retracted: false,
      cited_by_count: 412,
      authorships: [{ author: { display_name: 'Ada Lovelace' } }, { author: { display_name: 'Grace Hopper' } }],
      primary_location: { source: { display_name: 'Nature' } },
      ids: { pmid: 'https://pubmed.ncbi.nlm.nih.gov/32015507' },
    })
    const crossref = readCrossref({
      message: {
        DOI: '10.1038/s41586-020-2649-2',
        'update-to': [{ type: 'correction' }],
        author: [{ given: 'Ignored', family: 'Name' }],
      },
    })
    const scholar = readSemanticScholar({
      year: 1999,
      citationCount: 9,
      externalIds: { DOI: '10.1038/s41586-020-2649-2', PubMed: '32015507' },
      authors: [{ name: 'Should Not Win' }],
    })
    const merged = mergePaperMeta(openAlex, crossref, scholar)
    expect(merged.citationCount).toBe(412)
    expect(merged.corrected).toBe(true)
    expect(merged.retracted).toBe(false)
    expect(merged.authors).toEqual(['Ada Lovelace', 'Grace Hopper'])
    expect(merged.venue).toBe('Nature')
    expect(merged.pmid).toBe('32015507')
    expect(paperStatus({ url: NATURE, retracted: merged.retracted, corrected: merged.corrected })).toBe('corrected')
  })

  it('treats a Crossref retraction as retracted even if OpenAlex said no', () => {
    const merged = mergePaperMeta(
      { retracted: false, citationCount: 3 },
      readCrossref({ message: { relation: { 'is-retracted-by': [{ id: '10.1/retraction' }] } } }),
      {},
    )
    expect(merged.retracted).toBe(true)
    expect(merged.citationCount).toBe(3)
  })

  it('returns status unknown inputs when resolvers time out, and does not call them without an id', async () => {
    let calls = 0
    const hung = (_url: string, init?: RequestInit) => {
      calls += 1
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new Error('aborted')))
      })
    }
    const meta = await resolvePaperMetadata(
      { url: 'https://doi.org/10.1038/s41586-020-2649-2' },
      { fetchImpl: hung, timeoutMs: 20 },
    )
    expect(calls).toBe(3)
    expect(meta.retracted).toBeNull()
    expect(meta.citationCount).toBeNull()
    expect(paperStatus({ url: 'https://example.edu/x', ...meta })).toBe('unknown')

    calls = 0
    const skipped = await resolvePaperMetadata({ url: 'https://example.edu/x' }, { fetchImpl: hung, timeoutMs: 20 })
    expect(calls).toBe(0)
    expect(skipped).toEqual({})
  })

  it('sends a mailto and does not send an API key', async () => {
    const seen: { url: string; agent: string }[] = []
    const fetchImpl = async (url: string, init?: RequestInit) => {
      const headers = new Headers(init?.headers)
      seen.push({ url, agent: headers.get('user-agent') ?? '' })
      return new Response('{}', { status: 404 })
    }
    await resolvePaperMetadata(
      { url: 'https://doi.org/10.1038/s41586-020-2649-2' },
      { fetchImpl, timeoutMs: 1000 },
    )
    expect(seen.map((call) => call.url).join('\n')).toContain('api.openalex.org')
    expect(seen.map((call) => call.url).join('\n')).toContain('api.crossref.org')
    expect(seen.map((call) => call.url).join('\n')).toContain('api.semanticscholar.org')
    expect(seen.every((call) => call.url.includes('mailto=') || call.url.includes('semanticscholar.org'))).toBe(true)
    expect(seen.every((call) => call.agent.includes('mailto:'))).toBe(true)
    expect(JSON.stringify(seen)).not.toContain('EXA_API_KEY')
  })
})

describe('Exa research requests', () => {
  const previous = process.env.EXA_API_KEY
  afterEach(() => restoreKey(previous))

  it('does not call Exa when EXA_API_KEY is missing', async () => {
    delete process.env.EXA_API_KEY
    let called = false
    const result = await askResearch('Does extreme heat raise mortality?', {
      exaPost: async () => {
        called = true
        return {}
      },
    })
    expect(result).toEqual({ configured: false })
    expect(called).toBe(false)
  })

  it('searches research papers, then asks /answer, with no includeDomains', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    const calls: { path: string; body: Record<string, unknown> }[] = []
    const result = await askResearch('Does extreme heat raise mortality in older adults?', {
      now: AS_OF,
      resolve: async (fields) =>
        fields.url === NATURE
          ? {
              authors: ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'John von Neumann'],
              year: '2024',
              venue: 'Nature',
              doi: nature.doi,
              citationCount: 412,
              retracted: false,
            }
          : {},
      exaPost: async (path, body) => {
        calls.push({ path, body: body as Record<string, unknown> })
        if (path === '/search') return { results: [nature, arxiv] }
        return {
          answer: {
            sentences: [
              { text: 'Mortality rose among older adults.', urls: [NATURE] },
              { text: 'A page we never retrieved said otherwise.', urls: [UNRETRIEVED] },
            ],
          },
          citations: [nature, { url: UNRETRIEVED, title: 'No text' }],
        }
      },
    })
    expect(calls.map((call) => call.path)).toEqual(['/search', '/answer'])
    const search = calls[0].body
    expect(search.category).toBe('research paper')
    expect(search.type).toBe('auto')
    expect(search.numResults).toBe(10)
    expect(search).not.toHaveProperty('includeDomains')
    expect(search.excludeDomains).toEqual(excludeDomains())
    expect(JSON.stringify(search.contents)).toContain('summary')
    const answer = calls[1].body
    expect(answer.model).toBe('exa')
    expect(answer.text).toBe(true)
    expect(answer.stream).toBe(false)
    expect(result.configured).toBe(true)
    if (!result.configured) return
    expect(result.sentences[0]?.cites).toEqual([1])
    expect(result.citations[0]?.authors).toBe('Ada Lovelace et al.')
    expect(result.citations[0]?.year).toBe('2024')
    expect(result.citations[0]?.venue).toBe('Nature')
    expect(result.citations[0]?.href).toBe('https://doi.org/10.1038/s41586-020-2649-2')
    expect(result.citations[0]?.citationCount).toBe('cited 412 times (OpenAlex, Nov 3, 2026)')
    expect(result.uncited).toEqual([
      { text: 'A page we never retrieved said otherwise.', reason: 'dropped-citation' },
    ])
    expect(JSON.stringify(result)).not.toContain('test-key-value')
  })

  it('surfaces a timeout and redacts the key', async () => {
    process.env.EXA_API_KEY = 'super-secret-key-value'
    const timedOut = await askResearch('Does extreme heat raise mortality?', {
      exaPost: async () => {
        throw new ExaRequestError(0, 'Exa /search timed out.')
      },
    })
    expect(timedOut.configured).toBe(true)
    if (!timedOut.configured) return
    expect(timedOut.error).toContain('timed out')

    const leaked = await askResearch('Does extreme heat raise mortality?', {
      exaPost: async () => {
        throw new Error('upstream said super-secret-key-value')
      },
    })
    expect(leaked.configured).toBe(true)
    if (!leaked.configured) return
    expect(leaked.error).toContain('[redacted]')
    expect(leaked.error).not.toContain('super-secret-key-value')
  })

  it('calls findSimilar without includeDomains and keeps retrieved summaries', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    const calls: { path: string; body: Record<string, unknown> }[] = []
    const result = await similarResearch(NATURE, {
      now: AS_OF,
      resolve: async () => ({}),
      exaPost: async (path, body) => {
        calls.push({ path, body: body as Record<string, unknown> })
        return {
          results: [
            nature,
            arxiv,
            { url: RESEARCHGATE, title: 'Gate', text: 'no' },
            { url: REUTERS, title: 'Wire', summary: 'news' },
          ],
        }
      },
    })
    expect(calls[0].path).toBe('/findSimilar')
    expect(calls[0].body.category).toBe('research paper')
    expect(calls[0].body.numResults).toBe(8)
    expect(calls[0].body).not.toHaveProperty('includeDomains')
    expect(searchBody('heat').category).toBe('research paper')
    expect(similarBody(NATURE)).not.toHaveProperty('includeDomains')
    expect(result.configured).toBe(true)
    if (!result.configured) return
    expect(result.papers.map((paper) => paper.sourceUrl)).toEqual([ARXIV_PDF])
    expect(result.papers[0]?.excerptKind).toBe('summary')
    expect(result.papers[0]?.statusLabel).toBe('Preprint')
    expect(result.coverage.map((link) => link.label)).toEqual(['Coverage'])
    expect(result.papers.some((paper) => paper.sourceUrl === NATURE)).toBe(false)
  })
})

describe('research rate limit', () => {
  it('allows eight requests a minute, then refuses', () => {
    const ip = `test-${Date.now()}`
    const start = Date.UTC(2026, 10, 3, 12, 0, 0)
    for (let i = 0; i < 8; i += 1) expect(takeResearchSlot(ip, start + i)).toBe(true)
    expect(takeResearchSlot(ip, start + 9)).toBe(false)
    expect(takeResearchSlot(ip, start + 60_001)).toBe(true)
  })
})
