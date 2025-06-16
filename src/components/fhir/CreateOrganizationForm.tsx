import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import type { Organization } from 'fhir/r4'
import { v4 as uuidv4 } from 'uuid'
import { useOnboardingState } from '../../store/OnboardingState';


const CreateOrganizationForm: React.FC = () => {
  const navigate = useNavigate();  
  const [organization, setOrganization] = useState<Organization>({
    resourceType: 'Organization',
    id: '',
    identifier: [
      { system: 'https://www.w3.org/ns/did', value: '' },
      { type: { coding: [{ code: '', system: 'http://terminology.hl7.org/CodeSystem/v2-0203' }] } },
    ],
  })

  const { setFHIRResource } = useOnboardingState()
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setOrganization((prev) => {
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
    const uuid = uuidv4()
    organization.id = uuid
    setFHIRResource(organization) // or org, practitioner, etc.
    navigate('/onboarding/ethereum')
  }

return (
  <div className="flex justify-center items-start sm:items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950">
    <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          🏢 Create Organization
        </h2>

        {/* Organization Name */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Organization Name
          </label>
          <input
            type="text"
            name="name"
            value={organization.name || ''}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        {/* Address Line */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Address Line
          </label>
          <input
            type="text"
            name="address.0.line.0"
            value={organization.address?.[0]?.line?.[0] || ''}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            City
          </label>
          <input
            type="text"
            name="address.0.city"
            value={organization.address?.[0]?.city || ''}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Country
          </label>
          <input
            type="text"
            name="address.0.country"
            value={organization.address?.[0]?.country || ''}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        {/* Identifier Type */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Identifier Type
          </label>
          <select
            name="identifier.1.type.coding.0.code"
            value={organization.identifier?.[1].type?.coding?.[0].code || ''}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">Select identifier type</option>
            <option value="NPI">NPI</option>
            <option value="TAX">TIN</option>
            <option value="PAYERID">Payer ID</option>
          </select>
        </div>

        {/* Identifier Value */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Identifier Value
          </label>
          <input
            type="text"
            name="identifier.1.value"
            value={organization.identifier?.[1].value || ''}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button type="submit" className="btn-primary w-full">
            🚀 Create Organization
          </button>
        </div>
      </form>
    </div>
  </div>
)

}

export default CreateOrganizationForm
