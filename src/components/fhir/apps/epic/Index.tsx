import { useEffect, useState } from 'react'
import { fhir } from '../../../../store/fhirStore'
import { oauth2 as SMART } from 'fhirclient'
import type { Resource} from 'fhir/r4'
import EpicBrands from './Brands'
import FHIRResource from '../../FHIRResourceView'
import logo from '../../../../assets/did-health.png'
import { useTranslation } from 'react-i18next'

export default function EpicConnector() {
  const [status, setStatus] = useState('')
  const [patient, setPatient] = useState<Resource | null>(null)
  const [resources, setResources] = useState<Resource[]>([])

  const clientId = import.meta.env.VITE_EPIC_CLIENT_ID
  const redirectUri = import.meta.env.VITE_EPIC_REDIRECT_URI
  const defaultIss = import.meta.env.VITE_EPIC_ISS_URL
  const scope = 'openid fhirUser Patient/*.read'
  const { t } = useTranslation()

  useEffect(() => {
    const run = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const iss = urlParams.get('iss')

      if (iss) {
        // Step 1: Initiate SMART launch
        SMART.authorize({
          clientId,
          scope,
          iss,
          redirectUri,
        })
        return
      }

      try {
        // Step 2: Post-redirect — complete SMART handshake
        const client = await SMART.ready()
        setStatus('✅ Connected to Epic via SMART on FHIR')

        const pt = await client.patient.read()
        setPatient(pt)
        fhir.create(pt)

        const types = [
          'AllergyIntolerance',
          'CarePlan',
          'CareTeam',
          'Condition',
          'Coverage',
          'Device',
          'DiagnosticReport',
          'DocumentReference',
          'Encounter',
          'Goal',
          'Immunization',
          'Location',
          'Medication',
          'MedicationRequest',
          'MedicationStatement',
          'Observation',
          'Organization',
          'Patient',
          'Practitioner',
          'PractitionerRole',
          'Procedure',
          'Provenance',
          'QuestionnaireResponse',
          'RelatedPerson',
          'ServiceRequest',
          'Specimen'
        ]
          const all: Resource[] = []

        for (const type of types) {
          try {
            const bundle = await client.request(`${type}?_count=100`)
            const entries = bundle.entry?.map((e: any) => e.resource) || []
            if (entries.length > 0) {
              entries.forEach(fhir.create)
              all.push(...entries)
            } else {
              console.log(`No ${type} resources found`)
            }
          } catch (innerErr) {
            console.warn(`Failed to load ${type}:`, innerErr)
          }
        }

        setResources(all)
        setStatus('📦 FHIR data downloaded and saved locally')
      } catch (err: any) {
        console.error('❌ SMART session failed:', err)
        setStatus('❌ SMART session failed. Please launch Epic login.')
      }
    }

    run()
  }, [clientId, redirectUri])

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-2 ring-red-400/40 mb-4">
        <img
          src={logo}
          alt="did:health Logo"
          className="w-full h-full object-contain scale-110 transition-transform duration-300 hover:scale-125"
        />
      </div>
      <h1 className="text-2xl font-bold text-indigo-600">Connect to Epic EHR</h1>
      <div><EpicBrands /></div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Authorize with Epic via SMART on FHIR to view and download your records.
      </p>

      {status && <p className="text-sm font-mono text-gray-800 dark:text-gray-300">{status}</p>}

      {!patient && (
        <form method="GET" className="bg-white dark:bg-gray-900 border p-4 rounded space-y-2">
          <input
            name="iss"
            defaultValue={defaultIss}
            className="w-full p-2 rounded border text-sm"
          />
          <button
            type="submit"
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            🚀 Launch Epic Login
          </button>
        </form>
      )}

      {patient && (
        <div className="bg-white dark:bg-gray-800 border p-4 rounded text-xs">
          <FHIRResource resource={patient} />
        </div>
      )}

      {resources.length > 0 && (
        <div className="space-y-1 text-sm">
          <h2 className="text-lg font-semibold mt-6">📄 Records Downloaded</h2>
          {resources.map((r, i) => (
            <div key={i} className="border p-2 rounded">
              {r.resourceType} — <code>{r.id}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
