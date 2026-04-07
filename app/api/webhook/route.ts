/**
 * POST /api/webhook
 *
 * Make.com roept dit endpoint aan na elke stap in de workflow.
 * We updaten de in-memory job state zodat het dashboard live kan pollt.
 *
 * Body: { opdracht_id, step, status, message?, google_doc_url?, secret }
 */

import { NextRequest, NextResponse } from 'next/server'
import { initJob, updateJobStep, getJob } from '@/lib/store'
import type { WebhookPayload } from '@/lib/types'

export async function POST(req: NextRequest) {
  // Valideer secret
  const secret = process.env.WEBHOOK_SECRET
  if (secret) {
    const body = await req.text()
    const payload = JSON.parse(body) as WebhookPayload & { secret?: string }

    if (payload.secret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handleUpdate(payload)
  }

  // Geen secret geconfigureerd — accepteer alle requests (dev mode)
  const payload = (await req.json()) as WebhookPayload & { secret?: string }
  return handleUpdate(payload)
}

function handleUpdate(payload: WebhookPayload & { content_actie?: string }) {
  const { opdracht_id, step, status, message, google_doc_url } = payload

  if (!opdracht_id || !step || !status) {
    return NextResponse.json(
      { error: 'opdracht_id, step en status zijn verplicht' },
      { status: 400 }
    )
  }

  // Init job als die nog niet bestaat (eerste stap)
  if (!getJob(opdracht_id)) {
    const contentActie = (payload.content_actie === 'Optimaliseren'
      ? 'Optimaliseren'
      : 'Creëren') as 'Optimaliseren' | 'Creëren'
    initJob(opdracht_id, contentActie)
  }

  const job = updateJobStep(opdracht_id, step, status, message, google_doc_url)

  if (!job) {
    return NextResponse.json({ error: 'Job niet gevonden' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, currentStep: job.currentStep })
}
