import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { matchesIntervention } from '@/lib/research/claims'
import {
  attributionOnlyReason,
  auditSentences,
  coversPrimary,
  enrollmentNumber,
  headlineTrial,
  fallbackSentence,
  isFiller,
  isOpinionPiece,
  readWritten,
  sameNumber,
  selectWritingPapers,
  missingFacts,
  requiredFacts,
  sentenceProblems,
  truncatedTokens,
} from '@/lib/research/writing'
import { clearRetrievalCache, expandedQueries, keywordPrompt, readKeywordQuery, recallRetrieval, rememberRetrieval } from '@/lib/research/ask'
import { numberMatches } from '@/lib/research/text-checks.mjs'
import { isJournalArticleDoi, paperStatus } from '@/lib/research/papers'

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
    expect(sentenceProblems(copied, DORMAN, [DORMAN]).join(' ')).toContain('copied abstract wording')
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

  it('ranks a phase 3 trial ahead of a commentary and a meta-analysis', () => {
    const question = 'How well does this malaria vaccine work?'
    const phase3 = {
      doi: '10.1000/phase3',
      title: 'A phase 3 randomized controlled trial of a malaria vaccine',
      abstract: 'The randomized controlled malaria vaccine trial enrolled 200 children. Efficacy was 70%.',
      rank: 0,
    }
    const meta = {
      doi: '10.1000/meta',
      title: 'A systematic review and meta-analysis of the malaria vaccine',
      abstract: 'This meta-analysis pooled malaria vaccine trials.',
      rank: 3,
    }
    const note = {
      doi: '10.1000/note',
      title: 'Commentary on the malaria vaccine',
      abstract: 'This commentary discusses the malaria vaccine.',
      rank: 3,
    }
    expect(headlineTrial(question, [note, meta, phase3])).toBe(phase3.doi)
    expect(selectWritingPapers(question, [note, meta, phase3]).map((paper) => paper.doi)).toEqual([phase3.doi, meta.doi])
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
    for (const phrase of ['--judge', 'empty parentheses', 'meta note', 'duplicate sentence', '2 to 5 sentences', 'author and year', 'direction contradicts the abstract', 'latency under 25s', 'cites a relevant trial', 'EXA_API_KEY']) {
      expect(source).toContain(phrase)
    }
  })

  it('accepts the word large, requires 4878 on the R21 trial, and rejects filler', () => {
    const lancet = 'The phase 3 trial of R21/Matrix-M enrolled 4878 children. Vaccine efficacy was 75% in a large seasonal cohort.'
    expect(truncatedTokens('Datoo 2024 found a large protective effect.', lancet)).toEqual([])
    expect(enrollmentNumber(lancet)).toBe('4878')
    expect(sameNumber('enrolled 4,878 children', '4878')).toBe(true)
    const papers = [
      { doi: '10.1016/s0140-6736(23)02511-4', title: 'R21/Matrix-M phase 3 trial', abstract: lancet, rank: 0 },
      { doi: '10.1371/journal.pmed.1004515', title: 'Commentary on vaccines', abstract: 'A commentary.', rank: 3 },
    ]
    expect(headlineTrial('Does the R21/Matrix-M malaria vaccine work?', papers)).toBe(papers[0].doi)
    const audited = auditSentences(
      [{ text: 'Datoo 2024 found that R21/Matrix-M had 75% efficacy.', paper_id: papers[0].doi }],
      new Map([[papers[0].doi, lancet]]),
      papers[0].doi,
    )
    expect(audited.failures.join(' ')).toContain('missing enrollment')
    expect(isFiller('Dale 2025 discuss the optimization of the M72/AS01E vaccine phase 3 trial.', 'A later paper discusses the phase 3 trial.')).toBe(true)
    expect(sentenceProblems('A retrieved study indicated the vaccine was discussed [5].', lancet, [lancet]).join(' ')).toContain('no finding')
  })

  it('reuses a cached retrieval for the same question', () => {
    clearRetrievalCache()
    const paper = { url: 'https://doi.org/10.1056/nejmoa2033400', doi: '10.1056/nejmoa2033400', title: 'Dorman' }
    expect(recallRetrieval('Is a 4-month rifapentine regimen noninferior?')).toBeNull()
    rememberRetrieval('Is a 4-month rifapentine regimen noninferior?', [paper], 1_000)
    expect(recallRetrieval('  is a 4-month rifapentine regimen noninferior? ', 1_000 + 1000)?.[0].doi).toBe(paper.doi)
    expect(recallRetrieval('Is a 4-month rifapentine regimen noninferior?', 1_000 + 11 * 60 * 1000)).toBeNull()
    expect(expandedQueries('Does the M72/AS01E vaccine prevent tuberculosis?')).toEqual(['Does the M72/AS01E vaccine prevent tuberculosis?'])
    expect(expandedQueries('Does extreme heat raise mortality?')).toEqual(['Does extreme heat raise mortality?'])
    const prompt = keywordPrompt('Does extreme heat raise mortality?')
    expect(prompt).toContain('Does extreme heat raise mortality?')
    expect(prompt.toLowerCase()).toContain('do not include author names')
    expect(readKeywordQuery({ answer: { query: 'heatwave mortality randomized trial' } }, 'Does extreme heat raise mortality?')).toBe('heatwave mortality randomized trial')
    expect(readKeywordQuery({ answer: { query: 'Ada Lovelace heat mortality' } }, 'Does extreme heat raise mortality?')).toBeNull()
    clearRetrievalCache()
  })

  it('accepts the Datoo and Tait numbers that the abstracts print', () => {
    const datoo2021 = 'Vaccine efficacy was 77\u2009% (95% CI 71\u201380) and 74 % in 450 participants followed for one year.'
    const datoo2022 = 'The booster was given to 409 children. Efficacy remained high.'
    const meeren = 'The vaccine efficacy was 54.0% (90% CI, 13.9 to 75.4) after a mean of 2.3 years.'
    for (const token of ['77%', '74%', '450']) expect(numberMatches(token, datoo2021)).toBe(true)
    expect(numberMatches('409', datoo2022)).toBe(true)
    expect(numberMatches('54%', meeren)).toBe(true)
    expect(numberMatches('54.0%', 'Efficacy was 54 % in adults.')).toBe(true)
    expect(sentenceProblems('Datoo 2021 reported 77% and 74% efficacy among 450 participants.', datoo2021, [datoo2021])).not.toContain('number 77% is not in this abstract')
    const r21 = 'Investigators screened 5477 children. A phase 3 trial enrolling over 4800 children was done. The trial enrolled 4,878 children. Seasonal efficacy was 75% and standard efficacy was 68%.'
    expect(enrollmentNumber(r21)).toBe('4,878')
    expect(requiredFacts(r21, ['75%', '68%', '99%', '5477'])).toEqual(['4,878', '75%', '68%'])
    expect(missingFacts('In a phase 3 trial enrolling over 4800 children, Datoo 2024 observed high protective efficacy.', requiredFacts(r21, ['75%', '68%'])).length).toBeGreaterThan(0)
    expect(sentenceProblems('Datoo and colleagues (2024) reported 75% efficacy.', r21, [r21], { author: 'Datoo', year: '2023' }).join(' ')).toContain('year mismatch')
    expect(sentenceProblems('In a phase 3 study with thousands of young participants, efficacy was high.', r21, [r21]).join(' ')).toContain('vague sample size')
    expect(sentenceProblems('The study did not include 90 participants and improved the outcome.', 'The trial improved the measured outcome.', ['The trial improved the measured outcome.']).join(' ')).toContain('90')
    expect(attributionOnlyReason('it does not attribute these findings to Tait (2019)')).toBe(true)
    expect(attributionOnlyReason('the abstract does not support 90% efficacy')).toBe(false)
    const followUp = 'Vaccine efficacy was 54.0% after a mean of 2.3 years of follow-up in adults with latent infection.'
    expect(sentenceProblems(`A 2018 trial reported efficacy after a mean of 2.3 years of follow-up in adults.`, followUp, [followUp]).join(' ')).toContain('copied abstract wording')
    expect(sentenceProblems('Carr 2022 described a trial of 2,516 participants and said the regimen was noninferior.', 'The guidance says the 4-month regimen is effective.', ['The guidance says the 4-month regimen is effective.']).join(' ')).toContain('2,516')
    expect(sentenceProblems('Horne 2024 studied 68 adults with lower baseline growth hormone and found reduced insulin resistance.', 'The trial enrolled 68 adults. Insulin resistance fell in the lower baseline growth hormone subgroup.', ['The trial enrolled 68 adults. Insulin resistance fell in the lower baseline growth hormone subgroup.']).join(' ')).toContain('wrong group')
    expect(fallbackSentence('Semnani-Azad', '2021', 'A meta-analysis found intermittent fasting improved fasting glucose.')).toContain('Semnani-Azad 2021')
    const editorial = { doi: '10.1000/edit', title: 'Editorial on the malaria vaccine', abstract: 'This editorial discusses a randomized malaria vaccine trial.', rank: 1, kind: 'editorial' }
    const trial = { doi: '10.1000/trial', title: 'A phase 3 randomized trial of the malaria vaccine', abstract: 'The randomized malaria vaccine trial enrolled 200 children. Efficacy was 70%.', rank: 0 }
    expect(isOpinionPiece(editorial)).toBe(true)
    expect(selectWritingPapers('How well does this malaria vaccine work?', [editorial, trial]).map((paper) => paper.doi)).toEqual([trial.doi])
    expect(paperStatus({
      url: 'https://doi.org/10.1016/S0140-6736(23)02511-4',
      doi: '10.1016/S0140-6736(23)02511-4',
      openAlexType: 'preprint',
      retractionChecked: false,
    })).toBe('peer-reviewed')
    expect(paperStatus({
      url: 'https://doi.org/10.1016/j.cmet.2018.04.010',
      doi: '10.1016/j.cmet.2018.04.010',
      retractionChecked: false,
    })).toBe('peer-reviewed')
    expect(isJournalArticleDoi('10.2139/ssrn.1')).toBe(false)
    expect(sentenceProblems('Sutton 2018 enrolled an unspecified number of participants.', 'Eight men with prediabetes were studied. eTRF improved insulin sensitivity.', ['Eight men with prediabetes were studied. eTRF improved insulin sensitivity.']).join(' ')).toMatch(/unspecified|meta note/)
  })

  it('reads writer JSON and ignores the old url sentence shape', () => {
    expect(readWritten({ answer: { sentences: [{ text: 'Dorman 2021 found the regimen was noninferior.', paper_id: '10.1056/NEJMoa2033400', numbers: ['2516'] }] } })?.[0].paper_id).toBe('10.1056/nejmoa2033400')
    expect(readWritten({ answer: { sentences: [{ text: 'A claim.', urls: ['https://doi.org/10.1000/x'] }] } })).toBeNull()
  })
})
