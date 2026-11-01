import { describe, expect, it } from 'vitest'
import { ctas, ctaIssues, type Cta } from '@/data/ctas'

const sample = (): Cta => ({
  id: 'sample-build-biosecurity',
  problemSlugs: ['biosecurity'],
  kind: 'build',
  name: 'Sample',
  url: 'https://example.org/sample',
  type: 'nonprofit',
  oneLiner: 'A one sentence description with no new figure.',
  checkedDate: '2026-11-01',
})

describe('ctas', () => {
  it('passes the schema checks', () => {
    expect(ctaIssues()).toEqual([])
  })

  it('keeps the ingested research set', () => {
    expect(ctas).toHaveLength(96)
    expect(ctas.every((c) => !('httpStatus' in c))).toBe(true)
    expect(ctas.every((c) => !('problem' in c))).toBe(true)
    expect(ctas.filter((c) => c.checked === false)).toHaveLength(6)
  })

  it('types UK AISI as government and keeps both Far UV rows', () => {
    const aisi = ctas.find((c) => c.name === 'UK AI Security Institute')
    expect(aisi?.type).toBe('government')
    expect(aisi?.url).toBe('https://www.aisi.gov.uk')
    const far = ctas.filter((c) => c.url === 'https://faruv.com')
    expect(far.map((c) => c.kind).sort()).toEqual(['build', 'buy'])
  })

  it('maps air pollution onto copd and climate-change', () => {
    const openaq = ctas.find((c) => c.name === 'OpenAQ')
    expect(openaq?.problemSlugs).toEqual(['copd', 'climate-change'])
    expect(openaq?.riskSlugs).toBeUndefined()
    expect(ctas.some((c) => c.problemSlugs.includes('air-pollution'))).toBe(false)
  })

  it('copies amounts verbatim and only with a source url', () => {
    const amounts = ctas.filter((c) => c.amount).map((c) => c.amount?.text).sort()
    expect(amounts).toEqual([
      '$101 million prize purse (2023 to 2030)',
      'About $216 million in gifts and grants organized since 2019 (all cause areas)',
      'About $216 million in gifts and grants organized since 2019 (all cause areas)',
      'Grants of up to £1 million per project; over £27 million awarded to 60+ projects in the first round',
    ])
    for (const c of ctas) {
      if (c.amount) expect(c.amount.sourceUrl.startsWith('https://')).toBe(true)
    }
  })

  it('rejects a bad slug, a bad url, a missing name, and an amount with no source', () => {
    expect(ctaIssues([{ ...sample(), problemSlugs: ['not-a-problem'] }]).join('\n')).toMatch(/unknown problem/)
    expect(ctaIssues([{ ...sample(), url: 'http://example.org' }]).join('\n')).toMatch(/https/)
    expect(ctaIssues([{ ...sample(), name: '  ' }]).join('\n')).toMatch(/name required/)
    expect(ctaIssues([{ ...sample(), id: '' }]).join('\n')).toMatch(/id missing/)
    expect(
      ctaIssues([{ ...sample(), amount: { text: '$1', sourceUrl: 'notaurl' } }]).join('\n'),
    ).toMatch(/sourceUrl/)
    expect(ctaIssues([{ ...sample(), oneLiner: 'A line with an em dash \u2014 here' }]).join('\n')).toMatch(/dashes/)
  })
})
