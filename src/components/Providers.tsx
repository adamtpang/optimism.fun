'use client'

import { ThemeProvider } from 'next-themes'
import { FeedbackProvider } from './FeedbackWidget'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <FeedbackProvider>{children}</FeedbackProvider>
    </ThemeProvider>
  )
}
