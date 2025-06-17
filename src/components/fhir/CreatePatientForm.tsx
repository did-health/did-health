import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import type { Patient } from 'fhir/r4'
import { useOnboardingState } from '../../store/OnboardingState'
import logo from '../../assets/did-health.png'
const CreatePatientForm: React.FC = () => {
  const navigate = useNavigate()
  const { fhirResource, setFHIRResource } = useOnboardingState()

  const [patient, setPatient] = useState<Patient>({
    resourceType: 'Patient',
    id: '',
    name: [{ given: [''], family: '' }],
    gender: 'unknown',
    birthDate: '',
    telecom: [
      { use: 'home' },
      { system: 'phone', value: '' },
      { system: 'email', value: '' },
    ],
    address: [{ line: [''], city: '', state: '', postalCode: '', country: '' }],
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

  // Prefill if editing existing patient
  useEffect(() => {
    if (fhirResource?.resourceType === 'Patient') {
      setPatient(fhirResource as Patient)
    }
  }, [fhirResource])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setPatient((prev) => {
      const updated: any = { ...prev }
      const keys = name.split('.')
      let ref = updated
      for (let i = 0; i < keys.length - 1; i++) {
        if (!ref[keys[i]]) {
          // Create array if next key is a number, else object
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
    const updatedPatient = { ...patient }
    if (!updatedPatient.id) {
      updatedPatient.id = uuidv4()
    }
    console.log('FHIR Patient Resource:', updatedPatient)
    setFHIRResource(updatedPatient)
    navigate('/onboarding/ethereum')
  }

  return (
    <div className="flex justify-center items-start sm:items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
        <div className="flex justify-center items-center h-24 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-2 ring-green-400/50">
            <img
              src={logo}
              alt="did:health Logo"
              className="w-full h-full object-contain scale-110 transition-transform duration-300 hover:scale-125"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            🧬 {patient.id ? 'Edit' : 'Create'} Patient DID
          </h2>

          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              name="name.0.given.0"
              value={patient.name?.[0]?.given?.[0] || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              name="name.0.family"
              value={patient.name?.[0]?.family || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <select
              name="gender"
              value={patient.gender}
              onChange={handleInputChange}
              className="input"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Birth Date
            </label>
            <input
              type="date"
              name="birthDate"
              value={patient.birthDate || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              name="telecom.1.value"
              value={patient.telecom?.[1]?.value || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              name="telecom.2.value"
              value={patient.telecom?.[2]?.value || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Address
            </label>
            <div className="space-y-2">
              <input
                name="address.0.line.0"
                placeholder="Street"
                value={patient.address?.[0]?.line?.[0] || ''}
                onChange={handleInputChange}
                className="input"
              />
              <input
                name="address.0.city"
                placeholder="City"
                value={patient.address?.[0]?.city || ''}
                onChange={handleInputChange}
                className="input"
              />
              <input
                name="address.0.state"
                placeholder="State"
                value={patient.address?.[0]?.state || ''}
                onChange={handleInputChange}
                className="input"
              />
              <input
                name="address.0.postalCode"
                placeholder="Postal Code"
                value={patient.address?.[0]?.postalCode || ''}
                onChange={handleInputChange}
                className="input"
              />
              <input
                name="address.0.country"
                placeholder="Country"
                value={patient.address?.[0]?.country || ''}
                onChange={handleInputChange}
                className="input"
              />
            </div>
          </div>

          {/* Identifier Type */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Identifier Type
            </label>
            <select
              name="identifier.1.type.coding.0.code"
              value={patient.identifier?.[1].type?.coding?.[0]?.code || ''}
              onChange={handleInputChange}
              className="input"
            >
              <option value="">Select...</option>
              <option value="DL">Driver License</option>
              <option value="MR">Medical Record</option>
              <option value="SSN">Social Security</option>
            </select>
          </div>

          {/* Identifier Value */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Identifier Value
            </label>
            <input
              name="identifier.1.value"
              value={patient.identifier?.[1].value || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button type="submit" className="btn-primary w-full text-center">
              {patient.id ? '💾 Update Patient Record' : '✅ Save Patient Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePatientForm
