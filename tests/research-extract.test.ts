import { describe, expect, it } from 'vitest'
import { askResearch } from '@/lib/research/ask'
import { fetchRegistryAbstract } from '@/lib/research/metadata'
import { citeName, renderExtractSentence, spanInAbstract, supportText, verifyExtract, type PaperExtract } from '@/lib/research/extract'

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
    expect(sentence).toContain('3,573 adults (1,786 vaccine, 1,787 placebo)')
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
            extracts: [{
              doi: paper.doi,
              effect_direction: 'benefit',
              population: field('2516 participants', 'Among 2516 participants'),
              intervention: field('4-month rifapentine regimen with moxifloxacin'),
              comparator: field('6-month control'),
              outcome: field('was noninferior'),
              n: field('2,516', 'Among 2516 participants'),
              key_numbers: [],
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
    expect(result.sentences.map((sentence) => sentence.text).join(' ')).toContain('2,516')
  })
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
