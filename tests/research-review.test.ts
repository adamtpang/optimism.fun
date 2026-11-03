import { describe, expect, it } from 'vitest'
import { ANSWER_SYSTEM, UNVERIFIED_ANSWER, answerQuery, askResearch, readSupportChecks, researchHttpStatus, similarResearch } from '@/lib/research/ask'
import { pinsForQuestion } from '@/lib/research/pins'
import { isNewsRecord } from '@/lib/research/domains'
import { readCrossref, readEuropePmcAbstract, readNcbiIdconv, readOpenAlex, resolvePaperMetadata } from '@/lib/research/metadata'
import {
  chooseTitle,
  citationLink,
  cleanDoi,
  cleanTitle,
  doiFromExcerpt,
  doiFromUrl,
  paperStatus,
  plainExcerpt,
  studyDirection,
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
    const sciencedirect = await resolvePaperMetadata(
      { url: 'https://www.sciencedirect.com/science/article/pii/S014067361832261X', title: 'A Lancet article', text: 'Trial text.' },
      {
        timeoutMs: 1000,
        fetchImpl: async (url) => {
          if (url.includes('alternative-id:S014067361832261X')) {
            return json({ message: { items: [{ DOI: '10.1016/S0140-6736(18)32261-X', type: 'journal-article' }] } })
          }
          if (url.includes('api.crossref.org/works/10.1016')) {
            return json({ message: { DOI: '10.1016/S0140-6736(18)32261-X', type: 'journal-article', 'container-title': ['The Lancet'] } })
          }
          if (url.includes('api.openalex.org')) return json({ type: 'article', is_retracted: false })
          return json({})
        },
      },
    )
    expect(sciencedirect.doi).toBe('10.1016/S0140-6736(18)32261-X')
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

  it('renumbers cited sources from 1 with no gaps', () => {
    const papers: SourceFields[] = Array.from({ length: 8 }, (_, index) => ({
      url: `https://doi.org/10.1000/item${index + 1}`,
      title: `Study ${index + 1}`,
      text: `Result from study ${index + 1}.`,
      doi: `10.1000/item${index + 1}`,
    }))
    const shaped = shapeResearchAnswer({
      retrieved: papers,
      numberedSources: papers,
      answer: 'Result from study 1 [1]. Result from study 8 [8].',
    })
    expect(shaped.citations.map((paper) => paper.n)).toEqual([1, 2])
    expect(shaped.citations.map((paper) => paper.title)).toEqual(['Study 1', 'Study 8'])
    expect(shaped.sentences.map((sentence) => sentence.cites)).toEqual([[1], [2]])
    expect(shaped.sentences.map((sentence) => sentence.text).join(' ')).not.toContain('[8]')
  })

  it('drops a sentence whose number is not in the excerpt or abstract', () => {
    const doi = '10.1016/j.tube.2024.1'
    const url = 'https://doi.org/10.1016/j.tube.2024.1'
    const missing = shapeResearchAnswer({
      retrieved: [{ url, title: 'Tuberculosis trial', text: 'The trial measured sputum conversion.', doi }],
      answer: 'The trial enrolled 3,573 people [1]. The rate was 54.0% [1].',
    })
    expect(missing.sentences).toEqual([])

    const kept = shapeResearchAnswer({
      retrieved: [{ url, title: 'Tuberculosis trial', text: 'Short page text.', doi }],
      answer: 'The program reached 4,800 children [1].',
      metaByKey: {
        [url]: {
          doi,
          abstract: 'The program reached 4,800 children in the district.',
          retractionChecked: true,
          retracted: false,
          journal: true,
          crossrefType: 'journal-article',
        },
      },
    })
    expect(kept.sentences).toHaveLength(1)
    expect(kept.sentences[0]?.text).toContain('4,800')
    expect(kept.citations[0]?.excerpt).toContain('4,800')
  })

  it('does not treat a pooled study as an RCT unless the cited text says so', () => {
    const url = 'https://doi.org/10.1016/j.meta.2024.1'
    const dropped = shapeResearchAnswer({
      retrieved: [{ url, title: 'A meta-analysis', text: 'A meta-analysis of 8 studies found no effect on fasting glucose.', doi: '10.1016/j.meta.2024.1' }],
      answer: 'Eight RCTs found no effect on fasting glucose [1].',
    })
    expect(dropped.sentences).toEqual([])
    const kept = shapeResearchAnswer({
      retrieved: [{ url, title: 'A meta-analysis', text: 'This meta-analysis pooled 8 randomized controlled trials.', doi: '10.1016/j.meta.2024.1' }],
      answer: 'A meta-analysis of 8 RCTs found no effect [1].',
    })
    expect(kept.sentences).toHaveLength(1)
  })

  it('drops unresolved, untitled, and PDF items from the uncited source list', () => {
    const shaped = shapeResearchAnswer({
      retrieved: [
        { url: 'https://www.sciencedirect.com/science/article/pii/S0000000000000001', title: 'Unresolved ScienceDirect page', text: 'A page with no DOI.' },
        { url: 'https://www.nature.com/articles/s41586-020-2649-2.pdf', title: 'Nature PDF', text: 'PDF landing page.', doi: '10.1038/s41586-020-2649-2' },
        { url: 'https://example.edu/unknown', title: '', text: 'Mystery text.' },
        { url: 'https://doi.org/10.1000/keep1', title: 'A real trial', text: 'Adults were enrolled.', doi: '10.1000/keep1' },
      ],
      answer: null,
      metaByKey: {
        'https://example.edu/unknown': { retractionChecked: false },
      },
    })
    expect(shaped.retrieved.map((paper) => paper.title)).toEqual(['A real trial'])
  })

  it('keeps similar papers only when they resolve, and excludes the input paper', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    const seed = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10943166/'
    const result = await similarResearch(seed, {
      resolve: async (fields) => {
        if (fields.url === seed) {
          return {
            doi: '10.1007/s11154-023-09853-x',
            title: 'Circadian alignment of food intake and glycaemic control by time-restricted eating: A systematic review and meta-analysis',
            retractionChecked: true,
            retracted: false,
            journal: true,
          }
        }
        if (fields.url.includes('10.1002/oby.23620')) {
          return { doi: '10.1002/oby.23620', retractionChecked: true, retracted: false, journal: true, crossrefType: 'journal-article' }
        }
        return { retractionChecked: true, retracted: false }
      },
      exaPost: async () => ({
        results: [
          { url: 'https://link.springer.com/article/10.1007/s11154-023-09853-x', title: 'Circadian alignment of food intake and glycaemic control by time-restricted eating: A systematic review and meta-analysis', text: 'The same review.', doi: '10.1007/s11154-023-09853-x' },
          { url: 'https://www.diabetologia-journal.org/blog/fasting', title: 'Blog post', text: 'A blog.' },
          { url: 'https://diabetesonthenet.com/diabetes-primary-care/fasting-news', title: 'News summary', text: 'A news summary.' },
          { url: 'https://shamra-academia.com/papers/1', title: 'Translated copy', text: 'Machine translation.' },
          { url: 'https://springerlink.example.de/content/abc', title: 'Proxy mirror', text: 'A proxy.' },
          { url: 'https://www.nature.com/articles/s41586-020-2649-2.pdf', title: 'PDF', text: 'A pdf.', doi: '10.1038/s41586-020-2649-2' },
          { url: 'https://www.sciencedirect.com/science/article/pii/S123', title: 'No DOI yet', text: 'Unresolved publisher page.' },
          { url: 'https://onlinelibrary.wiley.com/doi/10.1002/oby.23620', title: 'A different trial', text: 'Another trial.', doi: '10.1002/oby.23620' },
        ],
      }),
    })
    delete process.env.EXA_API_KEY
    expect(result.configured).toBe(true)
    if (!result.configured) return
    expect(result.papers.map((paper) => paper.doi)).toEqual(['10.1002/oby.23620'])
  })

  it('reads an OpenAlex inverted abstract', () => {
    const meta = readOpenAlex({
      type: 'article',
      is_retracted: false,
      abstract_inverted_index: { The: [0], program: [1], reached: [2], '4800': [3], children: [4] },
    })
    expect(meta.abstract).toBe('The program reached 4800 children')
  })

  it('keeps the Lancet paper and explains when every sentence fails verification', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    const lancet = {
      url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(23)02511-4/fulltext',
      title: 'Seasonal malaria vaccination with R21',
      text: 'Vaccine efficacy was 75% in children.',
      doi: '10.1016/S0140-6736(23)02511-4',
    }
    const result = await askResearch('How well does the R21 malaria vaccine work?', {
      resolve: async () => ({ retractionChecked: true, retracted: false, journal: true, crossrefType: 'journal-article', doi: lancet.doi }),
      exaPost: async (path, body) => {
        if (path === '/search') return { results: [lancet] }
        const schema = JSON.stringify((body as { outputSchema?: unknown }).outputSchema ?? {})
        if (schema.includes('supported')) return { answer: { checks: [{ n: 1, supported: false }] } }
        return { answer: { sentences: [{ text: 'Vaccine efficacy was 75% in children.', urls: [lancet.url] }] }, citations: [] }
      },
    })
    delete process.env.EXA_API_KEY
    expect(result.configured).toBe(true)
    if (!result.configured) return
    expect(result.sentences).toEqual([])
    expect(result.citations).toEqual([])
    expect(result.error).toBe(UNVERIFIED_ANSWER)
    expect(result.status).toBe('no-answer')
    expect(researchHttpStatus(result)).toBe(200)
    expect(result.retrieved.some((paper) => paper.doi?.toLowerCase() === '10.1016/s0140-6736(23)02511-4')).toBe(true)
    expect(result.retrieved.find((paper) => paper.doi?.toLowerCase() === '10.1016/s0140-6736(23)02511-4')?.dropReason).toContain('abstract check')
  })

  it('rejects a derived headcount and keeps a literal one', () => {
    const url = 'https://doi.org/10.1002/oby.23620'
    const doi = '10.1002/oby.23620'
    const abstract = 'Participants were 17 women and 3 men with overweight or obesity.'
    const derived = shapeResearchAnswer({
      retrieved: [{ url, title: 'Pilot', text: 'Secondary analysis.', doi }],
      answer: 'A pilot of 20 adults with obesity found no change [1].',
      metaByKey: { [url]: { doi, abstract, retractionChecked: true, retracted: false, journal: true } },
    })
    expect(derived.sentences).toEqual([])
    const literal = shapeResearchAnswer({
      retrieved: [{ url, title: 'Pilot', text: 'Secondary analysis.', doi }],
      answer: 'The trial enrolled 17 women and 3 men with overweight or obesity [1].',
      metaByKey: { [url]: { doi, abstract, retractionChecked: true, retracted: false, journal: true } },
    })
    expect(literal.sentences).toHaveLength(1)
  })

  it('drops a citation that does not cover that sentence', () => {
    const counts = { url: 'https://doi.org/10.1000/counts', title: 'Main trial', text: '10 of 1786 and 22 of 1787, efficacy 54.0%.', doi: '10.1000/counts' }
    const percent = { url: 'https://doi.org/10.1000/percent', title: 'Other trial', text: 'Efficacy was 54.0%.', doi: '10.1000/percent' }
    const shaped = shapeResearchAnswer({
      retrieved: [counts, percent],
      numberedSources: [counts, percent],
      answer: { sentences: [{ text: 'There were 10 of 1786 and 22 of 1787 events, and efficacy was 54.0%.', urls: [counts.url, percent.url] }] },
    })
    expect(shaped.citations.map((paper) => paper.doi)).toEqual(['10.1000/counts'])
    expect(shaped.sentences[0]?.cites).toEqual([1])
  })

  it('strips site suffixes, keeps the full title, and links aggregators to doi.org', () => {
    expect(cleanTitle('Roll out and prospects of the malaria vaccine R21/Matrix-M | PLOS Medicine')).toBe(
      'Roll out and prospects of the malaria vaccine R21/Matrix-M',
    )
    const full = 'Efficacy of seasonal malaria vaccination with R21 in children over two transmission seasons'
    expect(chooseTitle(`${full.slice(0, 40)}... | Endocrine Reviews | Oxford Ac`, full)).toBe(full)
    const shaped = shapeResearchAnswer({
      retrieved: [{
        url: 'https://discovery.researcher.life/article/r21/10.1016/s0140-6736(23)02511-4',
        title: 'Seasonal malaria vaccination | Lancet',
        text: 'A phase 3 trial.',
        doi: '10.1016/S0140-6736(23)02511-4',
      }],
      answer: null,
      metaByKey: {
        'https://discovery.researcher.life/article/r21/10.1016/s0140-6736(23)02511-4': {
          doi: '10.1016/S0140-6736(23)02511-4',
          title: 'Seasonal malaria vaccination with R21 in Matrix-M adjuvant',
          retractionChecked: true,
          retracted: false,
          journal: true,
        },
      },
    })
    expect(shaped.retrieved[0]?.sourceUrl?.toLowerCase()).toBe('https://doi.org/10.1016/s0140-6736(23)02511-4')
    expect(shaped.retrieved[0]?.href?.toLowerCase()).toBe('https://doi.org/10.1016/s0140-6736(23)02511-4')
    expect(shaped.retrieved[0]?.title).toBe('Seasonal malaria vaccination with R21 in Matrix-M adjuvant')
  })

  it('tells the model to cite both a benefit and a null trial when both were retrieved', () => {
    const query = answerQuery(
      'Does intermittent fasting improve insulin sensitivity?',
      [
        { url: 'https://doi.org/10.1016/j.cmet.2018.04.010', title: 'Early time-restricted feeding', text: 'Early time-restricted feeding improves insulin sensitivity.' },
        { url: 'https://doi.org/10.1002/oby.23620', title: 'Time-restricted eating pilot', text: 'Time-restricted eating did not change insulin sensitivity.' },
      ],
    )
    expect(query).toContain('Say that they disagree')
    expect(query).toContain('Reports a benefit.')
    expect(query).toContain('Reports no effect.')
    expect(ANSWER_SYSTEM).toContain('overweight or obesity')
    expect(ANSWER_SYSTEM).toContain('17 plus 3 participants')
    expect(ANSWER_SYSTEM).toContain('Do not summarize only the majority')
  })

  it('keeps a supported sentence when the other side was also retrieved', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    const benefit = {
      url: 'https://doi.org/10.1016/j.cmet.2018.04.010',
      title: 'Early time-restricted feeding',
      text: 'Early time-restricted feeding improves insulin sensitivity in men with prediabetes.',
      doi: '10.1016/j.cmet.2018.04.010',
    }
    const none = {
      url: 'https://doi.org/10.1002/oby.23620',
      title: 'Time-restricted eating pilot',
      text: 'Time-restricted eating did not change insulin sensitivity.',
      doi: '10.1002/oby.23620',
    }
    const result = await askResearch('Does intermittent fasting improve insulin sensitivity?', {
      resolve: async () => ({ retractionChecked: true, retracted: false, journal: true, crossrefType: 'journal-article' }),
      exaPost: async (path, body) => {
        if (path === '/search') return { results: [benefit, none] }
        const schema = JSON.stringify((body as { outputSchema?: unknown }).outputSchema ?? {})
        if (schema.includes('supported')) return { answer: { checks: [{ n: 1, supported: true }] } }
        return { answer: { sentences: [{ text: 'Time-restricted eating did not change insulin sensitivity.', urls: [none.url] }] }, citations: [] }
      },
    })
    delete process.env.EXA_API_KEY
    expect(result.configured).toBe(true)
    if (!result.configured) return
    expect(result.error).toBeUndefined()
    expect(result.status).toBeUndefined()
    expect(result.sentences).toHaveLength(1)
    expect(result.citations.map((paper) => paper.doi)).toEqual(['10.1002/oby.23620'])
    expect(result.retrieved.some((paper) => paper.doi === '10.1016/j.cmet.2018.04.010')).toBe(true)
  })

  it('labels a significant efficacy result as a benefit and a null primary as no effect', () => {
    const m72 = 'The vaccine efficacy was 54.0% (90% confidence interval [CI], 13.9 to 75.4; 95% CI, 2.9 to 78.2; P = 0.04). Serious adverse events, potential immune-mediated diseases, and deaths occurred with similar frequencies in the two groups. M72/AS01E provided 54.0% protection for M. tuberculosis-infected adults against active pulmonary tuberculosis disease, without evident safety concerns.'
    expect(studyDirection(m72)).toBe('benefit')
    expect(studyDirection('Vaccine efficacy was 12.0% (P = 0.04).')).toBe('benefit')
    expect(studyDirection('Serious adverse events occurred with similar frequencies in the two groups.')).toBe('unclear')
    expect(studyDirection('Time-restricted eating did not alter insulin sensitivity or beta-cell function.')).toBe('no-effect')
    expect(studyDirection('Early time-restricted feeding improves insulin sensitivity.')).toBe('benefit')
    expect(studyDirection('Vaccine efficacy was 54.0% (P = 0.80).')).toBe('unclear')
  })

  it('strips HTML from titles and a journal-name tail', () => {
    expect(cleanTitle('Phase 2b Controlled Trial of M72/AS01<sub>E</sub> Vaccine to Prevent Tuberculosis')).toBe(
      'Phase 2b Controlled Trial of M72/AS01E Vaccine to Prevent Tuberculosis',
    )
    expect(cleanTitle('Phase 2b Controlled Trial of M72/AS01\n                    <sub>E</sub> Vaccine to Prevent Tuberculosis')).toBe(
      'Phase 2b Controlled Trial of M72/AS01E Vaccine to Prevent Tuberculosis',
    )
    expect(cleanTitle('Trial of M72/AS01<i>E</i> in adults')).toBe('Trial of M72/AS01E in adults')
    expect(cleanTitle('Early Time-Restricted Feeding Improves Insulin Sensitivity - Cell Metabolism')).toBe(
      'Early Time-Restricted Feeding Improves Insulin Sensitivity',
    )
  })

  it('reads a DOI from the excerpt and confirms the title with Crossref', async () => {
    const excerpt = 'The Canadian trial is described in the full text. doi: 10.1016/j.cjca.2023.09.017. End of page.'
    expect(doiFromExcerpt(excerpt)).toBe('10.1016/j.cjca.2023.09.017')
    const calls: string[] = []
    const meta = await resolvePaperMetadata(
      { url: 'https://publisher.example/cjca-page', title: 'Publisher page title', text: excerpt },
      {
        timeoutMs: 1000,
        fetchImpl: async (url) => {
          calls.push(url)
          if (url.includes('api.crossref.org/works/10.1016%2Fj.cjca.2023.09.017') || url.includes('api.crossref.org/works/10.1016/j.cjca.2023.09.017')) {
            return json({
              message: {
                DOI: '10.1016/j.cjca.2023.09.017',
                type: 'journal-article',
                title: ['A Crossref title for the Canadian trial'],
                'container-title': ['Canadian Journal of Cardiology'],
                author: [{ given: 'A', family: 'Author' }],
                issued: { 'date-parts': [[2023]] },
              },
            })
          }
          if (url.includes('api.openalex.org')) return json({ type: 'article', is_retracted: false, display_name: 'OpenAlex title' })
          return json({})
        },
      },
    )
    expect(calls.some((url) => url.includes('10.1016') && url.includes('j.cjca.2023.09.017'))).toBe(true)
    expect(meta.doi?.toLowerCase()).toBe('10.1016/j.cjca.2023.09.017')
    expect(meta.title).toBe('A Crossref title for the Canadian trial')
    expect(meta.venue).toBe('Canadian Journal of Cardiology')
  })

  it('uses a Europe PMC abstract when Crossref and OpenAlex have none', async () => {
    const doi = '10.1016/j.cmet.2018.04.010'
    const meta = await resolvePaperMetadata(
      { url: `https://doi.org/${doi}`, doi, title: 'Early time-restricted feeding' },
      {
        timeoutMs: 1000,
        fetchImpl: async (url) => {
          if (url.includes('api.crossref.org/works/')) {
            return json({ message: { DOI: doi, type: 'journal-article', title: ['Early Time-Restricted Feeding Improves Insulin Sensitivity'] } })
          }
          if (url.includes('api.openalex.org')) return json({ type: 'article', is_retracted: false, display_name: 'Early Time-Restricted Feeding Improves Insulin Sensitivity' })
          if (url.includes('europepmc')) {
            return json({ resultList: { result: [{ abstractText: 'Early time-restricted feeding improves insulin sensitivity.' }] } })
          }
          return json({})
        },
      },
    )
    expect(readEuropePmcAbstract({ resultList: { result: [{ abstractText: 'Early time-restricted feeding improves insulin sensitivity.' }] } })).toBe(
      'Early time-restricted feeding improves insulin sensitivity.',
    )
    expect(meta.abstract).toBe('Early time-restricted feeding improves insulin sensitivity.')
  })

  it('pins papers that the attached runs actually returned', () => {
    // Shape-only check. A search miss is covered by the askResearch pin test below.
    const pinned = [
      { doi: '10.1016/s0140-6736(23)02511-4', title: 'Safety and efficacy of malaria vaccine candidate R21/Matrix-M in African children: a multicentre, double-blind, randomised, controlled, phase 3 trial' },
      { doi: '10.1016/j.cmet.2018.04.010', title: 'Early Time-Restricted Feeding Improves Insulin Sensitivity, Blood Pressure, and Oxidative Stress Even Without Weight Loss in Men with Prediabetes' },
      { doi: '10.1186/s12986-021-00613-9', title: 'Time-restricted feeding improves blood glucose and insulin sensitivity in overweight patients with type 2 diabetes: a randomised controlled trial' },
      { doi: '10.1002/oby.23620', title: 'Time-restricted eating did not alter insulin sensitivity or beta-cell function in adults with obesity: A randomized pilot study' },
      { doi: '10.1056/nejmoa1803484', title: 'Phase 2b Controlled Trial of M72/AS01E Vaccine to Prevent Tuberculosis' },
      { doi: '10.1056/nejmoa1909953', title: 'Final Analysis of a Trial of M72/AS01E Vaccine to Prevent Tuberculosis' },
      { doi: '10.1056/nejmoa2033400', title: 'Four-Month Rifapentine Regimens with or without Moxifloxacin for Tuberculosis' },
    ]
    const papers: SourceFields[] = pinned.map((item) => ({
      url: `https://doi.org/${item.doi}`,
      title: `${item.title} | Publisher page`,
      text: 'The trial reported its primary outcome in the abstract.',
      doi: item.doi,
    }))
    const metaByKey = Object.fromEntries(papers.map((paper) => [paper.url, {
      doi: paper.doi,
      title: paper.title?.replace(/ \| Publisher page$/, ''),
      retractionChecked: true,
      retracted: false,
      journal: true,
      crossrefType: 'journal-article',
      abstract: 'The trial reported its primary outcome in the abstract.',
    }]))
    const shaped = shapeResearchAnswer({ retrieved: papers, answer: null, metaByKey })
    const present = new Set([...shaped.retrieved, ...shaped.citations].map((paper) => paper.doi?.toLowerCase()))
    for (const item of pinned) expect(present.has(item.doi), item.doi).toBe(true)
    expect(shaped.retrieved.find((paper) => paper.doi === '10.1016/s0140-6736(23)02511-4')?.title.startsWith('Safety and efficacy')).toBe(true)
    expect(shaped.retrieved.every((paper) => paper.dropReason)).toBe(true)
  })

  it('injects pinned papers when search omits them', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    const fasting = [
      '10.1016/j.cmet.2018.04.010',
      '10.1186/s12986-021-00613-9',
      '10.1002/oby.23620',
    ]
    expect(pinsForQuestion('Does intermittent fasting improve insulin sensitivity?').sort()).toEqual([...fasting].sort())
    const decoy = {
      url: 'https://doi.org/10.1000/decoy',
      title: 'A narrative review of diets',
      text: 'A narrative review of diets.',
      doi: '10.1000/decoy',
    }
    let query = ''
    const result = await askResearch('Does intermittent fasting improve insulin sensitivity?', {
      resolve: async (fields) => {
        const doi = (fields.doi || '').toLowerCase()
        if (!fasting.includes(doi)) {
          return { retractionChecked: true, retracted: false, journal: true, crossrefType: 'journal-article', doi: fields.doi }
        }
        return {
          doi,
          title: `Pinned ${doi}`,
          abstract: doi === '10.1002/oby.23620'
            ? 'Time-restricted eating did not alter insulin sensitivity.'
            : 'Early time-restricted feeding improves insulin sensitivity.',
          retractionChecked: true,
          retracted: false,
          journal: true,
          crossrefType: 'journal-article',
          year: '2018',
        }
      },
      exaPost: async (path, body) => {
        if (path === '/search') return { results: [decoy] }
        const schema = JSON.stringify((body as { outputSchema?: unknown }).outputSchema ?? {})
        if (schema.includes('supported')) return { answer: { checks: [{ n: 1, supported: true }] } }
        query = String((body as { query?: string }).query || '')
        return {
          answer: { sentences: [{ text: 'Early time-restricted feeding improves insulin sensitivity.', urls: [`https://doi.org/${fasting[0]}`] }] },
          citations: [],
        }
      },
    })
    delete process.env.EXA_API_KEY
    expect(result.configured).toBe(true)
    if (!result.configured) return
    for (const doi of fasting) expect(query, doi).toContain(doi)
    const present = new Set([...result.citations, ...result.retrieved].map((paper) => paper.doi?.toLowerCase()))
    for (const doi of fasting) expect(present.has(doi), doi).toBe(true)
    expect(result.sentences).toHaveLength(1)
  })

  it('injects the M72 trials for the vaccine question and the Dorman trial for the regimen question', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    const m72 = ['10.1056/nejmoa1803484', '10.1056/nejmoa1909953']
    const dorman = '10.1056/nejmoa2033400'
    expect(pinsForQuestion('Does the M72/AS01E vaccine prevent tuberculosis?').sort()).toEqual([...m72].sort())
    expect(pinsForQuestion('Did a 4-month rifapentine plus moxifloxacin regimen shorten tuberculosis treatment?')).toEqual([dorman])
    const decoy = {
      url: 'https://doi.org/10.1000/decoy',
      title: 'A narrative review',
      text: 'A narrative review of tuberculosis.',
      doi: '10.1000/decoy',
    }
    async function run(question: string) {
      return askResearch(question, {
        resolve: async (fields) => {
          const doi = (fields.doi || '').toLowerCase()
          const known = [...m72, dorman]
          if (!known.includes(doi)) {
            return { retractionChecked: true, retracted: false, journal: true, crossrefType: 'journal-article' }
          }
          return {
            doi,
            title: doi === dorman ? 'Four-Month Rifapentine Regimens with or without Moxifloxacin for Tuberculosis' : `M72 trial ${doi}`,
            abstract: doi === dorman
              ? 'In an open-label, phase 3, randomized, controlled trial, a 4-month rifapentine-based regimen with moxifloxacin was compared with a standard 6-month regimen.'
              : 'The vaccine efficacy was 54.0% (P = 0.04). M72/AS01E provided 54.0% protection against active pulmonary tuberculosis.',
            retractionChecked: true,
            retracted: false,
            journal: true,
            crossrefType: 'journal-article',
            year: doi === dorman ? '2021' : '2018',
          }
        },
        exaPost: async (path, body) => {
          if (path === '/search') return { results: [decoy] }
          const schema = JSON.stringify((body as { outputSchema?: unknown }).outputSchema ?? {})
          if (schema.includes('supported')) return { answer: { checks: [] } }
          return { answer: { sentences: [] }, citations: [] }
        },
      })
    }
    const vaccine = await run('Does the M72/AS01E vaccine prevent tuberculosis?')
    const regimen = await run('Did a 4-month rifapentine plus moxifloxacin regimen shorten tuberculosis treatment?')
    delete process.env.EXA_API_KEY
    expect(vaccine.configured && regimen.configured).toBe(true)
    if (!vaccine.configured || !regimen.configured) return
    const vaccineDois = new Set([...vaccine.citations, ...vaccine.retrieved].map((paper) => paper.doi?.toLowerCase()))
    const regimenDois = new Set([...regimen.citations, ...regimen.retrieved].map((paper) => paper.doi?.toLowerCase()))
    for (const doi of m72) expect(vaccineDois.has(doi), doi).toBe(true)
    expect(vaccineDois.has(dorman)).toBe(false)
    expect(regimenDois.has(dorman)).toBe(true)
    expect([...regimenDois].some((doi) => m72.includes(doi || ''))).toBe(false)
  })

  it('does not inject pins for an unrelated question', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    expect(pinsForQuestion('Does extreme heat raise mortality?')).toEqual([])
    const result = await askResearch('Does extreme heat raise mortality?', {
      resolve: async () => ({ retractionChecked: true, retracted: false, journal: true, crossrefType: 'journal-article' }),
      exaPost: async (path, body) => {
        if (path === '/search') {
          return { results: [{ url: 'https://doi.org/10.1038/s41586-020-2649-2', title: 'Heat and mortality', text: 'Mortality rose during extreme heat.', doi: '10.1038/s41586-020-2649-2' }] }
        }
        const schema = JSON.stringify((body as { outputSchema?: unknown }).outputSchema ?? {})
        if (schema.includes('supported')) return { answer: { checks: [{ n: 1, supported: true }] } }
        return { answer: { sentences: [{ text: 'Mortality rose during extreme heat.', urls: ['https://doi.org/10.1038/s41586-020-2649-2'] }] }, citations: [] }
      },
    })
    delete process.env.EXA_API_KEY
    expect(result.configured).toBe(true)
    if (!result.configured) return
    const dois = [...result.citations, ...result.retrieved].map((paper) => paper.doi?.toLowerCase())
    expect(dois).toEqual(['10.1038/s41586-020-2649-2'])
    expect(researchHttpStatus({ configured: true, error: 'Exa /search timed out.' })).toBe(502)
  })
})

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}
