import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { matchesIntervention } from '@/lib/research/claims'
import {
  auditSentences,
  coversPrimary,
  readWritten,
  selectWritingPapers,
  sentenceProblems,
} from '@/lib/research/writing'

const DORMAN = 'Among 2516 participants who had undergone randomization, a 4-month rifapentine regimen with moxifloxacin was noninferior to the 6-month control for drug-susceptible pulmonary tuberculosis.'
const TAIT = 'A total of 1786 participants received M72/AS01E and 1787 received placebo. The vaccine efficacy was 54.0%.'
const DATOO = 'The phase 3 trial of R21/Matrix-M enrolled 4878 children. Vaccine efficacy was 75% at seasonal sites and 68% at standard sites.'
const CHE = 'Time-restricted feeding improved insulin sensitivity and HOMA-IR in overweight patients with type 2 diabetes.'
const CDC = 'A 4-month regimen containing rifapentine and moxifloxacin was as effective as the standard 6-month regimen. CDC recommends the 4-month regimen.'
const BANTLE = 'Participants were 17 women and 3 men. Time-restricted eating did not significantly alter insulin sensitivity.'

describe('838d2f4 sentence checks', () => {
  it('rejects a total credited to the wrong paper, empty parentheses, and a truncated word', () => {
    expect(sentenceProblems('Van Der Meeren 2018 enrolled 3,573 adults.', TAIT, [TAIT])).toContain('number 3,573 is not in this abstract')
    expect(sentenceProblems('Kurbatova 2025 found the regimen was noninferior for noninferior ().', DORMAN, [DORMAN])).toContain('empty parentheses')
    expect(sentenceProblems('Chang 2025 described drug-susceptible pulmo in the regimen.', DORMAN, [DORMAN]).join(' ')).toContain('pulmo')
  })

  it('rejects a leaked note, an 8-word copy, a duplicate, and a backwards direction', () => {
    expect(sentenceProblems('Sutton 2018 found that n is not explicitly stated in the snippet.', CHE, [CHE])).toContain('meta note')
    const copied = 'Among 2516 participants who had undergone randomization, a 4-month rifapentine regimen was used.'
    expect(sentenceProblems(copied, DORMAN, [DORMAN])).toContain('copied abstract wording')
    const rows = [
      { text: 'Dorman 2021 found the 4-month rifapentine regimen was noninferior among 2516 participants.', paper_id: '10.1056/nejmoa2033400' },
      { text: 'Dorman 2021 found the 4-month rifapentine regimen was noninferior among 2516 participants.', paper_id: '10.1056/nejmoa2033400' },
    ]
    const audited = auditSentences(rows, new Map([[rows[0].paper_id, DORMAN]]))
    expect(audited.failures.join(' ')).toContain('duplicate')
    expect(sentenceProblems('Datoo 2024 showed no difference in malaria.', DATOO, [DATOO])).toContain('direction contradicts the abstract')
    expect(sentenceProblems('The CDC had mixed results for the rifapentine regimen.', CDC, [CDC])).toContain('direction contradicts the abstract')
    expect(sentenceProblems('Che 2021 showed no difference in insulin sensitivity.', CHE, [CHE])).toContain('direction contradicts the abstract')
    expect(sentenceProblems('Bantle 2023 enrolled 20 adults.', BANTLE, [BANTLE]).join(' ')).toContain('20')
  })

  it('keeps a supported Dorman sentence and selects the Lancet paper for every R21 wording', () => {
    const fine = 'Dorman 2021 found that the 4-month rifapentine regimen with moxifloxacin was noninferior among 2516 participants.'
    expect(sentenceProblems(fine, DORMAN, [DORMAN])).toEqual([])
    const lancet = {
      doi: '10.1016/s0140-6736(23)02511-4',
      title: 'Safety and efficacy of R21/Matrix-M in a phase 3 randomised trial',
      abstract: DATOO,
      rank: 0,
    }
    const review = {
      doi: '10.1371/journal.pmed.1004515',
      title: 'Roll out and prospects of the malaria vaccine',
      abstract: 'This commentary reviews prospects.',
      rank: 3,
    }
    for (const question of [
      'Does the R21/Matrix-M malaria vaccine work?',
      'How well does the R21 malaria vaccine work?',
      'How effective is R21/Matrix-M against malaria?',
    ]) {
      expect(matchesIntervention(question, `${lancet.title}\n${lancet.abstract}`)).toBe(true)
      const selected = selectWritingPapers(question, [review, lancet])
      expect(selected.map((paper) => paper.doi)).toContain(lancet.doi)
      expect(selected.map((paper) => paper.doi)).not.toContain(review.doi)
      expect(coversPrimary(question, selected, [{ paper_id: lancet.doi }])).toBe(true)
      expect(coversPrimary(question, selected, [])).toBe(false)
    }
  })

  it('demo-eval flags the same writing failures and can call the judge', () => {
    const source = readFileSync('scripts/demo-eval.mjs', 'utf8')
    for (const phrase of ['--judge', 'empty parentheses', 'meta note', 'duplicate sentence', 'truncated word', 'not no difference', 'EXA_API_KEY']) {
      expect(source).toContain(phrase)
    }
  })

  it('reads writer JSON and ignores the old url sentence shape', () => {
    expect(readWritten({ answer: { sentences: [{ text: 'Dorman 2021 found the regimen was noninferior.', paper_id: '10.1056/NEJMoa2033400', numbers: ['2516'] }] } })?.[0].paper_id).toBe('10.1056/nejmoa2033400')
    expect(readWritten({ answer: { sentences: [{ text: 'A claim.', urls: ['https://doi.org/10.1000/x'] }] } })).toBeNull()
  })
})
