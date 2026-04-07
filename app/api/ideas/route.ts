/**
 * POST /api/ideas
 *
 * Maakt een nieuwe opdracht aan in Airtable.
 * Als uitwerken=true, triggert ook direct de Make.com webhook.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createOpdracht, updateOpdrachStatus } from '@/lib/airtable'
import { initJob } from '@/lib/store'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { keyword, content_actie, pagina_type, bestaande_url, toelichting, uitwerken } =
    body

  if (!keyword) {
    return NextResponse.json({ error: 'keyword is verplicht' }, { status: 400 })
  }

  // Maak record aan in Airtable
  const opdracht = await createOpdracht({
    'Primair zoekwoord': keyword,
    'Content actie': content_actie ?? 'Creëren',
    'Pagina type': pagina_type,
    'Bestaande URL': bestaande_url,
    'Toelichting Opdracht': toelichting,
    Status: uitwerken ? 'Bezig' : 'Idee',
  })

  // Als direct uitwerken: init de job state en trigger Make.com
  if (uitwerken) {
    initJob(opdracht.id, content_actie ?? 'Creëren')

    const webhookUrl = process.env.MAKE_CONTENT_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: opdracht.id }),
        })
      } catch (err) {
        console.error('Make.com webhook mislukt:', err)
        // Zet status terug naar 'Klaar voor uitwerking' als webhook faalt
        await updateOpdrachStatus(opdracht.id, 'Klaar voor uitwerking')
        return NextResponse.json(
          { error: 'Make.com webhook kon niet worden getriggerd' },
          { status: 502 }
        )
      }
    }
  }

  return NextResponse.json({ id: opdracht.id, status: opdracht.Status })
}
