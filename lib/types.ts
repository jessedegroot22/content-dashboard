// ─── Airtable records ────────────────────────────────────────────────────────

export interface Opdracht {
  id: string
  'Primair zoekwoord': string
  'Hoofdkeyword'?: string
  'Content actie': 'Optimaliseren' | 'Creëren'
  'Pagina type'?: string
  'Bestaande URL'?: string
  'Status': OpdrachStatus
  'Datum aangemaakt'?: string
  'Toelichting Opdracht'?: string
  'Google Doc URL'?: string
  'Meta title'?: string
  'Meta description'?: string
  'Outline'?: string
  'Finale tekst (HTML)'?: string
  'Foutmelding'?: string
  'Klant'?: string[]
}

export type OpdrachStatus =
  | 'Idee'
  | 'Klaar voor uitwerking'
  | 'Bezig'
  | 'Klaar'
  | 'Fout'

export interface Klant {
  id: string
  'Klantnaam': string
  'Domein'?: string
  'GSC Property'?: string
  'Neuronwriter Project ID'?: string
}

// ─── Live job tracking ────────────────────────────────────────────────────────

export type StepStatus = 'pending' | 'running' | 'done' | 'error'

export interface WorkflowStep {
  id: string
  label: string
  description: string
  status: StepStatus
  startedAt?: number
  finishedAt?: number
  message?: string
}

export interface JobState {
  opdrachId: string
  contentActie: 'Optimaliseren' | 'Creëren'
  steps: WorkflowStep[]
  currentStep: string | null
  startedAt: number
  finishedAt?: number
  error?: string
  googleDocUrl?: string
}

// ─── API payloads ─────────────────────────────────────────────────────────────

export interface WebhookPayload {
  opdracht_id: string
  step: string
  status: StepStatus
  message?: string
  google_doc_url?: string
}

export interface NewIdeaPayload {
  keyword: string
  content_actie: 'Optimaliseren' | 'Creëren'
  pagina_type?: string
  bestaande_url?: string
  toelichting?: string
  klant_id?: string
}
