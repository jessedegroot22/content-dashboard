/**
 * In-memory job status store.
 * Make.com stuurt per stap een webhook → wij updaten hier de status.
 * Het dashboard pollt de /api/job/[id]/status route om live updates te tonen.
 *
 * Werkt prima voor single-instance deployment op Render.
 */

import type { JobState, StepStatus } from './types'
import { getWorkflowSteps } from './workflow-steps'

// Module-level singleton — overleeft requests, verdwijnt bij herstart
const jobs = new Map<string, JobState>()

export function initJob(
  opdrachId: string,
  contentActie: 'Optimaliseren' | 'Creëren'
): JobState {
  const state: JobState = {
    opdrachId,
    contentActie,
    steps: getWorkflowSteps(contentActie),
    currentStep: null,
    startedAt: Date.now(),
  }
  jobs.set(opdrachId, state)
  return state
}

export function getJob(opdrachId: string): JobState | undefined {
  return jobs.get(opdrachId)
}

export function updateJobStep(
  opdrachId: string,
  stepId: string,
  status: StepStatus,
  message?: string,
  googleDocUrl?: string
): JobState | null {
  const job = jobs.get(opdrachId)
  if (!job) return null

  const step = job.steps.find((s) => s.id === stepId)
  if (step) {
    step.status = status
    if (message) step.message = message
    if (status === 'running') {
      step.startedAt = Date.now()
      job.currentStep = stepId
    }
    if (status === 'done' || status === 'error') {
      step.finishedAt = Date.now()
    }
  }

  if (stepId === 'done' && status === 'done') {
    job.finishedAt = Date.now()
    job.currentStep = null
    if (googleDocUrl) job.googleDocUrl = googleDocUrl
  }

  if (status === 'error') {
    job.error = message
  }

  jobs.set(opdrachId, job)
  return job
}

export function getAllJobs(): JobState[] {
  return Array.from(jobs.values())
}
