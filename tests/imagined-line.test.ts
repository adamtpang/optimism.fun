import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ImaginedLine from '@/components/ImaginedLine'
import { problems } from '@/data/problems'
import type { Imagined } from '@/data/types'

const SOURCE = 'https://notboring.com/sci-fi-idea-bank'
const LABEL = 'Not Boring Sci-Fi Idea Bank'

const LINES: Record<string, string> = {
  'organ-banking':
    "First imagined in The Senator's Daughter by Edward Page Mitchell (1879): an early story about freezing a living person to store them.",
  'organ-shortage':
    'First imagined in The Velvet Glove by Harry Harrison (1956): small clusters of cells that regrow human limbs.',
  'brain-computer-interface':
    "First imagined in Masson's Secret by Raymond Z. Gallun (1939): a brain implant that sends sight and sound and lets the body be controlled.",
  'ai-clinical-care':
    'First imagined in Flamingo: A Drama of A.D. 1950 by Clarence Edward Heller (1930): a mechanical physician.',
  'artificial-womb':
    'First imagined in Brave New World by Aldous Huxley (1932): embryos grown to term in a room outside the body.',
}

function html(imagined?: Imagined) {
  return renderToStaticMarkup(createElement(ImaginedLine, { imagined }))
}

function text(imagined?: Imagined) {
  return html(imagined)
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

describe('imagined line', () => {
  it('renders nothing when the field is absent', () => {
    expect(html(undefined)).toBe('')
    const plain = problems.filter((problem) => !problem.imagined)
    expect(plain.length).toBeGreaterThan(0)
    for (const problem of plain) {
      expect(html(problem.imagined), problem.slug).toBe('')
    }
  })

  it('renders the five approved lines and no others', () => {
    const withLine = problems.filter((problem) => problem.imagined)
    expect(withLine.map((problem) => problem.slug).sort()).toEqual(Object.keys(LINES).sort())
    for (const problem of withLine) {
      const rendered = html(problem.imagined)
      expect(text(problem.imagined), problem.slug).toBe(`${LINES[problem.slug]} ${LABEL}`)
      expect(rendered, problem.slug).toContain(`href="${SOURCE}"`)
      expect(rendered, problem.slug).not.toMatch(/[—–]/)
      expect(problem.imagined?.year, problem.slug).toBeTypeOf('number')
    }
  })
})
