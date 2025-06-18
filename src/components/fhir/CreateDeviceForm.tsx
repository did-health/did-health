import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import type { Device as FHIRDevice } from 'fhir/r4'
import { useOnboardingState } from '../../store/OnboardingState'
import logo from '../../assets/did-health.png'

const CreateDeviceForm: React.FC = () => {
  const navigate = useNavigate()
  const { fhirResource, setFHIRResource } = useOnboardingState()

  const [device, setDevice] = useState<FHIRDevice | null>(null)

  useEffect(() => {
    if (fhirResource?.resourceType === 'Device') {
      setDevice(fhirResource as FHIRDevice)
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
    setFHIRResource(updatedDevice)
    navigate('/onboarding/ethereum')
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            🛠️ {device.id ? 'Edit' : 'Create'} did:health Device
          </h2>

          {/* Device Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Device Name</label>
            <input
              type="text"
              name="deviceName.0.name"
              value={device.deviceName?.[0]?.name || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Type (Code)</label>
            <input
              type="text"
              name="type.coding.0.code"
              value={device.type?.coding?.[0]?.code || ''}
              onChange={handleInputChange}
              className="input"
              placeholder="e.g. glucometer"
            />
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Manufacturer</label>
            <input
              type="text"
              name="manufacturer"
              value={device.manufacturer || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Model Number */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Model Number</label>
            <input
              type="text"
              name="modelNumber"
              value={device.modelNumber || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Serial Number</label>
            <input
              type="text"
              name="serialNumber"
              value={device.serialNumber || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* UDI Carrier */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">UDI Carrier</label>
            <input
              type="text"
              name="udiCarrier.0.deviceIdentifier"
              value={device.udiCarrier?.[0]?.deviceIdentifier || ''}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button type="submit" className="btn-primary w-full">
              {device.id ? '💾 Update Device' : '✅ Save Device Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateDeviceForm
