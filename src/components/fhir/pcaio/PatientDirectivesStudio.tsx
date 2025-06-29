import React, { useState } from 'react'

import CreateAdvanceDirectiveObservationForm from './CreateAdvanceDirectiveObservationForm'
import CreatePersonalGoalForm from './CreatePersonalGoalForm'
import CreateTreatmentPreferenceForm from './CreateTreatmentPreferenceForm'
import CreateMedicalOrderForm from './CreateMedicalOrderForm'
import CreateConsentForm from './CreateConsentForm'

export default function PatientDirectivesStudio({
  onComplete,
}: {
  onComplete: (resources: any[]) => void
}) {
  const [tab, setTab] = useState<'directive' | 'goals' | 'treatment' | 'orders' | 'consent'>('directive')
  const [resources, setResources] = useState<any[]>([])

  const addResource = (resource: any) => {
    setResources((prev) => [...prev, resource])
  }

  const handleDone = () => {
    if (resources.length === 0) {
      alert('Please add at least one directive.')
      return
    }
    onComplete(resources)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        🧾 Advance Directive Studio (PACIO ADI)
      </h2>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap text-sm">
        {[
          ['directive', '📄 General Directive'],
          ['goals', '🧠 Personal Goals'],
          ['treatment', '💉 Treatment Preferences'],
          ['orders', '📝 Medical Orders'],
          ['consent', '🛡️ Consent Preferences'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`px-3 py-1 rounded ${
              tab === key ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dynamic Form Rendering */}
      <div className="mt-4">
        {tab === 'directive' && <CreateAdvanceDirectiveObservationForm onSubmit={addResource} />}
        {tab === 'goals' && <CreatePersonalGoalForm onSubmit={addResource} />}
        {tab === 'treatment' && <CreateTreatmentPreferenceForm onSubmit={addResource} />}
        {tab === 'orders' && <CreateMedicalOrderForm onSubmit={addResource} />}
        {tab === 'consent' && <CreateConsentForm onSubmit={addResource} />}
      </div>

      {/* Review & Submit */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">🧾 Added Resources:</h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 max-h-40 overflow-y-auto">
          {resources.map((r, i) => (
            <li key={i}>
              ✅ {r.resourceType} – {r.code?.text || r.code?.coding?.[0]?.display || r.title || r.id}
            </li>
          ))}
        </ul>

        <button
          onClick={handleDone}
          className="btn-primary mt-4 w-full"
        >
          📤 Encrypt, Upload, and Register All
        </button>
      </div>
    </div>
  )
}
