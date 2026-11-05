import { describe, expect, it } from 'vitest'
import { askResearch } from '@/lib/research/ask'
import { questionIsGrounded } from '@/lib/research/claims'
import { renderExtractSentence, spanInAbstract, supportText, verifyExtract, type PaperExtract } from '@/lib/research/extract'

// Openings recorded from live /api/research/ask excerpts for these DOIs.
// The c998ba8 review did not include response bodies. These are the excerpts
// the same papers returned on the preceding live rechecks, including the
// short Sutton summary and the Dorman opening that omits 2,516.
const SUTTON_LIVE = 'Summary: The article reports that early time-restricted feeding (eating within a limited daily window) improves insulin sensitivity, lowers blood pressure, and reduces oxidative stress in men with prediabetes, even without weight loss.'
const ANDRIESSEN_LIVE = 'Summary: A 3-week daytime time-restricted eating (TRE) regimen, with a 10-hour daily eating window, was compared to spreading calories over at least 14 hours in adults with type 2 diabetes. TRE did not change hepatic glycogen content or overall insulin sensitivity (hepatic and peripheral).'
const DORMAN_LIVE = 'BACKGROUND: Rifapentine-based regimens have potent antimycobacterial activity that may allow for a shorter course in patients with drug-susceptible pulmonary tuberculosis. METHODS: In an open-label, phase 3, randomized, controlled trial involving persons with newly diagnosed pulmonary tuberculosis from 13 countries, we compared two 4-month rifapentine-based regimens with a standard 6-month regimen.'
const DORMAN_FULL = `${DORMAN_LIVE} Among 2516 participants who had undergone randomization, a 4-month rifapentine regimen with moxifloxacin was noninferior to the 6-month control.`
const M72_LIVE = 'A phase 2b randomized, double-blind, placebo-controlled trial evaluated the M72/AS01 E tuberculosis vaccine in HIV-negative adults (18-50). The vaccine efficacy was 54.0%.'
const M72_FINAL = 'The final analysis of the M72/AS01E vaccine reported vaccine efficacy of 49.7% against pulmonary tuberculosis, alongside the earlier 54.0% estimate.'
const R21_LIVE = 'We report on safety and efficacy of the R21/Matrix-M vaccine in a phase 3 trial. The phase 3 trial enrolled 4878 children. Seasonal efficacy was 75% and standard efficacy was 68%.'
const MMWR_LIVE = 'A randomized controlled trial indicated that a 4-month regimen containing rifapentine and moxifloxacin was as effective as the standard 6-month regimen. CDC recommends the 4-month regimen.'
const KIDNEY_LIVE = 'Nephrolithiasis is a kidney stone disease. Diet and fluids change the risk of stones.'

function field(text: string, evidence_span = text) {
  return { text, evidence_span }
}

