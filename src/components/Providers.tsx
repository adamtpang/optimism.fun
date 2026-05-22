'use client'

import { ThemeProvider } from 'next-themes'
import { FeedbackProvider } from './FeedbackWidget'
import FeedbackFAB from './FeedbackFAB'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <FeedbackProvider>
        {children}
        <FeedbackFAB />
      </FeedbackProvider>
    </ThemeProvider>
  )
}
