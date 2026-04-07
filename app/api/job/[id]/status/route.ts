/**
 * GET /api/job/[id]/status
 *
 * Frontend pollt dit endpoint elke 2.5 seconden om de live job status op te halen.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getJob } from '@/lib/store'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const job = getJob(params.id)

  if (!job) {
    return NextResponse.json({ error: 'Job niet gevonden' }, { status: 404 })
  }

  return NextResponse.json(job)
}
