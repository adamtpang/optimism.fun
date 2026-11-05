import { describe, expect, it } from 'vitest'
import { askResearch, includeResearchDebug, researchHttpStatus } from '@/lib/research/ask'
import { ExaRequestError } from '@/lib/sources/exa'
import { fetchRegistryAbstract } from '@/lib/research/metadata'
import { paperStatus, statusLabel } from '@/lib/research/papers'
import { citeName, renderExtractSentence, spanInAbstract, spanMatch, supportText, verifyExtract, type PaperExtract } from '@/lib/research/extract'

const SUTTON = 'Intermittent fasting (IF) improves cardiometabolic health. Men with prediabetes were randomized to early time-restricted feeding (eTRF) for 5 weeks. eTRF improved insulin sensitivity.'
const DORMAN = 'Among 2516 participants who had undergone randomization, a 4-month rifapentine regimen with moxifloxacin was noninferior to the 6-month control.'
const M72 = 'A total of 1786 participants received M72/AS01E and 1787 received placebo. The vaccine efficacy was 54.0%.'

function field(text: string, evidence_span = text): { text: string; evidence_span: string } {
  return { text, evidence_span }
}

describe('structured extracts', () => {
  it('uses the registry abstract instead of a short page excerpt', () => {
    const text = supportText(
      { text: 'Publisher page without the sample size.' },
      { abstract: DORMAN },
    )
    expect(text).toContain('2516')
    expect(text).not.toContain('Publisher page')
  })

  it('drops a bad field and keeps the paper when intervention and outcome still match', () => {
    const extract: PaperExtract = {
      doi: '10.1016/j.cmet.2018.04.010',
      effect_direction: 'benefit',
      population: field('men with prediabetes'),
      intervention: field('early time-restricted feeding'),
      comparator: null,
      outcome: field('improved insulin sensitivity'),
      key_numbers: [field('postprandial insulin', 'postprandial insulin')],
      n: field('5 weeks', 'for 5 weeks'),
    }
    const verified = verifyExtract(extract, SUTTON)
    expect(verified.rejectReason).toBeNull()
    expect(verified.droppedFields.join(' ')).toContain('key_numbers')
    expect(verified.keyNumbers).toEqual([])
    expect(verified.n).toContain('5 weeks')
    const sentence = renderExtractSentence(verified, citeName(['Elizabeth Sutton'], '2018'), SUTTON)
    expect(sentence).toContain('Sutton 2018')
    expect(sentence).toContain('early time-restricted feeding')
    expect(sentence).toContain('improved insulin sensitivity')
    expect(sentence).not.toContain('postprandial')
  })

  it('rejects the paper when the intervention span is not in the abstract', () => {
    const extract: PaperExtract = {
      doi: '10.1038/s41581-025-00990-x',
      effect_direction: 'null',
      population: field('adults'),
      intervention: field('clothing color', 'clothing color'),
      comparator: null,
      outcome: field('kidney stone', 'kidney stone'),
      key_numbers: [],
      n: null,
    }
    const verified = verifyExtract(extract, 'Nephrolithiasis is a kidney stone disease.')
    expect(verified.rejectReason).toContain('intervention')
    expect(spanInAbstract('clothing color', 'Nephrolithiasis is a kidney stone disease.')).toBe(false)
  })

  it('keeps 2,516 from the same abstract the claim was written from', () => {
    const extract: PaperExtract = {
      doi: '10.1056/nejmoa2033400',
      effect_direction: 'benefit',
      population: field('2516 participants', 'Among 2516 participants'),
      intervention: field('4-month rifapentine regimen with moxifloxacin'),
      comparator: field('6-month control'),
      outcome: field('was noninferior'),
      key_numbers: [field('2,516', 'Among 2516 participants')],
      n: field('2516', '2516 participants'),
    }
    const verified = verifyExtract(extract, DORMAN)
    const sentence = renderExtractSentence(verified, 'Dorman 2021', DORMAN)
    expect(verified.rejectReason).toBeNull()
    expect(sentence).toContain('2,516')
    expect(sentence.toLowerCase()).toContain('noninferior')
    expect(sentence).toContain('Dorman 2021')
  })

  it('writes the M72 arm total from the printed counts', () => {
    const extract: PaperExtract = {
      doi: '10.1056/nejmoa1803484',
      effect_direction: 'benefit',
      population: null,
      intervention: field('M72/AS01E'),
      comparator: field('placebo'),
      outcome: field('vaccine efficacy was 54.0%'),
      key_numbers: [field('54.0%', 'The vaccine efficacy was 54.0%'), field('1786', '1786 participants received M72/AS01E'), field('1787', '1787 received placebo')],
      n: null,
    }
    const sentence = renderExtractSentence(verifyExtract(extract, M72), 'Tait 2018', M72)
    expect(sentence).toContain('54.0%')
    expect(sentence).toContain('1786')
    expect(sentence).toContain('1787')
    expect(sentence).not.toContain('3,573')
    expect(sentence).not.toContain('39')
  })

  it('matches a span after dashes, quotes, and hyphenation, and logs the closest miss', () => {
    const abstract = 'A 4-month rifapentine\u2013moxifloxacin regimen was non-inferior to the 6-month control among 2516 participants.'
    expect(spanInAbstract('4 month rifapentine-moxifloxacin regimen was noninferior', abstract)).toBe(true)
    const missed = spanMatch('clothing color changes kidney stone risk completely', abstract)
    expect(missed.ok).toBe(false)
    expect(missed.closest.length).toBeGreaterThan(0)
  })

  it('calls Dorman noninferior and does not invent 39 from case counts', () => {
    const dorman = 'Among 2516 participants, a 4-month rifapentine regimen with moxifloxacin was noninferior to the 6-month control.'
    const extract: PaperExtract = {
      doi: '10.1056/nejmoa2033400',
      effect_direction: 'null',
      population: field('2516 participants', 'Among 2516 participants'),
      intervention: field('4-month rifapentine regimen with moxifloxacin'),
      comparator: null,
      outcome: field('was noninferior'),
      key_numbers: [field('2,516', 'Among 2516 participants')],
      n: null,
    }
    const verified = verifyExtract(extract, dorman)
    expect(verified.direction).toBe('noninferior')
    expect(verified.rejectReason).toBeNull()
    const cases = 'There were 13 cases in the vaccine group and 26 cases in the placebo group. Efficacy was 54.0%.'
    const invented: PaperExtract = {
      doi: '10.1056/nejmoa1909953',
      effect_direction: 'benefit',
      population: null,
      intervention: field('vaccine'),
      comparator: field('placebo'),
      outcome: field('Efficacy was 54.0%'),
      key_numbers: [field('13', '13 cases'), field('26', '26 cases'), field('39', '39 adults')],
      n: null,
    }
    const sentence = renderExtractSentence(verifyExtract(invented, cases), 'Tait 2019', cases)
    expect(sentence).not.toContain('39')
    expect(sentence).toContain('54.0%')
    expect(citeName(['Van Der Meeren'], '2018')).toBe('Van Der Meeren 2018')
    expect(citeName(['Susan E. Dorman'], '2021')).toBe('Dorman 2021')
  })

  it('asks from the full abstract and cites the verified span', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    let shown = ''
    const paper = {
      url: 'https://doi.org/10.1056/nejmoa2033400',
      title: 'Four-Month Rifapentine Regimens with or without Moxifloxacin for Tuberculosis',
      doi: '10.1056/nejmoa2033400',
      text: 'Short CDC-style blurb with no sample size.',
    }
    const result = await askResearch('Is a 4-month rifapentine regimen noninferior for tuberculosis?', {
      resolve: async () => ({
        doi: paper.doi,
        title: paper.title,
        authors: ['Susan E. Dorman'],
        year: '2021',
        abstract: DORMAN,
        retractionChecked: true,
        retracted: false,
        journal: true,
        crossrefType: 'journal-article',
      }),
      exaPost: async (path, body) => {
        if (path === '/search') return { results: [paper] }
        shown = String((body as { query?: string }).query || '')
        return {
          answer: {
            sentences: [{
              text: 'Dorman 2021 found that the rifapentine regimen with moxifloxacin was noninferior among 2516 participants.',
              paper_id: paper.doi,
              numbers: ['2516'],
            }],
          },
        }
      },
    })
    delete process.env.EXA_API_KEY
    expect(shown).toContain('2516')
    expect(shown).not.toContain('Short CDC-style')
    expect(result.configured).toBe(true)
    if (!result.configured) return
    expect(result.citations.map((item) => item.doi)).toContain(paper.doi)
    expect(result.sentences.map((sentence) => sentence.text).join(' ')).toContain('Dorman 2021')
    expect(result.sentences.map((sentence) => sentence.text).join(' ')).toMatch(/2516|2,516/)
  })
})

