import React, { useEffect, useRef, useState } from 'react'
import type { PractitionerQualificationWithSpecialty } from '../../types/fhir'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Webcam from 'react-webcam'
import { useOnboardingState } from '../../store/OnboardingState'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/did-health.png'
import type { Practitioner } from 'fhir/r4'
interface CreatePractitionerFormProps {
  defaultValues: Practitioner;
  onSubmit: (updatedFHIR: Practitioner) => Promise<void>;
}

const CreatePractitionerForm: React.FC<CreatePractitionerFormProps> = ({ defaultValues, onSubmit }) => {
  const navigate = useNavigate()
  const { fhirResource, setFhirResource } = useOnboardingState()
  const [practitioner, setPractitioner] = useState<Practitioner>(defaultValues)
  const [showCamera, setShowCamera] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const { t } = useTranslation(['fhir'])
  const { t: t2 } = useTranslation()

  useEffect(() => {
    if (!practitioner) {
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
          ref[keys[i]] = {}
        }
        ref = ref[keys[i]]
      }
      ref[keys[keys.length - 1]] = value
      return updated
    })
  }

  const updatePractitioner = () => {
    if (!practitioner) return
    const updatedPractitioner = { ...practitioner }
    if (!updatedPractitioner.id) {
      updatedPractitioner.id = uuidv4()
    }
    setFhirResource(updatedPractitioner)
  }

  if (!practitioner) return null

  return (
    <div className="flex justify-center items-start sm:items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          did:health {t('Practitioner.label')}
        </h2>
        <div className="space-y-4">
          {/* Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('HumanName.given.label')}</label>
              <input id="firstName" type="text" name="name.0.given.0" value={practitioner.name?.[0]?.given?.[0] || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('HumanName.family.label')}</label>
              <input id="lastName" type="text" name="name.0.family" value={practitioner.name?.[0]?.family || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Patient.gender.label')}</label>
              <select id="gender" name="gender" value={practitioner.gender || ''} onChange={handleInputChange} className="input">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Patient.birthDate.label')}</label>
              <input id="birthDate" type="date" name="birthDate" value={practitioner.birthDate || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('ContactPoint.system.phone.label')}</label>
              <input id="phone" type="tel" name="telecom.0.value" value={practitioner.telecom?.[0]?.value || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('ContactPoint.system.email.label')}</label>
              <input id="email" type="email" name="telecom.1.value" value={practitioner.telecom?.[1]?.value || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="addressLine" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Address.line.label')}</label>
              <input id="addressLine" type="text" name="address.0.line.0" value={practitioner.address?.[0]?.line?.[0] || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Address.city.label')}</label>
              <input id="city" type="text" name="address.0.city" value={practitioner.address?.[0]?.city || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Address.state.label')}</label>
              <input id="state" type="text" name="address.0.state" value={practitioner.address?.[0]?.state || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Address.postalCode.label')}</label>
              <input id="postalCode" type="text" name="address.0.postalCode" value={practitioner.address?.[0]?.postalCode || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Address.country.label')}</label>
              <input id="country" type="text" name="address.0.country" value={practitioner.address?.[0]?.country || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="qualification" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Practitioner.qualification.short')}</label>
              <input id="qualification" type="text" name="qualification.0.code.text" value={practitioner.qualification?.[0]?.code?.text || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label htmlFor="specialty" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Practitioner.qualification.specialty.short')}</label>
              <input id="specialty" type="text" name="qualification.0.specialty.0.text" value={(practitioner.qualification?.[0] as PractitionerQualificationWithSpecialty)?.specialty?.[0]?.text || ''} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">{t('Practitioner.identifier.label')}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="identifierType" className="sr-only">{t('Practitioner.identifier.short')}</label>
                  <select id="identifierType" name="identifier.2.type.coding.0.code" value={practitioner?.identifier?.[2]?.type?.coding?.[0]?.code || ''} onChange={handleInputChange} className="input input-bordered w-full">
                    <option value="">Type</option>
                    <option value="NI">National Insurance (UK)</option>
                    <option value="SS">Social Security Number (SSN)</option>
                    <option value="MR">Medical Record Number (MRN)</option>
                    <option value="DL">Driver License</option>
                    <option value="NPI">National Provider Identifier (NPI)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="identifierSystem" className="sr-only">{t('Practitioner.identifier.system.label')}</label>
                  <input id="identifierSystem" name="identifier.2.system" value={practitioner?.identifier?.[2]?.system || ''} onChange={handleInputChange} className="input input-bordered w-full" placeholder="System URI" />
                </div>
                <div>
                  <label htmlFor="identifierValue" className="sr-only">{t('Practitioner.identifier.value.label')}</label>
                  <input id="identifierValue" name="identifier.2.value" value={practitioner?.identifier?.[2]?.value || ''} onChange={handleInputChange} className="input input-bordered w-full" placeholder="Identifier Value" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={updatePractitioner}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {practitioner.id ? t2('common.update') : t2('common.create')} {t('Practitioner.label')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePractitionerForm
