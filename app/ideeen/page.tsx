import { getOpdrachten } from '@/lib/airtable'
import IdeeenClient from './IdeeenClient'
import type { Opdracht } from '@/lib/types'

export const revalidate = 0

export default async function IdeeenPage() {
  let opdrachten: Opdracht[] = []
  try {
    opdrachten = await getOpdrachten()
  } catch {
    // Airtable key nog niet ingevuld — toon lege state
  }

  return <IdeeenClient initialOpdrachten={opdrachten} />
}
