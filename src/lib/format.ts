/**
 * A death share as a percent of all deaths. Whole percents stay whole.
 * A share such as 15.5% is not rounded to 16% or 15%.
 */
export function formatDeathShare(share: number): string {
  const pct = share * 100
  const nearest = Math.round(pct)
  if (Math.abs(pct - nearest) < 0.05) return `${nearest}% of all deaths`
  return `${pct.toFixed(1)}% of all deaths`
}

export function formatHumans(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return `${n}`
}

export function formatUSD(n: number): string {
  if (n >= 1_000_000_000_000) return `$${(n / 1_000_000_000_000).toFixed(1)}T`
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`
  return `$${n.toLocaleString()}`
}

export function formatPercent(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`
}

export function formatScore(n: number): string {
  return n.toFixed(1)
}

export function formatYears(n: number): string {
  if (n >= 100) return `${(n / 100).toFixed(0)}c` // centuries
  return `${n}y`
}
