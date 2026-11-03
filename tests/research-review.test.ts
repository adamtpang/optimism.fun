import { describe, expect, it } from 'vitest'
import { ANSWER_SYSTEM, askResearch, readSupportChecks } from '@/lib/research/ask'
import { isNewsRecord } from '@/lib/research/domains'
import { readCrossref, readNcbiIdconv, resolvePaperMetadata } from '@/lib/research/metadata'
import {
  citationLink,
  cleanDoi,
  cleanTitle,
  doiFromUrl,
  paperStatus,
  plainExcerpt,
} from '@/lib/research/papers'
import { allowCitation, shapeResearchAnswer, type SourceFields } from '@/lib/research/shape'

const WAKEFIELD = {
  message: {
    DOI: '10.1016/S0140-6736(97)11096-0',
    type: 'journal-article',
    title: ['Ileal-lymphoid-nodular hyperplasia, non-specific colitis, and pervasive developmental disorder in children'],
    'container-title': ['The Lancet'],
    author: [{ given: 'A J', family: 'Wakefield' }],
    'updated-by': [{ DOI: '10.1016/S0140-6736(05)77876-7', type: 'retraction', label: 'Retraction' }],
  },
}

const NATURE = 'https://www.nature.com/articles/s41586-020-2649-2'
const BLOG = 'https://blog.example/intermittent-fasting'

