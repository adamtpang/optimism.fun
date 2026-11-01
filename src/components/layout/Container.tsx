import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** The only content width on the site. `prose` is the 680px reading measure. */
export default function Container({
  children,
  size = 'default',
  className,
}: {
  children: ReactNode
  size?: 'default' | 'prose'
  className?: string
}) {
  return <div className={cn(size === 'prose' ? 'site-prose' : 'site-shell', className)}>{children}</div>
}
