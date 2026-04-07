'use client'

import { useState } from 'react'
import { PAGINA_TYPES } from '@/lib/workflow-steps'

interface NewIdeaModalProps {
  onClose: () => void
  onSuccess: (opdrachId: string) => void
}

export default function NewIdeaModal({ onClose, onSuccess }: NewIdeaModalProps) {
  const [form, setForm] = useState({
    keyword: '',
    content_actie: 'Creëren' as 'Creëren' | 'Optimaliseren',
    pagina_type: '',
    bestaande_url: '',
    toelichting: '',
    uitwerken: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.keyword.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: form.keyword,
          content_actie: form.content_actie,
          pagina_type: form.pagina_type || undefined,
          bestaande_url: form.bestaande_url || undefined,
          toelichting: form.toelichting || undefined,
          uitwerken: form.uitwerken,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Er is iets misgegaan')
      }

      const data = await res.json()
      onSuccess(data.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-card w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <div>
            <h3 className="text-lg font-bold font-headline text-on-surface">
              Nieuw content idee
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Sla op als idee of werk direct uit
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Keyword */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">
              Primair zoekwoord <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.keyword}
              onChange={(e) => setForm({ ...form, keyword: e.target.value })}
              placeholder="bijv. zonnepanelen installeren kosten"
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
              required
            />
          </div>

          {/* Content actie */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">
              Type
            </label>
            <div className="flex gap-3">
              {(['Creëren', 'Optimaliseren'] as const).map((actie) => (
                <button
                  key={actie}
                  type="button"
                  onClick={() => setForm({ ...form, content_actie: actie })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    form.content_actie === actie
                      ? 'bg-primary-container text-white'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {actie === 'Creëren' ? '✦ Nieuwe tekst' : '↑ Optimaliseren'}
                </button>
              ))}
            </div>
          </div>

          {/* Pagina type */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">
              Pagina type
            </label>
            <select
              value={form.pagina_type}
              onChange={(e) => setForm({ ...form, pagina_type: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
            >
              <option value="">Kies een type…</option>
              {PAGINA_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Bestaande URL (alleen bij optimaliseren) */}
          {form.content_actie === 'Optimaliseren' && (
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Bestaande URL
              </label>
              <input
                type="url"
                value={form.bestaande_url}
                onChange={(e) => setForm({ ...form, bestaande_url: e.target.value })}
                placeholder="https://jouwwebsite.nl/pagina"
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
              />
            </div>
          )}

          {/* Toelichting */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">
              Toelichting <span className="text-on-surface-variant font-normal">(optioneel)</span>
            </label>
            <textarea
              value={form.toelichting}
              onChange={(e) => setForm({ ...form, toelichting: e.target.value })}
              placeholder="Extra context of wensen voor deze tekst…"
              rows={3}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-error bg-error-container/30 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading || !form.keyword.trim()}
              onClick={() => setForm((f) => ({ ...f, uitwerken: false }))}
              className="flex-1 py-2.5 bg-surface-container-low text-on-surface font-semibold text-sm rounded-xl hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              {loading ? 'Opslaan…' : 'Opslaan als idee'}
            </button>
            <button
              type="submit"
              disabled={loading || !form.keyword.trim()}
              onClick={() => setForm((f) => ({ ...f, uitwerken: true }))}
              className="flex-1 py-2.5 bg-primary-container text-white font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">
                {loading ? 'hourglass_empty' : 'rocket_launch'}
              </span>
              {loading ? 'Bezig…' : 'Direct uitwerken'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