describe('answer length', () => {
  it('writes three to five sentences and names the paper', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    const rows = [
      {
        doi: '10.1016/j.cmet.2018.04.010',
        title: 'Early time-restricted feeding randomized trial',
        author: 'Elizabeth Sutton',
        year: '2018',
        abstract: 'Intermittent fasting as early time-restricted feeding improved insulin sensitivity in men with prediabetes over 5 weeks.',
        direction: 'benefit' as const,
        intervention: 'early time-restricted feeding',
        outcome: 'improved insulin sensitivity',
        population: 'men with prediabetes',
      },
      {
        doi: '10.1007/s00125-022-05752-z',
        title: 'Three weeks of time-restricted eating randomized trial',
        author: 'Charlotte Andriessen',
        year: '2022',
        abstract: 'Intermittent fasting as time-restricted eating did not change insulin sensitivity in adults with type 2 diabetes.',
        direction: 'null' as const,
        intervention: 'time-restricted eating',
        outcome: 'did not change insulin sensitivity',
        population: 'adults with type 2 diabetes',
      },
      {
        doi: '10.1002/oby.23620',
        title: 'Time-restricted eating randomized pilot',
        author: 'Anne Bantle',
        year: '2023',
        abstract: 'Intermittent fasting as time-restricted eating did not significantly alter insulin sensitivity in adults with overweight or obesity over 12 weeks.',
        direction: 'null' as const,
        intervention: 'time-restricted eating',
        outcome: 'did not significantly alter insulin sensitivity',
        population: 'adults with overweight or obesity',
      },
    ]
    const result = await askResearch('Does intermittent fasting improve insulin sensitivity in adults?', {
      resolve: async (fields) => {
        const row = rows.find((item) => item.doi === fields.doi)
        return {
          doi: row?.doi,
          title: row?.title,
          authors: row ? [row.author] : null,
          year: row?.year,
          abstract: row?.abstract,
          retractionChecked: true,
          retracted: false,
          journal: true,
          crossrefType: 'journal-article',
        }
      },
      exaPost: async (path) => {
        if (path === '/search') {
          return { results: rows.map((row) => ({ url: `https://doi.org/${row.doi}`, doi: row.doi, title: row.title, text: 'Page.' })) }
        }
        return {
          answer: {
            sentences: [
              { text: 'Sutton 2018 reported better insulin sensitivity after early time-restricted feeding in men with prediabetes.', paper_id: rows[0].doi, numbers: [] },
              { text: 'Andriessen 2022 found that time-restricted eating left insulin sensitivity unchanged in adults with type 2 diabetes.', paper_id: rows[1].doi, numbers: [] },
              { text: 'Bantle 2023 found that time-restricted eating left insulin sensitivity unchanged in adults with overweight or obesity.', paper_id: rows[2].doi, numbers: [] },
            ],
          },
        }
      },
    })
    delete process.env.EXA_API_KEY
    expect(result.configured).toBe(true)
    if (!result.configured) return
    expect(result.sentences.length).toBeGreaterThanOrEqual(3)
    expect(result.sentences.length).toBeLessThanOrEqual(5)
    const text = result.sentences.map((sentence) => sentence.text).join(' ')
    expect(text).toContain('Sutton 2018')
    expect(text).toContain('Andriessen 2022')
    expect(text).not.toMatch(/The study noted/i)
    expect(text).not.toMatch(/reported a benefit in/i)
    expect(result.sentences.every((sentence) => /\b(19|20)\d{2}\b/.test(sentence.text))).toBe(true)
  })
})

