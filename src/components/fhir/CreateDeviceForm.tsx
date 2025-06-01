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
    navigate('/select-did')

  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Device DID</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Device Name</label>
        <input
          type="text"
          name="deviceName.0.name"
          value={device.deviceName?.[0]?.name || ''}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Model Number</label>
        <input
          type="text"
          name="modelNumber"
          value={device.modelNumber || ''}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button type="submit" className="bg-[#f71b02] text-white px-4 py-2 rounded">
        Save Device Record
      </button>
\
    </form>
  );
};

export default CreateDeviceForm;