describe('live excerpts from the failing rechecks', () => {
  it('keeps a Sutton benefit that the short summary supports and drops postprandial', () => {
    const extract: PaperExtract = {
      doi: '10.1016/j.cmet.2018.04.010',
      effect_direction: 'benefit',
      population: field('men with prediabetes'),
      intervention: field('early time-restricted feeding'),
      comparator: null,
      outcome: field('improves insulin sensitivity'),
      key_numbers: [field('postprandial insulin', 'reduced fasting and postprandial insulin')],
      n: null,
    }
    const verified = verifyExtract(extract, SUTTON_LIVE)
    expect(verified.rejectReason).toBeNull()
    expect(verified.keyNumbers).toEqual([])
    expect(verified.outcome).toContain('improves insulin sensitivity')
    expect(questionIsGrounded('Does intermittent fasting improve insulin sensitivity in adults?', [SUTTON_LIVE, ANDRIESSEN_LIVE])).toBe(true)
    expect(questionIsGrounded('Does wearing blue socks on Tuesdays reduce the risk of kidney stones in left-handed adults?', [KIDNEY_LIVE])).toBe(false)
  })

  it('uses the full Dorman abstract when the live excerpt omits 2,516, and does not stop at MMWR', async () => {
    expect(DORMAN_LIVE.includes('2516')).toBe(false)
    expect(supportText({ text: DORMAN_LIVE }, { abstract: DORMAN_FULL })).toContain('2516')
    process.env.EXA_API_KEY = 'test-key-value'
    const dorman = { url: 'https://doi.org/10.1056/nejmoa2033400', doi: '10.1056/nejmoa2033400', title: 'Four-Month Rifapentine Regimens with or without Moxifloxacin for Tuberculosis', text: DORMAN_LIVE }
    const mmwr = { url: 'https://doi.org/10.15585/mmwr.mm7108a1', doi: '10.15585/mmwr.mm7108a1', title: 'Interim Guidance: 4-Month Rifapentine-Moxifloxacin Regimen', text: MMWR_LIVE }
    const result = await askResearch('Is a 4-month rifapentine-based regimen as effective as the standard 6-month regimen for drug-susceptible pulmonary tuberculosis?', {
      resolve: async (fields) => fields.doi === dorman.doi
        ? { doi: dorman.doi, title: dorman.title, authors: ['Susan E. Dorman'], year: '2021', abstract: DORMAN_FULL, retractionChecked: true, retracted: false, journal: true, crossrefType: 'journal-article' }
        : { doi: mmwr.doi, title: mmwr.title, abstract: MMWR_LIVE, venue: 'MMWR', retractionChecked: true, retracted: false, journal: true, crossrefType: 'journal-article' },
      exaPost: async (path) => {
        if (path === '/search') return { results: [mmwr, dorman] }
        return {
          answer: {
            extracts: [
              {
                doi: dorman.doi,
                effect_direction: 'benefit',
                population: field('2516 participants', 'Among 2516 participants'),
                intervention: field('4-month rifapentine regimen with moxifloxacin'),
                outcome: field('was noninferior'),
                n: field('2,516', 'Among 2516 participants'),
                key_numbers: [],
              },
              {
                doi: mmwr.doi,
                effect_direction: 'benefit',
                intervention: field('4-month regimen containing rifapentine and moxifloxacin'),
                outcome: field('as effective as the standard 6-month regimen'),
                key_numbers: [],
                n: null,
              },
            ],
          },
        }
      },
    })
    delete process.env.EXA_API_KEY
    expect(result.configured).toBe(true)
    if (!result.configured) return
    const text = result.sentences.map((sentence) => sentence.text).join(' ')
    expect(result.citations.map((paper) => paper.doi)).toContain(dorman.doi)
    expect(result.citations.map((paper) => paper.doi)).not.toEqual([mmwr.doi])
    expect(text).toContain('2,516')
    expect(text.toLowerCase()).toContain('noninferior')
    expect(text).toContain('Dorman 2021')
    expect(result.citations.find((paper) => paper.doi === mmwr.doi)?.statusLabel === 'Guidance' || !result.citations.some((paper) => paper.doi === mmwr.doi)).toBe(true)
  })

  it('keeps M72 and R21 figures that the live abstracts print', () => {
    expect(questionIsGrounded('Does the M72/AS01E vaccine prevent tuberculosis?', [M72_LIVE])).toBe(true)
    expect(questionIsGrounded('How well does the R21 malaria vaccine work?', [R21_LIVE])).toBe(true)
    const m72 = verifyExtract({
      doi: '10.1056/nejmoa1803484',
      effect_direction: 'benefit',
      population: field('HIV-negative adults'),
      intervention: field('M72/AS01 E'),
      comparator: null,
      outcome: field('vaccine efficacy was 54.0%', 'The vaccine efficacy was 54.0%'),
      key_numbers: [field('54.0%', 'The vaccine efficacy was 54.0%')],
      n: null,
    }, M72_LIVE)
    const final = verifyExtract({
      doi: '10.1056/nejmoa1909953',
      effect_direction: 'benefit',
      population: null,
      intervention: field('M72/AS01E'),
      comparator: null,
      outcome: field('vaccine efficacy of 49.7%'),
      key_numbers: [field('49.7%', 'vaccine efficacy of 49.7%'), field('54.0%', 'earlier 54.0% estimate')],
      n: null,
    }, M72_FINAL)
    const r21 = verifyExtract({
      doi: '10.1016/s0140-6736(23)02511-4',
      effect_direction: 'benefit',
      population: field('4878 children', 'enrolled 4878 children'),
      intervention: field('R21/Matrix-M'),
      comparator: null,
      outcome: field('Seasonal efficacy was 75% and standard efficacy was 68%'),
      key_numbers: [field('75%', 'Seasonal efficacy was 75%'), field('68%', 'standard efficacy was 68%'), field('4878', 'enrolled 4878 children')],
      n: field('4878', 'enrolled 4878 children'),
    }, R21_LIVE)
    expect(m72.rejectReason).toBeNull()
    expect(m72.keyNumbers).toContain('54.0%')
    expect(final.rejectReason).toBeNull()
    expect(final.keyNumbers).toEqual(expect.arrayContaining(['49.7%', '54.0%']))
    expect(r21.rejectReason).toBeNull()
    expect(r21.keyNumbers).toEqual(expect.arrayContaining(['75%', '68%', '4878']))
  })
})

