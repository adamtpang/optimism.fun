'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Props = {
  label: string
  children: React.ReactNode
  align?: 'left' | 'right'
}

/**
 * Small (i) trigger that opens a popover on hover (desktop) or tap (touch).
 * Used on column headers in the problem table so users can read the
 * definition of bcr / itn / util δ / etc. without leaving the page.
 */
export default function InfoTip({ label, children, align = 'right' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    function onClickAway(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`${label} — what does this mean?`}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-hair-strong text-ink-500 hover:text-amber-300 hover:border-amber-300/60 focus:text-amber-300 focus:border-amber-300/60 focus:outline-none text-[9px] font-mono leading-none transition-colors"
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          className={`absolute z-50 top-full mt-2 w-72 border border-hair-strong bg-ink-900 shadow-xl p-3 normal-case tracking-normal ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <span className="block font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1.5">
            {label}
          </span>
          <span className="block font-sans text-xs text-ink-200 leading-relaxed">
            {children}
          </span>
          <Link
            href="/methodology"
            className="mt-2 inline-block font-mono text-[10px] uppercase tracking-wider text-amber-300/80 hover:text-amber-300"
          >
            methodology &rarr;
          </Link>
        </span>
      )}
    </span>
  )
}
