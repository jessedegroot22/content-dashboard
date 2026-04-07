import TopBar from '@/components/TopBar'
import { getKlanten } from '@/lib/airtable'
import type { Klant } from '@/lib/types'

export const revalidate = 0

export default async function InstellingenPage() {
  let klanten: Klant[] = []
  try {
    klanten = await getKlanten()
  } catch {
    // Keys nog niet ingevuld
  }

  return (
    <>
      <TopBar
        title="Instellingen"
        subtitle="Configuratie van het content dashboard"
      />
      <div className="p-8 max-w-2xl space-y-6">

        {/* Koppeling status */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
          <h3 className="text-sm font-bold text-on-surface mb-4">
            Omgevingsvariabelen
          </h3>
          <div className="space-y-3">
            <EnvRow
              label="Airtable API Key"
              envKey="AIRTABLE_API_KEY"
              isSet={!!process.env.AIRTABLE_API_KEY}
              hint="Maak een Personal Access Token aan in je Airtable account"
            />
            <EnvRow
              label="Airtable Base ID"
              envKey="AIRTABLE_BASE_ID"
              isSet={!!process.env.AIRTABLE_BASE_ID}
              hint="Te vinden in de Airtable API documentatie van jouw base"
            />
            <EnvRow
              label="Make.com Webhook URL"
              envKey="MAKE_CONTENT_WEBHOOK_URL"
              isSet={!!process.env.MAKE_CONTENT_WEBHOOK_URL}
              hint="De webhook URL van het 'NEW - Content tool' scenario"
            />
            <EnvRow
              label="Webhook Secret"
              envKey="WEBHOOK_SECRET"
              isSet={!!process.env.WEBHOOK_SECRET}
              hint="Stel hetzelfde secret in als in je Make.com HTTP module"
            />
          </div>
          <div className="mt-5 p-4 bg-surface-container-low rounded-xl">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Voeg deze variabelen toe aan je{' '}
              <code className="bg-surface-container px-1.5 py-0.5 rounded font-mono text-[11px]">
                .env.local
              </code>{' '}
              bestand (lokaal) of in de Render environment variables (productie).
            </p>
          </div>
        </div>

        {/* Klanten uit Airtable */}
        {klanten.length > 0 && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
            <h3 className="text-sm font-bold text-on-surface mb-4">
              Klanten in Airtable
            </h3>
            <div className="space-y-2">
              {klanten.map((klant) => (
                <div
                  key={klant.id}
                  className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl"
                >
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      {klant['Klantnaam']}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {klant['Domein'] || 'Geen domein'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {klant['GSC Property'] && (
                      <span className="text-[10px] bg-tertiary-fixed/20 text-on-tertiary-fixed-variant px-2 py-1 rounded-full font-semibold">
                        GSC ✓
                      </span>
                    )}
                    {klant['Neuronwriter Project ID'] && (
                      <span className="text-[10px] bg-secondary-fixed/40 text-on-secondary-fixed px-2 py-1 rounded-full font-semibold">
                        NW ✓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant mt-4">
              Klanten worden beheerd in Airtable (tabel: Klanten (Configuratie)).
            </p>
          </div>
        )}

        {/* Make.com integratie uitleg */}
        <div className="bg-primary-container rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-3">Make.com integratie</h3>
          <p className="text-xs text-on-primary-container leading-relaxed mb-4">
            Voeg na elke stap in je Make.com scenario een HTTP module toe die de status
            naar dit dashboard stuurt. Zo ziet de klant live wat er gebeurt.
          </p>
          <div className="bg-white/5 rounded-xl p-4 font-mono text-xs text-on-primary-container">
            <p className="text-tertiary-fixed font-semibold mb-1">POST /api/webhook</p>
            <p>{`{`}</p>
            <p className="pl-4">{`"opdracht_id": "{{1.id}}",`}</p>
            <p className="pl-4">{`"step": "perplexity_research",`}</p>
            <p className="pl-4">{`"status": "done",`}</p>
            <p className="pl-4">{`"secret": "{{jouw-webhook-secret}}"`}</p>
            <p>{`}`}</p>
          </div>
          <p className="text-[10px] text-on-primary-container mt-3">
            Beschikbare step IDs: load_opdracht, load_klant, start_neuronwriter,
            wait_neuronwriter, fetch_neuronwriter, load_tov, process_instructions,
            scrape_page (optim.), fetch_gsc (optim.), summarize_keywords,
            perplexity_research, generate_outline, write_content, create_doc, done
          </p>
        </div>
      </div>
    </>
  )
}

function EnvRow({
  label,
  isSet,
  hint,
}: {
  label: string
  envKey: string
  isSet: boolean
  hint: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 bg-surface-container-low rounded-xl">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{hint}</p>
      </div>
      <span
        className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
          isSet
            ? 'bg-tertiary-fixed/20 text-on-tertiary-fixed-variant'
            : 'bg-error-container text-error'
        }`}
      >
        <span className="material-symbols-outlined text-[12px]">
          {isSet ? 'check_circle' : 'cancel'}
        </span>
        {isSet ? 'Ingesteld' : 'Ontbreekt'}
      </span>
    </div>
  )
}
