'use server'

import { revalidatePath } from 'next/cache'
import { isDbConfigured } from '@/lib/db'
import { setCandidateStatus } from '@/lib/candidates'
import type { CandidateStatus } from '@/data/types'

export async function updateStatusAction(id: string, status: CandidateStatus) {
  if (!isDbConfigured()) return { ok: false as const, error: 'db-not-configured' }
  if (!id) return { ok: false as const, error: 'missing-id' }
  if (!['draft', 'promoted', 'rejected'].includes(status)) {
    return { ok: false as const, error: 'invalid-status' }
  }
  await setCandidateStatus(id, status)
  revalidatePath('/admin/candidates')
  return { ok: true as const }
}
