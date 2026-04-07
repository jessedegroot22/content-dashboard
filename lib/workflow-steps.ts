import type { WorkflowStep } from './types'

// Stap-definities per content actie — labels zijn bewust begrijpelijk voor klanten

const COMMON_STEPS: Omit<WorkflowStep, 'status'>[] = [
  {
    id: 'load_opdracht',
    label: 'Opdracht laden',
    description: 'We halen je opdracht op en controleren alle gegevens.',
  },
  {
    id: 'load_klant',
    label: 'Klantprofiel ophalen',
    description: 'We laden de schrijfstijl, doelgroep en instellingen van jouw website.',
  },
  {
    id: 'start_neuronwriter',
    label: 'Keyword analyse starten',
    description: 'NeuronWriter analyseert de top-10 Google resultaten voor dit zoekwoord.',
  },
  {
    id: 'wait_neuronwriter',
    label: 'Concurrentieanalyse verwerken',
    description: 'NeuronWriter verwerkt alle concurrerende pagina\'s. Dit duurt ±90 seconden.',
  },
  {
    id: 'fetch_neuronwriter',
    label: 'Keyword inzichten ophalen',
    description: 'We halen de aanbevolen termen, koppen en woordtelling op.',
  },
  {
    id: 'load_tov',
    label: 'Tone of voice laden',
    description: 'We laden de schrijfvoorbeelden en stijlgids van jouw merk.',
  },
  {
    id: 'process_instructions',
    label: 'Schrijfinstructies samenvatten',
    description: 'AI verwerkt alle instructies tot een heldere schrijfopdracht.',
  },
]

const OPTIMALISEREN_EXTRA: Omit<WorkflowStep, 'status'>[] = [
  {
    id: 'scrape_page',
    label: 'Bestaande pagina scrapen',
    description: 'We halen de huidige tekst op van je website om te vergelijken.',
  },
  {
    id: 'fetch_gsc',
    label: 'Google Search Console data ophalen',
    description: 'We analyseren welke zoektermen al verkeer brengen naar deze pagina.',
  },
]

const SHARED_ENDING_STEPS: Omit<WorkflowStep, 'status'>[] = [
  {
    id: 'summarize_keywords',
    label: 'Zoektermen analyseren',
    description: 'AI verwerkt de keyword data tot concrete schrijfinstructies.',
  },
  {
    id: 'perplexity_research',
    label: 'Diepgaand onderzoek',
    description: 'We doen actueel onderzoek naar het onderwerp via Perplexity AI.',
  },
  {
    id: 'generate_outline',
    label: 'Inhoudsopgave genereren',
    description: 'AI maakt een gestructureerde opbouw voor de tekst.',
  },
  {
    id: 'write_content',
    label: 'Content schrijven',
    description: 'AI schrijft de volledige tekst in jouw schrijfstijl. Dit duurt even.',
  },
  {
    id: 'create_doc',
    label: 'Google Doc aanmaken',
    description: 'We zetten de definitieve tekst in een Google Doc voor jou.',
  },
  {
    id: 'done',
    label: 'Klaar!',
    description: 'Je content is gereed. Bekijk het resultaat hieronder.',
  },
]

function makeSteps(defs: Omit<WorkflowStep, 'status'>[]): WorkflowStep[] {
  return defs.map((d) => ({ ...d, status: 'pending' }))
}

export function getWorkflowSteps(contentActie: 'Optimaliseren' | 'Creëren'): WorkflowStep[] {
  if (contentActie === 'Optimaliseren') {
    return makeSteps([...COMMON_STEPS, ...OPTIMALISEREN_EXTRA, ...SHARED_ENDING_STEPS])
  }
  return makeSteps([...COMMON_STEPS, ...SHARED_ENDING_STEPS])
}

export const PAGINA_TYPES = [
  'Blog artikel',
  'Landingspagina',
  'Productpagina',
  'Categoriepagina',
  'FAQ pagina',
  'Servicepagina',
  'Over ons pagina',
  'Pillar page',
]
