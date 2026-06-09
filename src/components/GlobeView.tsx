'use client'

/**
 * The capitalism globe — a modern, MIT-licensed re-imagining of Harvard's
 * "Globe of Economic Complexity" (which is GPL, so this is a clean-room rebuild
 * with globe.gl, not a fork).
 *
 * Three toggleable layers, each plotted at a country centroid and height-scaled
 * (log) within its own layer:
 *   · companies — public companies by market cap (sky)
 *   · founders  — people by net worth (gold)
 *   · countries — economies by GDP (emerald)
 *
 * Loaded client-only (globe.gl needs WebGL/window); globe.gl is imported inside
 * the effect so the module stays SSR-safe.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { publicCompanies } from '@/data/public-companies'
import { founders } from '@/data/founders'
import { countries } from '@/data/countries'
import { centroidFor } from '@/data/geo/country-centroids'

const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

export type LayerKey = 'companies' | 'founders' | 'countries'

type Pt = {
  lat: number
  lng: number
  name: string
  valueUSD: number
  alt: number
  radius: number
  color: string
  layer: LayerKey
}

const LAYER_META: Record<LayerKey, { label: string; color: string }> = {
  companies: { label: 'Companies', color: '#38bdf8' }, // sky
  founders: { label: 'Founders', color: '#fbbf24' }, // gold
  countries: { label: 'Countries', color: '#34d399' }, // emerald
}

const fmtUSD = (v: number) => {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(0)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`
  return `$${v.toFixed(0)}`
}

/** Map a list of {country/name, value} into height-normalized points for one layer. */
function buildLayer(
  layer: LayerKey,
  rows: { country: string; name: string; value: number }[],
): Pt[] {
  const vals = rows.map((r) => r.value).filter((v) => v > 0)
  if (vals.length === 0) return []
  const lo = Math.log10(Math.max(1, Math.min(...vals)))
  const hi = Math.log10(Math.max(1, Math.max(...vals)))
  const color = LAYER_META[layer].color
  return rows
    .map((r, i): Pt | null => {
      const ctr = centroidFor(r.country)
      if (!ctr || !(r.value > 0)) return null
      const t = hi <= lo ? 0.5 : clamp01((Math.log10(Math.max(1, r.value)) - lo) / (hi - lo))
      // Deterministic jitter so same-country points spread into a readable cluster.
      const jLat = (((i * 37) % 13) - 6) * 0.5
      const jLng = (((i * 53) % 13) - 6) * 0.5
      return {
        lat: ctr.lat + jLat,
        lng: ctr.lng + jLng,
        name: r.name,
        valueUSD: r.value,
        alt: 0.02 + 0.26 * t,
        radius: 0.16 + 0.2 * t,
        color,
        layer,
      }
    })
    .filter((p): p is Pt => p !== null)
}

export default function GlobeView({
  className = 'w-full h-[68vh] min-h-[440px]',
  initialLayers = ['companies'],
  showToggle = true,
}: {
  className?: string
  initialLayers?: LayerKey[]
  showToggle?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const worldRef = useRef<any>(null)
  const [active, setActive] = useState<Set<LayerKey>>(() => new Set(initialLayers))

  // Build every layer once — data is static.
  const layers = useMemo(() => {
    return {
      companies: buildLayer(
        'companies',
        publicCompanies.map((c) => ({
          country: c.country,
          name: c.name,
          value: c.marketCap?.value ?? 0,
        })),
      ),
      founders: buildLayer(
        'founders',
        founders.map((f) => ({ country: f.country, name: f.name, value: f.netWorth?.value ?? 0 })),
      ),
      countries: buildLayer(
        'countries',
        countries.map((c) => ({ country: c.name, name: c.name, value: c.gdp?.value ?? 0 })),
      ),
    } as Record<LayerKey, Pt[]>
  }, [])

  const counts = useMemo(
    () => ({
      companies: layers.companies.length,
      founders: layers.founders.length,
      countries: layers.countries.length,
    }),
    [layers],
  )

  const activePoints = useMemo(
    () => (['companies', 'founders', 'countries'] as LayerKey[]).filter((k) => active.has(k)).flatMap((k) => layers[k]),
    [active, layers],
  )

  // Init the globe once.
  useEffect(() => {
    let disposed = false
    let onResize: (() => void) | null = null

    void (async () => {
      const Globe = (await import('globe.gl')).default
      const el = ref.current
      if (disposed || !el) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g: any = new (Globe as any)(el)
      g
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundColor('rgba(0,0,0,0)')
        .atmosphereColor('#38bdf8')
        .atmosphereAltitude(0.18)
        .pointLat('lat')
        .pointLng('lng')
        .pointAltitude('alt')
        .pointRadius('radius')
        .pointColor('color')
        .pointsTransitionDuration(280)
        .pointLabel(
          (d: Pt) =>
            `<div style="font-family:ui-monospace,monospace;font-size:11px;background:#08080a;color:#f6f5f2;border:1px solid ${d.color};padding:4px 8px;border-radius:4px;white-space:nowrap;">${d.name} · ${fmtUSD(d.valueUSD)}</div>`,
        )

      g.pointOfView({ lat: 25, lng: -40, altitude: 2.3 }, 0)
      const controls = g.controls()
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.42
      controls.enableZoom = true

      onResize = () => {
        if (!ref.current) return
        g.width(ref.current.clientWidth)
        g.height(ref.current.clientHeight)
      }
      onResize()
      window.addEventListener('resize', onResize)
      worldRef.current = g
      // Seed the initial point set.
      g.pointsData(activePoints)
    })()

    return () => {
      disposed = true
      if (onResize) window.removeEventListener('resize', onResize)
      try {
        worldRef.current?._destructor?.()
      } catch {
        // ignore teardown errors
      }
      worldRef.current = null
      if (ref.current) ref.current.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update points whenever the active layers change.
  useEffect(() => {
    worldRef.current?.pointsData(activePoints)
  }, [activePoints])

  const toggle = (k: LayerKey) =>
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  return (
    <div className={`relative ${className}`}>
      <div ref={ref} className="absolute inset-0" aria-label="Globe of economic activity" />
      {showToggle && (
        <div className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1.5">
          {(['companies', 'founders', 'countries'] as LayerKey[]).map((k) => {
            const on = active.has(k)
            return (
              <button
                key={k}
                type="button"
                onClick={() => toggle(k)}
                aria-pressed={on}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur transition-colors ${
                  on
                    ? 'border-ink-600 bg-ink-900/70 text-ink-100'
                    : 'border-hair bg-ink-900/30 text-ink-500 hover:text-ink-300'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: on ? LAYER_META[k].color : 'transparent', border: `1px solid ${LAYER_META[k].color}` }}
                />
                {LAYER_META[k].label}
                <span className="text-ink-500">{counts[k]}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
