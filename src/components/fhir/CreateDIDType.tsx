import { useOnboardingState } from '../../store/OnboardingState'
import type { Patient, Practitioner, Organization, Device } from 'fhir/r4'
import { useTranslation } from 'react-i18next'

export function CreateDIDForm() {
  const { setFhirResource } = useOnboardingState()
  const { t } = useTranslation(['fhir'])
  const { t: t2 } = useTranslation()

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
    setFhirResource(resource)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">{t2('didHealthOnboarding')}</h2>
      <p className="text-sm mb-4">{t2('didHealthOnboardingDescription')}</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleResourceType('Patient')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          {t('Patient.label')}
        </button>
        <button
          onClick={() => handleResourceType('Practitioner')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          {t('Practitioner.label')}
        </button>
        <button
          onClick={() => handleResourceType('Organization')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          {t('Organization.label')}
        </button>
        <button
          onClick={() => handleResourceType('Device')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          {t('Device.label')}
        </button>
      </div>
      <div className="mt-6 text-sm text-gray-700">
        <p className="font-bold mb-1">{t('didHealthOnboardingDescription')}</p>
        <ul className="list-disc list-inside">
{t2('didHealthOnboardingBulletDescription')}
        </ul>
      </div>
    </div>
  )
}