describe('review fixtures', () => {
  it('derives status from Crossref and OpenAlex types, not the host', () => {
    expect(paperStatus({ url: 'https://www.nature.com/articles/s41586-020-2649-2' })).toBe('unknown')
    expect(paperStatus({
      url: 'https://pubmed.ncbi.nlm.nih.gov/34620199/',
      retractionChecked: true,
      retracted: false,
    })).toBe('unknown')
    expect(paperStatus({
      url: 'https://pubmed.ncbi.nlm.nih.gov/34620199/',
      doi: '10.1186/s12986-021-00613-9',
      crossrefType: 'journal-article',
      retractionChecked: true,
      retracted: false,
    })).toBe('peer-reviewed')
    expect(paperStatus({ url: 'https://www.biorxiv.org/content/10.1101/2020.01.01.123456', doi: '10.1101/2020.01.01.123456' })).toBe('preprint')
    expect(paperStatus({ url: 'https://arxiv.org/abs/2401.00001', doi: '10.48550/arxiv.2401.00001' })).toBe('preprint')
    expect(paperStatus({ url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1', doi: '10.2139/ssrn.1' })).toBe('preprint')
    expect(paperStatus({ url: 'https://www.researchsquare.com/article/rs-1', doi: '10.21203/rs.3.rs-1' })).toBe('preprint')
    expect(isNewsRecord('https://www.nature.com/articles/d41586-023-00191-1', '10.1038/d41586-023-00191-1')).toBe(true)
    expect(paperStatus({
      url: 'https://www.nature.com/articles/d41586-023-00191-1',
      doi: '10.1038/d41586-023-00191-1',
      crossrefType: 'journal-article',
      retractionChecked: true,
      retracted: false,
    })).toBe('unknown')
    expect(allowCitation({
      url: 'https://www.science.org/content/article/a-news-story',
      text: 'A news writeup of a trial.',
    })).toBe('coverage')
    expect(paperStatus({
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMp2300123',
      title: 'Perspective: A clinical opinion',
      crossrefType: 'journal-article',
      retractionChecked: true,
      retracted: false,
    })).toBe('unknown')
    expect(allowCitation({
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMp2300123',
      title: 'Perspective: A clinical opinion',
      text: 'An opinion.',
    })).toBe('not-research')
  })

  it('reads a DOI from URL patterns and from a title match', async () => {
    expect(doiFromUrl('https://www.nature.com/articles/s41586-020-2649-2')).toBe('10.1038/s41586-020-2649-2')
    expect(doiFromUrl('https://www.nature.com/articles/s41591-023-02287-7?code=49c30565&error=cookies_not_supported')).toBe(
      '10.1038/s41591-023-02287-7',
    )
    expect(doiFromUrl('https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(97)11096-0/fulltext')).toBe(
      '10.1016/S0140-6736(97)11096-0',
    )
    expect(citationLink({
      url: 'https://www.nature.com/articles/s41591-023-02287-7?code=abc&error=cookies_not_supported',
    }).href).toBe('https://doi.org/10.1038/s41591-023-02287-7')

    const title = 'Time-restricted feeding improves blood glucose and insulin sensitivity in overweight patients with type 2 diabetes'
    let sawTitleLookup = false
    const meta = await resolvePaperMetadata(
      { url: 'https://publisher.example/papers/tre-trial', title, text: 'A randomised trial.' },
      {
        timeoutMs: 1000,
        fetchImpl: async (url) => {
          if (url.includes('api.openalex.org/works?search=')) {
            sawTitleLookup = true
            return json({ results: [{ display_name: title, doi: 'https://doi.org/10.1186/s12986-021-00613-9' }] })
          }
          if (url.includes('api.crossref.org/works?query.bibliographic=')) return json({ message: { items: [] } })
          if (url.includes('api.crossref.org/works/10.1186')) {
            return json({
              message: {
                DOI: '10.1186/s12986-021-00613-9',
                type: 'journal-article',
                title: [title],
                'container-title': ['Nutrition & Metabolism'],
                author: [{ given: 'Tingting', family: 'Che' }],
                issued: { 'date-parts': [[2021]] },
              },
            })
          }
          if (url.includes('api.openalex.org/works/doi:')) {
            return json({
              type: 'article',
              doi: 'https://doi.org/10.1186/s12986-021-00613-9',
              display_name: title,
              publication_year: 2021,
              is_retracted: false,
              authorships: [{ author: { display_name: 'Tingting Che' } }],
              primary_location: { source: { display_name: 'Nutrition & Metabolism' } },
            })
          }
          return json({})
        },
      },
    )
    expect(sawTitleLookup).toBe(true)
    expect(meta.doi).toBe('10.1186/s12986-021-00613-9')
    expect(meta.venue).toBe('Nutrition & Metabolism')
    expect(paperStatus({ url: 'https://publisher.example/papers/tre-trial', ...meta })).toBe('peer-reviewed')
  })

  it('does not cite a paper when the retraction check times out', async () => {
    const meta = await resolvePaperMetadata(
      { url: 'https://doi.org/10.1186/s12986-021-00613-9', title: 'A trial', text: 'Results.' },
      {
        timeoutMs: 20,
        fetchImpl: (_url, init) => new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')))
        }),
      },
    )
    expect(meta.retractionChecked).toBe(false)
    expect(paperStatus({ url: 'https://doi.org/10.1186/s12986-021-00613-9', ...meta })).toBe('unverified')
    const shaped = shapeResearchAnswer({
      retrieved: [{ url: 'https://doi.org/10.1186/s12986-021-00613-9', title: 'A trial', text: 'Results.' }],
      answer: { sentences: [{ text: 'Glucose fell.', urls: ['https://doi.org/10.1186/s12986-021-00613-9'] }] },
      metaByKey: { 'https://doi.org/10.1186/s12986-021-00613-9': meta },
    })
    expect(shaped.sentences).toEqual([])
    expect(shaped.citations).toEqual([])
    expect(shaped.retrieved[0]?.statusLabel).toBe('Unverified')
  })

  it('reads Crossref updated-by retractions and expressions of concern', () => {
    const retracted = readCrossref(WAKEFIELD)
    expect(retracted.retracted).toBe(true)
    expect(retracted.doi).toBe('10.1016/S0140-6736(97)11096-0')
    expect(paperStatus({
      url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(97)11096-0/fulltext',
      ...retracted,
      retractionChecked: true,
    })).toBe('retracted')
    const concern = readCrossref({
      message: {
        DOI: '10.1000/concern',
        type: 'journal-article',
        'updated-by': [{ type: 'expression_of_concern' }],
      },
    })
    expect(concern.concern).toBe(true)
    expect(paperStatus({ url: 'https://doi.org/10.1000/concern', ...concern, retractionChecked: true })).toBe('concern')
  })

  it('strips bioRxiv version and file suffixes from DOIs', () => {
    expect(cleanDoi('10.1101/2020.12.01.406439v1.full.pdf')).toBe('10.1101/2020.12.01.406439')
    expect(cleanDoi('https://doi.org/10.3389/fnut.2024.1325894/full')).toBe('10.3389/fnut.2024.1325894')
    expect(citationLink({ url: 'https://www.biorxiv.org/content/10.1101/2020.12.01.406439v1.full.pdf' }).href).toBe(
      'https://doi.org/10.1101/2020.12.01.406439',
    )
  })

  it('maps [1] to the prompt list, not to the order of Exa answer citations', () => {
    const first: SourceFields = { url: 'https://doi.org/10.1000/first', title: 'First paper', text: 'The first result.' }
    const second: SourceFields = { url: 'https://doi.org/10.1000/second', title: 'Second paper', text: 'The second result.' }
    const shaped = shapeResearchAnswer({
      retrieved: [first, second],
      numberedSources: [first, second],
      answer: 'The first result held [1].',
      answerCitations: [second, first],
    })
    expect(shaped.sentences[0]?.cites).toEqual([1])
    expect(shaped.citations[0]?.title).toBe('First paper')
    expect(shaped.citations[0]?.doi).toBe('10.1000/first')
  })

  it('drops an answer-only blog and keeps an answer-only paper that has a DOI', () => {
    const search: SourceFields = { url: NATURE, title: 'Nature trial', text: 'Adults were studied.', doi: '10.1038/s41586-020-2649-2' }
    const shaped = shapeResearchAnswer({
      retrieved: [search],
      numberedSources: [search],
      answer: {
        sentences: [
          { text: 'A blog claimed a benefit.', urls: [BLOG] },
          { text: 'The indexed trial reported a change.', urls: ['https://doi.org/10.1002/oby.23620'] },
        ],
      },
      answerCitations: [
        { url: BLOG, title: 'A blog', text: 'Unindexed claim.' },
        { url: 'https://onlinelibrary.wiley.com/doi/full/10.1002/oby.23620', title: 'Wiley trial', text: 'No change in HOMA-IR.', doi: '10.1002/oby.23620' },
      ],
    })
    expect(shaped.citations.map((paper) => paper.doi)).toEqual(['10.1002/oby.23620'])
    expect(shaped.uncited.map((sentence) => sentence.text)).toContain('A blog claimed a benefit.')
    expect(shaped.sentences.map((sentence) => sentence.text).join(' ')).not.toContain('blog')
  })

  it('dedupes a publisher page and its PubMed record on the DOI', () => {
    const doi = '10.1186/s12986-021-00613-9'
    const title = 'Time-restricted feeding improves blood glucose and insulin sensitivity - PubMed'
    const shaped = shapeResearchAnswer({
      retrieved: [
        { url: 'https://pubmed.ncbi.nlm.nih.gov/34620199/', title, text: 'A randomised trial.', doi },
        { url: 'https://nutritionandmetabolism.biomedcentral.com/articles/10.1186/s12986-021-00613-9', title: 'Time-restricted feeding improves blood glucose and insulin sensitivity', text: 'A randomised trial.', doi },
      ],
      answer: null,
    })
    expect(shaped.retrieved).toHaveLength(1)
    expect(shaped.retrieved[0]?.title).toBe('Time-restricted feeding improves blood glucose and insulin sensitivity')
    expect(shaped.retrieved[0]?.href).toBe(`https://doi.org/${doi}`)
  })

  it('resolves mirrors and Medscape PMIDs, and drops a mirror with no id', () => {
    expect(doiFromUrl('https://www.medscape.com/medline/abstract/34620199')).toBeNull()
    expect(citationLink({ url: 'https://www.medscape.com/medline/abstract/34620199' }).href).toBe(
      'https://pubmed.ncbi.nlm.nih.gov/34620199/',
    )
    const mirror = shapeResearchAnswer({
      retrieved: [
        { url: 'https://www.springermedizin.de/effects-of-time-restricted-eating/53032742', title: 'Effects of time-restricted eating | springermedizin.de', text: 'A review.' },
        { url: 'https://www.malariaworld.org/blog/some-reprint', title: 'A reprint', text: 'Copied text.' },
      ],
      answer: { sentences: [{ text: 'The mirror says so.', urls: ['https://www.springermedizin.de/effects-of-time-restricted-eating/53032742'] }] },
    })
    expect(mirror.citations).toEqual([])
    expect(cleanTitle('Effects of time-restricted eating | springermedizin.de')).toBe('Effects of time-restricted eating')
    expect(cleanTitle('Frontiers | The effects of different intermittent fasting regimens')).toBe(
      'The effects of different intermittent fasting regimens',
    )
    expect(cleanTitle('Early Time-Restricted Feeding - PMC')).toBe('Early Time-Restricted Feeding')
    const kept = shapeResearchAnswer({
      retrieved: [{
        url: 'https://www.springermedizin.de/effects-of-time-restricted-eating/53032742',
        title: 'Effects of time-restricted eating | springermedizin.de',
        text: 'A review of trials.',
        doi: '10.1007/s11154-023-09853-x',
      }],
      answer: null,
    })
    expect(kept.retrieved[0]?.href).toBe('https://doi.org/10.1007/s11154-023-09853-x')
  })

  it('replaces em dashes in excerpts and states the answer rules', () => {
    expect(plainExcerpt('TRE - a 6\u20138 hour window \u2014 did not change HOMA-IR.')).toBe(
      'TRE - a 6\u20138 hour window - did not change HOMA-IR.',
    )
    const shaped = shapeResearchAnswer({
      retrieved: [{ url: NATURE, title: 'A trial - PMC', text: 'The trial \u2014 in men with prediabetes \u2014 measured HOMA-IR.', doi: '10.1038/s41586-020-2649-2' }],
      answer: null,
    })
    expect(shaped.retrieved[0]?.excerpt).not.toContain('\u2014')
    expect(shaped.retrieved[0]?.excerpt).toContain(' - ')
    expect(ANSWER_SYSTEM).toContain('sex, condition, and sample size')
    expect(ANSWER_SYSTEM).toContain('subgroup')
    expect(ANSWER_SYSTEM).toContain('a meta-analysis')
    expect(ANSWER_SYSTEM).toContain('HOMA-IR')
    expect(ANSWER_SYSTEM).toContain('time-restricted eating')
  })

  it('drops a sentence the abstract check rejects', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    const result = await askResearch('Does time-restricted eating change HOMA-IR in adults with prediabetes?', {
      resolve: async () => ({ retractionChecked: true, retracted: false, crossrefType: 'journal-article', journal: true }),
      exaPost: async (path, body) => {
        if (path === '/search') {
          return {
            results: [{
              url: NATURE,
              title: 'A trial',
              text: 'In 12 men with prediabetes, early time-restricted eating did not change HOMA-IR.',
              doi: '10.1038/s41586-020-2649-2',
            }],
          }
        }
        const schema = JSON.stringify((body as { outputSchema?: unknown }).outputSchema ?? {})
        if (schema.includes('supported')) {
          return { answer: { checks: [{ n: 1, supported: false }, { n: 2, supported: true }] } }
        }
        return {
          answer: {
            sentences: [
              { text: 'Insulin sensitivity improved in all adults.', urls: [NATURE] },
              { text: 'In 12 men with prediabetes, HOMA-IR did not change.', urls: [NATURE] },
            ],
          },
          citations: [],
        }
      },
    })
    delete process.env.EXA_API_KEY
    expect(result.configured).toBe(true)
    if (!result.configured) return
    expect(result.sentences).toHaveLength(1)
    expect(result.sentences[0]?.text).toContain('HOMA-IR')
    expect(result.sentences.some((sentence) => sentence.text.includes('all adults'))).toBe(false)
    expect(readSupportChecks({ answer: { checks: [{ n: 2, supported: true }] } })).toEqual([{ n: 2, supported: true }])
  })

  it('resolves a PMC id through the NCBI converter', async () => {
    expect(readNcbiIdconv({
      records: [{ pmcid: 'PMC5990470', pmid: 29754952, doi: '10.1016/j.cmet.2018.04.010' }],
    }).doi).toBe('10.1016/j.cmet.2018.04.010')
    const meta = await resolvePaperMetadata(
      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5990470/', title: 'Early Time-Restricted Feeding - PMC', summary: 'A Cell Metabolism trial.' },
      {
        timeoutMs: 1000,
        fetchImpl: async (url) => {
          if (url.includes('ncbi.nlm.nih.gov/pmc/utils/idconv')) {
            return json({ records: [{ pmcid: 'PMC5990470', pmid: '29754952', doi: '10.1016/j.cmet.2018.04.010' }] })
          }
          if (url.includes('api.crossref.org/works/')) {
            return json({
              message: {
                DOI: '10.1016/j.cmet.2018.04.010',
                type: 'journal-article',
                'container-title': ['Cell Metabolism'],
                issued: { 'date-parts': [[2018]] },
                author: [{ given: 'Elizabeth F.', family: 'Sutton' }],
              },
            })
          }
          if (url.includes('api.openalex.org')) {
            return json({ type: 'article', is_retracted: false, publication_year: 2018, display_name: 'Early Time-Restricted Feeding' })
          }
          return json({})
        },
      },
    )
    expect(meta.doi).toBe('10.1016/j.cmet.2018.04.010')
    expect(meta.venue).toBe('Cell Metabolism')
    expect(paperStatus({ url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5990470/', ...meta })).toBe('peer-reviewed')
  })
})

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}
