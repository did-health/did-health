import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Observation } from 'fhir/r4'

export default function CreateTreatmentPreferenceForm({ onSubmit }: { onSubmit: (obs: Observation) => void }) {
  const [treatment, setTreatment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const obs: Observation = {
      resourceType: 'Observation',
      id: uuidv4(),
      meta: {
        profile: ['http://hl7.org/fhir/us/pacio-adi/StructureDefinition/TreatmentInterventionPreference'],
      },
      status: 'final',
      code: {
        coding: [
          { system: 'http://loinc.org', code: '81379-0', display: 'Intervention preference' }
        ],
        text: 'Treatment preference'
      },
      valueString: treatment,
    }
    onSubmit(obs)
    setTreatment('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold">💉 Treatment Preference</h3>
      <textarea value={treatment} onChange={(e) => setTreatment(e.target.value)} required className="input" rows={4} />
      <button className="btn-primary">Add Treatment Preference</button>
    </form>
  )
}
