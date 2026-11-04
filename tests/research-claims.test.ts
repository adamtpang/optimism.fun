import { describe, expect, it } from 'vitest'
import { cleanDoi } from '@/lib/research/papers'
import { dedupeSources, groundClaims, isVerbatimAbstract, missingContentTerms, paragraphFromClaims, questionIsGrounded, studyRank, unsupportedNumbers } from '@/lib/research/claims'
import type { SourceFields } from '@/lib/research/shape'

// Recorded abstracts from the 798dcb6 recheck, trimmed to the sentences the claims use.
const SUTTON = 'Intermittent fasting (IF) improves cardiometabolic health. Men with prediabetes were randomized to early time-restricted feeding (eTRF) or a control schedule for 5 weeks and later crossed over. eTRF improved insulin sensitivity, beta cell responsiveness, blood pressure, oxidative stress, and appetite.'
const ANDRIESSEN = 'Fourteen adults with type 2 diabetes participated in a 3 week time-restricted eating regimen. Hepatic and peripheral insulin sensitivity also remained unaffected by TRE (p=0.67 and p=0.25, respectively).'
const M72 = 'HIV-negative adults 18 to 50 years of age were followed for a mean of 2.3 years. A total of 1786 participants received M72/AS01E and 1787 received placebo. The vaccine efficacy was 54.0% (90% CI, 13.9 to 75.4; P=0.04).'
const DORMAN = 'Among 2516 participants who had undergone randomization, a 4-month rifapentine regimen with moxifloxacin was noninferior to the 6-month control.'
const R21 = 'The phase 3 trial enrolled over 4800 children. At 12 months, vaccine efficacy in the younger age group was 79% (95% CI 73-84) at seasonal sites and 75% (65-83) at standard sites. A confidence bound of 78 appears for a different outcome.'

const VERBATIM = 'Hepatic and peripheral insulin sensitivity also remained unaffected by TRE (p=0.67 and p=0.25, respectively).'

function joined(claims: { text: string }[]): string {
  return claims.map((claim) => claim.text).join(' ')
}

describe('grounded claims from recorded abstracts', () => {
  it('cites Sutton with a benefit and Andriessen with a null, and drops a copied sentence', () => {
    const grounded = groundClaims(
      [
        { doi: '10.1016/j.cmet.2018.04.010', abstract: SUTTON },
        { doi: '10.1007/s00125-022-05752-z', abstract: ANDRIESSEN },
      ],
      [
        { doi: '10.1016/j.cmet.2018.04.010', direction: 'benefit', text: 'In men with prediabetes, 5 weeks of early time-restricted feeding improved insulin sensitivity.' },
        { doi: '10.1007/s00125-022-05752-z', direction: 'null', text: 'After 3 weeks, hepatic and peripheral insulin sensitivity did not change in adults with type 2 diabetes.' },
        { doi: '10.1007/s00125-022-05752-z', direction: 'null', text: VERBATIM },
        { doi: '10.1007/s00125-022-05752-z', direction: 'null', text: 'Later, two trials reported no benefit (Carlson et al., 2007; Soeters et al., 2009).' },
      ],
    )
    expect(grounded.map((claim) => `${claim.doi} ${claim.direction}`)).toEqual([
      '10.1016/j.cmet.2018.04.010 benefit',
      '10.1007/s00125-022-05752-z null',
    ])
    const text = joined(grounded)
    expect(text).not.toContain('p=0.67')
    expect(text).not.toContain('Carlson')
    expect(isVerbatimAbstract(grounded[1].text, ANDRIESSEN)).toBe(false)
    expect(isVerbatimAbstract(VERBATIM, ANDRIESSEN)).toBe(true)
  })

  it('keeps 54.0% for M72 and writes the enrollment from the printed arms', () => {
    const grounded = groundClaims(
      [{ doi: '10.1056/nejmoa1803484', abstract: M72 }],
      [{
        doi: '10.1056/nejmoa1803484',
        direction: 'benefit',
        text: 'Among HIV-negative adults aged 18 to 50 years, vaccine efficacy was 54.0% after a mean of 2.3 years in 3,573 adults.',
      }],
    )
    expect(grounded).toHaveLength(1)
    expect(grounded[0].text).toContain('54.0%')
    expect(grounded[0].text).toContain('2.3 years')
    expect(grounded[0].text).toContain('18 to 50')
    expect(grounded[0].text).toContain('3,573 adults (1,786 vaccine, 1,787 placebo)')
    expect(grounded[0].text).not.toContain('plus')
    expect(isVerbatimAbstract(grounded[0].text, M72)).toBe(false)
  })

  it('keeps 2,516 and noninferior for the 4-month regimen', () => {
    const grounded = groundClaims(
      [{ doi: '10.1056/nejmoa2033400', abstract: DORMAN }],
      [{
        doi: '10.1056/nejmoa2033400',
        direction: 'benefit',
        text: 'In 2,516 participants, the 4-month rifapentine regimen with moxifloxacin was noninferior to the 6-month regimen.',
      }],
    )
    expect(grounded[0]?.text).toContain('2,516')
    expect(grounded[0]?.text.toLowerCase()).toContain('noninferior')
    expect(isVerbatimAbstract(grounded[0].text, DORMAN)).toBe(false)
  })

  it('does not allow an R21 range the abstract does not print', () => {
    expect(unsupportedNumbers('Efficacy was 78-79% in young children.', R21)).toContain('78-79%')
    const grounded = groundClaims(
      [{ doi: '10.1016/s0140-6736(23)02511-4', abstract: R21 }],
      [{
        doi: '10.1016/s0140-6736(23)02511-4',
        direction: 'benefit',
        text: 'In young children, efficacy was 78-79% at seasonal sites, where the abstract instead prints 79%.',
      }],
      [{ doi: '10.1016/s0140-6736(23)02511-4', text: 'In young children at seasonal sites, vaccine efficacy was 79%.' }],
    )
    expect(joined(grounded)).not.toContain('78-79%')
    expect(joined(grounded)).toContain('79%')
    expect(isVerbatimAbstract(grounded[0].text, R21)).toBe(false)
  })

  it('drops a no-DOI duplicate of Sutton', () => {
    const withDoi: SourceFields = {
      url: 'https://doi.org/10.1016/j.cmet.2018.04.010',
      title: 'Early Time-Restricted Feeding Improves Insulin Sensitivity, Blood Pressure, and Oxidative Stress',
      doi: '10.1016/j.cmet.2018.04.010',
      text: SUTTON,
    }
    const duplicate: SourceFields = {
      url: 'https://www.cell.com/cell-metabolism/fulltext/early-time-restricted',
      title: 'Early Time-Restricted Feeding Improves Insulin Sensitivity, Blood Pressure, and Oxidative Stress',
      text: 'A long full-text page with no DOI.',
    }
    const kept = dedupeSources([duplicate, withDoi])
    expect(kept).toHaveLength(1)
    expect(kept[0].doi).toBe('10.1016/j.cmet.2018.04.010')
  })

  it('rejects Sutton claims whose outcome words are not in the abstract', () => {
    expect(missingContentTerms('Early time-restricted feeding reduced fasting and postprandial insulin.', SUTTON)).toContain('postprandial')
    expect(missingContentTerms('The average and highest insulin concentrations fell.', SUTTON).length).toBeGreaterThan(0)
    const grounded = groundClaims(
      [{ doi: '10.1016/j.cmet.2018.04.010', abstract: SUTTON, title: 'Early time-restricted feeding' }],
      [
        { doi: '10.1016/j.cmet.2018.04.010', direction: 'benefit', text: 'Early time-restricted feeding reduced fasting and postprandial insulin.' },
        { doi: '10.1016/j.cmet.2018.04.010', direction: 'benefit', text: 'In men with prediabetes, 5 weeks of early time-restricted feeding improved insulin sensitivity.' },
      ],
      [],
      'Does intermittent fasting improve insulin sensitivity?',
    )
    expect(joined(grounded)).not.toContain('postprandial')
    expect(joined(grounded)).toContain('insulin sensitivity')
  })

  it('returns no-answer material when no abstract mentions socks', () => {
    const kidney = 'Nephrolithiasis is a kidney stone disease. Diet and fluids change the risk of stones.'
    expect(questionIsGrounded('Does wearing blue socks on Tuesdays reduce the risk of kidney stones in left-handed adults?', [kidney])).toBe(false)
    const grounded = groundClaims(
      [{ doi: '10.1038/s41581-025-00990-x', abstract: kidney, title: 'Kidney stone disease' }],
      [{ doi: '10.1038/s41581-025-00990-x', direction: 'null', text: 'The review found no evidence that clothing color changes kidney stone risk.' }],
      [],
      'Does wearing blue socks on Tuesdays reduce the risk of kidney stones?',
    )
    expect(grounded).toEqual([])
    expect(missingContentTerms('The review found no evidence that clothing color changes kidney stone risk.', kidney)).toContain('clothing')
  })

  it('keeps a null trial and at least three fasting papers, with Sutton and Andriessen', () => {
    const papers = [
      { doi: '10.1016/j.cmet.2018.04.010', title: 'Early time-restricted feeding randomized trial', abstract: SUTTON },
      { doi: '10.1007/s00125-022-05752-z', title: 'Three weeks of time-restricted eating randomized trial', abstract: ANDRIESSEN },
      { doi: '10.1002/oby.23620', title: 'Time-restricted eating randomized pilot', abstract: 'Intermittent fasting as time-restricted eating for 12 weeks in adults with overweight or obesity did not significantly alter insulin sensitivity.' },
      { doi: '10.1186/s12986-021-00613-9', title: 'Time-restricted feeding randomized trial', abstract: 'Intermittent fasting as time-restricted feeding improved insulin sensitivity in overweight patients with type 2 diabetes.' },
    ]
    const grounded = groundClaims(
      papers,
      papers.map((paper) => ({
        doi: paper.doi,
        direction: paper.doi.includes('oby.23620') || paper.doi.includes('s00125') ? 'null' as const : 'benefit' as const,
        text: paper.doi.includes('cmet')
          ? 'In men with prediabetes, 5 weeks of early time-restricted feeding improved insulin sensitivity.'
          : paper.doi.includes('s00125')
            ? 'After 3 weeks, hepatic and peripheral insulin sensitivity did not change in adults with type 2 diabetes.'
            : paper.doi.includes('oby')
              ? 'Over 12 weeks, time-restricted eating did not change insulin sensitivity in adults with overweight or obesity.'
              : 'Time-restricted feeding improved insulin sensitivity in patients with type 2 diabetes.',
      })),
      [],
      'Does intermittent fasting improve insulin sensitivity?',
    )
    const dois = grounded.map((claim) => claim.doi)
    expect(dois).toContain('10.1016/j.cmet.2018.04.010')
    expect(dois).toContain('10.1007/s00125-022-05752-z')
    expect(new Set(dois).size).toBeGreaterThanOrEqual(3)
    expect(grounded.some((claim) => claim.direction === 'benefit')).toBe(true)
    expect(grounded.some((claim) => claim.direction === 'null')).toBe(true)
  })

  it('prefers the R21 phase 3 trial and drops an off-topic cross-protection line', () => {
    const phase3 = { doi: '10.1016/s0140-6736(23)02511-4', title: 'Safety and efficacy of R21/Matrix-M in a phase 3 randomised controlled trial', abstract: 'The phase 3 malaria vaccine trial enrolled 4878 children. Seasonal efficacy was 75% and standard efficacy was 68%.' }
    const review = { doi: '10.1371/journal.pmed.1004515', title: 'Roll out and prospects of the malaria vaccine R21', abstract: 'This commentary reviews prospects. Efficacy in ages 5 to 17 months was 78%. There was no cross-protection against blood or sexual stages.' }
    expect(studyRank(phase3.title, phase3.abstract)).toBeLessThan(studyRank(review.title, review.abstract))
    const grounded = groundClaims(
      [review, phase3],
      [
        { doi: review.doi, direction: 'benefit', text: 'A review estimated 78% malaria vaccine efficacy.' },
        { doi: review.doi, direction: 'mixed', text: 'There was no cross-protection against blood or sexual stages.' },
        { doi: phase3.doi, direction: 'benefit', text: 'The phase 3 malaria vaccine trial in 4878 children found seasonal efficacy of 75% and standard efficacy of 68%.' },
      ],
      [],
      'How well does the R21 malaria vaccine work?',
    )
    expect(grounded.map((claim) => claim.doi)).toContain(phase3.doi)
    expect(joined(grounded)).toContain('75%')
    expect(joined(grounded)).toContain('68%')
    expect(joined(grounded)).toContain('4878')
    expect(joined(grounded)).not.toContain('cross-protection')
    expect(joined(grounded)).not.toContain('78-79%')
  })

  it('keeps both M72 effect sizes and lowercases the DOI', () => {
    expect(cleanDoi('10.1056/NEJMoa1803484')).toBe('10.1056/nejmoa1803484')
    const final = 'The final analysis reported vaccine efficacy of 49.7% against pulmonary tuberculosis.'
    const grounded = groundClaims(
      [
        { doi: '10.1056/nejmoa1803484', title: 'Phase 2b placebo-controlled trial of M72/AS01E', abstract: M72 },
        { doi: '10.1056/nejmoa1909953', title: 'Final analysis of a placebo-controlled trial of M72/AS01E', abstract: final },
      ],
      [
        { doi: '10.1056/NEJMoa1803484', direction: 'benefit', text: 'In adults aged 18 to 50 years, vaccine efficacy was 54.0% after 2.3 years.' },
        { doi: '10.1056/nejmoa1909953', direction: 'benefit', text: 'The final analysis reported tuberculosis vaccine efficacy of 49.7%.' },
      ],
      [],
      'Does the M72 vaccine prevent tuberculosis?',
    )
    expect(joined(grounded)).toContain('54.0%')
    expect(joined(grounded)).toContain('49.7%')
    const paragraph = paragraphFromClaims(grounded)
    expect(paragraph.startsWith('The retrieved studies report a benefit.')).toBe(true)
    expect(paragraph.match(/serious adverse events/g) ?? []).toHaveLength(0)
  })
})
