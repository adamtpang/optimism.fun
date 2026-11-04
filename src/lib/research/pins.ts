/**
 * Papers the live answer must see even when Exa search omits them.
 * A missing pin fails CI in tests/research-review.test.ts, which calls
 * askResearch with a search response that does not contain the DOI.
 */

export type ResearchPin = {
  doi: string
  pattern: RegExp
}

export const RESEARCH_PINS: ResearchPin[] = [
  { doi: '10.1016/s0140-6736(23)02511-4', pattern: /\br21\b|matrix-m/i },
  { doi: '10.1016/j.cmet.2018.04.010', pattern: /\bfasting\b|time-restricted|insulin sensitivity/i },
  { doi: '10.1186/s12986-021-00613-9', pattern: /\bfasting\b|time-restricted|insulin sensitivity/i },
  { doi: '10.1002/oby.23620', pattern: /\bfasting\b|time-restricted|insulin sensitivity/i },
  { doi: '10.1056/nejmoa1803484', pattern: /\bm72\b|\bas01/i },
  { doi: '10.1056/nejmoa1909953', pattern: /\bm72\b|\bas01/i },
  {
    doi: '10.1056/nejmoa2033400',
    pattern: /rifapentine|moxifloxacin|treatment-shorten|(?:(?:4|four)[-\s]?month).{0,48}(?:tuberculosis|\btb\b|regimen)|(?:tuberculosis|\btb\b|regimen).{0,48}(?:4|four)[-\s]?month/i,
  },
]

export function pinsForQuestion(question: string): string[] {
  const seen = new Set<string>()
  const dois: string[] = []
  for (const pin of RESEARCH_PINS) {
    if (!pin.pattern.test(question) || seen.has(pin.doi)) continue
    seen.add(pin.doi)
    dois.push(pin.doi)
  }
  return dois
}
