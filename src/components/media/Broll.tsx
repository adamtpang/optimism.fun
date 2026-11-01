'use client'

import { useEffect, useRef, useState } from 'react'
import Credit from './Credit'
import { mediaCredit } from './credits'

/**
 * Desktop-only b-roll. Muted, plays when at least half in view, and starts
 * paused on its poster when the user prefers reduced motion or Save-Data.
 * Not used in the LCP slot.
 */
export default function Broll() {
  const ref = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const saveData = Boolean(connection?.saveData)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)

    if (reduce || saveData) {
      video.pause()
      return () => {
        video.removeEventListener('play', onPlay)
        video.removeEventListener('pause', onPause)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(video)
    return () => {
      observer.disconnect()
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [])

  function toggle() {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      userPaused.current = false
      video.play().catch(() => {})
    } else {
      userPaused.current = true
      video.pause()
    }
  }

  const credit = mediaCredit('iss_night')
  return (
    <figure className="broll hidden md:block">
      <div className="relative">
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
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="absolute bottom-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <path fill="currentColor" d="M4 3h3v10H4V3zm5 0h3v10H9V3z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <path fill="currentColor" d="M5 3.5v9l8-4.5-8-4.5z" />
            </svg>
          )}
        </button>
      </div>
      <figcaption className="site-shell py-3">
        <Credit credit={credit} />
      </figcaption>
    </figure>
  )
}
