import { useNavigate } from 'react-router-dom'
export function CreateDIDForm() {
  const navigate = useNavigate()
  return (
    <div>
      <h2 className="text-lg font-semibold">Create your DID</h2>
      <p className="text-sm mb-4">Select the kind of entity you are:</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/create/patient')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          Patient
        </button>
        <button
          onClick={() => navigate('/create/practitioner')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          Practitioner
        </button>
        <button
          onClick={() => navigate('/create/organization')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          Organization
        </button>
        <button
          onClick={() => navigate('/create/device')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-red-50"
        >
          Device
        </button>
      </div>
      <div className="mt-6 text-sm text-gray-700">
        <p className="font-bold mb-1">A DID can be made for:</p>
        <ul className="list-disc list-inside">
          <li>Patient</li>
          <li>Practitioner (Doctors, Nurses, and other healthcare professionals)</li>
          <li>Organization (Hospital, Medical Practice, Insurance Company, etc.)</li>
          <li>Device (Monitor, Machine, etc.)</li>
          <li>More (Let us know!)</li>
        </ul>
      </div>
    </div>
  )
}