import { useOnboardingState } from '../../store/OnboardingState'
import type { Patient, Practitioner, Organization, Device } from 'fhir/r4'

export function CreateDIDForm() {
  const { setFHIRResource } = useOnboardingState()

  const handleResourceType = (resourceType: 'Patient' | 'Practitioner' | 'Organization' | 'Device') => {
    let resource: Patient | Practitioner | Organization | Device = {
      resourceType: resourceType,
      id: '',
      meta: { profile: [] }
    }
    switch (resourceType) {
      case 'Patient':
        resource = {
          resourceType: 'Patient',
          id: '',
          meta: {
            profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient']
          }
        }
        break
      case 'Practitioner':
        resource = {
          resourceType: 'Practitioner',
          id: '',
          meta: {
            profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner']
          }
        }
        break
      case 'Organization':
        resource = {
          resourceType: 'Organization',
          id: '',
          meta: {
            profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-organization']
          }
        }
        break
      case 'Device':
        resource = {
          resourceType: 'Device',
          id: '',
          meta: {
            profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-device']
          }
        }
        break
      default:
        console.error(`Unknown resource type: ${resourceType}`)
        return
    }
    setFHIRResource(resource)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Create your DID</h2>
      <p className="text-sm mb-4">Select the kind of entity you are:</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleResourceType('Patient')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          Patient
        </button>
        <button
          onClick={() => handleResourceType('Practitioner')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          Practitioner
        </button>
        <button
          onClick={() => handleResourceType('Organization')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          Organization
        </button>
        <button
          onClick={() => handleResourceType('Device')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          Device
        </button>
      </div>
      <div className="mt-6 text-sm text-gray-700">
        <p className="font-bold mb-1">A DID can be made for:</p>
        <ul className="list-disc list-inside">
          <li>Patient</li>
          <li>Practitioner (Doctors, Nurses, and other healthcare professionals)</li>
          <li>Organization (Hospital, Medical Practice, Insurance Company, etc.)</li>
          <li>Device (Monitor, Machine, etc.)</li>
          <li>More (Let us know!)</li>
        </ul>
      </div>
    </div>
  )
}