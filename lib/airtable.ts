import type { Klant, Opdracht, OpdrachStatus } from './types'

const BASE_URL = 'https://api.airtable.com/v0'

// Tabel IDs uit de Make.com blueprint
const TABLES = {
  opdrachten: 'tblQZt7013ByB4R0V',
  klanten: 'tbln2kFeZfvPqQQK4',
}

function headers() {
  return {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

function baseUrl() {
  const base = process.env.AIRTABLE_BASE_ID
  if (!base) throw new Error('AIRTABLE_BASE_ID is not set')
  return `${BASE_URL}/${base}`
}

// ─── Generieke fetch helpers ──────────────────────────────────────────────────

async function atFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...options,
    headers: headers(),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Airtable error ${res.status}: ${body}`)
  }
  return res.json()
}

function mapRecord<T>(record: { id: string; fields: Record<string, unknown> }): T {
  return { id: record.id, ...record.fields } as T
}

// ─── Opdrachten ───────────────────────────────────────────────────────────────

export async function getOpdrachten(): Promise<Opdracht[]> {
  const data = await atFetch(
    `/${TABLES.opdrachten}?sort[0][field]=Datum aangemaakt&sort[0][direction]=desc`
  )
  return (data.records as { id: string; fields: Record<string, unknown> }[]).map((r) =>
    mapRecord<Opdracht>(r)
  )
}

export async function getOpdracht(id: string): Promise<Opdracht> {
  const data = await atFetch(`/${TABLES.opdrachten}/${id}`)
  return mapRecord<Opdracht>(data)
}

export async function createOpdracht(fields: Partial<Opdracht>): Promise<Opdracht> {
  const data = await atFetch(`/${TABLES.opdrachten}`, {
    method: 'POST',
    body: JSON.stringify({ fields }),
  })
  return mapRecord<Opdracht>(data)
}

export async function updateOpdrachStatus(
  id: string,
  status: OpdrachStatus
): Promise<void> {
  await atFetch(`/${TABLES.opdrachten}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: { Status: status } }),
  })
}

// ─── Klanten ──────────────────────────────────────────────────────────────────

export async function getKlanten(): Promise<Klant[]> {
  const data = await atFetch(`/${TABLES.klanten}`)
  return (data.records as { id: string; fields: Record<string, unknown> }[]).map((r) =>
    mapRecord<Klant>(r)
  )
}

export async function getKlant(id: string): Promise<Klant> {
  const data = await atFetch(`/${TABLES.klanten}/${id}`)
  return mapRecord<Klant>(data)
}
