import { useEffect, useState } from 'react'
import { fhir } from '../../../../store/fhirStore'
import type { Resource, FhirResource, BundleEntry } from 'fhir/r4'
import { useOnboardingState } from '../../../../store/OnboardingState'
import FHIRResource from '../../FHIRResourceView'
import FHIRSearchResults from '../../../../components/fhir/FHIRSearchResults'
import { useTranslation } from 'react-i18next'
import logo from '../../../../assets/did-health.png'
const usCoreTypes = [
  'Patient','AllergyIntolerance', 'CarePlan', 'CareTeam', 'Condition', 'Coverage', 'Device',
  'DiagnosticReport', 'DocumentReference', 'Encounter', 'Goal', 'Immunization',
  'Location', 'Medication', 'MedicationRequest', 'MedicationStatement', 'Observation',
  'Organization',  'Practitioner', 'PractitionerRole', 'Procedure',
  'Provenance', 'QuestionnaireResponse', 'RelatedPerson', 'ServiceRequest', 'OperationOutcome', 'Specimen',
] as const

export default function AllResourcesList() {
  const [results, setResults] = useState<Record<string, FhirResource[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState<FhirResource | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const { aesKey } = useOnboardingState()
  const { t } = useTranslation('fhir')
  const {t: t2} = useTranslation()

  useEffect(() => {
    const fetchAll = async () => {
      if (!aesKey) {
        console.warn('❌ AES key is missing — wallet might not be connected.')
        return
      }

      const out: Record<string, FhirResource[]> = {}
      for (const type of usCoreTypes) {
        try {
          console.log(`Fetching ${type}...`)
          const bundle = await fhir.search(type)
          const entries = bundle.entry || []
          out[type] = entries.map((e: BundleEntry<FhirResource>) => e.resource!).filter(Boolean)
        } catch (err) {
          console.warn(`❌ Failed to fetch ${type}`, err)
        }
      }
      setResults(out)
      setLoading(false)
    }

    fetchAll()
  }, [aesKey])

  const toggleSection = (type: string) => {
    setExpandedSections((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const jumpTo = (type: string) => {
    const el = document.getElementById(`section-${type}`)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredTypes = usCoreTypes.filter(type => results[type]?.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <img src={logo} alt="did:health" className="h-12 w-auto" />
          <h1 className="ml-4 text-2xl font-bold">did:health {t2('recordManager')}</h1>
        </div>

        {/* Jump to Select */}
        {!loading && (
          <div className="mb-6">
            <label htmlFor="jump-select" className="block mb-2 text-sm font-medium text-gray-700">
              {t('jumpToSection', 'Jump to Resource Section')}
            </label>
            <select
              id="jump-select"
              className="block w-full md:w-1/2 p-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              onChange={(e) => jumpTo(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>{t('selectResource', 'Select a resource...')}</option>
              {filteredTypes.map((type) => (
                <option key={type} value={type}>{t(`${type}.label`, type)}</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('loadingMessage', 'Loading FHIR data...')}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTypes.map((type) => {
              const resources = results[type]
              const isOpen = expandedSections[type] ?? true
              return (
                <div key={type} id={`section-${type}`} className="border p-4 rounded shadow-sm">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection(type)}>
                    <h2 className="text-lg font-semibold">
                      {t(`${type}.label`, type)} ({resources.length})
                    </h2>
                    <span className="text-blue-600">
                      {isOpen ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </div>
                  {isOpen && (
                    <div className="overflow-x-auto mt-4">
                      <FHIRSearchResults
                        onSelectResource={(resource: FhirResource) => setSelectedResource(resource)}
                        bundle={{
                          resourceType: 'Bundle',
                          type: 'collection',
                          entry: resources.map((resource: FhirResource) => ({
                            fullUrl: `urn:uuid:${resource.id}`,
                            resource: resource,
                            request: {
                              method: 'GET',
                              url: `${resource.resourceType}/${resource.id}`
                            }
                          }))
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Selected Resource Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FHIRResource resource={selectedResource} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
