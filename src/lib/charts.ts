/** Geometry for the dependency-free charts. No data lives here. */

export type SeriesPoint = { year: number; value: number }

export function formatMeasure(n: number): string {
  const abs = Math.abs(n)
  const trim = (v: number) => {
    const s = v.toFixed(1)
    return s.endsWith('.0') ? s.slice(0, -2) : s
  }
  const sign = n < 0 ? '-' : ''
  if (abs >= 1e9) return `${sign}${trim(abs / 1e9)}B`
  if (abs >= 1e6) return `${sign}${trim(abs / 1e6)}M`
  if (abs >= 1e4) return `${sign}${trim(abs / 1e3)}k`
  if (abs >= 100) return Math.round(n).toLocaleString('en-US')
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(1)
}

/** Bar length on a log10 scale. The smallest value in the set still shows. */
export function logBarPercent(value: number, min: number, max: number): number {
  const lo = Math.log10(Math.max(min, 1))
  const hi = Math.log10(Math.max(max, 1))
  if (!(hi > lo)) return 100
  const t = (Math.log10(Math.max(value, 1)) - lo) / (hi - lo)
  const clamped = Math.max(0, Math.min(1, t))
  return Math.round((8 + clamped * 92) * 10) / 10
}

/** 0 = well funded (cyan), 10 = neglected (rose). Null is a neutral gray. */
export function neglectColor(score: number | null): string {
  if (score == null || Number.isNaN(score)) return '#94a3b8'
  const t = Math.max(0, Math.min(10, score)) / 10
  const a = [8, 145, 178]
  const b = [190, 18, 60]
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

export function lineLayout(
  series: SeriesPoint[],
  width: number,
  height: number,
  pad = { l: 52, r: 16, t: 16, b: 28 },
) {
  const minX = Math.min(...series.map((d) => d.year))
  const maxX = Math.max(...series.map((d) => d.year))
  const dataMin = Math.min(...series.map((d) => d.value))
  const dataMax = Math.max(...series.map((d) => d.value))
  const minY = dataMin === dataMax ? dataMin - 1 : dataMin
  const maxY = dataMin === dataMax ? dataMax + 1 : dataMax
  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1
  const px = (x: number) => pad.l + ((x - minX) / spanX) * (width - pad.l - pad.r)
  const py = (y: number) => pad.t + (1 - (y - minY) / spanY) * (height - pad.t - pad.b)
  const ticks = Array.from({ length: 4 }, (_, i) => dataMin + ((dataMax - dataMin) * i) / 3)
  return {
    minX,
    maxX,
    dataMin,
    dataMax,
    px,
    py,
    ticks: dataMin === dataMax ? [dataMin] : ticks,
    points: series.map((d) => ({ ...d, x: px(d.year), y: py(d.value) })),
    pad,
    width,
    height,
  }
}