describe('labels and debug', () => {
  it('labels MMWR as guidance and a JES supplement as a meeting abstract', () => {
    const shared = { retractionChecked: true, retracted: false, journal: true, crossrefType: 'journal-article' }
    expect(paperStatus({ url: 'https://doi.org/10.15585/mmwr.mm7108a1', doi: '10.15585/mmwr.mm7108a1', title: 'Interim Guidance', ...shared })).toBe('guidance')
    expect(statusLabel('guidance')).toBe('Guidance')
    expect(paperStatus({ url: 'https://doi.org/10.1210/jendso/bvac150.018', doi: '10.1210/jendso/bvac150.018', ...shared })).toBe('meeting-abstract')
    expect(statusLabel('meeting-abstract')).toBe('Meeting abstract')
  })

  it('does not cite guidance alone when a primary trial was retrieved', async () => {
    process.env.EXA_API_KEY = 'test-key-value'
    const dorman = {
      url: 'https://doi.org/10.1056/nejmoa2033400',
      doi: '10.1056/nejmoa2033400',
      title: 'Four-Month Rifapentine Regimens with or without Moxifloxacin for Tuberculosis',
      text: 'Short page.',
    }
    const mmwr = {
      url: 'https://doi.org/10.15585/mmwr.mm7108a1',
      doi: '10.15585/mmwr.mm7108a1',
      title: 'Interim Guidance: 4-Month Rifapentine-Moxifloxacin Regimen',
      text: 'Short page.',
    }
    const result = await askResearch('Is a 4-month rifapentine regimen effective for tuberculosis?', {
      resolve: async (fields) => fields.doi === dorman.doi
        ? {
            doi: dorman.doi,
            title: dorman.title,
            authors: ['Susan E. Dorman'],
            year: '2021',
            abstract: 'In a randomized trial, a 4-month rifapentine regimen with moxifloxacin was noninferior.',
            retractionChecked: true,
            retracted: false,
            journal: true,
            crossrefType: 'journal-article',
          }
        : {
            doi: mmwr.doi,
            title: mmwr.title,
            abstract: 'CDC interim guidance says a 4-month rifapentine regimen is as effective as the 6-month regimen.',
            venue: 'MMWR',
            retractionChecked: true,
            retracted: false,
            journal: true,
            crossrefType: 'journal-article',
          },
      exaPost: async (path) => {
        if (path === '/search') return { results: [mmwr, dorman] }
        return {
          answer: {
            sentences: [
              { text: 'Dorman 2021 found that the rifapentine regimen with moxifloxacin was noninferior.', paper_id: dorman.doi, numbers: [] },
              { text: 'CDC guidance described the rifapentine regimen as effective for tuberculosis treatment.', paper_id: mmwr.doi, numbers: [] },
            ],
          },
        }
      },
    })
    delete process.env.EXA_API_KEY
    expect(result.configured).toBe(true)
    if (!result.configured) return
    const dois = result.citations.map((paper) => paper.doi)
    expect(dois).toContain(dorman.doi)
    expect(dois).not.toEqual([mmwr.doi])
    const guidance = result.citations.find((paper) => paper.doi === mmwr.doi) || result.retrieved.find((paper) => paper.doi === mmwr.doi)
    expect(guidance?.statusLabel).toBe('Guidance')
    expect(result.sentences.map((sentence) => sentence.text).join(' ')).toMatch(/noninferior/i)
    expect(includeResearchDebug('https://preview.example/api/research/ask?debug=1')).toBe(true)
    expect(includeResearchDebug('https://preview.example/api/research/ask')).toBe(false)
  })
})

