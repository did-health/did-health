import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import type { Device } from 'fhir/r4'
import { useOnboardingState } from '../../store/OnboardingState'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/did-health.png'

interface CreateDeviceFormProps {
  defaultValues: Device
  onSubmit: (updatedFHIR: Device) => Promise<void>
}

const CreateDeviceForm: React.FC<CreateDeviceFormProps> = ({ defaultValues, onSubmit }) => {
  const navigate = useNavigate()
  const { fhirResource, setFhirResource } = useOnboardingState()
  const [device, setDevice] = useState<Device>(defaultValues)
  const { t } = useTranslation(['fhir'])
  const { t: t2 } = useTranslation()

  useEffect(() => {
    if (fhirResource?.resourceType === 'Device') {
      setDevice(fhirResource as Device)
    } else {
      setDevice({
        resourceType: 'Device',
        identifier: [{ system: 'https://www.w3.org/ns/did', value: '' }],
      })
    }
  }, [fhirResource])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setDevice((prev) => {
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
    if (!device) return
    const updatedDevice = { ...device }
    if (!updatedDevice.id) {
      updatedDevice.id = uuidv4()
    }
    setFhirResource(updatedDevice)
    //navigate('/onboarding/ethereum')
  }

  if (!device) return null

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
            🛠️ did:health {t('Device.label')} 
          </h2>

          {/* Device Name */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('Device.deviceName.name.label')}</label>
            <input
              type="text"
              name="deviceName.0.name"
              value={device.deviceName?.[0]?.name || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Device Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('Device.type.label')}</label>
            <input
              type="text"
              name="type.coding.0.code"
              value={device.type?.coding?.[0]?.code || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="e.g. glucometer"
            />
          </div>

          {/* Manufacturer */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('Device.manufacturer.label')}</label>
            <input
              type="text"
              name="manufacturer"
              value={device.manufacturer || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Model Number */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('Device.modelNumber.label')}</label>
            <input
              type="text"
              name="modelNumber"
              value={device.modelNumber || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Serial Number */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('Device.serialNumber.label')}</label>
            <input
              type="text"
              name="serialNumber"
              value={device.serialNumber || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* UDI Carrier */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('Device.udiCarrier.deviceIdentifier.label')}</label>
            <input
              type="text"
              name="udiCarrier.0.deviceIdentifier"
              value={device.udiCarrier?.[0]?.deviceIdentifier || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary w-full sm:w-auto"
            >
              {device?.id ? t2('common.update') : t2('common.create')} {t('Device.label')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateDeviceForm
