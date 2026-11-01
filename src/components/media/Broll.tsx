'use client'

import { useEffect, useRef } from 'react'
import Credit from './Credit'
import { mediaCredit } from './credits'

/**
 * Desktop-only b-roll. Muted, plays when at least half in view, and never
 * autoplays under reduced motion or Save-Data. Not used in the LCP slot.
 */
export default function Broll() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const saveData = Boolean(connection?.saveData)
    if (reduce || saveData) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const credit = mediaCredit('iss_night')
  return (
    <figure className="hidden md:block">
      <video
        ref={ref}
        className="w-full h-[360px] object-cover bg-neutral-900"
        muted
        playsInline
        loop
        preload="none"
        poster="/media/iss_night-poster.avif"
        aria-label={credit.text}
      >
        <source src="/media/iss_night-1280.webm" type="video/webm" />
        <source src="/media/iss_night-1280.mp4" type="video/mp4" />
      </video>
      <figcaption className="site-shell py-3">
        <Credit credit={credit} />
      </figcaption>
    </figure>
  )
}
