import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { VISITOR_CLASSES } from '@/lib/visitor-classes'

const css = readFileSync('src/styles/ds/colors.css', 'utf8')

function token(name: string): string {
  const m = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!m) throw new Error(`token ${name} not found as a 6-digit hex in colors.css`)
  return m[1]!
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r!) + 0.7152 * lin(g!) + 0.0722 * lin(b!)
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}

const WHITE = '#ffffff'
const PAPER = token('--surface-paper')
const BODY = token('--text-primary')

describe('class colors', () => {
  for (const c of VISITOR_CLASSES) {
    const fill = token(`--class-${c.id}-fill`)
    const on = token(`--class-${c.id}-on`)
    const ink = token(`--class-${c.id}-ink`)
    const tint = token(`--class-${c.id}-tint`)

    it(`${c.id}: text on the solid fill reads at 4.5:1`, () => {
      expect(contrast(on, fill)).toBeGreaterThanOrEqual(4.5)
    })
    it(`${c.id}: ink reads at 4.5:1 on white, on paper and on its tint`, () => {
      expect(contrast(ink, WHITE)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(ink, PAPER)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(ink, tint)).toBeGreaterThanOrEqual(4.5)
    })
    it(`${c.id}: body text reads at 4.5:1 on the tint`, () => {
      expect(contrast(BODY, tint)).toBeGreaterThanOrEqual(4.5)
    })
    it(`${c.id}: the button border is visible at 3:1 on white and paper`, () => {
      expect(contrast(ink, WHITE)).toBeGreaterThanOrEqual(3)
      expect(contrast(ink, PAPER)).toBeGreaterThanOrEqual(3)
    })
  }

  it('gives each class a different fill', () => {
    const fills = VISITOR_CLASSES.map((c) => token(`--class-${c.id}-fill`))
    expect(new Set(fills).size).toBe(3)
  })
})
