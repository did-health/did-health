import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { Practitioner } from 'fhir/r4';
import { useOnboardingState } from '../../store/OnboardingState';


const CreatePractitionerForm: React.FC = () => {
  const navigate = useNavigate();
  const [practitioner, setPractitioner] = useState<Practitioner>({
    resourceType: 'Practitioner',
    id: '',
    name: [{ given: [''], family: '' }],
    gender: 'unknown',
    birthDate: '',
    telecom: [
      { use: 'home', system: 'phone', value: '' },
      { system: 'email', value: '' },
    ],
    address: [
      { line: [''], city: '', state: '', postalCode: '', country: '' },
    ],
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
  });
  const { setFHIRResource } = useOnboardingState()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPractitioner((prev) => {
      const updated = { ...prev };
      const keys = name.split('.');
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      if (Array.isArray(current[keys[keys.length - 1]])) {
        current[keys[keys.length - 1]] = [value];
      } else {
        current[keys[keys.length - 1]] = value;
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPractitioner = { ...practitioner, id: uuidv4() };
    setFHIRResource(newPractitioner) // or org, practitioner, etc.
    navigate('/select-did')
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Create Practitioner DID Resource</h2>
      <input
        type="text"
        name="name.0.given.0"
        value={practitioner.name?.[0].given?.[0] || ''}
        onChange={handleInputChange}
        placeholder="First Name"
        className="input mb-2"
      />
      <input
        type="text"
        name="name.0.family"
        value={practitioner.name?.[0].family || ''}
        onChange={handleInputChange}
        placeholder="Last Name"
        className="input mb-2"
      />
      <select
        name="gender"
        value={practitioner.gender || ''}
        onChange={handleInputChange}
        className="input mb-2"
      >
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
        className="input mb-2"
      />
      <input
        type="tel"
        name="telecom.0.value"
        value={practitioner.telecom?.[0].value || ''}
        onChange={handleInputChange}
        placeholder="Phone"
        className="input mb-2"
      />
      <input
        type="email"
        name="telecom.1.value"
        value={practitioner.telecom?.[1].value || ''}
        onChange={handleInputChange}
        placeholder="Email"
        className="input mb-2"
      />
      <input
        type="text"
        name="address.0.line.0"
        value={practitioner.address?.[0].line?.[0] || ''}
        onChange={handleInputChange}
        placeholder="Address Line"
        className="input mb-2"
      />
      <input
        type="text"
        name="address.0.city"
        value={practitioner.address?.[0].city || ''}
        onChange={handleInputChange}
        placeholder="City"
        className="input mb-2"
      />
      <input
        type="text"
        name="address.0.state"
        value={practitioner.address?.[0].state || ''}
        onChange={handleInputChange}
        placeholder="State"
        className="input mb-2"
      />
      <input
        type="text"
        name="address.0.postalCode"
        value={practitioner.address?.[0].postalCode || ''}
        onChange={handleInputChange}
        placeholder="Postal Code"
        className="input mb-2"
      />
      <input
        type="text"
        name="address.0.country"
        value={practitioner.address?.[0].country || ''}
        onChange={handleInputChange}
        placeholder="Country"
        className="input mb-4"
      />
      <button
        type="submit"
        className="bg-[#f71b02] text-white px-4 py-2 rounded"
      >
        Save Practitioner Record
      </button>
    </form>
  );
};

export default CreatePractitionerForm;
