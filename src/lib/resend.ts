import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

export const resend = apiKey ? new Resend(apiKey) : null
export const audienceId = process.env.RESEND_AUDIENCE_ID ?? ''
export const notifyEmail =
  process.env.RESEND_NOTIFY_EMAIL ?? 'adamtpang@gmail.com'
export const fromEmail =
  process.env.RESEND_FROM_EMAIL ?? 'optimism.fun <onboarding@resend.dev>'
