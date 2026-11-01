import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function Section({
  children,
  id,
  className,
}: {
  children: ReactNode
  id?: string
  className?: string
}) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      {children}
    </section>
  )
}
