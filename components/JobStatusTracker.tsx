'use client'

import { useEffect, useState } from 'react'
import type { JobState, WorkflowStep } from '@/lib/types'

interface JobStatusTrackerProps {
  opdrachId: string
  keyword: string
  contentActie: 'Optimaliseren' | 'Creëren'
}

function StepIcon({ status }: { status: WorkflowStep['status'] }) {
  if (status === 'done') {
    return (
      <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-on-tertiary-fixed text-[16px]">
          check
        </span>
      </div>
    )
  }
  if (status === 'running') {
    return (
      <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-white text-[16px] animate-spin">
          progress_activity
        </span>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-error text-[16px]">error</span>
      </div>
    )
  }
  return (
    <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-outline-variant/30 flex items-center justify-center flex-shrink-0">
      <div className="w-2 h-2 rounded-full bg-outline-variant/50" />
    </div>
  )
}

function StepRow({ step, isLast }: { step: WorkflowStep; isLast: boolean }) {
  const isActive = step.status === 'running'
  const isDone = step.status === 'done'
  const isError = step.status === 'error'
  const isPending = step.status === 'pending'

  return (
    <div className="flex gap-4">
      {/* Icon + connector line */}
      <div className="flex flex-col items-center">
        <StepIcon status={step.status} />
        {!isLast && (
          <div
            className={`w-0.5 flex-1 mt-1 min-h-[2rem] rounded-full transition-colors duration-500 ${
              isDone ? 'bg-tertiary-fixed/60' : 'bg-outline-variant/20'
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className={`pb-6 flex-1 ${isLast ? 'pb-0' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-semibold transition-colors ${
              isActive
                ? 'text-on-surface'
                : isDone
                ? 'text-on-surface'
                : isError
                ? 'text-error'
                : 'text-on-surface-variant'
            }`}
          >
            {step.label}
          </p>
          {step.finishedAt && step.startedAt && (
            <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full flex-shrink-0">
              {((step.finishedAt - step.startedAt) / 1000).toFixed(0)}s
            </span>
          )}
        </div>

        {/* Description — toon bij running of pending als volgende stap */}
        {(isActive || (!isDone && !isError && !isPending)) && (
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            {step.description}
          </p>
        )}

        {/* Message bij error */}
        {isError && step.message && (
          <p className="text-xs text-error mt-1 bg-error-container/30 px-3 py-1.5 rounded-lg">
            {step.message}
          </p>
        )}

        {/* Pulsing "bezig" indicator */}
        {isActive && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:0ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:150ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:300ms]" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function JobStatusTracker({
  opdrachId,
  keyword,
  contentActie,
}: JobStatusTrackerProps) {
  const [job, setJob] = useState<JobState | null>(null)
  const [notStarted, setNotStarted] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    async function poll() {
      try {
        const res = await fetch(`/api/job/${opdrachId}/status`)
        if (res.status === 404) {
          setNotStarted(true)
          return
        }
        const data: JobState = await res.json()
        setJob(data)
        setNotStarted(false)

        // Stop polling als job klaar of fout is
        if (data.finishedAt || data.error) {
          clearInterval(interval)
        }
      } catch {
        // stil falen — probeer opnieuw bij volgende poll
      }
    }

    poll()
    interval = setInterval(poll, 2500)
    return () => clearInterval(interval)
  }, [opdrachId])

  const doneCount = job?.steps.filter((s) => s.status === 'done').length ?? 0
  const totalCount = job?.steps.length ?? 0
  const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0
  const isFinished = !!job?.finishedAt
  const hasError = !!job?.error

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-card">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              isFinished
                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                : hasError
                ? 'bg-error-container text-error'
                : 'bg-primary-container text-white'
            }`}
          >
            {isFinished ? 'Klaar' : hasError ? 'Fout opgetreden' : 'Bezig…'}
          </span>
          <span className="text-sm text-on-surface-variant font-semibold">
            {doneCount} / {totalCount} stappen
          </span>
        </div>

        <h3 className="text-2xl font-bold font-headline text-on-surface mt-3">
          {keyword}
        </h3>
        <p className="text-sm text-on-surface-variant">
          {contentActie === 'Creëren' ? '✦ Nieuwe tekst schrijven' : '↑ Bestaande tekst optimaliseren'}
        </p>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: hasError
                ? 'rgb(186 26 26)'
                : isFinished
                ? '#d9ee59'
                : 'linear-gradient(to right, #366287, #0d1b36)',
            }}
          />
        </div>
      </div>

      {/* Steps */}
      {notStarted ? (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-on-surface-variant">
              hourglass_empty
            </span>
          </div>
          <p className="text-sm font-semibold text-on-surface">Wachten op Make.com…</p>
          <p className="text-xs text-on-surface-variant mt-1">
            De workflow start zodra Make.com de opdracht oppakt.
          </p>
        </div>
      ) : !job ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-surface-container flex-shrink-0" />
              <div className="flex-1 space-y-1.5 pt-1">
                <div className="h-3 bg-surface-container rounded w-1/3" />
                <div className="h-2.5 bg-surface-container rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {job.steps.map((step, i) => (
            <StepRow key={step.id} step={step} isLast={i === job.steps.length - 1} />
          ))}
        </div>
      )}

      {/* Result CTA */}
      {isFinished && job?.googleDocUrl && (
        <div className="mt-8 p-6 bg-surface-container-low rounded-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            Resultaat
          </p>
          <a
            href={job.googleDocUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-primary-container text-white px-6 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
            Bekijk in Google Docs
          </a>
        </div>
      )}

      {/* Error detail */}
      {hasError && (
        <div className="mt-6 p-4 bg-error-container/30 rounded-xl">
          <p className="text-sm font-semibold text-error">Er is een fout opgetreden</p>
          <p className="text-xs text-on-surface-variant mt-1">{job?.error}</p>
        </div>
      )}
    </div>
  )
}
