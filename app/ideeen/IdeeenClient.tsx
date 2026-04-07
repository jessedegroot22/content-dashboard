'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/TopBar'
import NewIdeaModal from '@/components/NewIdeaModal'
import type { Opdracht, OpdrachStatus } from '@/lib/types'

const STATUS_CONFIG: Record<
  OpdrachStatus,
  { label: string; color: string; dot: string }
> = {
  Idee: {
    label: 'Idee',
    color: 'bg-surface-container text-on-surface-variant',
    dot: 'bg-outline-variant',
  },
  'Klaar voor uitwerking': {
    label: 'Klaar voor uitwerking',
    color: 'bg-secondary-fixed text-on-secondary-fixed',
    dot: 'bg-secondary',
  },
  Bezig: {
    label: 'Bezig',
    color: 'bg-primary-container/20 text-on-primary-container',
    dot: 'bg-secondary animate-pulse',
  },
  Klaar: {
    label: 'Klaar',
    color: 'bg-tertiary-fixed/20 text-on-tertiary-fixed-variant',
    dot: 'bg-tertiary-fixed',
  },
  Fout: {
    label: 'Fout',
    color: 'bg-error-container text-on-error-container',
    dot: 'bg-error',
  },
}

type Tab = 'alle' | 'ideeen' | 'bezig' | 'klaar'

const TABS: { id: Tab; label: string }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'ideeen', label: 'Ideeën' },
  { id: 'bezig', label: 'Actief' },
  { id: 'klaar', label: 'Klaar' },
]

function filterOpdrachten(opdrachten: Opdracht[], tab: Tab): Opdracht[] {
  if (tab === 'ideeen')
    return opdrachten.filter((o) =>
      ['Idee', 'Klaar voor uitwerking'].includes(o.Status)
    )
  if (tab === 'bezig') return opdrachten.filter((o) => o.Status === 'Bezig')
  if (tab === 'klaar') return opdrachten.filter((o) => o.Status === 'Klaar')
  return opdrachten
}

interface IdeeenClientProps {
  initialOpdrachten: Opdracht[]
}

export default function IdeeenClient({ initialOpdrachten }: IdeeenClientProps) {
  const router = useRouter()
  const [opdrachten, setOpdrachten] = useState(initialOpdrachten)
  const [tab, setTab] = useState<Tab>('alle')
  const [showModal, setShowModal] = useState(false)

  const visible = filterOpdrachten(opdrachten, tab)

  const counts = {
    alle: opdrachten.length,
    ideeen: opdrachten.filter((o) => ['Idee', 'Klaar voor uitwerking'].includes(o.Status)).length,
    bezig: opdrachten.filter((o) => o.Status === 'Bezig').length,
    klaar: opdrachten.filter((o) => o.Status === 'Klaar').length,
  }

  function handleSuccess(opdrachId: string) {
    setShowModal(false)
    // Als de opdracht direct uitgewerkt wordt, navigeer naar de job pagina
    router.push(`/job/${opdrachId}`)
  }

  async function handleUitwerken(opdracht: Opdracht) {
    try {
      await fetch(`/api/ideas/${opdracht.id}/uitwerken`, { method: 'POST' })
      router.push(`/job/${opdracht.id}`)
    } catch {
      alert('Kon de opdracht niet starten. Controleer de instellingen.')
    }
  }

  return (
    <>
      <TopBar
        title="Content ideeën"
        subtitle="Beheer en werk content uit voor jouw website"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nieuw idee
          </button>
        }
      />

      <div className="p-8">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <SummaryCard
            icon="lightbulb"
            label="Ideeën"
            value={counts.ideeen}
            color="text-on-surface-variant"
          />
          <SummaryCard
            icon="pending_actions"
            label="Actief"
            value={counts.bezig}
            color="text-secondary"
          />
          <SummaryCard
            icon="check_circle"
            label="Klaar"
            value={counts.klaar}
            color="text-on-tertiary-fixed-variant"
          />
          <SummaryCard
            icon="article"
            label="Totaal"
            value={counts.alle}
            color="text-on-surface"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-surface-container-low p-1 rounded-xl w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-surface-container-lowest text-on-surface shadow-card'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.label}
              {counts[t.id] > 0 && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                    tab === t.id
                      ? 'bg-surface-container text-on-surface-variant'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {counts[t.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        {visible.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/15">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Zoekwoord
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Type
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Pagina type
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Datum
                  </th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {visible.map((opdracht) => (
                  <OpdrachRow
                    key={opdracht.id}
                    opdracht={opdracht}
                    onUitwerken={() => handleUitwerken(opdracht)}
                    onOpenJob={() => router.push(`/job/${opdracht.id}`)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <NewIdeaModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
      )}
    </>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <span className={`material-symbols-outlined text-[20px] ${color}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold font-headline text-on-surface">{value}</p>
      <p className="text-xs text-on-surface-variant mt-0.5">{label}</p>
    </div>
  )
}

function OpdrachRow({
  opdracht,
  onUitwerken,
  onOpenJob,
}: {
  opdracht: Opdracht
  onUitwerken: () => void
  onOpenJob: () => void
}) {
  const status = opdracht.Status as OpdrachStatus
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['Idee']
  const isBezig = status === 'Bezig'
  const isKlaar = status === 'Klaar'
  const canUitwerken = ['Idee', 'Klaar voor uitwerking'].includes(status)

  return (
    <tr className="hover:bg-surface-container-low/50 transition-colors group">
      <td className="px-6 py-4">
        <p className="font-semibold text-sm text-on-surface">
          {opdracht['Primair zoekwoord']}
        </p>
        {opdracht['Toelichting Opdracht'] && (
          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
            {opdracht['Toelichting Opdracht']}
          </p>
        )}
      </td>
      <td className="px-6 py-4">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            opdracht['Content actie'] === 'Creëren'
              ? 'bg-surface-container text-on-surface-variant'
              : 'bg-secondary-fixed/60 text-on-secondary-fixed'
          }`}
        >
          {opdracht['Content actie'] === 'Creëren' ? '✦ Nieuw' : '↑ Optim.'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-on-surface-variant">
          {opdracht['Pagina type'] || '—'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs text-on-surface-variant">
          {opdracht['Datum aangemaakt']
            ? new Date(opdracht['Datum aangemaakt']).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'short',
              })
            : '—'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        {canUitwerken && (
          <button
            onClick={onUitwerken}
            className="opacity-0 group-hover:opacity-100 text-xs font-bold bg-primary-container text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 ml-auto"
          >
            <span className="material-symbols-outlined text-[14px]">rocket_launch</span>
            Uitwerken
          </button>
        )}
        {(isBezig || isKlaar) && (
          <button
            onClick={onOpenJob}
            className="opacity-0 group-hover:opacity-100 text-xs font-bold bg-surface-container text-on-surface px-4 py-2 rounded-xl hover:bg-surface-container-high transition-all flex items-center gap-1.5 ml-auto"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isBezig ? 'pending_actions' : 'open_in_new'}
            </span>
            {isBezig ? 'Volg status' : 'Bekijk'}
          </button>
        )}
      </td>
    </tr>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card p-16 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-on-surface-variant text-[28px]">
          lightbulb
        </span>
      </div>
      <h3 className="text-lg font-bold font-headline text-on-surface mb-2">
        Nog geen content ideeën
      </h3>
      <p className="text-sm text-on-surface-variant max-w-xs mb-6">
        Voeg je eerste zoekwoord toe om content te laten schrijven of optimaliseren.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Voeg eerste idee toe
      </button>
    </div>
  )
}
