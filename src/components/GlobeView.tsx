'use client'

/**
 * The capitalism globe — a modern, MIT-licensed re-imagining of Harvard's
 * "Globe of Economic Complexity" (which is GPL, so this is a clean-room rebuild
 * with globe.gl, not a fork). Plots the world's largest public companies at
 * their HQ country, each dot's height scaled to market cap. Dark earth, sky-blue
 * confetti, slow auto-rotation. Loaded client-only (globe.gl needs WebGL/window).
 */
import { useEffect, useRef } from 'react'
import { publicCompanies } from '@/data/public-companies'
import { centroidFor } from '@/data/geo/country-centroids'

const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

type Pt = { lat: number; lng: number; name: string; mc: number; alt: number }

export default function GlobeView() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let world: { _destructor?: () => void; width: (n: number) => void; height: (n: number) => void } | null = null
    let disposed = false
    let onResize: (() => void) | null = null

    void (async () => {
      const Globe = (await import('globe.gl')).default
      const el = ref.current
      if (disposed || !el) return

      const maxLog = Math.log10(3.5e12) // ~ largest market cap
      const points: Pt[] = publicCompanies
        .map((c, i): Pt | null => {
          const ctr = centroidFor(c.country)
          const mc = c.marketCap?.value ?? 0
          if (!ctr || !mc) return null
          // Deterministic jitter so same-country points spread into a cluster.
          const jLat = (((i * 37) % 13) - 6) * 0.55
          const jLng = (((i * 53) % 13) - 6) * 0.55
          const alt = 0.03 + 0.16 * clamp01((Math.log10(Math.max(1e9, mc)) - 9) / (maxLog - 9))
          return { lat: ctr.lat + jLat, lng: ctr.lng + jLng, name: c.name, mc, alt }
        })
        .filter((p): p is Pt => p !== null)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g: any = new (Globe as any)(el)
      g
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundColor('rgba(0,0,0,0)')
        .atmosphereColor('#38bdf8')
        .atmosphereAltitude(0.18)
        .pointsData(points)
        .pointLat('lat')
        .pointLng('lng')
        .pointAltitude('alt')
        .pointRadius(0.3)
        .pointColor(() => '#0ea5e9')
        .pointsTransitionDuration(0)
        .pointLabel(
          (d: Pt) =>
            `<div style="font-family:ui-monospace,monospace;font-size:11px;background:#08080a;color:#f6f5f2;border:1px solid #0ea5e9;padding:4px 8px;border-radius:4px;white-space:nowrap;">${d.name} · $${(d.mc / 1e9).toFixed(0)}B</div>`,
        )

      g.pointOfView({ lat: 25, lng: -40, altitude: 2.3 }, 0)
      const controls = g.controls()
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.45
      controls.enableZoom = true

      onResize = () => {
        if (!ref.current) return
        g.width(ref.current.clientWidth)
        g.height(ref.current.clientHeight)
      }
      onResize()
      window.addEventListener('resize', onResize)
      world = g
    })()

    return () => {
      disposed = true
      if (onResize) window.removeEventListener('resize', onResize)
      try {
        world?._destructor?.()
      } catch {
        // ignore teardown errors
      }
      if (ref.current) ref.current.innerHTML = ''
    }
  }, [])

  return <div ref={ref} className="w-full h-[68vh] min-h-[440px]" aria-label="Globe of public companies by market cap" />
}
