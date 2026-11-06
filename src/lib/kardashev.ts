/**
 * Sagan's 1973 continuous Kardashev index.
 *
 * K = (log10(P) - 6) / 10, with P in watts. On this scale Type I is 10^16 W.
 * The index is logarithmic. 0.73 is not 73 percent of a planet's energy.
 *
 * The power assumption shared with /capital is ~20 TW (2×10^13 W). Type I
 * at 10^16 W is the convention already stated there. It is not Earth's
 * incident sunlight (~1.7×10^17 W) and it is not a measured confidence interval.
 */
export const KARDASHEV = {
  currentWatts: 2e13,
  typeIWatts: 1e16,
  assumption: '~20 TW current power, Type I reference 10^16 W, Sagan 1973 formula',
  formula: 'K = (log10(P_watts) - 6) / 10',
  get index(): number {
    return (Math.log10(this.currentWatts) - 6) / 10
  },
  /** Alias used by /capital. */
  get current(): number {
    return this.index
  },
  get multipleToTypeI(): number {
    return this.typeIWatts / this.currentWatts
  },
  /** Share of the Type I reference power. 20 TW / 10^16 W = 0.002. */
  get fractionOfTypeI(): number {
    return this.currentWatts / this.typeIWatts
  },
}

export function formatKardashev(): {
  index: string
  fraction: string
  multiple: string
  caption: string
} {
  const index = KARDASHEV.index
  const pct = KARDASHEV.fractionOfTypeI * 100
  return {
    index: index.toFixed(2),
    fraction: `${pct.toFixed(1)}%`,
    multiple: String(Math.round(KARDASHEV.multipleToTypeI)),
    caption:
      `Type ${index.toFixed(2)} is Sagan’s logarithmic index, not a percent of planetary energy. ` +
      `At the stated ~20 TW, humanity uses ${pct.toFixed(1)}% of the Type I reference (10^16 W), ` +
      `about ${Math.round(KARDASHEV.multipleToTypeI)}× short of that reference. ` +
      `This is not Earth’s full incident sunlight, and it is not a confidence interval.`,
  }
}
