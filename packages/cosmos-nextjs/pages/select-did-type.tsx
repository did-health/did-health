import Link from 'next/dist/client/link';
import React, { useState } from 'react';

const SelectDIDTypeForm: React.FC = () => {
  const [entity, setEntity] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (entity) {
      alert(`Selected entity is: ${entity}`);
    } else {
      alert('No entity selected!');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>  
      <div className="form-group">
        <div className="p-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
            Select the kind of entity you are:
        </label>
        <div className="grid grid-cols-2 gap-3 mb-4">
            <Link href="/create-patient" className="col-span-1">
            <button type="button" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline navigation-button">
                Patient
            </button>
            </Link>
            <Link href="/create-practitioner" className="col-span-1">
            <button type="button" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline navigation-button">
                Practitioner
            </button>
            </Link>
            <Link href="/create-organization" className="col-span-1">
            <button type="button" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline navigation-button">
                Organization
            </button>
            </Link>
            <Link href="/create-device" className="col-span-1">
            <button type="button" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline navigation-button">
                Device
            </button>
            </Link>
        </div>
        <label className='block text-gray-700 text-sm font-bold mb-2"'>
              A DID can be made for:
                <ul>
                  <li>Patient</li>
                  <li>Pracitioner (Doctors, Nurses, and other healthcare professionals)</li>
                  <li>Organization (Hospital, Medical Practice, Health Insurance Company, Drug Manufacturer, Pharmacy, Laboratory, Research and other healthcare professionals)</li>
                  <li>Device (Monitor, Machine, etc)</li>
                  <li>More (Let us know!)</li>
                </ul>
        </label>  
      </div>
    </div>
    </form>
  </div>
  );
};

export default SelectDIDTypeForm;
