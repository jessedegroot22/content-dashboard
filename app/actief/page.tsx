import { getOpdrachten } from '@/lib/airtable'
import TopBar from '@/components/TopBar'
import Link from 'next/link'
import type { Opdracht } from '@/lib/types'

export const revalidate = 0

export default async function ActiefPage() {
  let actief: Opdracht[] = []
  try {
    const all = await getOpdrachten()
    actief = all.filter((o) => o.Status === 'Bezig')
  } catch {
    // Airtable key nog niet ingevuld
  }

  return (
    <>
      <TopBar
        title="Actieve jobs"
        subtitle="Opdrachten die momenteel worden uitgewerkt"
      />
      <div className="p-8">
        {actief.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl shadow-card p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-surface-variant text-[28px]">
                pending_actions
              </span>
            </div>
            <h3 className="text-lg font-bold font-headline text-on-surface mb-2">
              Geen actieve jobs
            </h3>
            <p className="text-sm text-on-surface-variant max-w-xs mb-6">
              Start een opdracht vanuit de ideeënlijst om hier de voortgang te zien.
            </p>
            <Link
              href="/ideeen"
              className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              Naar ideeënlijst
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actief.map((opdracht) => (
              <Link
                key={opdracht.id}
                href={`/job/${opdracht.id}`}
                className="bg-surface-container-lowest rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse flex-shrink-0" />
                      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                        Bezig
                      </span>
                    </div>
                    <p className="font-bold text-on-surface font-headline truncate">
                      {opdracht['Primair zoekwoord']}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {opdracht['Content actie']} · {opdracht['Pagina type'] || 'Geen pagina type'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors ml-4">
                    chevron_right
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
