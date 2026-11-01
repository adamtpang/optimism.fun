/**
 * Media credit line.
 *
 * Public-domain and CC0 lines are staged in public/media/CREDITS.md and are
 * not rendered until that copy is approved. CC BY attribution is mandatory,
 * so a `cc-by` credit renders beside the image that requires it.
 */
import type { ReactNode } from 'react'

export default function Credit({
  license,
  children,
  onDark = false,
}: {
  license: 'cc-by' | 'cc0' | 'public-domain'
  children: ReactNode
  onDark?: boolean
}) {
  if (license !== 'cc-by') return null
  return (
    <p className={onDark ? 'text-small text-neutral-300' : 'text-small text-neutral-600'}>{children}</p>
  )
}
