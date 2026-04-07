/**
 * POST /api/ideas/[id]/uitwerken
 *
 * Triggert de Make.com workflow voor een bestaand idee.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getOpdracht, updateOpdrachStatus } from '@/lib/airtable'
import { initJob } from '@/lib/store'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const opdracht = await getOpdracht(params.id)

  // Zet status op Bezig in Airtable
  await updateOpdrachStatus(params.id, 'Bezig')

  // Init in-memory job state
  initJob(params.id, opdracht['Content actie'])

  // Trigger Make.com
  const webhookUrl = process.env.MAKE_CONTENT_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'MAKE_CONTENT_WEBHOOK_URL is niet geconfigureerd' },
      { status: 500 }
    )
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: params.id }),
  })

  if (!res.ok) {
    await updateOpdrachStatus(params.id, 'Klaar voor uitwerking')
    return NextResponse.json(
      { error: 'Make.com webhook mislukt' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
