import { getOpdracht } from '@/lib/airtable'
import JobClient from './JobClient'
import TopBar from '@/components/TopBar'
import Link from 'next/link'

interface Props {
  params: { id: string }
}

export const revalidate = 0

export default async function JobPage({ params }: Props) {
  let opdracht = null
  try {
    opdracht = await getOpdracht(params.id)
  } catch {
    return (
      <div className="p-8">
        <p className="text-on-surface-variant text-sm">Opdracht niet gevonden.</p>
      </div>
    )
  }

  return (
    <>
      <TopBar
        title={opdracht['Primair zoekwoord']}
        subtitle={opdracht['Content actie'] === 'Creëren' ? '✦ Nieuwe tekst schrijven' : '↑ Bestaande tekst optimaliseren'}
        actions={
          <Link
            href="/ideeen"
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Terug naar overzicht
          </Link>
        }
      />
      <div className="p-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Live status tracker — neemt meeste ruimte */}
          <div className="col-span-12 lg:col-span-7">
            <JobClient
              opdrachId={params.id}
              keyword={opdracht['Primair zoekwoord']}
              contentActie={opdracht['Content actie']}
            />
          </div>

          {/* Sidebar met opdracht details */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <OpdrachDetails opdracht={opdracht} />
          </div>
        </div>
      </div>
    </>
  )
}

function OpdrachDetails({ opdracht }: { opdracht: Awaited<ReturnType<typeof getOpdracht>> }) {
  const details = [
    { label: 'Zoekwoord', value: opdracht['Primair zoekwoord'] },
    { label: 'Pagina type', value: opdracht['Pagina type'] },
    { label: 'Type actie', value: opdracht['Content actie'] },
    { label: 'Status', value: opdracht['Status'] },
    ...(opdracht['Bestaande URL']
      ? [{ label: 'Bestaande URL', value: opdracht['Bestaande URL'], isUrl: true }]
      : []),
  ]

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
      <h4 className="text-sm font-bold text-on-surface mb-4">Opdracht details</h4>
      <dl className="space-y-3">
        {details.map((d) => (
          <div key={d.label}>
            <dt className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              {d.label}
            </dt>
            <dd className="text-sm text-on-surface mt-0.5">
              {d.isUrl ? (
                <a
                  href={d.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline truncate block"
                >
                  {d.value}
                </a>
              ) : (
                d.value || '—'
              )}
            </dd>
          </div>
        ))}
      </dl>

      {opdracht['Toelichting Opdracht'] && (
        <div className="mt-5 pt-5 border-t border-outline-variant/15">
          <dt className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-1.5">
            Toelichting
          </dt>
          <dd className="text-sm text-on-surface leading-relaxed">
            {opdracht['Toelichting Opdracht']}
          </dd>
        </div>
      )}
    </div>
  )
}