describe('3ff297c debug cases', () => {
  it('keeps Dorman when the span uses a unicode dash and says noninferior', () => {
    const abstract = 'Among 2516 participants, a 4-month rifapentine regimen with moxifloxacin was noninferior to the 6-month control.'
    const extract: PaperExtract = {
      doi: '10.1056/nejmoa2033400',
      effect_direction: 'null',
      population: field('2516 participants'),
      intervention: field('4\u2011month rifapentine regimen with moxifloxacin', '4\u2011month rifapentine regimen with moxifloxacin'),
      comparator: null,
      outcome: field('was non-inferior', 'was non-inferior'),
      key_numbers: [field('2,516', 'Among 2516 participants')],
      n: null,
    }
    expect(spanInAbstract(extract.intervention!.evidence_span, abstract)).toBe(true)
    const verified = verifyExtract(extract, abstract)
    expect(verified.rejectReason).toBeNull()
    expect(verified.direction).toBe('noninferior')
    const sentence = renderExtractSentence(verified, 'Dorman 2021', abstract)
    expect(sentence).toMatch(/noninferior/i)
    expect(sentence).toMatch(/2516|2,516/)
  })

  it('keeps Andriessen when the span hyphenates time-restricted differently', () => {
    const abstract = 'In adults with type 2 diabetes, time-restricted eating did not change hepatic and peripheral insulin sensitivity.'
    const extract: PaperExtract = {
      doi: '10.1007/s00125-022-05752-z',
      effect_direction: 'null',
      population: field('adults with type 2 diabetes'),
      intervention: field('time\u2010restricted eating', 'time\u2010restricted eating'),
      comparator: null,
      outcome: field('did not change hepatic and peripheral insulin sensitivity'),
      key_numbers: [],
      n: null,
    }
    const verified = verifyExtract(extract, abstract)
    expect(verified.rejectReason).toBeNull()
    expect(verified.direction).toBe('no-difference')
  })

  it('does not turn 13 and 26 case counts into 39 adults', () => {
    const abstract = '13 participants in the vaccine group and 26 in the placebo group developed tuberculosis. Efficacy was 54.0%.'
    const extract: PaperExtract = {
      doi: '10.1056/nejmoa1909953',
      effect_direction: 'benefit',
      population: null,
      intervention: field('vaccine'),
      comparator: field('placebo'),
      outcome: field('Efficacy was 54.0%'),
      key_numbers: [field('13', '13 participants'), field('26', '26 in the placebo'), field('39 adults', '39 adults')],
      n: null,
    }
    const sentence = renderExtractSentence(verifyExtract(extract, abstract), 'Tait 2019', abstract)
    expect(sentence).not.toContain('39')
    expect(sentence).toContain('54.0%')
    expect(sentence.match(/\[1\]/g) || []).toHaveLength(0)
  })
})