describe('R21 wordings', () => {
  const abstract = 'The phase 3 trial of the R21/Matrix-M malaria vaccine enrolled 4878 children. Vaccine efficacy was 75% at seasonal sites.'
  const paper = {
    url: 'https://doi.org/10.1016/s0140-6736(23)02511-4',
    doi: '10.1016/s0140-6736(23)02511-4',
    title: 'Safety and efficacy of malaria vaccine candidate R21/Matrix-M in a phase 3 randomised controlled trial',
    text: 'Short page.',
  }
  for (const question of [
    'Does the R21/Matrix-M malaria vaccine work?',
    'How well does the R21 malaria vaccine work?',
    'How effective is R21/Matrix-M against malaria?',
  ]) {
    it(`cites the phase 3 trial for "${question}"`, async () => {
      process.env.EXA_API_KEY = 'test-key-value'
      const result = await askResearch(question, {
        resolve: async () => ({
          doi: paper.doi,
          title: paper.title,
          authors: ['Mehreen S. Datoo'],
          year: '2024',
          abstract,
          retractionChecked: true,
          retracted: false,
          journal: true,
          crossrefType: 'journal-article',
        }),
        exaPost: async (path) => {
          if (path === '/search') return { results: [paper] }
          if (question.startsWith('How effective')) throw new ExaRequestError(0, 'Exa /answer timed out.')
          return {
            answer: {
              sentences: [{
                text: 'Datoo 2024 found that R21/Matrix-M had 75% efficacy in a phase 3 trial of 4878 children.',
                paper_id: paper.doi,
                numbers: ['75%', '4878'],
              }],
            },
          }
        },
      })
      delete process.env.EXA_API_KEY
      expect(result.configured).toBe(true)
      if (!result.configured) return
      expect(researchHttpStatus(result)).toBe(200)
      if (question.startsWith('How effective')) {
        expect(result.status).toBe('no-answer')
        return
      }
      expect(result.status).not.toBe('no-answer')
      const text = result.sentences.map((sentence) => sentence.text).join(' ')
      expect(result.citations.map((item) => item.doi)).toContain(paper.doi)
      expect(text).toMatch(/4,?878|4878/)
      expect(text).toContain('75%')
      expect(text).toContain('2024')
    })
  }
})

describe('registry abstracts', () => {
  it('prefers the longer Europe PMC abstract', async () => {
    const fetchImpl = async (url: string) => {
      const payload = url.includes('europepmc')
        ? { resultList: { result: [{ abstractText: DORMAN }] } }
        : { message: { abstract: 'Short crossref line.', type: 'journal-article' } }
      return { ok: true, json: async () => payload } as Response
    }
    const text = await fetchRegistryAbstract('10.1056/nejmoa2033400', { fetchImpl, timeoutMs: 1000 })
    expect(text).toContain('2516')
  })
})
