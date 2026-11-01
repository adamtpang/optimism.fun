import { FeedbackProvider } from './FeedbackWidget'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <FeedbackProvider>{children}</FeedbackProvider>
}
