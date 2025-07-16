import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import type { Organization } from 'fhir/r4'
import { useOnboardingState } from '../../store/OnboardingState'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/did-health.png'

interface CreateOrganizationFormProps {
  defaultValues: Organization
  onSubmit: (updatedFHIR: Organization) => Promise<void>
}

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = ({ defaultValues, onSubmit }) => {
  const navigate = useNavigate()
  const { fhirResource, setFhirResource } = useOnboardingState()
  const [organization, setOrganization] = useState<Organization>(defaultValues)
  const { t } = useTranslation(['fhir'])
  const { t: t2 } = useTranslation()

  useEffect(() => {
    if (fhirResource?.resourceType === 'Organization') {
      setOrganization(fhirResource as Organization)
    } else {
      setOrganization({
        resourceType: 'Organization',
        identifier: [
          { system: 'https://www.w3.org/ns/did', value: '' },
          { type: { coding: [{ code: '', system: 'http://terminology.hl7.org/CodeSystem/v2-0203' }] }, value: '' },
        ],
      })
    }
  }, [fhirResource])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setOrganization((prev) => {
      if (!prev) return prev
      const updated = { ...prev }
      const keys = name.split('.')
      let current: any = updated

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const nextKey = keys[i + 1]

        if (i === keys.length - 1) {
          if (Array.isArray(current[key])) {
            current[key] = [value]
          } else {
            current[key] = value
          }
        } else {
          if (!current[key]) {
            current[key] = /^\d+$/.test(nextKey) ? [] : {}
          }
          current = current[key]
        }
      }

      return updated
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!organization) return
    const updatedOrg = { ...organization }

    if (!updatedOrg.id) {
      updatedOrg.id = uuidv4()
    }

    setFhirResource(updatedOrg)
    //navigate('/onboarding/ethereum')
  }

  if (!organization) return null

  return (
    <div className="flex justify-center items-start min-h-screen p-4 bg-background">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
        <div className="flex justify-center items-center h-24 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-2 ring-green-400/50">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            🏢 did:health {t('Organization.label')} 
          </h2>

          {/* Organization Name */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('Organization.name.label')}</label>
            <input
              type="text"
              name="name"
              value={organization.name || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Organization Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('Organization.type.label')}</label>
            <select
              name="type.0.coding.0.code"
              value={organization.type?.[0]?.coding?.[0]?.code || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            >
              <option value="">{t('Organization.type.label')}</option>
              <option value="prov">Healthcare Provider</option>
              <option value="dept">Hospital Department</option>
              <option value="team">Care Team</option>
              <option value="govt">Government Agency</option>
              <option value="ins">Insurance Company</option>
              <option value="pay">Payer</option>
              <option value="edu">Educational Institution</option>
              <option value="reli">Religious Organization</option>
              <option value="crs">Clinical Research Sponsor</option>
              <option value="pharm">Pharmacy</option>
              <option value="lab">Laboratory</option>
              <option value="ambul">Ambulance Service</option>
              <option value="emg">Emergency Services</option>
              <option value="ngo">Non-Governmental Organization</option>
              <option value="bus">Business Entity</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Organization Active Status */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('Organization.active.label')}</label>
            <select
              name="active"
              value={organization.active ? 'true' : 'false'}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Organization Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('ContactPoint.system.phone.label')}</label>
              <input
                type="tel"
                name="telecom.0.value"
                value={organization.telecom?.[0]?.value || ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('ContactPoint.system.email.label')}</label>
              <input
                type="email"
                name="telecom.1.value"
                value={organization.telecom?.[1]?.value || ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Organization Address */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('Address.label')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="address.0.line.0"
                value={organization.address?.[0]?.line?.[0] || ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder={t('Address.line.label')}
              />
              <input
                type="text"
                name="address.0.city"
                value={organization.address?.[0]?.city || ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder={t('Address.city.label')}
              />
              <input
                type="text"
                name="address.0.state"
                value={organization.address?.[0]?.state || ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder={t('Address.state.label')}
              />
              <input
                type="text"
                name="address.0.postalCode"
                value={organization.address?.[0]?.postalCode || ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder={t('Address.postalCode.label')}
              />
            </div>
          </div>

          {/* Organization Identifier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Identifier Type</label>
              <select
                name="identifier.0.type.coding.0.code"
                value={organization.identifier?.[0]?.type?.coding?.[0]?.code || ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              >
                <option value="">Select Type...</option>
                <option value="NPI">NPI</option>
                <option value="TAX">Tax ID</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Identifier Value</label>
              <input
                type="text"
                name="identifier.0.value"
                value={organization.identifier?.[0]?.value || ''}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary w-full sm:w-auto"
            >
              {organization?.id ? t2('common.update') : t2('common.create')} {t('Organization.label')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateOrganizationForm
