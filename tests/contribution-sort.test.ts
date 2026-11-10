import { describe, expect, it } from 'vitest'
import { founders } from '@/data/founders'
import { publicCompanies } from '@/data/public-companies'
import { companyRows, founderRows } from '@/lib/contribution-sort'
import { problems } from '@/data/problems'
import { rankBySlug } from '@/lib/open-data'

describe('contribution sort', () => {
  it('keeps net worth and market cap as the default order', () => {
    expect(founderRows('size').map((row) => row.founder.name)).toEqual(founders.map((founder) => founder.name))
    expect(companyRows('size').map((row) => row.company.name)).toEqual(publicCompanies.map((company) => company.name))
  })

  it('moves sourced problem links ahead without inventing a link', () => {
    const foundersBySize = founderRows('size')
    const foundersByQuest = founderRows('contribution')
    expect(foundersByQuest.map((row) => row.founder.name)).not.toEqual(foundersBySize.map((row) => row.founder.name))
    const firstUnlinked = foundersByQuest.findIndex((row) => row.contribution === 'not yet sourced')
    expect(firstUnlinked).toBeGreaterThan(0)
    expect(foundersByQuest.slice(0, firstUnlinked).every((row) => row.contribution !== 'not yet sourced')).toBe(true)
    expect(foundersByQuest.slice(firstUnlinked).every((row) => row.contribution === 'not yet sourced')).toBe(true)
    const musk = foundersByQuest.find((row) => row.founder.name === 'Elon Musk')
    expect(musk?.contribution).toBe('not yet sourced')

    const companiesByQuest = companyRows('contribution')
    const sourced = companiesByQuest.filter((row) => row.contribution !== 'not yet sourced').map((row) => row.company.name)
    expect(sourced.sort()).toEqual(['Eli Lilly', 'Merck', 'Roche'])
    expect(companiesByQuest.find((row) => row.company.name === 'Roche')?.contribution).toBe(
      problems.find((problem) => problem.slug === 'cancer')?.name,
    )
    const unsourcedBefore = publicCompanies.map((company) => company.name).filter((name) => !sourced.includes(name))
    const unsourcedAfter = companiesByQuest.filter((row) => row.contribution === 'not yet sourced').map((row) => row.company.name)
    expect(unsourcedAfter).toEqual(unsourcedBefore)
    expect(companiesByQuest.findIndex((row) => row.company.name === 'NVIDIA')).toBeGreaterThan(
      companiesByQuest.findIndex((row) => row.company.name === 'Eli Lilly'),
    )

    const rank = rankBySlug()
    const eli = problems.find((problem) => problem.organizations?.some((org) => org.name === 'Eli Lilly'))
    const merck = problems.find((problem) => problem.organizations?.some((org) => org.name === 'Merck'))
    expect(eli && merck).toBeTruthy()
    const eliRow = companiesByQuest.find((row) => row.company.name === 'Eli Lilly')
    const merckRow = companiesByQuest.find((row) => row.company.name === 'Merck')
    expect(eliRow?.contribution).toBe(eli!.name)
    expect(merckRow?.contribution).toBe(merck!.name)
    const eliRank = rank.get(eli!.slug)!
    const merckRank = rank.get(merck!.slug)!
    expect(companiesByQuest.findIndex((row) => row.company.name === 'Eli Lilly') < companiesByQuest.findIndex((row) => row.company.name === 'Merck')).toBe(
      eliRank < merckRank || (eliRank === merckRank && publicCompanies.findIndex((company) => company.name === 'Eli Lilly') < publicCompanies.findIndex((company) => company.name === 'Merck')),
    )
  })
})
