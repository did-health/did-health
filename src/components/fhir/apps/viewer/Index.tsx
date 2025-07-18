import { useEffect, useState } from 'react'
import { fhir } from '../../../../store/fhirStore'
import type { Resource, FhirResource, BundleEntry } from 'fhir/r4'
import { useOnboardingState } from '../../../../store/OnboardingState'
import FHIRResource from '../../FHIRResourceView'
import FHIRSearchResults from '../../../../components/fhir/FHIRSearchResults'
const usCoreTypes = [
  'AllergyIntolerance', 'CarePlan', 'CareTeam', 'Condition', 'Coverage', 'Device',
  'DiagnosticReport', 'DocumentReference', 'Encounter', 'Goal', 'Immunization',
  'Location', 'Medication', 'MedicationRequest', 'MedicationStatement', 'Observation',
  'Organization', 'Patient', 'Practitioner', 'PractitionerRole', 'Procedure',
  'Provenance', 'QuestionnaireResponse', 'RelatedPerson', 'ServiceRequest', 'Specimen',
] as const

export default function AllResourcesList() {
  const [results, setResults] = useState<Record<string, FhirResource[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState<FhirResource | null>(null)
  const { aesKey } = useOnboardingState();

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
          const bundle = await fhir.search(type)  // Ensure this internally uses aesKey
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <img src="/logo.svg" alt="DID Health Logo" className="h-12 w-auto" />
          <h1 className="ml-4 text-2xl font-bold">DID Health FHIR Viewer</h1>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading FHIR data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {usCoreTypes.map((type) => {
              const resources = results[type] || []
              return (
                <div key={type} className="border p-4 rounded shadow-sm">
                  <h2 className="text-lg font-semibold mb-2">{type} ({resources.length})</h2>
                  {resources.length === 0 ? (
                    <p className="text-sm text-gray-400">No resources found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <FHIRSearchResults
                        onSelectResource={(resource: FhirResource) => {
                          setSelectedResource(resource)
                        }}
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
      {selectedResource && selectedResource !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
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


