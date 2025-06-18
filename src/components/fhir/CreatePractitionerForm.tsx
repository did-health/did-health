import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Webcam from 'react-webcam'
import type { Practitioner, CodeableConcept } from 'fhir/r4'
import logo from '../../assets/did-health.png'

// Extend PractitionerQualification to include specialty for local use


type PractitionerQualificationWithSpecialty = NonNullable<Practitioner['qualification']>[number] & {
  specialty?: CodeableConcept[]
}

import { useOnboardingState } from '../../store/OnboardingState'

const CreatePractitionerForm: React.FC = () => {
  const navigate = useNavigate()
  const { fhirResource, setFHIRResource } = useOnboardingState()
  const webcamRef = useRef<Webcam>(null)
  const [showCamera, setShowCamera] = useState(false)

  const [practitioner, setPractitioner] = useState<Practitioner>({ resourceType: 'Practitioner' })

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
        </div>    <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            🩺 {practitioner.id ? 'Edit' : 'Create'} Practitioner DID Resource
          </h2>

          <input type="text" name="name.0.given.0" value={practitioner.name?.[0]?.given?.[0] || ''} onChange={handleInputChange} placeholder="First Name" className="input" />
          <input type="text" name="name.0.family" value={practitioner.name?.[0]?.family || ''} onChange={handleInputChange} placeholder="Last Name" className="input" />
          <select name="gender" value={practitioner.gender || ''} onChange={handleInputChange} className="input">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unknown">Unknown</option>
          </select>
          <input type="date" name="birthDate" value={practitioner.birthDate || ''} onChange={handleInputChange} className="input" />
          <input type="tel" name="telecom.0.value" value={practitioner.telecom?.[0]?.value || ''} onChange={handleInputChange} placeholder="Phone" className="input" />
          <input type="email" name="telecom.1.value" value={practitioner.telecom?.[1]?.value || ''} onChange={handleInputChange} placeholder="Email" className="input" />
          <input type="text" name="address.0.line.0" value={practitioner.address?.[0]?.line?.[0] || ''} onChange={handleInputChange} placeholder="Address Line" className="input" />
          <input type="text" name="address.0.city" value={practitioner.address?.[0]?.city || ''} onChange={handleInputChange} placeholder="City" className="input" />
          <input type="text" name="address.0.state" value={practitioner.address?.[0]?.state || ''} onChange={handleInputChange} placeholder="State" className="input" />
          <input type="text" name="address.0.postalCode" value={practitioner.address?.[0]?.postalCode || ''} onChange={handleInputChange} placeholder="Postal Code" className="input" />
          <input type="text" name="address.0.country" value={practitioner.address?.[0]?.country || ''} onChange={handleInputChange} placeholder="Country" className="input" />

          <input type="text" name="qualification.0.code.text" value={practitioner.qualification?.[0]?.code?.text || ''} onChange={handleInputChange} placeholder="Qualification (e.g. MD, RN)" className="input" />
          <input
            type="text"
            name="qualification.0.specialty.0.text"
            value={
              ((practitioner.qualification?.[0] as PractitionerQualificationWithSpecialty)?.specialty?.[0]?.text || '')
            }
            onChange={handleInputChange}
            placeholder="Specialty (e.g. Cardiology)"
            className="input"
          />

          {/* Practitioner Photo */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Practitioner Photo</label>
            {practitioner?.photo?.[0]?.data && !showCamera && (
              <>
                <img
                  src={`data:${practitioner.photo[0].contentType};base64,${practitioner.photo[0].data}`}
                  alt="Practitioner"
                  className="w-32 h-32 rounded-full object-cover border shadow"
                />
                <button type="button" className="btn-outline mt-2" onClick={() => setShowCamera(true)}>
                  🔁 Change Photo
                </button>
              </>
            )}
            {(!practitioner?.photo?.[0]?.data || showCamera) && (
              <>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full sm:w-64 rounded-md shadow-md border"
                  videoConstraints={{ width: 320, height: 240, facingMode: 'user' }}
                />
                <button
                  type="button"
                  className="btn-primary mt-2"
                  onClick={() => {
                    const screenshot = webcamRef.current?.getScreenshot()
                    if (!screenshot) return
                    setPractitioner((prev) => {
                      if (!prev) return prev
                      return {
                        ...prev,
                        photo: [
                          {
                            contentType: 'image/jpeg',
                            data: screenshot.split(',')[1],
                            title: 'captured-webcam.jpg',
                            creation: new Date().toISOString(),
                          },
                        ],
                      }
                    })
                    setShowCamera(false)
                  }}
                >
                  📸 Capture Photo
                </button>
              </>
            )}
          </div>
          {/* Identifier: NPI, SSN, MRN */}
<div>
  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
    Identifier (e.g. NPI, MRN, SSN)
  </label>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <select
      name="identifier.2.type.coding.0.code"
      value={practitioner?.identifier?.[2]?.type?.coding?.[0]?.code || ''}
      onChange={handleInputChange}
      className="input input-bordered w-full"
    >
      <option value="">Type</option>
      <option value="NI">National Insurance (UK)</option>
      <option value="SS">Social Security Number (SSN)</option>
      <option value="MR">Medical Record Number (MRN)</option>
      <option value="DL">Driver License</option>
      <option value="NPI">National Provider Identifier (NPI)</option>
    </select>

    <input
      name="identifier.2.system"
      value={practitioner?.identifier?.[2]?.system || ''}
      onChange={handleInputChange}
      className="input input-bordered w-full"
      placeholder="System URI"
    />

    <input
      name="identifier.2.value"
      value={practitioner?.identifier?.[2]?.value || ''}
      onChange={handleInputChange}
      className="input input-bordered w-full"
      placeholder="Identifier Value"
    />
  </div>
</div>


          <button type="submit" className="btn-primary w-full">
            {practitioner.id ? '💾 Update Practitioner' : '✅ Save Practitioner Record'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePractitionerForm
