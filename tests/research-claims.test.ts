import { describe, expect, it } from 'vitest'
import { dedupeSources, groundClaims, isVerbatimAbstract, unsupportedNumbers } from '@/lib/research/claims'
import type { SourceFields } from '@/lib/research/shape'

// Recorded abstracts from the 798dcb6 recheck, trimmed to the sentences the claims use.
const SUTTON = 'Men with prediabetes were randomized to eTRF (6-hr feeding period, with dinner before 3 p.m.) or a control schedule (12-hr feeding period) for 5 weeks and later crossed over to the other schedule. eTRF improved insulin sensitivity, β cell responsiveness, blood pressure, oxidative stress, and appetite.'
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
})
