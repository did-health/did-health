import React, { useEffect, useState } from 'react'
import { fhir } from '../../../../store/fhirStore'
import type { FhirResource, BundleEntry, Bundle } from 'fhir/r4'
import { useOnboardingState } from '../../../../store/OnboardingState'
import FHIRSearchResults from '../../../../components/fhir/FHIRSearchResults'
const usCoreTypes = [
  'AllergyIntolerance', 'CarePlan', 'CareTeam', 'Condition', 'Coverage', 'Device',
  'DiagnosticReport', 'DocumentReference', 'Encounter', 'Goal', 'Immunization',
  'Location', 'Medication', 'MedicationRequest', 'MedicationStatement', 'Observation',
  'Organization', 'Patient', 'Practitioner', 'PractitionerRole', 'Procedure',
  'Provenance', 'QuestionnaireResponse', 'RelatedPerson', 'ServiceRequest', 'Specimen',
] as const

type ResourceType = typeof usCoreTypes[number]

export default function AllResourcesList() {
  const [results, setResults] = useState<Record<string, FhirResource[]>>({})
  const [loading, setLoading] = useState(true)
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

  if (loading) return <p className="text-gray-500">Loading FHIR data...</p>

  return (
    <div className="space-y-4">
      {usCoreTypes.map((type) => {
        const resources = results[type] || []
        return (
          <div key={type} className="border p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold">{type} ({resources.length})</h2>
            {resources.length === 0 ? (
              <p className="text-sm text-gray-400">No resources found.</p>
            ) : (
              <FHIRSearchResults
                onSelectResource={(resource) => {
                  // Handle resource selection here if needed
                  console.log('Selected resource:', resource);
                }}
                bundle={{
                  resourceType: 'Bundle' as const,
                  type: 'collection' as const,
                  entry: resources.map(resource => ({
                    resource,
                    request: {
                      method: 'GET' as const,
                      url: resource.resourceType
                    }
                  }))
                } as Bundle<FhirResource>} />
            )}
          </div>
        )
      })}
    </div>
  )
}
