import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { Device as FHIRDevice } from 'fhir/r4';
import { useOnboardingState } from '../../store/OnboardingState';

const CreateDeviceForm: React.FC = () => {
  const navigate = useNavigate();

  const [device, setDevice] = useState<FHIRDevice>({
    resourceType: 'Device',
    id: '',
    identifier: [
      { system: 'https://www.w3.org/ns/did', value: '' },
    ],
  });

  const { setFHIRResource } = useOnboardingState()

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDevice((prev) => {
      const updated: any = { ...prev };
      const keys = name.split('.');
      let ref = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!ref[keys[i]]) ref[keys[i]] = {};
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = uuidv4();
    const newDevice = { ...device, id };
    console.log('FHIR Device Resource:', newDevice);
    setFHIRResource(device) // or org, practitioner, etc.
    navigate('/onboarding/ethereum')

  };

return (
  <div className="flex justify-center items-start sm:items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950">
    <div className="w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          🛠️ Create Device DID
        </h2>

        {/* Device Name */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Device Name
          </label>
          <input
            type="text"
            name="deviceName.0.name"
            value={device.deviceName?.[0]?.name || ''}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        {/* Model Number */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Model Number
          </label>
          <input
            type="text"
            name="modelNumber"
            value={device.modelNumber || ''}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button type="submit" className="btn-primary w-full">
            ✅ Save Device Record
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default CreateDeviceForm;
