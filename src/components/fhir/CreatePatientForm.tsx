// Extended CreatePatientForm.tsx to support full US Core fields without hardcoded values
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import type { Patient } from 'fhir/r4'
import { useOnboardingState } from '../../store/OnboardingState'
import logo from '../../assets/did-health.png'
import Webcam from 'react-webcam'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface CreatePatientFormProps {
  defaultValues: Patient
  onSubmit: (updatedFHIR: Patient) => Promise<void>
}

const CreatePatientForm: React.FC<CreatePatientFormProps> = ({ defaultValues, onSubmit }) => {
  const navigate = useNavigate()
  const { fhirResource, setFhirResource } = useOnboardingState()
  const webcamRef = useRef<Webcam | null>(null)
  const [patient, setPatient] = useState<Patient>(defaultValues)
  const [showCamera, setShowCamera] = useState(false)
  const [status, setStatus] = useState<string>('')
  const { t } = useTranslation(['fhir'])
  const { t: t2 } = useTranslation()

  useEffect(() => {
    if (fhirResource?.resourceType === 'Patient') {
      setPatient(fhirResource as Patient)
    } else {
      setPatient({
        resourceType: 'Patient',
      })
    }
  }, [fhirResource])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setPatient((prev) => {
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

  const updatePatient = () => {
    if (!patient) return
    const updatedPatient = { ...patient }
    if (!updatedPatient.id) {
      updatedPatient.id = uuidv4()
    }
    // Update the FHIR resource in Zustand
    setFhirResource(updatedPatient)
    // Call the parent's onSubmit handler with the updated data
    onSubmit(updatedPatient)
    setStatus('✅ FHIR updated successfully')
    console.log('FHIR Patient Resource:', updatedPatient)
  }

  if (!patient) return null
  function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}


  return (
    <div className="flex justify-center items-start sm:items-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
        <div className="flex justify-center items-center h-24 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-2 ring-green-400/50">
            <img
              src={logo}
              alt="did:health Logo"
              className="w-full h-full object-contain scale-110 transition-transform duration-300 hover:scale-125"
            />
          </div>
        </div>
        <div className="space-y-4">
          {status && <p className="text-sm text-gray-600 mb-4">{status}</p>}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            🧬 did:health {t('Patient.label')} 
          </h2>

  {/* Demographics */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('HumanName.given.label')}</label>
      <input name="name.0.given.0" value={patient?.name?.[0]?.given?.[0] || ''} onChange={handleInputChange} className="input input-bordered w-full" />
    </div>
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('HumanName.family.label')}</label>
      <input name="name.0.family" value={patient?.name?.[0]?.family || ''} onChange={handleInputChange} className="input input-bordered w-full" />
    </div>
{/* Patient Photo (Webcam or Preview) */}
<div className="space-y-2">
  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
    {t('Patient.photo.label')}
  </label>

  {/* Existing Photo */}
  {patient?.photo?.[0]?.data && !showCamera && (
    <>
      <img
        src={`data:${patient.photo[0].contentType};base64,${patient.photo[0].data}`}
        alt="Patient"
        className="w-32 h-32 rounded-full object-cover border shadow"
      />
      <button
        type="button"
        className="btn-outline mt-2"
        onClick={() => setShowCamera(true)}
      >
        🔁 Change Photo
      </button>
    </>
  )}

  {/* Webcam to capture new photo */}
  {(!patient?.photo?.[0]?.data || showCamera) && (
    <>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full sm:w-64 rounded-md shadow-md border"
        videoConstraints={{
          width: 320,
          height: 240,
          facingMode: "user"
        }}
      />
      <button
        type="button"
        className="btn-primary mt-2"
        onClick={() => {
          const screenshot = webcamRef.current?.getScreenshot()
          if (!screenshot) return
          setPatient(prev => {
            if (!prev) return prev
            return {
              ...prev,
              photo: [{
                contentType: 'image/jpeg',
                data: screenshot.split(',')[1],
                title: 'captured-webcam.jpg',
                creation: new Date().toISOString(),
              }]
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


    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Patient.gender.label')}</label>
      <select name="gender" value={patient?.gender || ''} onChange={handleInputChange} className="input input-bordered w-full">
        <option value="">Select...</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Patient.birthDate.label')}</label>
      <input type="date" name="birthDate" value={patient?.birthDate || ''} onChange={handleInputChange} className="input input-bordered w-full" />
    </div>
  </div>

  {/* Contact Info */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('ContactPoint.system.phone.label')}</label>
      <input name="telecom.1.value" value={patient?.telecom?.[1]?.value || ''} onChange={handleInputChange} className="input input-bordered w-full" />
    </div>
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('ContactPoint.system.email.label')}</label>
      <input name="telecom.2.value" value={patient?.telecom?.[2]?.value || ''} onChange={handleInputChange} className="input input-bordered w-full" />
    </div>
  </div>

  {/* Address */}
  <div>
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Address.label')}</label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input name="address.0.line.0" placeholder= {t('Address.line.label')} value={patient?.address?.[0]?.line?.[0] || ''} onChange={handleInputChange} className="input input-bordered w-full" />
      <input name="address.0.city" placeholder={  t('Address.city.label')} value={patient?.address?.[0]?.city || ''} onChange={handleInputChange} className="input input-bordered w-full" />
      <input name="address.0.state" placeholder={t('Address.state.label')} value={patient?.address?.[0]?.state || ''} onChange={handleInputChange} className="input input-bordered w-full" />
      <input name="address.0.postalCode" placeholder={t('Address.postalCode.label')} value={patient?.address?.[0]?.postalCode || ''} onChange={handleInputChange} className="input input-bordered w-full" />
      <input name="address.0.country" placeholder={t('Address.country.label')} value={patient?.address?.[0]?.country || ''} onChange={handleInputChange} className="input input-bordered w-full" />
    </div>
  </div>

  {/* Identifiers */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Patient.Identifier.label')}</label>
      <select name="identifier.1.type.coding.0.code" value={patient?.identifier?.[1]?.type?.coding?.[0]?.code || ''} onChange={handleInputChange} className="input input-bordered w-full">
        <option value="">Select...</option>
        <option value="DL">Driver License</option>
        <option value="MR">Medical Record</option>
        <option value="SS">Social Security</option>
      </select>
    </div>
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Identifier Value</label>
      <input name="identifier.1.value" value={patient?.identifier?.[1]?.value || ''} onChange={handleInputChange} className="input input-bordered w-full" />
    </div>
  </div>

  {/* Other Fields */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Patient.maritalStatus.label')}</label>
      <select name="maritalStatus.coding.0.code" value={patient?.maritalStatus?.coding?.[0]?.code || ''} onChange={handleInputChange} className="input input-bordered w-full">
        <option value="">Select...</option>
        <option value="M">Married</option>
        <option value="S">Never Married</option>
        <option value="D">Divorced</option>
        <option value="W">Widowed</option>
        <option value="U">Unknown</option>
      </select>
    </div>
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Patient.multipleBirth[x].label')}</label>
      <select name="multipleBirthBoolean" value={patient?.multipleBirthBoolean ? 'true' : 'false'} onChange={handleInputChange} className="input input-bordered w-full">
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Patient.language.label')}</label>
      <input name="communication.0.language.coding.0.code" value={patient?.communication?.[0]?.language?.coding?.[0]?.code || ''} onChange={handleInputChange} className="input input-bordered w-full" placeholder="e.g. en, es, fr" />
    </div>
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Patient.gender.label')}</label>
      <select name="extension.2.valueCode" value={patient?.extension?.[2]?.valueCode || ''} onChange={handleInputChange} className="input input-bordered w-full">
        <option value="">Select...</option>
        <option value="M">Male</option>
        <option value="F">Female</option>
        <option value="UNK">Unknown</option>
      </select>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Population.race.label')}</label>
      <select name="extension.0.extension.0.valueCoding.code" value={patient?.extension?.[0]?.extension?.[0]?.valueCoding?.code || ''} onChange={handleInputChange} className="input input-bordered w-full">
        <option value="">Select Race</option>
        <option value="1002-5">American Indian or Alaska Native</option>
        <option value="2028-9">Asian</option>
        <option value="2054-5">Black or African American</option>
        <option value="2076-8">Native Hawaiian or Other Pacific Islander</option>
        <option value="2106-3">White</option>
        <option value="2131-1">Other Race</option>
      </select>
    </div>
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Population.ethnicity.label')}</label>
      <select name="extension.1.extension.0.valueCoding.code" value={patient?.extension?.[1]?.extension?.[0]?.valueCoding?.code || ''} onChange={handleInputChange} className="input input-bordered w-full">
        <option value="">Select Ethnicity</option>
        <option value="2135-2">Hispanic or Latino</option>
        <option value="2186-5">Not Hispanic or Latino</option>
      </select>
    </div>
  </div>

  {/* Submit */}
  <div className="pt-6">
            <button
              onClick={updatePatient}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {patient.id ? t2('common.update') : t2('common.create')} {t('Patient.label')}
            </button>
  </div>
</div>

      </div>
    </div>
  )
}

export default CreatePatientForm
