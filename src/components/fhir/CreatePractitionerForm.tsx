import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import type { Practitioner } from 'fhir/r4'
import { useOnboardingState } from '../../store/OnboardingState'

const CreatePractitionerForm: React.FC = () => {
  const navigate = useNavigate()
  const { fhirResource, setFHIRResource } = useOnboardingState()

  const [practitioner, setPractitioner] = useState<Practitioner | null>(null)

  useEffect(() => {
    if (fhirResource?.resourceType === 'Practitioner') {
      setPractitioner(fhirResource as Practitioner)
    } else {
      setPractitioner({
        resourceType: 'Practitioner',
        identifier: [
          { system: 'https://www.w3.org/ns/did', value: '' },
          {
            type: {
              coding: [
                { code: '', system: 'http://terminology.hl7.org/CodeSystem/v2-0203' },
              ],
            },
            value: '',
          },
        ],
      })
    }
  }, [fhirResource])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setPractitioner((prev) => {
      if (!prev) return prev
      const updated: any = { ...prev }
      const keys = name.split('.')
      let ref = updated
      for (let i = 0; i < keys.length - 1; i++) {
        if (!ref[keys[i]]) {
          ref[keys[i]] = /^\d+$/.test(keys[i + 1]) ? [] : {}
        }
        ref = ref[keys[i]]
      }
      ref[keys[keys.length - 1]] = value
      return updated
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!practitioner) return
    const updatedPractitioner = { ...practitioner }
    if (!updatedPractitioner.id) {
      updatedPractitioner.id = uuidv4()
    }
    setFHIRResource(updatedPractitioner)
    navigate('/onboarding/ethereum')
  }

  if (!practitioner) return null

  return (
    <div className="flex justify-center items-start sm:items-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            🩺 {practitioner.id ? 'Edit' : 'Create'} Practitioner DID Resource
          </h2>

          <input
            type="text"
            name="name.0.given.0"
            value={practitioner.name?.[0]?.given?.[0] || ''}
            onChange={handleInputChange}
            placeholder="First Name"
            className="input"
          />
          <input
            type="text"
            name="name.0.family"
            value={practitioner.name?.[0]?.family || ''}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="input"
          />
          <select
            name="gender"
            value={practitioner.gender || ''}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unknown">Unknown</option>
          </select>
          <input
            type="date"
            name="birthDate"
            value={practitioner.birthDate || ''}
            onChange={handleInputChange}
            className="input"
          />
          <input
            type="tel"
            name="telecom.0.value"
            value={practitioner.telecom?.[0]?.value || ''}
            onChange={handleInputChange}
            placeholder="Phone"
            className="input"
          />
          <input
            type="email"
            name="telecom.1.value"
            value={practitioner.telecom?.[1]?.value || ''}
            onChange={handleInputChange}
            placeholder="Email"
            className="input"
          />
          <input
            type="text"
            name="address.0.line.0"
            value={practitioner.address?.[0]?.line?.[0] || ''}
            onChange={handleInputChange}
            placeholder="Address Line"
            className="input"
          />
          <input
            type="text"
            name="address.0.city"
            value={practitioner.address?.[0]?.city || ''}
            onChange={handleInputChange}
            placeholder="City"
            className="input"
          />
          <input
            type="text"
            name="address.0.state"
            value={practitioner.address?.[0]?.state || ''}
            onChange={handleInputChange}
            placeholder="State"
            className="input"
          />
          <input
            type="text"
            name="address.0.postalCode"
            value={practitioner.address?.[0]?.postalCode || ''}
            onChange={handleInputChange}
            placeholder="Postal Code"
            className="input"
          />
          <input
            type="text"
            name="address.0.country"
            value={practitioner.address?.[0]?.country || ''}
            onChange={handleInputChange}
            placeholder="Country"
            className="input"
          />

          <button type="submit" className="btn-primary w-full">
            {practitioner.id ? '💾 Update Practitioner' : '✅ Save Practitioner Record'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePractitionerForm
