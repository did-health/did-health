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
    navigate('/select-did')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg">

      <div className="mb-4">
        <label className="block text-sm font-bold">Organization Name:</label>
        <input
          type="text"
          name="name"
          value={organization.name || ''}
          onChange={handleInputChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Address Line:</label>
        <input
          type="text"
          name="address.0.line.0"
          value={organization.address?.[0]?.line?.[0] || ''}
          onChange={handleInputChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">City:</label>
        <input
          type="text"
          name="address.0.city"
          value={organization.address?.[0]?.city || ''}
          onChange={handleInputChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Country:</label>
        <input
          type="text"
          name="address.0.country"
          value={organization.address?.[0]?.country || ''}
          onChange={handleInputChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Identifier Type:</label>
        <select
          name="identifier.1.type.coding.0.code"
          value={organization.identifier?.[1].type?.coding?.[0].code || ''}
          onChange={handleInputChange}
          className="select select-bordered w-full"
        >
          <option value="">Select identifier type</option>
          <option value="NPI">NPI</option>
          <option value="TAX">TIN</option>
          <option value="PAYERID">Payer ID</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Identifier Value:</label>
        <input
          type="text"
          name="identifier.1.value"
          value={organization.identifier?.[1].value || ''}
          onChange={handleInputChange}
          className="input input-bordered w-full"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Create Organization
      </button>
    </form>
  )
}

export default CreateOrganizationForm
