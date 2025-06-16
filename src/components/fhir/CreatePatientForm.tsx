import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { Patient } from 'fhir/r4';
import { useOnboardingState } from '../../store/OnboardingState';

const CreatePatientForm: React.FC = () => {
  const navigate = useNavigate();
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
  });
  const { setFHIRResource } = useOnboardingState()
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPatient((prev) => {
      const updated = { ...prev };
      const keys = name.split('.');
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient = { ...patient, id: uuidv4() };
    console.log('FHIR Patient Resource:', newPatient);
    setFHIRResource(patient) // or org, practitioner, etc.
    navigate('/onboarding/ethereum')

  };

return (
  <div className="flex justify-center items-start sm:items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950">
    <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          🧬 Create Patient DID
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

        {/* Contact Info */}
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

        {/* Address Fields */}
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

        {/* Identifier */}
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

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="btn-primary w-full text-center"
          >
            💾 Save Patient Record
          </button>
        </div>
      </form>
    </div>
  </div>
)


};

export default CreatePatientForm;
