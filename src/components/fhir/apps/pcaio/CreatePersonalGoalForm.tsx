import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Observation } from 'fhir/r4'

export default function CreatePersonalGoalForm({ onSubmit }: { onSubmit: (obs: Observation) => void }) {
  const [goal, setGoal] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const obs: Observation = {
      resourceType: 'Observation',
      id: uuidv4(),
      meta: {
        profile: ['http://hl7.org/fhir/us/pacio-adi/StructureDefinition/PersonalGoal'],
      },
      status: 'final',
      code: {
        coding: [
          { system: 'http://loinc.org', code: '81378-2', display: 'Personal goal' }
        ],
        text: 'Personal goal'
      },
      valueString: goal,
    }
    onSubmit(obs)
    setGoal('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold">🧠 Personal Goal</h3>
      <textarea value={goal} onChange={(e) => setGoal(e.target.value)} required className="input" rows={4} />
      <button className="btn-primary">Add Personal Goal</button>
    </form>
  )
}
